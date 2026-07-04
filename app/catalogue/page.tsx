import type { Metadata } from 'next';
import { PRODUCTS } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';

export const metadata: Metadata = {
  title: 'All Peptides — AthenaBioLabs',
  description: 'Browse HPLC-verified research peptides. Third-party tested, COA included.',
};

const CATEGORIES = [...new Set(PRODUCTS.map(p => p.category))];

export default async function Catalogue({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  const list = cat ? PRODUCTS.filter(p => p.category === cat) : PRODUCTS;

  return (
    <main>
      <section style={{ padding: '64px 0 72px' }}>
        <div className="w">
          <span className="lb">Catalogue</span>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(32px,5vw,52px)', fontWeight: 300, letterSpacing: '-.025em', margin: '10px 0 24px' }}>
            {cat || 'All Peptides'}
          </h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 36 }}>
            <a href="/catalogue" className="b b2" style={{ padding: '9px 18px', fontSize: 10, background: !cat ? '#1a1a1a' : undefined, color: !cat ? '#FAFAF7' : undefined }}>All</a>
            {CATEGORIES.map(c => (
              <a key={c} href={`/catalogue?cat=${encodeURIComponent(c)}`} className="b b2" style={{ padding: '9px 18px', fontSize: 10, background: cat === c ? '#1a1a1a' : undefined, color: cat === c ? '#FAFAF7' : undefined }}>{c}</a>
            ))}
          </div>

          <div className="feat-grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))' }}>
            {list.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
          {list.length === 0 && <p style={{ color: '#8a8580' }}>No products in this category.</p>}
        </div>
      </section>
    </main>
  );
}
