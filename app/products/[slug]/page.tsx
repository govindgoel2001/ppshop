import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS, getProduct, getRelatedProducts } from '@/lib/products';
import { ProductBuy } from '@/components/ProductBuy';
import { ProductCard } from '@/components/ProductCard';

export function generateStaticParams() {
  return PRODUCTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return { title: 'Not found — AthenaBioLabs' };
  return { title: `${p.name} — AthenaBioLabs`, description: p.desc.slice(0, 155) };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const related = getRelatedProducts(p, 3);

  return (
    <main>
      <section style={{ padding: '48px 0 64px' }}>
        <div className="w">
          <a href="/catalogue" style={{ fontSize: 11, color: '#6F6753', textDecoration: 'none' }}>← Back to catalogue</a>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, marginTop: 24, alignItems: 'start' }} className="pdp-grid">
            <div style={{ background: '#F4F0E5', borderRadius: 20, overflow: 'hidden' }}>
              <img src={`/img/${p.image}`} alt={p.name} style={{ width: '100%', display: 'block' }} />
            </div>
            <div>
              <span className="lb">{p.category}</span>
              <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(30px,4vw,46px)', fontWeight: 700, letterSpacing: '-.02em', margin: '8px 0 6px' }}>{p.name}</h1>
              <p style={{ fontSize: 14, fontStyle: 'italic', color: '#B8912F', marginBottom: 20 }}>{p.tagline}</p>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: '#332D22', marginBottom: 24, fontWeight: 300 }}>{p.desc}</p>

              <ProductBuy p={p} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px', marginTop: 32, borderTop: '1px solid #E8E1CE', paddingTop: 24 }}>
                {[['Research dose', p.dose], ['Molecular weight', p.mw], ['Sequence', p.seq], ['Category', p.cat]].map(([l, val]) => (
                  <div key={l}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#A79C82', marginBottom: 3 }}>{l}</div>
                    <div style={{ fontSize: 12.5, color: '#332D22' }}>{val}</div>
                  </div>
                ))}
              </div>

              {p.janoshik && (
                <div style={{ marginTop: 24, padding: '16px 20px', background: '#fff', border: '1px solid #E8E1CE' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#22A06B', marginBottom: 6 }}>Third-party verified · Janoshik</div>
                  <div style={{ fontSize: 13, color: '#332D22', marginBottom: 8 }}>Purity <strong>{p.janoshik.purity}</strong> · {p.janoshik.quantity}</div>
                  <a href={p.janoshik.verifyUrl} target="_blank" rel="noopener" style={{ fontSize: 12, color: '#B8912F', textDecoration: 'none' }}>View Certificate of Analysis ↗</a>
                </div>
              )}
            </div>
          </div>

          {p.faqs.length > 0 && (
            <div style={{ maxWidth: 760, marginTop: 64 }}>
              <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 20 }}>Common questions</h2>
              {p.faqs.map(f => (
                <details key={f.q} style={{ borderBottom: '1px solid #E8E1CE', padding: '14px 0' }}>
                  <summary style={{ fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{f.q}</summary>
                  <p style={{ fontSize: 13, lineHeight: 1.7, color: '#6F6753', marginTop: 8 }}>{f.a}</p>
                </details>
              ))}
            </div>
          )}

          {p.citations.length > 0 && (
            <div style={{ maxWidth: 760, marginTop: 48 }}>
              <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 20 }}>Selected literature</h2>
              {p.citations.map(c => (
                <a key={c.url} href={c.url} target="_blank" rel="noopener" style={{ display: 'block', padding: '12px 0', borderBottom: '1px solid #E8E1CE', textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{c.title}</div>
                  <div style={{ fontSize: 11.5, color: '#6F6753', marginTop: 2 }}>{c.year} · {c.journal}</div>
                </a>
              ))}
            </div>
          )}

          <div style={{ marginTop: 72 }}>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 20 }}>You may also research</h2>
            <div className="feat-grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))' }}>
              {related.map(r => <ProductCard key={r.id} p={r} />)}
            </div>
          </div>
        </div>
      </section>
      <style>{`@media(max-width:820px){.pdp-grid{grid-template-columns:1fr!important;gap:28px!important}}`}</style>
    </main>
  );
}
