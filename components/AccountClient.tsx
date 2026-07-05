'use client';

import { useEffect, useState } from 'react';
import { fmt } from '@/lib/products';
import { waLink } from '@/lib/site';

type Order = {
  id: number;
  ref: string | null;
  items: string | null;
  total: number | null;
  coupon: string | null;
  status: string | null;
  eta: string | null;
  dispatch_tracking: string | null;
  created_at: string;
};

const STEPS = ['Chat initiated', 'Purchased', 'Shipped', 'Delivered'];

// Maps DB status → 0-based step index. Legacy statuses from the old
// UPI flow land on sensible steps too.
function stepOf(status: string | null): number {
  switch ((status ?? '').toLowerCase()) {
    case 'purchased':
    case 'confirmed':
    case 'paid':
    case 'verified':
      return 1;
    case 'shipped':
    case 'booked':
    case 'dispatched':
      return 2;
    case 'delivered':
      return 3;
    default:
      return 0; // initiated / pending_verification / unknown
  }
}

function niceDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function AccountClient({ name }: { name: string }) {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => {
        setOrders(d.orders ?? []);
        if (d.skipped) setNote('Order history is being set up — new orders will appear here shortly.');
      })
      .catch(() => {
        setOrders([]);
        setNote('Could not load your orders right now. Please refresh in a moment.');
      });
  }, []);

  return (
    <main className="acct">
      <div className="w">
        <div className="acct-hero">
          <div className="eyebrow">Your account</div>
          <h1>Welcome back, <em>{name}</em></h1>
          <p className="acct-sub">
            Track every order here — from the moment you start a WhatsApp chat to the day it lands at your door.
          </p>
        </div>

        {note && <div className="acct-note">{note}</div>}

        {orders === null ? (
          <div className="acct-empty">Loading your orders…</div>
        ) : orders.length === 0 && !note ? (
          <div className="acct-empty">
            <p>No orders yet.</p>
            <a href="/catalogue" className="b b1" style={{ marginTop: 16 }}>Browse the collection</a>
          </div>
        ) : (
          orders.map(o => {
            const step = stepOf(o.status);
            const cancelled = (o.status ?? '').toLowerCase() === 'cancelled';
            return (
              <div className="acct-order" key={o.id}>
                <div className="acct-order-head">
                  <div>
                    <span className="acct-ref">{o.ref ?? `#${o.id}`}</span>
                    <span className="acct-date">{niceDate(o.created_at)}</span>
                  </div>
                  <div className="acct-total">{o.total != null ? fmt(o.total) : ''}</div>
                </div>

                {o.items && <div className="acct-items">{o.items}</div>}
                {o.coupon && <div className="acct-coupon">Coupon applied: {o.coupon}</div>}

                {cancelled ? (
                  <div className="acct-cancel">Cancelled</div>
                ) : (
                  <div className="acct-steps">
                    {STEPS.map((label, i) => (
                      <div key={label} className={'acct-step' + (i <= step ? ' done' : '') + (i === step ? ' now' : '')}>
                        <span className="dot" />
                        <span className="lbl">{label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {!cancelled && o.eta && step < 3 && (
                  <div className="acct-eta">Expected by <strong>{o.eta}</strong></div>
                )}

                {!cancelled && o.dispatch_tracking && (
                  <a
                    className="acct-track"
                    href={`https://www.delhivery.com/track-v2/package/${encodeURIComponent(o.dispatch_tracking)}`}
                    target="_blank"
                    rel="noopener"
                  >
                    Track with Delhivery — AWB {o.dispatch_tracking}
                  </a>
                )}

                {!cancelled && step === 0 && (
                  <a
                    className="acct-wa"
                    href={waLink(`Hi AthenaBioLabs, following up on my order ${o.ref ?? '#' + o.id}.`)}
                    target="_blank"
                    rel="noopener"
                  >
                    Continue on WhatsApp
                  </a>
                )}
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
