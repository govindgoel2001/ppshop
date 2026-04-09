// api/record-coupon.js
// POST { email: string, code: sting, order_id?: string }
// Permanently records coupon usage after payment. Requires prior OTP verification.

import { createClient } from '@supabase/supabase-js';
import { validateEmail, validateCouponCode } from './_lib/validate.js';

const supa = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, code, order_id } = req.body || {};

  if (!validateEmail(email) || !validateCouponCode(code)) {
    return res.status(400).json({ error: 'Invalid request.' });
  }

  const em = email.toLowerCase().trim();
  const cd = code.trim().toUpperCase();

  // Confirm OTP was verified — prevents recording without going through verification
  const { data: otpRecord } = await supa
    .from('email_otps')
    .select('verified')
    .eq('email', em)
    .maybeSingle();

  if (!otpRecord?.verified) {
    return res.status(403).json({ error: 'Email not verified.' });
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

  // Sanitise order_id — alphanumeric + hyphens only, max 100 chars
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

  return res.status(200).json({ recorded: true });
}
