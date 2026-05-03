// api/admin/login.js
// POST { email, next? } — sends a magic-link email if the address is in ADMIN_EMAILS.
// Always returns { ok: true } to avoid leaking the admin allow-list.

import { createClient } from '@supabase/supabase-js';
import { newToken, adminAllowList } from '../_lib/session.js';
import { sendAdminLoginLink } from '../_lib/mailer.js';
import { recordOtpAttempt } from '../_lib/ratelimit.js';
import { validateEmail, getIp } from '../_lib/validate.js';

const TOKEN_TTL_MIN = 30;
const SITE_URL = process.env.ADMIN_SITE_URL || 'https://athenabiolabs.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const email = String((req.body && req.body.email) || '').trim().toLowerCase();
  if (!validateEmail(email)) return res.status(400).json({ error: 'Invalid email.' });

  const ip = getIp(req);
  const allowed = adminAllowList();

  if (!allowed.includes(email)) {
    await recordOtpAttempt(email, 'admin_login', ip);
    return res.status(200).json({ ok: true });
  }

  // Throttle: max 3 admin-login attempts per email per hour
  const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supa
    .from('otp_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('email', email).eq('type', 'admin_login').gte('created_at', since);
  if ((count || 0) >= 3) return res.status(429).json({ error: 'Too many sign-in attempts. Try later.' });

  const token = newToken();
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MIN * 60 * 1000).toISOString();

  const { error } = await supa.from('admin_login_tokens')
    .insert({ token, email, expires_at: expiresAt, used: false });
  if (error) {
    console.error('admin/login token insert error:', error);
    return res.status(500).json({ error: 'Could not send link.' });
  }

  await recordOtpAttempt(email, 'admin_login', ip);

  const next = typeof req.body.next === 'string' && req.body.next.startsWith('/admin/')
    ? req.body.next : '/admin/index.html';
  const link = `${SITE_URL}/api/admin/auth?token=${encodeURIComponent(token)}&next=${encodeURIComponent(next)}`;
  await sendAdminLoginLink({ to: email, link });

  return res.status(200).json({ ok: true });
}
