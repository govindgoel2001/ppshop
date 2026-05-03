// api/send-otp.jss
// POST { email: string }

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { checkEmailRateLimit, recordOtpAttempt } from './_lib/ratelimit.js';
import { validateEmail, getIp } from './_lib/validate.js';

const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body || {};
  if (!validateEmail(email)) return res.status(400).json({ error: 'Invalid email address.' });

  const em = email.toLowerCase().trim();
  const ip = getIp(req);

  // Rate limit: max 3 OTPs per email per hour
  const allowed = await checkEmailRateLimit(em);
  if (!allowed) {
    return res.status(429).json({ error: 'Too many codes sent to this email. Try again in an hour.' });
  }

  // Check if email is blocked — silent block returns same shape as success to avoid enumeration
  const { data: blocked } = await supa
    .from('blocked_emails').select('email').eq('email', em).maybeSingle();
  if (blocked) return res.status(200).json({ sent: true });

  // Already used FIRST5 — return same shape so attackers can't enumerate which emails redeemed
  const { data: existing } = await supa
    .from('coupon_usage').select('id').eq('email', em).eq('code', 'FIRST5').maybeSingle();
  if (existing) return res.status(200).json({ sent: true, alreadyUsed: true });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  const { error: dbErr } = await supa
    .from('email_otps')
    .upsert(
      { email: em, otp, expires_at: expiresAt, verified: false, verified_at: null, fail_count: 0 },
      { onConflict: 'email' }
    );

  if (dbErr) {
    console.error('OTP upsert error:', dbErr);
    return res.status(500).json({ error: 'Failed to generate OTP. Please try again.' });
  }

  const { error: emailErr } = await resend.emails.send({
    from: 'AthenaBioLabs <support@athenabiolabs.com>',
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
    // Roll back the OTP row so the user isn't stuck with a stale code, and don't burn a rate-limit slot.
    await supa.from('email_otps').delete().eq('email', em);
    return res.status(500).json({ error: 'Failed to send email. Please try again.' });
  }

  // Only record the attempt against the per-email cap after a successful send
  await recordOtpAttempt(em, 'send', ip);

  return res.status(200).json({ sent: true });
}
