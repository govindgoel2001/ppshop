// api/order-webhook.js
// Supabase Database Webhook — fires on orders UPDATE
// Set up in: Supabase Dashboard → Database → Webhooks
//   Table: orders  |  Event: UPDATE  |  URL: /api/order-webhook
//   Header: Authorization: Bearer <WEBHOOK_SECRET>
//
// When an order's status is flipped to 'confirmed' (from the dashboard
// or any DB update), this sends the customer their confirmation email.
// The customer_notified flag is claimed atomically to prevent duplicates.

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function fmt(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

async function sendCustomerConfirmation(order) {
  const firstName = esc((order.customer_name || '').split(' ')[0] || 'there');
  await resend.emails.send({
    from: 'AthenaBioLabs <support@athenabiolabs.com>',
    to: order.email,
    subject: 'Order Confirmed — AthenaBioLabs',
    html: `
      <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:40px 24px;color:#1a1a1a;background:#FAFAF7">
        <p style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#C8A97E;margin:0 0 4px">AthenaBioLabs</p>
        <h1 style="font-size:28px;font-weight:400;margin:0 0 6px">Order Confirmed</h1>
        <p style="font-size:13px;color:#aaa;margin:0 0 32px">Reference #${esc(String(order.id))}</p>
        <div style="background:#F0EDE7;border-left:3px solid #7a9a6d;padding:18px 22px;margin-bottom:28px;font-size:14px;line-height:1.75;color:#555">
          <strong style="color:#1a1a1a">✓ Payment received.</strong><br>
          Your order is confirmed and will be dispatched within 24 hours, cold-chain packed.
        </div>
        <p style="font-size:14px;line-height:1.75;color:#555;margin-bottom:10px">
          <strong>Items:</strong> ${esc(order.items)}
        </p>
        <p style="font-size:14px;line-height:1.75;color:#555;margin-bottom:28px">
          <strong>Total:</strong> ${fmt(order.total)}
        </p>
        <p style="font-size:13px;line-height:1.75;color:#888;margin-bottom:6px">
          Tracking details will follow once dispatched. All peptides ship in an insulated pack with ice gel — typically 2–4 days pan-India.
        </p>
        <p style="font-size:12px;color:#aaa;margin-top:28px;line-height:1.7">
          Questions? Reply to this email or write to <a href="mailto:support@athenabiolabs.com" style="color:#C8A97E">support@athenabiolabs.com</a>
        </p>
      </div>
    `,
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // Verify webhook secret
  if (!WEBHOOK_SECRET) {
    console.error('WEBHOOK_SECRET not set');
    return res.status(500).end();
  }
  const auth = req.headers['authorization'];
  if (auth !== `Bearer ${WEBHOOK_SECRET}`) {
    return res.status(401).end();
  }

  const { type, table, record, old_record } = req.body || {};

  // Only handle orders table UPDATE events
  if (table !== 'orders' || type !== 'UPDATE') {
    return res.status(200).end();
  }

  // Only act when status just changed to 'confirmed'
  if (record?.status !== 'confirmed' || old_record?.status === 'confirmed') {
    return res.status(200).end();
  }

  if (!record.email) {
    return res.status(200).end();
  }

  // Atomically claim the notification — prevent duplicate emails when
  // confirm-order.js (email link) and this webhook fire for the same order.
  const { data: claimed } = await supa
    .from('orders')
    .update({ customer_notified: true })
    .eq('id', record.id)
    .eq('customer_notified', false)
    .select('id')
    .maybeSingle();

  if (!claimed) {
    // confirm-order.js already sent the email — nothing to do
    return res.status(200).end();
  }

  try {
    await sendCustomerConfirmation(record);
  } catch (err) {
    console.error('Webhook email error:', err);
    // Roll back the flag so a retry can succeed
    await supa.from('orders').update({ customer_notified: false }).eq('id', record.id).catch(() => {});
    return res.status(500).end();
  }

  return res.status(200).end();
}
