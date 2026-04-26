// api/verify-coupon.js
// POST { email: string, otp: string, code: string }

import { createClient } from '@supabase/supabase-js';
import {
  checkVerifyRateLimit,
  checkEmailVerifyRateLimit,
  recordOtpAttempt,
} from './_lib/ratelimit.js';
import { validateEmail, validateOtp, validateCouponCode, getIp } from './_lib/validate.js';

const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const MAX_OTP_FAILS = 5;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, otp, code } = req.body || {};
  if (!validateEmail(email) || !validateOtp(otp) || !validateCouponCode(code)) {
    return res.status(400).json({ error: 'Invalid request.' });
  }

  const em = email.toLowerCase().trim();
  const ip = getIp(req);

  // Rate limit by IP and by email — guards against single attacker and distributed brute-force
  const ipOk = await checkVerifyRateLimit(ip);
  if (!ipOk) return res.status(429).json({ error: 'Too many attempts. Please wait a few minutes.' });
  const emailOk = await checkEmailVerifyRateLimit(em);
  if (!emailOk) return res.status(429).json({ error: 'Too many attempts. Please request a new code.' });

  // Always count the attempt before any check that could reveal coupon-usage state
  await recordOtpAttempt(em, 'verify', ip);

  const cd = code.trim().toUpperCase();

  // Look up the OTP record FIRST — order matters so we don't leak which emails have used the coupon
  const { data: record } = await supa
    .from('email_otps')
    .select('otp, expires_at, verified, fail_count')
    .eq('email', em)
    .maybeSingle();

  if (!record) return res.status(404).json({ error: 'No code found for this email. Please request a new one.' });
  if (record.verified) return res.status(409).json({ error: 'Code already used. Please request a new one.' });
  if (new Date(record.expires_at) < new Date()) return res.status(410).json({ error: 'Code expired. Please request a new one.' });
  if ((record.fail_count || 0) >= MAX_OTP_FAILS) {
    // Invalidate the OTP after too many wrong tries so brute force can't outlast the rate limit
    await supa.from('email_otps').delete().eq('email', em);
    return res.status(429).json({ error: 'Too many wrong attempts. Please request a new code.' });
  }

  if (record.otp !== otp.trim()) {
    await supa
      .from('email_otps')
      .update({ fail_count: (record.fail_count || 0) + 1 })
      .eq('email', em);
    return res.status(400).json({ error: 'Incorrect code. Please try again.' });
  }

  // Coupon-already-used check happens AFTER OTP validation so this endpoint never confirms
  // coupon state to an unverified caller
  const { data: used } = await supa
    .from('coupon_usage').select('id').eq('email', em).eq('code', cd).maybeSingle();
  if (used) return res.status(409).json({ error: 'This coupon has already been used with this email.' });

  await supa
    .from('email_otps')
    .update({ verified: true, verified_at: new Date().toISOString() })
    .eq('email', em);

  return res.status(200).json({ valid: true });
}
