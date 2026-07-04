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
    <a href={`/products/${p.slug}`} className="pc" style={{ padding: 0, cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
      <div style={{ overflow: 'hidden', height: 220, position: 'relative' }}>
        <img src={`/img/${p.image}`} alt={p.name} loading="lazy" style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block', filter: oos ? 'grayscale(.7)' : 'none' }} />
        {oos && <span style={{ position: 'absolute', top: 12, left: 12, background: '#1a1a1a', color: '#FAFAF7', fontSize: 9, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', padding: '5px 10px' }}>Out of stock</span>}
      </div>
      <div style={{ padding: '20px 24px' }}>
        <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#b5b0a6', marginBottom: 4 }}>{p.category}</div>
        <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8, letterSpacing: '-.01em' }}>{p.name}</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="pp" style={{ fontSize: 18 }}>{fmt(v.pr)}</span>
          {oos ? (
            <span style={{ fontSize: 10, color: '#b06a4a', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase' }}>Unavailable</span>
          ) : (
            <button
              className="b b1"
              style={{ padding: '8px 18px', fontSize: 9 }}
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
