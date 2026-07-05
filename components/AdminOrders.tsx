'use client';

import { useEffect, useState } from 'react';
import { fmt } from '@/lib/products';

type Order = {
  id: number;
  ref: string | null;
  email: string | null;
  items: string | null;
  total: number | null;
  coupon: string | null;
  status: string | null;
  eta: string | null;
  dispatch_tracking: string | null;
  admin_notes: string | null;
  created_at: string;
};

const STATUSES = ['initiated', 'purchased', 'shipped', 'delivered', 'cancelled'];

function niceDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) +
    ' ' + new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function Row({ order, onSaved }: { order: Order; onSaved: (o: Order) => void }) {
  const [status, setStatus] = useState(order.status ?? 'initiated');
  const [eta, setEta] = useState(order.eta ?? '');
  const [awb, setAwb] = useState(order.dispatch_tracking ?? '');
  const [notes, setNotes] = useState(order.admin_notes ?? '');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const dirty =
    status !== (order.status ?? 'initiated') ||
    eta !== (order.eta ?? '') ||
    awb !== (order.dispatch_tracking ?? '') ||
    notes !== (order.admin_notes ?? '');

  async function save() {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: order.id,
          status,
          eta: eta || null,
          dispatch_tracking: awb || null,
          admin_notes: notes || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'save failed');
      onSaved(data.order);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'save failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={'adm-row st-' + status}>
      <div className="adm-row-top">
        <div>
          <span className="adm-ref">{order.ref ?? `#${order.id}`}</span>
          <span className="adm-date">{niceDate(order.created_at)}</span>
          {order.email && <span className="adm-email">{order.email}</span>}
        </div>
        <span className="adm-total">{order.total != null ? fmt(order.total) : ''}</span>
      </div>
      {order.items && <div className="adm-items">{order.items}{order.coupon ? ` · coupon ${order.coupon}` : ''}</div>}

      <div className="adm-controls">
        <select value={status} onChange={e => setStatus(e.target.value)}>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input
          placeholder="ETA shown to customer, e.g. 12 July"
          value={eta}
          onChange={e => setEta(e.target.value)}
        />
        <input
          placeholder="Delhivery AWB"
          value={awb}
          onChange={e => setAwb(e.target.value)}
        />
        <input
          placeholder="Private notes"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
        <button className="b b1" disabled={!dirty || busy} onClick={save}>
          {busy ? 'Saving…' : dirty ? 'Save' : 'Saved'}
        </button>
      </div>
      {err && <div className="adm-err">{err}</div>}
    </div>
  );
}

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(r => r.json())
      .then(d => {
        setOrders(d.orders ?? []);
        if (d.skipped) setNote('Supabase is not configured in this environment — set SUPABASE_SERVICE_KEY.');
        if (d.error) setNote(d.error);
      })
      .catch(() => setNote('Could not load orders.'));
  }, []);

  const shown = (orders ?? []).filter(o => filter === 'all' || (o.status ?? 'initiated') === filter);

  return (
    <main className="adm">
      <div className="w">
        <div className="acct-hero">
          <div className="eyebrow" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: '#B8912F', marginBottom: 12 }}>Admin</div>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, letterSpacing: '-.02em' }}>Orders</h1>
        </div>

        <div className="adm-filters">
          {['all', ...STATUSES].map(s => (
            <button
              key={s}
              className={'adm-chip' + (filter === s ? ' on' : '')}
              onClick={() => setFilter(s)}
            >
              {s}{s !== 'all' && orders ? ` (${orders.filter(o => (o.status ?? 'initiated') === s).length})` : ''}
            </button>
          ))}
        </div>

        {note && <div className="acct-note">{note}</div>}

        {orders === null ? (
          <div className="acct-empty">Loading…</div>
        ) : shown.length === 0 ? (
          <div className="acct-empty">No orders{filter !== 'all' ? ` with status "${filter}"` : ''}.</div>
        ) : (
          shown.map(o => (
            <Row
              key={o.id}
              order={o}
              onSaved={u => setOrders(prev => (prev ?? []).map(p => (p.id === u.id ? u : p)))}
            />
          ))
        )}
      </div>
    </main>
  );
}
