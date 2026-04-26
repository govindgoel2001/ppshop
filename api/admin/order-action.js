// api/admin/order-action.js
// POST { orderId, action: 'approve'|'reject'|'ship'|'note', payload?: {...} }
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '../_lib/session.js';
import {
  sendCustomerApproved, sendCustomerRejected, sendCustomerShipped,
} from '../_lib/mailer.js';

const TRANSITIONS = {
  approve: { from: 'pending_verification', to: 'paid'      },
  reject:  { from: 'pending_verification', to: 'rejected'  },
  ship:    { from: 'paid',                 to: 'shipped'   },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  let session;
  try { session = await requireAdmin(req); }
  catch { return res.status(401).json({ error: 'Unauthenticated.' }); }

  const { orderId, action, payload } = req.body || {};
  const id = Number.parseInt(orderId, 10);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'Bad orderId.' });

  const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const { data: order } = await supa.from('orders').select('*').eq('id', id).maybeSingle();
  if (!order) return res.status(404).json({ error: 'Order not found.' });

  if (action === 'note') {
    const notes = String((payload && payload.notes) || '').slice(0, 4000);
    await supa.from('orders').update({ admin_notes: notes }).eq('id', id);
    await supa.from('order_audit').insert({
      order_id: id, actor: session.email, action: 'note', detail: notes.slice(0, 200),
    });
    return res.status(200).json({ ok: true });
  }

  const t = TRANSITIONS[action];
  if (!t) return res.status(400).json({ error: 'Unknown action.' });

  // Idempotence: if already in target state, return ok without re-emailing
  if (order.status === t.to) return res.status(200).json({ ok: true, already: true });
  if (order.status !== t.from) {
    return res.status(409).json({ error: `Cannot ${action} from status ${order.status}.` });
  }

  const update = { status: t.to };
  let detail = '';
  if (action === 'reject') {
    update.rejection_reason = String((payload && payload.reason) || '').slice(0, 1000);
    detail = update.rejection_reason;
  }
  if (action === 'ship') {
    update.dispatch_tracking = String((payload && payload.tracking) || '').slice(0, 200);
    detail = update.dispatch_tracking;
    if (!update.dispatch_tracking) return res.status(400).json({ error: 'Tracking number required.' });
  }

  const { error } = await supa.from('orders').update(update).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });

  await supa.from('order_audit').insert({
    order_id: id, actor: session.email, action, detail,
  });

  const updatedOrder = { ...order, ...update };
  if (action === 'approve') sendCustomerApproved({ to: order.email, order: updatedOrder }).catch(e => console.error(e));
  if (action === 'reject')  sendCustomerRejected({ to: order.email, order: updatedOrder, reason: update.rejection_reason }).catch(e => console.error(e));
  if (action === 'ship')    sendCustomerShipped({ to: order.email, order: updatedOrder, tracking: update.dispatch_tracking }).catch(e => console.error(e));

  return res.status(200).json({ ok: true, status: t.to });
}
