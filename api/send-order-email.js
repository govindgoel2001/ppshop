// api/send-order-email.js
// POST { email, name, address, items, total, coupon, ebook, utr }

import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { getIp } from './_lib/validate.js';

const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);
const MERCHANT_EMAIL = process.env.MERCHANT_EMAIL || 'govindnarayangoel395@gmail.com';
const SITE_URL = (process.env.SITE_URL || 'https://athenabiolabs.com').replace(/\/$/, '');

// ── Server-side price source of truth ───────────────────────────────────────
// Must match shared.js — update both when prices change.
const PRICE_MAP = {
  'Tirzepatide|10mg':       2400,
  'Tirzepatide|20mg':       3800,
  'Retatrutide|10mg':       2899,
  'Retatrutide|20mg':       4500,
  'BPC-157|10mg':           1990,
  'TB-500|10mg':            3400,
  'BPC+TB Combo|10mg':      3200,
  'GHK-Cu|50mg':            2200,
  'CJC-1295 (no DAC)|5mg':  2800,
  'CJC+IPA Combo|10mg':     3750,
  'KLOW Blend|80mg':        3990,
  'BAC Water|10ml':          799,
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function fmt(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

function secureToken() {
  return crypto.randomBytes(32).toString('hex');
}

function emailValid(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length <= 254;
}

// Rate limit: max 5 order submissions per IP per hour (reuses otp_attempts table)
async function checkOrderRateLimit(ip) {
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supa
    .from('otp_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('ip', ip)
    .eq('type', 'order')
    .gte('created_at', since);
  return (count || 0) < 5;
}

async function recordOrderAttempt(ip) {
  await supa.from('otp_attempts').insert({ email: 'order', type: 'order', ip });
}

// ── Handler ──────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // ── Rate limit by IP ──────────────────────────────────────────────────────
  const ip = getIp(req);
  const allowed = await checkOrderRateLimit(ip);
  if (!allowed) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { email, name, address, items, coupon, ebook, utr } = req.body || {};

  // ── Basic field validation ────────────────────────────────────────────────
  if (!email || !name || !address || !Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const em = email.toLowerCase().trim();
  if (!emailValid(em)) return res.status(400).json({ error: 'Invalid email address.' });

  const safeName    = String(name).trim().slice(0, 100);
  const safeAddress = String(address).trim().slice(0, 500);
  const safeUtr     = utr ? String(utr).trim().slice(0, 50) : null;

  if (!safeName || !safeAddress) {
    return res.status(400).json({ error: 'Name and address are required.' });
  }

  // ── Server-side price recalculation ──────────────────────────────────────
  if (items.length > 20) {
    return res.status(400).json({ error: 'Too many items.' });
  }

  let subtotal = 0;
  const validatedItems = [];

  for (const item of items) {
    const key = `${String(item.n || '')}|${String(item.ds || '')}`;
    const unitPrice = PRICE_MAP[key];
    if (!unitPrice) {
      return res.status(400).json({ error: `Unknown product: ${String(item.n || '').slice(0, 50)}` });
    }
    const qty = Math.floor(Number(item.q));
    if (!qty || qty < 1 || qty > 20) {
      return res.status(400).json({ error: 'Invalid quantity.' });
    }
    subtotal += unitPrice * qty;
    validatedItems.push({ n: String(item.n), ds: String(item.ds), pr: unitPrice, q: qty });
  }

  // ── Server-side coupon validation ────────────────────────────────────────
  let appliedCoupon = null;
  let discount = 0;

  const couponCode = coupon ? String(coupon).trim().toUpperCase() : '';

  if (couponCode === 'FIRST5') {
    const { data: used } = await supa
      .from('coupon_usage').select('id').eq('email', em).eq('code', 'FIRST5').maybeSingle();
    if (!used) {
      appliedCoupon = 'FIRST5';
      discount = Math.round(subtotal * 0.05);
    }
    // If already used, silently ignore — don't error, just don't apply
  } else if (couponCode === 'BULK10' && subtotal >= 20000) {
    appliedCoupon = 'BULK10';
    discount = Math.round(subtotal * 0.10);
  } else if (!couponCode && subtotal >= 20000) {
    appliedCoupon = 'BULK10';
    discount = Math.round(subtotal * 0.10);
  }

  const total = subtotal - discount;

  // ── Record attempt before DB write ───────────────────────────────────────
  await recordOrderAttempt(ip);

  // ── Insert order ──────────────────────────────────────────────────────────
  const confirmToken = secureToken();
  const itemsStr = validatedItems.map(c => `${c.n} (${c.ds}) x${c.q}`).join(', ');

  const { data: order, error: dbErr } = await supa
    .from('orders')
    .insert({
      email: em,
      customer_name: safeName,
      shipping_address: safeAddress,
      items: itemsStr,
      total,
      coupon: appliedCoupon,
      payment_method: 'bank_transfer',
      status: 'pending_verification',
      ebook: ebook !== false,
      confirm_token: confirmToken,
      utr: safeUtr,
    })
    .select('id')
    .single();

  if (dbErr) {
    console.error('Order insert error:', dbErr);
    return res.status(500).json({ error: 'Failed to save order. Please try again.' });
  }

  const orderId = order.id;
  const confirmUrl = `${SITE_URL}/api/confirm-order?id=${orderId}&token=${confirmToken}`;

  // ── Record FIRST5 usage server-side ──────────────────────────────────────
  if (appliedCoupon === 'FIRST5') {
    await supa.from('coupon_usage').insert({
      email: em, code: 'FIRST5', order_id: String(orderId)
    }).catch(() => {}); // unique constraint handles duplicates
  }

  // ── Build email content ───────────────────────────────────────────────────
  const itemRows = validatedItems.map(c =>
    `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:13px">${esc(c.n)} <span style="color:#999">(${esc(c.ds)})</span></td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;font-size:13px">×${c.q}</td>
      <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;font-size:13px">${fmt(c.pr * c.q)}</td>
    </tr>`
  ).join('');

  const firstName = esc(safeName.split(' ')[0]);
  const discountRow = appliedCoupon
    ? `<tr><td colspan="2" style="padding:6px 0;font-size:13px;color:#7a9a6d">Discount (${esc(appliedCoupon)})</td><td style="padding:6px 0;text-align:right;font-size:13px;color:#7a9a6d">−${fmt(discount)}</td></tr>`
    : '';

  // ── Customer: Order Received (pending) ────────────────────────────────────
  await resend.emails.send({
    from: 'AthenaBioLabs <support@athenabiolabs.com>',
    to: em,
    subject: 'Order Received — Payment Confirmation Pending · AthenaBioLabs',
    html: `
      <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:40px 24px;color:#1a1a1a;background:#FAFAF7">
        <p style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#C8A97E;margin:0 0 4px">AthenaBioLabs</p>
        <h1 style="font-size:28px;font-weight:400;margin:0 0 6px">Order Received</h1>
        <p style="font-size:13px;color:#aaa;margin:0 0 32px">Reference #${orderId}</p>
        <p style="font-size:15px;line-height:1.75;color:#555;margin-bottom:28px">
          Thank you, ${firstName}. We've received your order and are waiting to verify your UPI payment.
          Once confirmed you'll get another email and we'll dispatch within 24 hours.
        </p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
          <thead>
            <tr style="border-bottom:2px solid #eee">
              <th style="text-align:left;padding-bottom:8px;font-size:10px;font-family:DM Sans,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#aaa;font-weight:600">Item</th>
              <th style="text-align:center;padding-bottom:8px;font-size:10px;font-family:DM Sans,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#aaa;font-weight:600">Qty</th>
              <th style="text-align:right;padding-bottom:8px;font-size:10px;font-family:DM Sans,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#aaa;font-weight:600">Price</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
          <tfoot>
            ${discountRow}
            <tr><td colspan="2" style="padding-top:12px;font-size:14px;font-weight:600">Total</td><td style="padding-top:12px;text-align:right;font-size:14px;font-weight:600">${fmt(total)}</td></tr>
          </tfoot>
        </table>
        <div style="background:#FFF8F0;border-left:3px solid #C8A97E;padding:16px 20px;margin-bottom:28px;font-size:13px;line-height:1.75;color:#666">
          <strong style="color:#1a1a1a">Shipping to:</strong><br>
          ${esc(safeAddress).replace(/\n/g, '<br>')}
        </div>
        <p style="font-size:12px;color:#aaa;line-height:1.7">
          Questions? Reply to this email or write to <a href="mailto:support@athenabiolabs.com" style="color:#C8A97E">support@athenabiolabs.com</a>
        </p>
      </div>
    `,
  });

  // ── Merchant: New order + one-click confirm ───────────────────────────────
  await resend.emails.send({
    from: 'AthenaBioLabs Orders <support@athenabiolabs.com>',
    to: MERCHANT_EMAIL,
    subject: `New Order #${orderId} · ${fmt(total)} · UPI Pending`,
    html: `
      <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:40px 24px;color:#1a1a1a;background:#FAFAF7">
        <p style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#C8A97E;margin:0 0 4px">AthenaBioLabs Orders</p>
        <h1 style="font-size:26px;font-weight:400;margin:0 0 6px">New Order — ${fmt(total)}</h1>
        <p style="font-size:13px;color:#aaa;margin:0 0 28px">Order #${orderId} · UPI / Bank Transfer · Awaiting verification</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:28px;font-size:14px">
          <tr><td style="padding:7px 0;color:#888;border-bottom:1px solid #eee">Customer</td><td style="padding:7px 0;text-align:right;border-bottom:1px solid #eee">${esc(safeName)}</td></tr>
          <tr><td style="padding:7px 0;color:#888;border-bottom:1px solid #eee">Email</td><td style="padding:7px 0;text-align:right;border-bottom:1px solid #eee">${esc(em)}</td></tr>
          <tr><td style="padding:7px 0;color:#888;border-bottom:1px solid #eee;vertical-align:top">Ship to</td><td style="padding:7px 0;text-align:right;border-bottom:1px solid #eee">${esc(safeAddress).replace(/\n/g, '<br>')}</td></tr>
          <tr><td style="padding:7px 0;color:#888;border-bottom:1px solid #eee;vertical-align:top">Items</td><td style="padding:7px 0;text-align:right;border-bottom:1px solid #eee">${esc(itemsStr)}</td></tr>
          ${appliedCoupon ? `<tr><td style="padding:7px 0;color:#888;border-bottom:1px solid #eee">Coupon</td><td style="padding:7px 0;text-align:right;border-bottom:1px solid #eee">${esc(appliedCoupon)} (−${fmt(discount)})</td></tr>` : ''}
          ${safeUtr ? `<tr><td style="padding:7px 0;color:#888;border-bottom:1px solid #eee">UTR / Ref</td><td style="padding:7px 0;text-align:right;border-bottom:1px solid #eee;font-weight:700;color:#1a1a1a;font-size:16px">${esc(safeUtr)}</td></tr>` : ''}
          <tr><td style="padding:7px 0;color:#888">Total paid</td><td style="padding:7px 0;text-align:right;font-weight:600;font-size:16px">${fmt(total)}</td></tr>
        </table>
        <p style="font-size:14px;color:#555;line-height:1.7;margin-bottom:24px">
          Check your Paytm for <strong>${fmt(total)}</strong>${safeUtr ? ` — UTR <strong>${esc(safeUtr)}</strong>` : ''}. Once verified, click below.
        </p>
        <a href="${confirmUrl}" style="display:inline-block;background:#1a1a1a;color:#FAFAF7;font-family:DM Sans,sans-serif;font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;padding:16px 36px;text-decoration:none">
          Confirm Order →
        </a>
        <p style="font-size:11px;color:#ccc;margin-top:20px;word-break:break-all">${confirmUrl}</p>
      </div>
    `,
  });

  return res.status(200).json({ success: true, orderId });
}
