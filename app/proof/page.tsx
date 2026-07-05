import type { Metadata } from 'next';
import { proofPhotos } from '@/lib/proof';
import { waLink } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Delivery Photos — AthenaBioLabs',
  description: 'Real delivery photos sent by AthenaBioLabs customers on WhatsApp — packages, vials and lab reports, the day their order arrived.',
};

export default function ProofPage() {
  const photos = proofPhotos();
  return (
    <main className="proof-page">
      <div className="w">
        <div style={{ textAlign: 'center', padding: '56px 0 40px' }}>
          <span className="lb">Delivery Proof</span>
          <h1 style={{ fontSize: 'clamp(30px,5vw,46px)', letterSpacing: '-.03em', marginBottom: 14 }}>
            Real packages. Real researchers.
          </h1>
          <p style={{ fontSize: 14, color: 'var(--muted)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            Every photo below was sent to us by a customer on WhatsApp, the day their order arrived.
          </p>
        </div>

        {photos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0 80px' }}>
            <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>
              Photos are on their way — check back soon.
            </p>
            <a href="/catalogue" className="b b1">Browse the Collection</a>
          </div>
        ) : (
          <>
            <div className="proof-grid">
              {photos.map(f => (
                <figure className="proof-grid-card" key={f}>
                  <img src={`/img/proof/${f}`} alt="Delivery photo shared by an AthenaBioLabs customer" loading="lazy" />
                </figure>
              ))}
            </div>
            <div style={{ textAlign: 'center', padding: '40px 0 72px' }}>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
                Received your order? We&rsquo;d love to add your photo here.
              </p>
              <a
                href={waLink('Hi AthenaBioLabs, my order arrived — here is a delivery photo!')}
                target="_blank"
                rel="noopener"
                className="b b2"
              >
                Share Yours on WhatsApp
              </a>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
