// api/record-coupon.js
// POST { email: string, code: string, order_id?: string }
// Permanently records coupon usage after payment. Requires a recently-verified OTP.

import { createClient } from '@supabase/supabase-js';
import { validateEmail, validateCouponCode, getIp } from './_lib/validate.js';
import { checkRecordRateLimit } from './_lib/ratelimit.js';

const supa = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Verified flag must be at most this old to be accepted — limits the window in which an
// attacker who knows a verified email can burn the coupon.
const VERIFY_TTL_MS = 30 * 60 * 1000;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const ip = getIp(req);
  const ipOk = await checkRecordRateLimit(ip);
  if (!ipOk) return res.status(429).json({ error: 'Too many requests.' });

  const { email, code, order_id } = req.body || {};

  if (!validateEmail(email) || !validateCouponCode(code)) {
    return res.status(400).json({ error: 'Invalid request.' });
  }

  const em = email.toLowerCase().trim();
  const cd = code.trim().toUpperCase();

  // Confirm OTP was verified recently — prevents recording without a fresh verification
  const { data: otpRecord } = await supa
    .from('email_otps')
    .select('verified, verified_at')
    .eq('email', em)
    .maybeSingle();

  if (!otpRecord?.verified) {
    return res.status(403).json({ error: 'Email not verified.' });
  }

  if (otpRecord.verified_at) {
    const age = Date.now() - new Date(otpRecord.verified_at).getTime();
    if (age > VERIFY_TTL_MS) {
      return res.status(403).json({ error: 'Verification expired. Please verify again.' });
    }
  }

  // Idempotent — if already recorded, return success
  const { data: existing } = await supa
    .from('coupon_usage')
    .select('id')
    .eq('email', em)
    .eq('code', cd)
    .maybeSingle();

  if (existing) {
    return res.status(200).json({ recorded: true });
  }

  // Sanitise order_id — alphanumeric + hyphens/underscores only, max 100 chars
  const safeOrderId = typeof order_id === 'string'
    ? order_id.replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, 100)
    : null;

  const { error } = await supa
    .from('coupon_usage')
    .insert({ email: em, code: cd, order_id: safeOrderId });

  if (error) {
    console.error('record-coupon error:', error);
    return res.status(500).json({ error: 'Failed to record coupon usage.' });
  }

  // Consume the verification so the same flag can't be reused for a second code
  await supa
    .from('email_otps')
    .update({ verified: false })
    .eq('email', em);

  return res.status(200).json({ recorded: true });
}
