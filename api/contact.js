import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

function getSupa() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }

  const subjectLine = subject || 'Website Inquiry';

  // Save to Supabase
  try {
    await getSupa().from('contact_submissions').insert({ name, email, subject: subjectLine, message });
  } catch (_) {}

  const resend = new Resend(process.env.RESEND_API_KEY);
  const FROM = 'AthenaBioLabs <support@athenabiolabs.com>';

  // Thank-you email to the enquirer
  const customerHtml = `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
    <h2 style="font-weight:400;margin-bottom:8px">Thanks for reaching out, ${escapeHtml(name)}.</h2>
    <p style="color:#555;line-height:1.6">We've received your enquiry and will get back to you within <strong>24 hours</strong>.</p>
    <p style="color:#555;line-height:1.6">In the meantime, feel free to browse our <a href="https://athenabiolabs.com/catalogue" style="color:#C8A97E">peptide catalogue</a> or chat with us on <a href="https://wa.me/919560397569" style="color:#C8A97E">WhatsApp</a>.</p>
    <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
    <p style="font-size:12px;color:#aaa">Your message: "${escapeHtml(message)}"</p>
    <p style="font-size:12px;color:#aaa;margin-top:24px">AthenaBioLabs · support@athenabiolabs.com</p>
  </div>`;

  // Internal notification to support
  const adminHtml = `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px 24px">
    <h2 style="font-weight:400">New contact enquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(subjectLine)}</p>
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap;background:#f5f5f5;padding:12px;border-radius:4px">${escapeHtml(message)}</p>
  </div>`;

  const [customerResult, adminResult] = await Promise.allSettled([
    resend.emails.send({ from: FROM, to: email, subject: `We'll be in touch — AthenaBioLabs`, html: customerHtml }),
    resend.emails.send({ from: FROM, to: 'support@athenabiolabs.com', subject: `New enquiry from ${name} — ${subjectLine}`, html: adminHtml }),
  ]);

  if (customerResult.status === 'rejected' || customerResult.value?.error) {
    console.error('contact mailer error (customer):', customerResult.reason || customerResult.value?.error);
  }
  if (adminResult.status === 'rejected' || adminResult.value?.error) {
    console.error('contact mailer error (admin):', adminResult.reason || adminResult.value?.error);
  }

  return res.status(200).json({ ok: true });
}
