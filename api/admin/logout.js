// api/admin/logout.js
import { createClient } from '@supabase/supabase-js';
import { readSessionCookie, clearSessionCookie } from '../_lib/session.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const tok = readSessionCookie(req);
  if (tok) {
    const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    await supa.from('admin_sessions').delete().eq('token', tok);
  }
  clearSessionCookie(res);
  return res.status(200).json({ ok: true });
}
