// api/admin/me.js
import { requireAdmin } from '../_lib/session.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const { email } = await requireAdmin(req);
    return res.status(200).json({ email });
  } catch {
    return res.status(401).json({ error: 'Unauthenticated.' });
  }
}
