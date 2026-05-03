// api/admin/orders.js
// GET /api/admin/orders?status=pending|paid|rejected|shipped|all (default: pending)
// GET /api/admin/orders?id=N — single order with audit log
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '../_lib/session.js';

const STATUS_MAP = {
  pending: 'pending_verification',
  paid: 'paid',
  rejected: 'rejected',
  shipped: 'shipped',
};

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  try { await requireAdmin(req); }
  catch { return res.status(401).json({ error: 'Unauthenticated.' }); }

  const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  if (req.query.id) {
    const id = Number.parseInt(req.query.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Bad id.' });
    const { data: order } = await supa.from('orders').select('*').eq('id', id).maybeSingle();
    if (!order) return res.status(404).json({ error: 'Not found.' });
    const { data: audit } = await supa.from('order_audit')
      .select('*').eq('order_id', id).order('created_at', { ascending: false });
    return res.status(200).json({ order, audit: audit || [] });
  }

  const status = req.query.status || 'pending';
  const limit  = Math.min(Number.parseInt(req.query.limit, 10) || 50, 100);

  let q = supa.from('orders').select('*').order('created_at', { ascending: false }).limit(limit);
  if (status !== 'all') {
    const dbStatus = STATUS_MAP[status];
    if (!dbStatus) return res.status(400).json({ error: 'Bad status filter.' });
    q = q.eq('status', dbStatus);
  }
  if (req.query.before) q = q.lt('created_at', req.query.before);

  const { data, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ orders: data || [] });
}
