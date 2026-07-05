'use client';

import type { Product } from '@/lib/products';
import { fmt } from '@/lib/products';
import { useCartStore } from '@/lib/cart';

export function ProductCard({ p }: { p: Product }) {
  const { add, getQty, adjust } = useCartStore();
  const v = p.variants[0];
  const qty = getQty(p.id, 0);
  const oos = p.oos || p.variants.every(x => x.oos);

  return (
    <a href={`/products/${p.slug}`} className="pc" style={{ padding: 20, cursor: 'pointer', textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
      <div style={{ overflow: 'hidden', height: 210, position: 'relative', borderRadius: 14, background: '#fff' }}>
        <img src={`/img/${p.image}`} alt={p.name} loading="lazy" style={{ width: '100%', height: 210, objectFit: 'cover', display: 'block', filter: oos ? 'grayscale(.7)' : 'none', transition: 'transform .6s cubic-bezier(.23,1,.32,1)' }} />
        {oos && <span style={{ position: 'absolute', top: 12, left: 12, background: '#1A1712', color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', padding: '6px 12px', borderRadius: 999 }}>Out of stock</span>}
        {!oos && p.janoshik && (
          <span style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,.92)', color: '#C9A227', fontSize: 9, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', padding: '6px 12px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.3 7.2 16.9l.9-5.4-3.9-3.8 5.4-.8L12 2z" /></svg>
            COA
          </span>
        )}
      </div>
      <div style={{ padding: '18px 6px 4px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 5 }}>{p.category}</div>
        <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 10, letterSpacing: '-.02em' }}>{p.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', gap: 10, flexWrap: 'wrap' }}>
          <span className="pp" style={{ fontSize: 19 }}>{fmt(v.pr)}</span>
          {oos ? (
            <span style={{ fontSize: 10, color: '#C2543A', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' }}>Unavailable</span>
          ) : (
            <button
              className="b b1"
              style={{ padding: '10px 22px', fontSize: 12 }}
              onClick={e => { e.preventDefault(); e.stopPropagation(); qty > 0 ? adjust(p.id, 0, 1) : add(p.id, 0); window.openCart?.(); }}
            >
              {qty > 0 ? `In cart (${qty})` : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </a>
  );
}
