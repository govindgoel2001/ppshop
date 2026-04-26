// api/place-order.js
// POST { items, coupon, contactEmail, otpEmail, shippingAddress, ebook, ref, utr }
// Recomputes total server-side, writes orders + coupon_usage + order_audit, emails admin + customer.

import { createClient } from '@supabase/supabase-js';
import { priceItems, applyCoupon } from './_lib/catalogue.js';
import { adminAllowList } from './_lib/session.js';
import { sendAdminAlert, sendCustomerPlaced } from './_lib/mailer.js';
import { validateEmail, getIp } from './_lib/validate.js';

const REF_RE = /^[A-Z0-9]{8}$/;
const UTR_RE = /^\d{12}$/;

const supa = () => createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

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

  // 1. Server-side pricing
  const priced = priceItems(items);
  if (priced.errors.length) return res.status(400).json({ error: priced.errors[0] });
  const subtotal = priced.subtotal;
  if (subtotal <= 0) return res.status(400).json({ error: 'Cart is empty.' });

  // 2. Coupon
  let discount = 0, finalCoupon = null, isVerifiedFirst5 = false;
  if (coupon === 'FIRST5') {
    if (!otpEmail || !validateEmail(otpEmail)) {
      return res.status(400).json({ error: 'FIRST5 needs a verified email.' });
    }
    const { data: otpRec } = await supa()
      .from('email_otps').select('verified, verified_at')
      .eq('email', otpEmail).maybeSingle();
    if (otpRec?.verified && otpRec.verified_at) {
      const age = Date.now() - new Date(otpRec.verified_at).getTime();
      if (age < 30 * 60 * 1000) isVerifiedFirst5 = true;
    }
  }
  if (coupon) {
    const c = applyCoupon(subtotal, coupon, isVerifiedFirst5);
    if (!c.error) { discount = c.discount; finalCoupon = c.code; }
  }
  const total = subtotal - discount;

  // 3. Insert order
  const sb = supa();
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
      shipping_address: shippingAddress || null,
      submitted_at: new Date().toISOString(),
    })
    .select('id, ref, total, coupon, email, utr')
    .single();

  if (insErr) {
    console.error('place-order insert error:', insErr);
    if (insErr.code === '23505') return res.status(409).json({ error: 'Duplicate UTR or order reference.' });
    return res.status(500).json({ error: 'Could not save your order. Please contact support.' });
  }

  const order = inserted;

  // 4. Coupon-usage + consume verified flag
  if (finalCoupon === 'FIRST5' && otpEmail) {
    await sb.from('coupon_usage').insert({ email: otpEmail, code: 'FIRST5', order_id: String(order.id) }).then(() => {});
    await sb.from('email_otps').update({ verified: false }).eq('email', otpEmail);
  }

  // 5. Audit
  await sb.from('order_audit').insert({
    order_id: order.id, actor: 'customer', action: 'placed',
    detail: `UTR ${utr}, contact ${contactEmail}, IP ${getIp(req)}`,
  });

  // 6. Emails (best-effort)
  const admins = adminAllowList();
  if (admins.length) {
    sendAdminAlert({ adminEmails: admins, order, lines: priced.lines }).catch(e => console.error(e));
  }
  sendCustomerPlaced({ to: contactEmail, order, lines: priced.lines }).catch(e => console.error(e));

  return res.status(200).json({ ok: true, ref: order.ref, orderId: order.id });
}
