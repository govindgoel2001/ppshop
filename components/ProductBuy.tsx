'use client';

import { useState } from 'react';
import type { Product } from '@/lib/products';
import { fmt } from '@/lib/products';
import { useCartStore } from '@/lib/cart';

export function ProductBuy({ p }: { p: Product }) {
  const { add, getQty, adjust } = useCartStore();
  const [vi, setVi] = useState(p.variants.findIndex(v => !v.oos));
  const v = p.variants[vi] ?? p.variants[0];
  const oos = p.oos || !v || v.oos;
  const qty = getQty(p.id, vi);

  return (
    <div>
      {p.variants.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
          {p.variants.map((x, i) => (
            <button
              key={x.sp}
              onClick={() => setVi(i)}
              disabled={!!x.oos}
              className="b b2"
              style={{ padding: '10px 18px', fontSize: 10, background: i === vi ? '#1A1712' : undefined, color: i === vi ? '#fff' : undefined, opacity: x.oos ? 0.4 : 1, cursor: x.oos ? 'not-allowed' : 'pointer' }}
            >
              {x.sp}{x.oos ? ' — OOS' : ''}
            </button>
          ))}
        </div>
      )}
      <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 34, fontWeight: 600, marginBottom: 18 }}>{fmt(v?.pr ?? 0)}</div>
      {oos ? (
        <span style={{ display: 'inline-block', background: '#FBEDE8', color: '#C2543A', fontSize: 10, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', padding: '12px 24px', borderRadius: 999 }}>Out of stock</span>
      ) : (
        <button className="b b1" style={{ padding: '16px 40px', fontSize: 12 }} onClick={() => { qty > 0 ? adjust(p.id, vi, 1) : add(p.id, vi); window.openCart?.(); }}>
          {qty > 0 ? `In cart (${qty}) — add another` : 'Add to Cart'}
        </button>
      )}
    </div>
  );
}
