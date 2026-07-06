'use client';

import { useRef } from 'react';
import { ProtectedImg } from '@/components/ProtectedImg';

/** Horizontal scroll-snap carousel of customer delivery photos. */
export function ProofCarousel({ photos }: { photos: string[] }) {
  const track = useRef<HTMLDivElement>(null);

  if (photos.length === 0) return null;

  function scroll(dir: number) {
    track.current?.scrollBy({ left: dir * 292, behavior: 'smooth' });
  }

  return (
    <section className="proof">
      <div className="w" style={{ textAlign: 'center' }}>
        <span className="lb reveal">Delivery Proof</span>
        <h2 className="reveal reveal-d1">Real packages. Real researchers.</h2>
        <p className="proof-sub reveal reveal-d2">
          Photos sent by customers on WhatsApp, the day their order arrived.
        </p>
      </div>
      <div className="proof-wrap">
        <button className="proof-arrow" aria-label="Previous photos" onClick={() => scroll(-1)}>&larr;</button>
        <div className="proof-track" ref={track}>
          {photos.map(f => (
            <figure className="proof-card" key={f}>
              <ProtectedImg src={`/img/proof/${f}`} alt="Delivery photo shared by an AthenaBioLabs customer" />
            </figure>
          ))}
        </div>
        <button className="proof-arrow" aria-label="Next photos" onClick={() => scroll(1)}>&rarr;</button>
      </div>
      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <a href="/proof" className="b b2">See All Delivery Photos &rarr;</a>
      </div>
    </section>
  );
}
