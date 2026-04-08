// api/send-otp.js
// POST { email: string }
// Generates a 6-digit OTP, stores it in Supabase, sends via Resend.
// Returns { sent: true } or { alreadyUsed: true } or { error: string }

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supa = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY  // service key — never the anon key server-side
);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body || {};
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const em = email.toLowerCase().trim();

  // Check if this email already used FIRST5
  const { data: existing } = await supa
    .from('coupon_usage')
    .select('id')
    .eq('email', em)
    .eq('code', 'FIRST5')
    .maybeSingle();

  if (existing) {
    return res.status(200).json({ alreadyUsed: true });
  }

  // Generate 6-digit OTP, expires in 10 min
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  // Upsert — one active OTP per email at a time
  const { error: dbErr } = await supa
    .from('email_otps')
    .upsert(
      { email: em, otp, expires_at: expiresAt, verified: false },
      { onConflict: 'email' }
    );

  if (dbErr) {
    console.error('OTP upsert error:', dbErr);
    return res.status(500).json({ error: 'Failed to generate OTP' });
  }

  // Send email
  const { error: emailErr } = await resend.emails.send({
    from: 'AthenaBioLabs <noreply@athenabiolabs.com>',
    to: em,
    subject: 'Your verification code — AthenaBioLabs',
    html: `
      <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#1a1a1a">
        <p style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#C8A97E;margin-bottom:4px">AthenaBioLabs</p>
        <h1 style="font-size:28px;font-weight:400;margin:0 0 24px">Your verification code</h1>
        <p style="font-size:15px;line-height:1.6;color:#555;margin-bottom:32px">
          Enter this code to unlock your <strong>FIRST5</strong> discount — 5% off your first order.
        </p>
        <div style="background:#F0EDE7;border-left:3px solid #C8A97E;padding:20px 28px;font-size:36px;font-weight:700;letter-spacing:.3em;text-align:center;margin-bottom:32px">
          ${otp}
        </div>
        <p style="font-size:12px;color:#999;line-height:1.6">
          This code expires in 10 minutes. If you didn't request this, ignore this email.
        </p>
      </div>
    `,
  });

  if (emailErr) {
    console.error('Resend error:', emailErr);
    return res.status(500).json({ error: 'Failed to send email' });
  }

  return res.status(200).json({ sent: true });
}
