import type { Metadata } from 'next';
import { GUIDES } from '@/lib/guides';

export const metadata: Metadata = {
  title: 'Research Guides — Peptide Science & Verification',
  description:
    'Research-framed guides on peptides: Retatrutide vs Tirzepatide, BPC-157 vs TB-500, how to read a Certificate of Analysis, and more. For in-vitro research context only.',
  alternates: { canonical: '/guides' },
};

const BASE = 'https://www.athenabiolabs.com';

const listJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: GUIDES.map((g, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: `${BASE}/guides/${g.slug}`,
    name: g.title,
  })),
};

export default function GuidesIndex() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }} />
      <section style={{ padding: '64px 0 72px' }}>
        <div className="w" style={{ maxWidth: 820 }}>
          <span className="lb">Research Guides</span>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(30px,5vw,46px)', fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1.1, margin: '10px 0 16px' }}>
            Peptide research, explained clearly
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: '#332D22', marginBottom: 40, maxWidth: 680 }}>
            Plain-language summaries of the published research literature — compound comparisons,
            mechanisms, and how to verify quality before you buy. Written for researchers, for
            in-vitro research context only.
          </p>

          <div style={{ display: 'grid', gap: 18 }}>
            {GUIDES.map(g => (
              <a
                key={g.slug}
                href={`/guides/${g.slug}`}
                style={{ display: 'block', padding: '26px 28px', background: '#fff', border: '1px solid #E8E1CE', borderRadius: 16, textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: '#B8912F', marginBottom: 8 }}>
                  {g.readMins} min read
                </div>
                <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: '-.01em', marginBottom: 8 }}>{g.title}</h2>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: '#6F6753' }}>{g.dek}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
