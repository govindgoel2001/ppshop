// api/confirm-order.js
// GET ?id=ORDER_ID&token=CONFIRM_TOKEN
// Merchant clicks link → order confirmed → customer emailed

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

function fmt(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

function page(title, icon, heading, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title} · AthenaBioLabs</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Georgia,serif;background:#FAFAF7;color:#1a1a1a;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:32px}
    .card{max-width:420px;width:100%;text-align:center;padding:56px 40px;background:#fff;border:1px solid #eee}
    .icon{font-size:48px;margin-bottom:20px}
    .label{font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:#C8A97E;margin-bottom:10px}
    h1{font-size:26px;font-weight:400;margin-bottom:16px}
    p{font-size:14px;line-height:1.8;color:#777}
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${icon}</div>
    <div class="label">AthenaBioLabs</div>
    <h1>${heading}</h1>
    <p>${body}</p>
  </div>
</body>
</html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { id, token } = req.query;
  if (!id || !token) {
    return res.status(400).send(page('Error', '✕', 'Invalid Link', 'This confirmation link is missing required parameters.'));
  }

  const { data: order, error } = await supa
    .from('orders')
    .select('id, email, customer_name, items, total, status, confirm_token')
    .eq('id', id)
    .single();

  if (error || !order) {
    return res.status(404).send(page('Not Found', '✕', 'Order Not Found', 'No order found with this ID.'));
  }

  if (order.confirm_token !== token) {
    return res.status(403).send(page('Error', '✕', 'Invalid Token', 'This confirmation link is not valid.'));
  }

  if (order.status === 'confirmed') {
    return res.status(200).send(page(
      'Already Confirmed', '✓',
      `Order #${order.id} Already Confirmed`,
      'This order was already confirmed. The customer was notified.'
    ));
  }

  const { error: updateErr } = await supa
    .from('orders')
    .update({ status: 'confirmed' })
    .eq('id', id);

  if (updateErr) {
    console.error('Confirm update error:', updateErr);
    return res.status(500).send(page('Error', '⚠', 'Update Failed', 'Could not update the order. Please try again or update manually in Supabase.'));
  }

  // Email the customer
  if (order.email) {
    const firstName = (order.customer_name || '').split(' ')[0] || 'there';
    await resend.emails.send({
      from: 'AthenaBioLabs <support@athenabiolabs.com>',
      to: order.email,
      subject: 'Order Confirmed — AthenaBioLabs',
      html: `
        <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:40px 24px;color:#1a1a1a;background:#FAFAF7">
          <p style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#C8A97E;margin:0 0 4px">AthenaBioLabs</p>
          <h1 style="font-size:28px;font-weight:400;margin:0 0 6px">Order Confirmed</h1>
          <p style="font-size:13px;color:#aaa;margin:0 0 32px">Reference #${order.id}</p>

          <div style="background:#F0EDE7;border-left:3px solid #7a9a6d;padding:18px 22px;margin-bottom:28px;font-size:14px;line-height:1.75;color:#555">
            <strong style="color:#1a1a1a">✓ Payment received.</strong><br>
            Your order is confirmed and will be dispatched within 24 hours, cold-chain packed.
          </div>

          <p style="font-size:14px;line-height:1.75;color:#555;margin-bottom:10px">
            <strong>Items:</strong> ${order.items}
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

  return res.status(200).send(page(
    'Order Confirmed', '✓',
    `Order #${order.id} Confirmed`,
    `Payment verified. ${order.customer_name ? order.customer_name + ' has' : 'Customer has'} been emailed. Dispatch within 24 hours.`
  ));
}
