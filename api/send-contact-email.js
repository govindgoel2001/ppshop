// api/send-contact-email.js
// POST { name, email, subject, message }

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { getIp } from './_lib/validate.js';

const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);
const MERCHANT_EMAIL = process.env.MERCHANT_EMAIL || 'govindnarayangoel395@gmail.com';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function emailValid(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length <= 254;
}

async function checkContactRateLimit(ip) {
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supa
    .from('otp_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('ip', ip)
    .eq('type', 'contact')
    .gte('created_at', since);
  return (count || 0) < 10;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const ip = getIp(req);
  const allowed = await checkContactRateLimit(ip);
  if (!allowed) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }

  const em = String(email).toLowerCase().trim();
  if (!emailValid(em)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  const safeName    = String(name).trim().slice(0, 100);
  const safeSubject = String(subject || 'Website Inquiry').trim().slice(0, 200);
  const safeMessage = String(message).trim().slice(0, 2000);

  if (!safeName || !safeMessage) {
    return res.status(400).json({ error: 'Name and message are required.' });
  }

  // Record attempt for rate limiting
  await supa.from('otp_attempts').insert({ email: em, type: 'contact', ip }).catch(() => {});

  // Log to Supabase (best-effort, non-blocking)
  supa.from('contact_submissions').insert({
    name: safeName, email: em, subject: safeSubject, message: safeMessage,
  }).catch(() => {});

  // Send notification to merchant
  const { error } = await resend.emails.send({
    from: 'AthenaBioLabs Contact <support@athenabiolabs.com>',
    to: MERCHANT_EMAIL,
    reply_to: em,
    subject: `Contact: ${safeSubject}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:40px 24px;color:#1a1a1a;background:#FAFAF7">
        <p style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#C8A97E;margin:0 0 4px">AthenaBioLabs</p>
        <h1 style="font-size:24px;font-weight:400;margin:0 0 24px">New Contact Message</h1>
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px">
          <tr><td style="padding:8px 0;color:#888;border-bottom:1px solid #eee;width:100px">From</td><td style="padding:8px 0;border-bottom:1px solid #eee">${esc(safeName)}</td></tr>
          <tr><td style="padding:8px 0;color:#888;border-bottom:1px solid #eee">Email</td><td style="padding:8px 0;border-bottom:1px solid #eee"><a href="mailto:${esc(em)}" style="color:#C8A97E">${esc(em)}</a></td></tr>
          <tr><td style="padding:8px 0;color:#888;border-bottom:1px solid #eee">Subject</td><td style="padding:8px 0;border-bottom:1px solid #eee">${esc(safeSubject)}</td></tr>
        </table>
        <div style="background:#F0EDE7;padding:20px 24px;font-size:14px;line-height:1.8;color:#333;white-space:pre-wrap">${esc(safeMessage)}</div>
        <p style="font-size:12px;color:#aaa;margin-top:20px">Reply directly to this email to respond to ${esc(safeName)}.</p>
      </div>
    `,
  });

  if (error) {
    console.error('Contact email error:', error);
    return res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }

  return res.status(200).json({ success: true });
}
