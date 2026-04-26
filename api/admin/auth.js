// api/admin/auth.js
// GET /api/admin/auth?token=...&next=...
// Validates the magic-link token, creates a session, sets cookie, redirects.
import { createClient } from '@supabase/supabase-js';
import { newToken, setSessionCookie, adminAllowList } from '../_lib/session.js';

const SESSION_TTL_DAYS = 7;

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const token = String(req.query.token || '');
  const next  = typeof req.query.next === 'string' && req.query.next.startsWith('/admin/')
    ? req.query.next : '/admin/index.html';

  if (!token) return res.status(400).send('Missing token.');

  const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const { data: row } = await supa
    .from('admin_login_tokens')
    .select('email, expires_at, used')
    .eq('token', token)
    .maybeSingle();

  if (!row || row.used || new Date(row.expires_at) < new Date()) {
    return res.status(400).send('This sign-in link is invalid or expired.');
  }
  if (!adminAllowList().includes(row.email.toLowerCase())) {
    return res.status(403).send('Access revoked.');
  }

  await supa.from('admin_login_tokens').update({ used: true }).eq('token', token);

  const sessionTok = newToken();
  const expiresAt  = new Date(Date.now() + SESSION_TTL_DAYS * 86400 * 1000).toISOString();
  await supa.from('admin_sessions').insert({ token: sessionTok, email: row.email, expires_at: expiresAt });

  setSessionCookie(res, sessionTok);
  res.statusCode = 302;
  res.setHeader('Location', next);
  res.end();
}
