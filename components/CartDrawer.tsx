'use client';

import { useEffect, useState } from 'react';
import { useCartStore, type CartItem } from '@/lib/cart';
import { fmt } from '@/lib/products';
import { waLink, CONSENT_TEXT } from '@/lib/site';
import { AUTH_ENABLED } from '@/components/AuthProvider';
import { ClerkOrderGate } from '@/components/ClerkOrderGate';

function buildOrderMessage(cart: CartItem[], total: number, who?: string, ref?: string): string {
  const lines = cart.map(
    it => `• ${it.n} — ${it.sp} × ${it.q} = ${fmt(it.pr * it.q)}`
  );
  return [
    'Hi AthenaBioLabs, I would like to place an order:',
    '',
    ...lines,
    '',
    `Total: ${fmt(total)}`,
    ref ? `Order ref: ${ref}` : '',
    ref ? `Track & pay: ${window.location.origin}/pay/${ref}` : '',
    who ? `Account: ${who}` : '',
    '',
    'Preferred payment: (UPI / Bank transfer / Crypto)',
    '',
    'I confirm I am 18+ and that this order is for research use only, not for human or animal consumption. I accept AthenaBioLabs holds no liability for misuse.',
  ]
    .filter(Boolean)
    .join('\n');
}

export function CartDrawer() {
  const { cart, adjust, remove, totalPrice, clear } = useCartStore();
  const [open, setOpen] = useState(false);
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    window.openCart = () => setOpen(true);
    return () => { window.openCart = undefined; };
  }, []);

  useEffect(() => {
    const ov = document.getElementById('ov');
    const dr = document.getElementById('dr');
    if (ov) {
      ov.className = 'ov' + (open ? ' op' : '');
      ov.onclick = open ? () => setOpen(false) : null;
    }
    if (dr) dr.className = 'dr' + (open ? ' op' : '');
    const closeBtn = document.getElementById('cartClose');
    if (closeBtn) closeBtn.onclick = () => setOpen(false);
    if (open && cart.length > 0) {
      try { window.posthog?.capture('CheckoutStarted', { items: cart.length, value: totalPrice(), currency: 'INR' }); } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const total = totalPrice();

  async function order(who?: string) {
    if (!consent) return;
    // Pre-open the tab synchronously so popup blockers don't eat it while
    // we record the order server-side.
    const tab = window.open('about:blank', '_blank');
    // Record the order first (guests included) so it gets a ref and a
    // payment link. If that fails, the WhatsApp order still goes through.
    let ref: string | undefined;
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart.map(it => ({ id: it.id, vi: it.vi, q: it.q })) }),
      });
      const data = await res.json();
      if (res.ok && data.ref) ref = data.ref;
    } catch {}
    const msg = buildOrderMessage(cart, total, who, ref);
    try { window.posthog?.capture('WhatsAppOrder', { value: total, currency: 'INR', items: cart.length, ref }); } catch {}
    const url = waLink(msg);
    if (tab) tab.location.href = url;
    else window.open(url, '_blank', 'noopener');
    clear();
    setConsent(false);
    setOpen(false);
  }

  return (
    <div className="db" style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontStyle: 'italic', color: '#A79C82', marginBottom: 24 }}>Your cart is empty</p>
          <a href="/" className="b b2">Browse Collection</a>
        </div>
      ) : (
        <>
          {cart.map(it => (
            <div className="ci" key={`${it.id}-${it.vi}`}>
              <div className="ct">{it.n.replace(/[-\s+()]/g, '').substring(0, 3).toUpperCase()}</div>
              <div className="cd2">
                <h4>{it.n}</h4>
                <div className="cm">{it.ds} · {it.sp} · 99%+ HPLC</div>
                <div style={{ marginTop: 10, display: 'flex', alignItems: 'center' }}>
                  <div className="cq">
                    <button onClick={() => adjust(it.id, it.vi, -1)}>−</button>
                    <span>{it.q}</span>
                    <button onClick={() => adjust(it.id, it.vi, 1)}>+</button>
                  </div>
                  <button className="cr" onClick={() => remove(it.id, it.vi)}>Remove</button>
                </div>
              </div>
              <div className="cp">{fmt(it.pr * it.q)}</div>
            </div>
          ))}

          <div style={{ borderTop: '1px solid rgba(0,0,0,.06)', marginTop: 16, paddingTop: 20 }}>
            <div className="sr"><span>Subtotal</span><span>{fmt(total)}</span></div>
            <div className="sr"><span>Shipping</span><span style={{ color: '#22A06B' }}>Complimentary</span></div>
            <div className="gs" style={{ margin: '12px 0' }} />
            <div className="st"><span>Total</span><span>{fmt(total)}</span></div>

            <div style={{ marginTop: 8, fontSize: 11, color: '#6F6753', lineHeight: 1.6 }}>
              Pay by <strong>UPI, bank transfer, or crypto</strong> — arranged directly on WhatsApp after you place your order.
            </div>

            <label className="consent-row">
              <input
                type="checkbox"
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
              />
              <span>{CONSENT_TEXT}</span>
            </label>

            {AUTH_ENABLED ? (
              <ClerkOrderGate consent={consent} onOrder={order} />
            ) : (
              <button
                className="b b1"
                style={{ width: '100%', marginTop: 14, padding: '18px 40px', fontSize: 13, opacity: consent ? 1 : 0.5, cursor: consent ? 'pointer' : 'not-allowed' }}
                disabled={!consent}
                onClick={() => order()}
              >
                Order on WhatsApp
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

declare global {
  interface Window {
    openCart?: () => void;
    posthog?: { capture: (event: string, props?: Record<string, unknown>) => void };
  }
}
