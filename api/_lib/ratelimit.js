// api/_lib/ratelimit.js
// Supabase-based rate limiting — no extra services needed.
// Tracks attempt counts in the email_otps table + a simple in-memory fallback for IP.

import { createClient } from '@supabase/supabase-js';

function getSupa() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

// Check how many OTPs have been sent to this email in the last hour.
// Returns true if allowed, false if rate limited.
export async function checkEmailRateLimit(email) {
  const supa = getSupa();
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supa
    .from('otp_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('email', email)
    .eq('type', 'send')
    .gte('created_at', since);
  return (count || 0) < 3;
}

export async function recordOtpAttempt(email, type, ip) {
  const supa = getSupa();
  await supa.from('otp_attempts').insert({ email, type, ip });
}

// Check verify attempts by IP in last 10 minutes (5 max).
export async function checkVerifyRateLimit(ip) {
  const supa = getSupa();
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count } = await supa
    .from('otp_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('ip', ip)
    .eq('type', 'verify')
    .gte('created_at', since);
  return (count || 0) < 5;
}
