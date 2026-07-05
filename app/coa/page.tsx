import type { Metadata } from 'next';
import { COA_ENTRIES } from '@/lib/coa';
import { waLink } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Certificates of Analysis — AthenaBioLabs',
  description: 'Third-party Janoshik COA links (HPLC purity, mass spec, endotoxin) for every compound in stock.',
};

export default function CoaPage() {
  return (
    <main>
      <section style={{ padding: '72px 0 24px' }}>
        <div className="w" style={{ maxWidth: 860 }}>
          <span className="lb">Verified Third-Party Testing</span>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(32px,5vw,52px)', fontWeight: 700, letterSpacing: '-.025em', margin: '10px 0 16px' }}>
            Certificates of <em>Analysis</em>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#6F6753', maxWidth: 620, fontWeight: 300 }}>
            Every batch is independently tested by Janoshik Analytical. Each link below opens the
            original lab report — HPLC purity, mass-spec identity, and where applicable an LAL
            endotoxin result. All products are sold strictly for research use only.
          </p>
        </div>
      </section>

      <section style={{ padding: '16px 0 72px' }}>
        <div className="w" style={{ maxWidth: 860 }}>
          <div className="coa-list">
            {COA_ENTRIES.map(entry => (
              <div key={entry.code} className="coa-card">
                <div className="coa-card-head">
                  <div>
                    <h3>{entry.name}</h3>
                    <span className="coa-code">{entry.code}</span>
                  </div>
                  <span className={'coa-stock' + (entry.inStock ? ' in' : '')}>
                    {entry.inStock ? 'In stock' : 'Out of stock'}
                  </span>
                </div>

                {entry.tests.length > 0 ? (
                  <div className="coa-links">
                    {entry.tests.map(t => (
                      <a key={t.url} href={t.url} target="_blank" rel="noopener" className="coa-link">
                        <span>{t.label}</span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="coa-note">
                    {entry.note}{' '}
                    <a href={waLink(`Hi, please share the current COA for ${entry.name}.`)} target="_blank" rel="noopener" style={{ color: '#B8912F' }}>
                      Request via WhatsApp
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>

          <p style={{ marginTop: 32, fontSize: 12, color: '#6F6753', lineHeight: 1.7 }}>
            Reports are hosted on janoshik.com / verify.janoshik.com. If a link ever fails to load,
            message us and we&apos;ll send the certificate for your specific lot.
          </p>
        </div>
      </section>
    </main>
  );
}
