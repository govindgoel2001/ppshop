// api/record-coupon.js
// POST { email: string, code: string, order_id: string }
// Called after payment is confirmed — permanently records coupon usage.
// Requires the OTP to have been verified first (verified: true in email_otps).

import { createClient } from '@supabase/supabase-js';

const supa = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, code, order_id } = req.body || {};
  if (!email || !code) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const em = email.toLowerCase().trim();
  const cd = code.toUpperCase();

  // Confirm OTP was verified (prevents recording without verification)
  const { data: otpRecord } = await supa
    .from('email_otps')
    .select('verified')
    .eq('email', em)
    .maybeSingle();

  if (!otpRecord?.verified) {
    return res.status(403).json({ error: 'Email not verified.' });
  }

  // Guard against double-recording
  const { data: existing } = await supa
    .from('coupon_usage')
    .select('id')
    .eq('email', em)
    .eq('code', cd)
    .maybeSingle();

  if (existing) {
    return res.status(200).json({ recorded: true }); // idempotent
  }

  const { error } = await supa
    .from('coupon_usage')
    .insert({ email: em, code: cd, order_id: order_id || null });

  if (error) {
    console.error('record-coupon error:', error);
    return res.status(500).json({ error: 'Failed to record coupon usage.' });
  }

  return res.status(200).json({ recorded: true });
}
