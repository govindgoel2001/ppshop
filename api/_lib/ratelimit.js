// api/_lib/ratelimit.js
// Supabase-based rate limiting. Tracks attempt counts in the otp_attempts table.

import { createClient } from '@supabase/supabase-js';

function getSupa() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

// Max OTPs sent to a single email per hour.
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

// Verify attempts by IP in last 10 minutes.
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

// Verify attempts by email in last 10 minutes — guards against distributed-IP brute force.
export async function checkEmailVerifyRateLimit(email) {
  const supa = getSupa();
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count } = await supa
    .from('otp_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('email', email)
    .eq('type', 'verify')
    .gte('created_at', since);
  return (count || 0) < 8;
}

// Record-coupon attempts per IP per hour — prevents coupon-burning DoS.
export async function checkRecordRateLimit(ip) {
  const supa = getSupa();
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supa
    .from('otp_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('ip', ip)
    .eq('type', 'record')
    .gte('created_at', since);
  return (count || 0) < 10;
}

// Place-order attempts per IP per hour — prevents email-flood / order-flood.
// Each successful or failed call burns the rate limit; admin can bump the
// table directly if a legit customer is locked out.
export async function checkPlaceOrderRateLimit(ip) {
  const supa = getSupa();
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supa
    .from('otp_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('ip', ip)
    .eq('type', 'place_order')
    .gte('created_at', since);
  return (count || 0) < 5;
}

export async function recordPlaceOrderAttempt(email, ip) {
  const supa = getSupa();
  await supa.from('otp_attempts').insert({ email, type: 'place_order', ip });
}
