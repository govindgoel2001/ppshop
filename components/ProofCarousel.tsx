'use client';

import { ProtectedImg } from '@/components/ProtectedImg';

/** Continuously gliding marquee of customer delivery photos. */
export function ProofCarousel({ photos }: { photos: string[] }) {
  if (photos.length === 0) return null;

  // Two identical halves let the track loop seamlessly at -50%.
  const half = (key: string) => (
    <div className="proof-half" key={key} aria-hidden={key === 'b'}>
      {photos.map(f => (
        <figure className="proof-card" key={f}>
          <ProtectedImg src={`/img/proof/${f}`} alt="Delivery photo shared by an AthenaBioLabs customer" />
        </figure>
      ))}
    </div>
  );

  return (
    <section className="proof">
      <div className="w" style={{ textAlign: 'center' }}>
        <span className="lb reveal">Delivery Proof</span>
        <h2 className="reveal reveal-d1">Real packages. Real researchers.</h2>
        <p className="proof-sub reveal reveal-d2">
          Photos sent by customers on WhatsApp, the day their order arrived.
        </p>
      </div>
      <div className="proof-marquee">
        <div className="proof-track" style={{ animationDuration: `${photos.length * 9}s` }}>
          {half('a')}
          {half('b')}
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <a href="/proof" className="b b2">See All Delivery Photos &rarr;</a>
      </div>
    </section>
  );
}
