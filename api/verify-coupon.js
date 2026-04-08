// api/verify-coupon.js
// POST { email: string, otp: string, code: string }
// Validates OTP server-side, marks it verified.
// Rate limited: 5 attempts/IP/10min to prevent brute force.

import { createClient } from '@supabase/supabase-js';
import { verifyIpLimiter } from './_lib/ratelimit.js';
import { validateEmail, validateOtp, validateCouponCode, getIp } from './_lib/validate.js';

const supa = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, otp, code } = req.body || {};

  if (!validateEmail(email) || !validateOtp(otp) || !validateCouponCode(code)) {
    return res.status(400).json({ error: 'Invalid request.' });
  }

  const em = email.toLowerCase().trim();
  const ip = getIp(req);

  // Rate limit verify attempts by IP
  const { success: ipOk } = await verifyIpLimiter.limit(ip);
  if (!ipOk) {
    return res.status(429).json({ error: 'Too many attempts. Please wait a few minutes.' });
  }

  const cd = code.trim().toUpperCase();

  // Guard: check coupon not already used
  const { data: used } = await supa
    .from('coupon_usage')
    .select('id')
    .eq('email', em)
    .eq('code', cd)
    .maybeSingle();

  if (used) {
    return res.status(200).json({ error: 'This coupon has already been used with this email.' });
  }

  // Fetch OTP record
  const { data: record } = await supa
    .from('email_otps')
    .select('otp, expires_at, verified')
    .eq('email', em)
    .maybeSingle();

  if (!record) {
    return res.status(200).json({ error: 'No code found for this email. Please request a new one.' });
  }
  if (record.verified) {
    return res.status(200).json({ error: 'Code already used. Please request a new one.' });
  }
  if (new Date(record.expires_at) < new Date()) {
    return res.status(200).json({ error: 'Code expired. Please request a new one.' });
  }
  if (record.otp !== otp.trim()) {
    return res.status(200).json({ error: 'Incorrect code. Please try again.' });
  }

  // Mark OTP verified
  await supa.from('email_otps').update({ verified: true }).eq('email', em);

  return res.status(200).json({ valid: true });
}
