// api/_lib/mailer.js
import { Resend } from 'resend';

const FROM = 'AthenaBioLabs <support@athenabiolabs.com>';
const SITE_URL = process.env.ADMIN_SITE_URL || 'https://athenabiolabs.com';

function getResend() { return new Resend(process.env.RESEND_API_KEY); }

function fmtINR(n) { return '₹' + Number(n).toLocaleString('en-IN'); }

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function itemsToHtml(lines) {
  return lines.map(l =>
    `<tr><td>${escapeHtml(l.n)} (${escapeHtml(l.ds)})</td><td>×${l.q}</td><td>${fmtINR(l.lineTotal)}</td></tr>`
  ).join('');
}

async function send({ to, subject, html }) {
  const { error } = await getResend().emails.send({ from: FROM, to, subject, html });
  if (error) console.error('mailer error:', error);
  return { ok: !error, error };
}

export async function sendAdminAlert({ adminEmails, order, lines }) {
  const subject = `New order ${order.ref} — ${fmtINR(order.total)} — pending verification`;
  const link = `${SITE_URL}/admin/order.html?id=${order.id}`;
  const html = `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px 24px">
    <h2 style="font-weight:400;margin-bottom:8px">New order: ${escapeHtml(order.ref)}</h2>
    <p>${escapeHtml(order.email)} · UTR ${escapeHtml(order.utr || '—')}</p>
    <table style="border-collapse:collapse;width:100%;margin:16px 0">${itemsToHtml(lines)}</table>
    <p><strong>Total: ${fmtINR(order.total)}</strong> ${order.coupon ? `(coupon ${order.coupon})` : ''}</p>
    <p style="margin-top:24px"><a href="${link}" style="background:#1a1a1a;color:#fff;padding:12px 20px;text-decoration:none">Review &amp; verify</a></p>
  </div>`;
  return send({ to: adminEmails, subject, html });
}

export async function sendCustomerPlaced({ to, order, lines }) {
  const html = `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px 24px">
    <h2 style="font-weight:400">Order ${escapeHtml(order.ref)} received</h2>
    <p>We've received your UTR <code>${escapeHtml(order.utr)}</code>. We typically verify within 24 hours.</p>
    <table style="border-collapse:collapse;width:100%;margin:16px 0">${itemsToHtml(lines)}</table>
    <p><strong>Total: ${fmtINR(order.total)}</strong></p>
    <p style="font-size:12px;color:#888">If you didn't place this order, reply to this email.</p>
  </div>`;
  return send({ to, subject: `Order ${order.ref} received — verifying payment`, html });
}

export async function sendCustomerApproved({ to, order }) {
  const html = `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px 24px">
    <h2 style="font-weight:400">Order ${escapeHtml(order.ref)} confirmed</h2>
    <p>Your payment is verified and we'll dispatch within 24 hours.</p>
  </div>`;
  return send({ to, subject: `Order ${order.ref} confirmed — dispatch within 24h`, html });
}

export async function sendCustomerRejected({ to, order, reason }) {
  const html = `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px 24px">
    <h2 style="font-weight:400">Order ${escapeHtml(order.ref)} could not be verified</h2>
    <p>Reason: ${escapeHtml(reason || 'Payment not received.')}</p>
    <p>Reply with a fresh UTR or use a different payment method.</p>
  </div>`;
  return send({ to, subject: `Order ${order.ref} — payment not verified`, html });
}

export async function sendCustomerShipped({ to, order, tracking }) {
  const html = `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px 24px">
    <h2 style="font-weight:400">Order ${escapeHtml(order.ref)} has shipped</h2>
    <p>Tracking number: <strong>${escapeHtml(tracking)}</strong></p>
  </div>`;
  return send({ to, subject: `Order ${order.ref} shipped`, html });
}

export async function sendAdminLoginLink({ to, link }) {
  const html = `<div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:32px 24px">
    <h2 style="font-weight:400">AthenaBioLabs admin sign-in</h2>
    <p>Click to sign in. This link expires in 30 minutes and works once.</p>
    <p><a href="${link}" style="background:#1a1a1a;color:#fff;padding:12px 20px;text-decoration:none">Sign in</a></p>
    <p style="font-size:12px;color:#888">If this wasn't you, ignore this email.</p>
  </div>`;
  return send({ to, subject: 'AthenaBioLabs admin sign-in link', html });
}
