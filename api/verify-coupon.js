// api/verify-coupon.js
// POST { email: string, otp: string, code: string }
// Verifies OTP, then checks if the coupon has been used.
// On success, marks the OTP as verified. Coupon is recorded at order time.
// Returns { valid: true } or { error: string }

import { createClient } from '@supabase/supabase-js';

const supa = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, otp, code } = req.body || {};
  if (!email || !otp || !code) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const em = email.toLowerCase().trim();

  // Double-check coupon hasn't been used by this email already
  const { data: used } = await supa
    .from('coupon_usage')
    .select('id')
    .eq('email', em)
    .eq('code', code.toUpperCase())
    .maybeSingle();

  if (used) {
    return res.status(200).json({ error: 'This coupon has already been used with this email.' });
  }

  // Verify OTP
  const { data: record } = await supa
    .from('email_otps')
    .select('otp, expires_at, verified')
    .eq('email', em)
    .maybeSingle();

  if (!record) {
    return res.status(200).json({ error: 'No OTP found for this email. Please request a new one.' });
  }
  if (record.verified) {
    return res.status(200).json({ error: 'OTP already used. Please request a new one.' });
  }
  if (new Date(record.expires_at) < new Date()) {
    return res.status(200).json({ error: 'Code expired. Please request a new one.' });
  }
  if (record.otp !== otp.trim()) {
    return res.status(200).json({ error: 'Incorrect code. Please try again.' });
  }

  // Mark OTP as verified
  await supa
    .from('email_otps')
    .update({ verified: true })
    .eq('email', em);

  return res.status(200).json({ valid: true });
}
