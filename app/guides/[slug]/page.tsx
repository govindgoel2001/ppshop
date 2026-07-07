import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GUIDES, getGuide } from '@/lib/guides';
import { getProduct } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';

const BASE = 'https://www.athenabiolabs.com';

export function generateStaticParams() {
  return GUIDES.map(g => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return { title: 'Guide not found — AthenaBioLabs' };
  return {
    title: g.metaTitle,
    description: g.description,
    alternates: { canonical: `/guides/${g.slug}` },
    openGraph: {
      type: 'article',
      title: g.metaTitle,
      description: g.description,
      url: `${BASE}/guides/${g.slug}`,
    },
  };
}

function guideJsonLd(g: NonNullable<ReturnType<typeof getGuide>>) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: g.title,
        description: g.description,
        datePublished: g.updated,
        dateModified: g.updated,
        author: { '@type': 'Organization', name: 'AthenaBioLabs', url: BASE },
        publisher: { '@id': `${BASE}/#org` },
        mainEntityOfPage: `${BASE}/guides/${g.slug}`,
        inLanguage: 'en-IN',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: `${BASE}/guides` },
          { '@type': 'ListItem', position: 3, name: g.title, item: `${BASE}/guides/${g.slug}` },
        ],
      },
      ...(g.faqs.length > 0
        ? [{
            '@type': 'FAQPage',
            mainEntity: g.faqs.map(f => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }]
        : []),
    ],
  };
}

const h2Style: React.CSSProperties = {
  fontFamily: "'Space Grotesk',sans-serif",
  fontSize: 'clamp(22px,3vw,30px)',
  fontWeight: 700,
  letterSpacing: '-.02em',
  margin: '44px 0 16px',
};
const pStyle: React.CSSProperties = { fontSize: 14.5, lineHeight: 1.85, color: '#332D22', marginBottom: 14 };

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  const related = g.relatedProducts.map(getProduct).filter(Boolean);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideJsonLd(g)) }} />
      <section style={{ padding: '56px 0 72px' }}>
        <div className="w" style={{ maxWidth: 780 }}>
          <a href="/guides" style={{ fontSize: 11, color: '#6F6753', textDecoration: 'none' }}>← All guides</a>
          <span className="lb" style={{ display: 'block', marginTop: 18 }}>Research Guide</span>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(28px,5vw,44px)', fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1.12, margin: '10px 0 14px' }}>
            {g.title}
          </h1>
          <p style={{ ...pStyle, fontSize: 16.5, color: '#6F6753', fontStyle: 'italic' }}>{g.dek}</p>
          <p style={{ fontSize: 12, color: '#A79C82', margin: '4px 0 8px' }}>
            Updated {new Date(g.updated).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · {g.readMins} min read
          </p>

          {/* Key facts — the answer-shaped block AI engines quote. */}
          <div style={{ margin: '28px 0 8px', padding: '22px 26px', background: '#F4F0E5', borderRadius: 14, borderLeft: '3px solid #B8912F' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: '#B8912F', marginBottom: 12 }}>Key facts</div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {g.keyFacts.map(f => (
                <li key={f} style={{ fontSize: 13.5, lineHeight: 1.7, color: '#332D22', marginBottom: 8 }}>{f}</li>
              ))}
            </ul>
          </div>

          {g.sections.map(s => (
            <div key={s.h}>
              <h2 style={h2Style}>{s.h}</h2>
              {s.body.map((para, i) => <p key={i} style={pStyle}>{para}</p>)}
            </div>
          ))}

          {g.faqs.length > 0 && (
            <div style={{ marginTop: 48 }}>
              <h2 style={h2Style}>Frequently asked questions</h2>
              {g.faqs.map(f => (
                <details key={f.q} style={{ borderBottom: '1px solid #E8E1CE', padding: '14px 0' }}>
                  <summary style={{ fontSize: 14.5, fontWeight: 600, cursor: 'pointer' }}>{f.q}</summary>
                  <p style={{ fontSize: 13.5, lineHeight: 1.75, color: '#6F6753', marginTop: 8 }}>{f.a}</p>
                </details>
              ))}
            </div>
          )}

          {g.citations.length > 0 && (
            <div style={{ marginTop: 44 }}>
              <h2 style={{ ...h2Style, fontSize: 22 }}>References</h2>
              {g.citations.map(c => (
                <a key={c.url} href={c.url} target="_blank" rel="noopener nofollow" style={{ display: 'block', padding: '12px 0', borderBottom: '1px solid #E8E1CE', textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{c.title}</div>
                  <div style={{ fontSize: 11.5, color: '#6F6753', marginTop: 2 }}>{c.year} · {c.journal}</div>
                </a>
              ))}
            </div>
          )}

          <div style={{ marginTop: 40, padding: '18px 22px', background: '#F4F0E5', borderRadius: 12, fontSize: 12.5, lineHeight: 1.7, color: '#6F6753' }}>
            This guide summarises published research literature for educational context only. It is not
            medical advice. All AthenaBioLabs products are sold strictly for in-vitro laboratory research
            and are not for human or animal use.
          </div>
        </div>

        {related.length > 0 && (
          <div className="w" style={{ marginTop: 56 }}>
            <h2 style={{ ...h2Style, margin: '0 0 20px' }}>Related research peptides</h2>
            <div className="feat-grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))' }}>
              {related.map(p => p && <ProductCard key={p.id} p={p} />)}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
