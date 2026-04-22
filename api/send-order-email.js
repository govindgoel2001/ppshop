// api/send-order-email.js
// POST { email, name, address, items, total, coupon, ebook }
// Saves order, emails customer (pending) + merchant (with confirm link)

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);
const MERCHANT_EMAIL = process.env.MERCHANT_EMAIL || 'govindnarayangoel395@gmail.com';
const SITE_URL = (process.env.SITE_URL || 'https://athenabiolabs.com').replace(/\/$/, '');

function token() {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function fmt(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

function emailValid(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, name, address, items, total, coupon, ebook, utr } = req.body || {};

  if (!email || !name || !address || !items || !total) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const em = email.toLowerCase().trim();
  if (!emailValid(em)) return res.status(400).json({ error: 'Invalid email address.' });

  const confirmToken = token();
  const itemsStr = Array.isArray(items)
    ? items.map(c => `${c.n} (${c.ds}) x${c.q}`).join(', ')
    : String(items);

  const { data: order, error: dbErr } = await supa
    .from('orders')
    .insert({
      email: em,
      customer_name: String(name).trim(),
      shipping_address: String(address).trim(),
      items: itemsStr,
      total: Number(total),
      coupon: coupon || null,
      payment_method: 'bank_transfer',
      status: 'pending_verification',
      ebook: ebook !== false,
      confirm_token: confirmToken,
      utr: utr ? String(utr).trim() : null,
    })
    .select('id')
    .single();

  if (dbErr) {
    console.error('Order insert error:', dbErr);
    return res.status(500).json({ error: 'Failed to save order. Please try again.' });
  }

  const orderId = order.id;
  const confirmUrl = `${SITE_URL}/api/confirm-order?id=${orderId}&token=${confirmToken}`;

  const itemRows = Array.isArray(items)
    ? items.map(c =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;font-size:13px">${c.n} <span style="color:#999">(${c.ds})</span></td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;font-size:13px">×${c.q}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;font-size:13px">${fmt(c.pr * c.q)}</td>
        </tr>`
      ).join('')
    : `<tr><td colspan="3" style="padding:8px 0;font-size:13px">${itemsStr}</td></tr>`;

  // ── Customer: Order Received (pending) ──────────────────────────────────
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
          Thank you, ${String(name).trim().split(' ')[0]}. We've received your order and are waiting to verify your UPI payment.
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
            <tr>
              <td colspan="2" style="padding-top:12px;font-size:14px;font-weight:600">Total</td>
              <td style="padding-top:12px;text-align:right;font-size:14px;font-weight:600">${fmt(total)}</td>
            </tr>
          </tfoot>
        </table>

        <div style="background:#FFF8F0;border-left:3px solid #C8A97E;padding:16px 20px;margin-bottom:28px;font-size:13px;line-height:1.75;color:#666">
          <strong style="color:#1a1a1a">Shipping to:</strong><br>
          ${String(address).trim().replace(/\n/g, '<br>')}
        </div>

        <p style="font-size:12px;color:#aaa;line-height:1.7">
          Questions? Reply to this email or write to <a href="mailto:support@athenabiolabs.com" style="color:#C8A97E">support@athenabiolabs.com</a>
        </p>
      </div>
    `,
  });

  // ── Merchant: New order + one-click confirm link ─────────────────────────
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
          <tr><td style="padding:7px 0;color:#888;border-bottom:1px solid #eee">Customer</td><td style="padding:7px 0;text-align:right;border-bottom:1px solid #eee">${String(name).trim()}</td></tr>
          <tr><td style="padding:7px 0;color:#888;border-bottom:1px solid #eee">Email</td><td style="padding:7px 0;text-align:right;border-bottom:1px solid #eee">${em}</td></tr>
          <tr><td style="padding:7px 0;color:#888;border-bottom:1px solid #eee;vertical-align:top">Ship to</td><td style="padding:7px 0;text-align:right;border-bottom:1px solid #eee">${String(address).trim().replace(/\n/g, '<br>')}</td></tr>
          <tr><td style="padding:7px 0;color:#888;border-bottom:1px solid #eee;vertical-align:top">Items</td><td style="padding:7px 0;text-align:right;border-bottom:1px solid #eee">${itemsStr}</td></tr>
          ${coupon ? `<tr><td style="padding:7px 0;color:#888;border-bottom:1px solid #eee">Coupon</td><td style="padding:7px 0;text-align:right;border-bottom:1px solid #eee">${coupon}</td></tr>` : ''}
          ${utr ? `<tr><td style="padding:7px 0;color:#888;border-bottom:1px solid #eee">UTR / Ref</td><td style="padding:7px 0;text-align:right;border-bottom:1px solid #eee;font-weight:600;color:#1a1a1a">${utr}</td></tr>` : ''}
          <tr><td style="padding:7px 0;color:#888">Total</td><td style="padding:7px 0;text-align:right;font-weight:600">${fmt(total)}</td></tr>
        </table>

        <p style="font-size:14px;color:#555;line-height:1.7;margin-bottom:24px">
          Check your UPI / Paytm app for a payment of <strong>${fmt(total)}</strong> from the customer.
          Once verified, click below — the customer will be emailed instantly.
        </p>

        <a href="${confirmUrl}"
           style="display:inline-block;background:#1a1a1a;color:#FAFAF7;font-family:DM Sans,sans-serif;font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;padding:16px 36px;text-decoration:none">
          Confirm Order →
        </a>

        <p style="font-size:11px;color:#ccc;margin-top:20px;word-break:break-all">${confirmUrl}</p>
      </div>
    `,
  });

  return res.status(200).json({ success: true, orderId });
}
