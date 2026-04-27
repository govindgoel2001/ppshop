// api/place-order.js
// POST { items, coupon, contactEmail, otpEmail, shippingAddress, ebook, ref, utr }
// Recomputes total server-side, writes orders + coupon_usage + order_audit, emails admin + customer.

import { createClient } from '@supabase/supabase-js';
import { priceItems, applyCoupon } from './_lib/catalogue.js';
import { adminAllowList } from './_lib/session.js';
import { sendAdminAlert, sendCustomerPlaced } from './_lib/mailer.js';
import { validateEmail, getIp } from './_lib/validate.js';
import { checkPlaceOrderRateLimit, recordPlaceOrderAttempt } from './_lib/ratelimit.js';

const REF_RE = /^[A-Z0-9]{8}$/;
const UTR_RE = /^\d{12}$/;
// Indian PIN: 6 digits, first digit 1-9.
const PIN_RE = /\b[1-9]\d{5}\b/;

const supa = () => createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const ip = getIp(req);

  // Rate limit FIRST so a flooder can't exhaust send-email budget on validation alone.
  const rateOk = await checkPlaceOrderRateLimit(ip);
  if (!rateOk) return res.status(429).json({ error: 'Too many orders from this address. Try again later.' });

  const body = req.body || {};
  const items = Array.isArray(body.items) ? body.items : [];
  const coupon = body.coupon ? String(body.coupon).trim().toUpperCase() : null;
  const contactEmail = (body.contactEmail || '').trim().toLowerCase();
  const otpEmail     = body.otpEmail ? String(body.otpEmail).trim().toLowerCase() : null;
  const shippingAddress = typeof body.shippingAddress === 'string' ? body.shippingAddress.trim().slice(0, 1000) : '';
  const ebook = body.ebook !== false;
  const ref   = String(body.ref || '').toUpperCase();
  const utr   = String(body.utr || '').trim();

  if (!validateEmail(contactEmail)) return res.status(400).json({ error: 'Invalid contact email.' });
  if (!REF_RE.test(ref))            return res.status(400).json({ error: 'Invalid order reference.' });
  if (!UTR_RE.test(utr))            return res.status(400).json({ error: 'UTR must be 12 digits.' });
  if (!shippingAddress)             return res.status(400).json({ error: 'Delivery address required.' });
  if (!PIN_RE.test(shippingAddress)) return res.status(400).json({ error: 'Address must include a 6-digit PIN code.' });

  // Burn the rate-limit slot once we've passed cheap validation.
  await recordPlaceOrderAttempt(contactEmail, ip);

  // 1. Server-side pricing
  const priced = priceItems(items);
  if (priced.errors.length) return res.status(400).json({ error: priced.errors[0] });
  const subtotal = priced.subtotal;
  if (subtotal <= 0) return res.status(400).json({ error: 'Cart is empty.' });

  const sb = supa();

  // 2. Coupon eligibility
  let isVerifiedFirst5 = false;
  if (coupon === 'FIRST5') {
    if (!otpEmail || !validateEmail(otpEmail)) {
      return res.status(400).json({ error: 'FIRST5 needs a verified email.' });
    }
    // Anti-lateral-burn: a FIRST5 redemption must originate from the same email
    // that owns the verified flag. Otherwise an attacker could pass a victim's
    // otpEmail and burn the victim's discount on their own order.
    if (otpEmail !== contactEmail) {
      return res.status(400).json({ error: 'FIRST5 must be redeemed by the verified email.' });
    }
    const { data: otpRec } = await sb
      .from('email_otps').select('verified, verified_at')
      .eq('email', otpEmail).maybeSingle();
    if (otpRec?.verified && otpRec.verified_at) {
      const age = Date.now() - new Date(otpRec.verified_at).getTime();
      if (age < 30 * 60 * 1000) isVerifiedFirst5 = true;
    }
  }

  // 3. Atomically claim the FIRST5 redemption lock BEFORE inserting the order.
  // coupon_usage.unique(email, code) is the lock; 23505 means already redeemed.
  // Prevents the parallel-request race where two orders both apply the discount.
  let couponLockHeld = false;
  if (coupon === 'FIRST5' && isVerifiedFirst5) {
    const { error: lockErr } = await sb
      .from('coupon_usage')
      .insert({ email: otpEmail, code: 'FIRST5', order_id: null });
    if (lockErr) {
      if (lockErr.code === '23505') {
        // Already redeemed — silently strip the discount, charge full.
        isVerifiedFirst5 = false;
      } else {
        console.error('coupon_usage lock error:', lockErr);
        return res.status(500).json({ error: 'Could not save your order. Please contact support.' });
      }
    } else {
      couponLockHeld = true;
    }
  }

  // 4. Compute final total against the (possibly stripped) coupon eligibility.
  let discount = 0, finalCoupon = null;
  if (coupon) {
    const c = applyCoupon(subtotal, coupon, isVerifiedFirst5);
    if (!c.error) { discount = c.discount; finalCoupon = c.code; }
  }
  const total = subtotal - discount;

  // 5. Insert order
  const { data: inserted, error: insErr } = await sb
    .from('orders')
    .insert({
      ref,
      utr,
      items: priced.lines.map(l => `${l.n} (${l.ds}) x${l.q}`).join(', '),
      total,
      coupon: finalCoupon,
      payment_method: 'upi_qr',
      status: 'pending_verification',
      ebook,
      email: contactEmail,
      shipping_address: shippingAddress,
      submitted_at: new Date().toISOString(),
    })
    .select('id, ref, total, coupon, email, utr')
    .single();

  if (insErr) {
    // Release the coupon lock so a legit retry can still redeem.
    if (couponLockHeld) {
      await sb.from('coupon_usage').delete().eq('email', otpEmail).eq('code', 'FIRST5');
    }
    // Mask 23505 (duplicate ref/UTR). Returning a specific error lets a UTR-shoulder-surfer
    // confirm the customer's UTR is real; the legit customer should contact support
    // (admin can resolve the duplicate manually from the admin panel).
    console.error('place-order insert error:', insErr, 'utr_or_ref_collision_ip', ip);
    return res.status(500).json({ error: 'Could not save your order. Please contact support.' });
  }

  const order = inserted;

  // 6. Backfill order_id on the coupon lock + consume the verified flag
  if (couponLockHeld) {
    await sb.from('coupon_usage').update({ order_id: String(order.id) })
      .eq('email', otpEmail).eq('code', 'FIRST5');
    await sb.from('email_otps').update({ verified: false }).eq('email', otpEmail);
  }

  // 7. Audit
  await sb.from('order_audit').insert({
    order_id: order.id, actor: 'customer', action: 'placed',
    detail: `UTR ${utr}, contact ${contactEmail}, IP ${ip}`,
  });

  // 8. Emails (best-effort)
  const admins = adminAllowList();
  if (admins.length) {
    sendAdminAlert({ adminEmails: admins, order, lines: priced.lines }).catch(e => console.error(e));
  }
  sendCustomerPlaced({ to: contactEmail, order, lines: priced.lines }).catch(e => console.error(e));

  return res.status(200).json({ ok: true, ref: order.ref, orderId: order.id });
}
