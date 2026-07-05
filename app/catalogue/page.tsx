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
  const tested = PRODUCTS.filter(p => p.janoshik).length;

  return (
    <main>
      {/* Violet header band */}
      <section style={{ background: 'var(--violet-900)', padding: '56px 0 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -120, top: -140, width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle,rgba(227,200,120,.22),transparent 70%)' }} />
        <div className="w" style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 28 }}>
          <div>
            <span className="lb" style={{ color: 'var(--gold-soft)' }}>Catalogue</span>
            <h1 style={{ fontSize: 'clamp(34px,5vw,56px)', fontWeight: 700, letterSpacing: '-.035em', color: '#fff', margin: '4px 0 10px' }}>
              {cat || 'All Peptides'}
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.65)', maxWidth: 460 }}>
              Every compound verified by independent lab analysis. Batch-level COAs available for full transparency.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 32, paddingBottom: 6 }}>
            {[
              { v: String(PRODUCTS.length), l: 'Compounds' },
              { v: '≥99%', l: 'Avg Purity' },
              { v: String(tested), l: 'Live COAs' },
            ].map(s => (
              <div key={s.l}>
                <b style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 32, fontWeight: 700, color: '#fff', display: 'block', lineHeight: 1.1 }}>{s.v}</b>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)' }}>{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '40px 0 72px' }}>
        <div className="w">
          <div className="fl" style={{ marginBottom: 36 }}>
            <a href="/catalogue" className={`fb${!cat ? ' on' : ''}`} style={{ textDecoration: 'none' }}>All</a>
            {CATEGORIES.map(c => (
              <a key={c} href={`/catalogue?cat=${encodeURIComponent(c)}`} className={`fb${cat === c ? ' on' : ''}`} style={{ textDecoration: 'none' }}>{c}</a>
            ))}
          </div>

          <div className="feat-grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))' }}>
            {list.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
          {list.length === 0 && <p style={{ color: 'var(--muted)' }}>No products in this category.</p>}
        </div>
      </section>
    </main>
  );
}
