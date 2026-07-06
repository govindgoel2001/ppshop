import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PRODUCTS, getProduct, getRelatedProducts } from '@/lib/products';
import { ProductBuy } from '@/components/ProductBuy';
import { ProductCard } from '@/components/ProductCard';

export function generateStaticParams() {
  return PRODUCTS.map(p => ({ slug: p.slug }));
}

// Popular shorthand names researchers actually search with.
const NICKNAMES: Record<string, string> = {
  retatrutide: 'Reta',
  tirzepatide: 'Tirz',
  'bpc-157': 'BPC',
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return { title: 'Not found — AthenaBioLabs' };
  const nick = NICKNAMES[p.slug];
  const minPrice = Math.min(...p.variants.map(v => v.pr));
  return {
    title: `${p.name} India — Buy Research-Grade ${nick ? `${p.name} (${nick})` : p.name} Online`,
    description: `${p.name}${nick ? ` (${nick})` : ''} for research in India from ₹${minPrice}. ${p.janoshik ? `Janoshik-verified ${p.janoshik.purity} purity, ` : '99%+ HPLC purity, '}COA included, cold-chain express delivery pan-India. ${p.desc.slice(0, 80)}`,
    keywords: [
      `${p.name} India`, `buy ${p.name} India`, `${p.name} research India`,
      ...(nick ? [`${nick} India`, `where to get ${nick.toLowerCase()} India`, `${nick.toLowerCase()} where to buy India`] : []),
      'research peptides India',
    ],
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: {
      title: `${p.name} India — Research-Grade, COA Included | AthenaBioLabs`,
      description: p.desc.slice(0, 155),
      images: [`/img/${p.image}`],
    },
  };
}

function productJsonLd(p: NonNullable<ReturnType<typeof getProduct>>) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: p.name,
        description: p.desc,
        image: `https://www.athenabiolabs.com/img/${p.image}`,
        brand: { '@type': 'Brand', name: 'AthenaBioLabs' },
        category: p.category,
        url: `https://www.athenabiolabs.com/products/${p.slug}`,
        offers: p.variants.map(v => ({
          '@type': 'Offer',
          name: `${p.name} ${v.ds}`,
          price: v.pr,
          priceCurrency: 'INR',
          availability: v.oos || p.oos ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
          areaServed: { '@type': 'Country', name: 'India' },
          url: `https://www.athenabiolabs.com/products/${p.slug}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.athenabiolabs.com' },
          { '@type': 'ListItem', position: 2, name: 'Peptides', item: 'https://www.athenabiolabs.com/catalogue' },
          { '@type': 'ListItem', position: 3, name: p.name, item: `https://www.athenabiolabs.com/products/${p.slug}` },
        ],
      },
    ],
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const related = getRelatedProducts(p, 3);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(p)) }}
      />
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
