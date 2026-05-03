// api/_lib/session.js
import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const SESSION_TTL_DAYS = 7;
const COOKIE_NAME = 'abl_admin';

export function newToken() {
  return crypto.randomBytes(48).toString('base64url');
}

export function readSessionCookie(req) {
  const c = req && req.headers && req.headers.cookie;
  if (!c) return null;
  const m = String(c).match(/(?:^|;\s*)abl_admin=([^;]+)/);
  return m ? m[1] : null;
}

export function buildSessionCookie(token) {
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_DAYS * 86400}`;
}

export function buildClearCookie() {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

export function setSessionCookie(res, token) {
  res.setHeader('Set-Cookie', buildSessionCookie(token));
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', buildClearCookie());
}

export function adminAllowList() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
}

export async function requireAdmin(req) {
  const token = readSessionCookie(req);
  if (!token) { const e = new Error('No session'); e.code = 'UNAUTHENTICATED'; throw e; }

  const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const { data } = await supa
    .from('admin_sessions')
    .select('email, expires_at')
    .eq('token', token)
    .maybeSingle();

  if (!data) { const e = new Error('Bad session'); e.code = 'UNAUTHENTICATED'; throw e; }
  if (new Date(data.expires_at) < new Date()) {
    const e = new Error('Expired'); e.code = 'UNAUTHENTICATED'; throw e;
  }
  if (!adminAllowList().includes(data.email.toLowerCase())) {
    const e = new Error('Not in allow-list'); e.code = 'REVOKED'; throw e;
  }
  return { email: data.email };
}
