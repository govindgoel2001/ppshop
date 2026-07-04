'use client';

import { useEffect } from 'react';
import type { Product } from '@/lib/products';
import { fmt } from '@/lib/products';
import { useCartStore } from '@/lib/cart';
import { PaymentMethods } from '@/components/PaymentMethods';

export function HomeClient({ products, featured }: { products: Product[]; featured: Product[] }) {
  const { add, getQty, adjust } = useCartStore();

  useEffect(() => {
    // scroll reveal
    if (!window.IntersectionObserver) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="hr">
        <div className="w">
          <div className="hr-grid">
            <div className="hr-text">
              <span className="lb">Pharmaceutical-Grade Research Peptides</span>
              <h1>The science of<br /><em>precision</em><span className="dt">.</span></h1>
              <p>HPLC-verified peptides with 99%+ purity. Each batch third-party tested. Full COA included. Temperature-controlled shipping.</p>
              <div className="hr-proof">
                <div className="hr-proof-dots"><span /><span /><span /></div>
                <p>99%+ HPLC purity &mdash; COA included with every batch</p>
              </div>
              <div className="hb">
                <a href="/catalogue" className="b b1">Browse All Peptides</a>
                <a href="https://topmate.io/athenabiolabs/" target="_blank" rel="noopener" className="b b3">Book Your Consultation</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase', color: '#b5b0a6' }}>Accepted:</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: '#6b6560', background: '#F0EDE7', padding: '5px 14px', letterSpacing: '.04em' }}>UPI</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: '#6b6560', background: '#F0EDE7', padding: '5px 14px', letterSpacing: '.04em' }}>Bank Transfer</span>
                <span style={{ fontSize: 11, fontWeight: 500, color: '#6b6560', background: '#F0EDE7', padding: '5px 14px', letterSpacing: '.04em' }}>Crypto</span>
              </div>
            </div>
            <div className="hr-imgs">
              <img src="/img/retatrutide.png" alt="Retatrutide research peptide" className="hr-hero-img" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="sp-bar">
        <div className="w">
          <div className="sp-bar-grid reveal">
            <div className="sp-bar-item"><div className="sp-bar-num">99%+</div><div className="sp-bar-lbl">HPLC Purity Guaranteed</div></div>
            <div className="sp-bar-item"><div className="sp-bar-num">24h</div><div className="sp-bar-lbl">Dispatch Turnaround</div></div>
            <div className="sp-bar-item"><div className="sp-bar-num">COA</div><div className="sp-bar-lbl">With Every Order</div></div>
            <div className="sp-bar-item"><div className="sp-bar-num">Free</div><div className="sp-bar-lbl">eBook Included</div></div>
          </div>
        </div>
      </section>

      {/* Accepted payments */}
      <PaymentMethods />

      {/* Inside a batch */}
      <section style={{ background: '#EDE8E2', padding: '80px 0' }}>
        <div className="w">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 64, alignItems: 'center' }} className="batch-grid">
            <div>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.28em', textTransform: 'uppercase', color: '#C8A97E' }}>Inside a batch</span>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(32px,4vw,56px)', fontWeight: 300, lineHeight: 1.05, letterSpacing: '-.025em', margin: '14px 0 20px' }}>
                What <em style={{ fontWeight: 500 }}>99%+ purity</em><br />actually looks like.
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: '#6b6560', margin: '0 0 28px', fontWeight: 300 }}>
                Every vial we ship is traced to a single manufacturing lot, with six documented tests in its Certificate of Analysis.
              </p>
              <a href="mailto:support@athenabiolabs.com?subject=COA%20Request" style={{ display: 'inline-block', textDecoration: 'none', background: 'transparent', color: '#1a1a1a', padding: '14px 32px', fontSize: 11, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', border: '1px solid #1a1a1a', fontFamily: "'DM Sans',sans-serif" }}>Request a sample COA →</a>
            </div>
            <div style={{ background: '#FAFAF7', padding: '36px 40px', boxShadow: '0 30px 80px rgba(0,0,0,.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 20, borderBottom: '1px solid rgba(0,0,0,.08)', marginBottom: 22 }}>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600 }}>Retatrutide · 10mg</div>
                  <div style={{ fontFamily: 'ui-monospace,monospace', fontSize: 10, color: '#8a8580', marginTop: 4, letterSpacing: '.08em' }}>Lot № 2403-RTT-09 · Manufactured 22 Mar 2026</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: '#C8A97E', marginBottom: 4 }}>Verified</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7a9a6d', display: 'inline-block' }} />
                    <span style={{ fontSize: 10, color: '#6b6560' }}>Third-party lab</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 32px', marginBottom: 24 }}>
                {[
                  { lbl: 'HPLC Purity', val: '99.4%', note: 'Chromatogram ≥99%', green: true },
                  { lbl: 'Mass Spec.', val: '4401.2', note: 'Expected 4400.6 Da' },
                  { lbl: 'Endotoxin', val: '<0.1 EU/mg', note: 'Below threshold', green: true },
                  { lbl: 'Residual Solvent', val: 'ND', note: 'Not detected' },
                  { lbl: 'Appearance', val: 'White', note: '' },
                  { lbl: 'Moisture', val: '1.8%', note: '' },
                ].map(r => (
                  <div key={r.lbl} style={{ paddingBottom: 12, borderBottom: '1px solid rgba(0,0,0,.05)' }}>
                    <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: '#b5b0a6', marginBottom: 4 }}>{r.lbl}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                      <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 600, color: r.green ? '#7a9a6d' : '#1a1a1a' }}>{r.val}</span>
                      {r.note && <span style={{ fontSize: 10, color: '#8a8580' }}>{r.note}</span>}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#1a1a1a', padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 8, fontWeight: 600, letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(200,169,126,.75)' }}>HPLC Chromatogram · UV 220nm</span>
                  <span style={{ fontSize: 8, fontFamily: 'ui-monospace,monospace', color: 'rgba(250,250,247,.4)', letterSpacing: '.14em' }}>99.42% AREA</span>
                </div>
                <svg width="100%" viewBox="0 0 460 70" style={{ display: 'block' }}>
                  <line x1="0" y1="69" x2="460" y2="69" stroke="rgba(250,250,247,.1)" strokeWidth="1" />
                  <path d="M0,65 L70,65 L80,62 L90,65 L130,65 L140,58 L150,65 L220,65 L225,8 L230,65 L300,65 L310,60 L320,65 L390,65 L395,62 L400,65 L460,65" stroke="#C8A97E" strokeWidth="1.5" fill="none" />
                </svg>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, fontFamily: 'ui-monospace,monospace', color: 'rgba(250,250,247,.35)', marginTop: 4, letterSpacing: '.1em' }}>
                  <span>0.0</span><span>5.0</span><span>10.0</span><span>15.0</span><span>20.0</span><span>25.0 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <style>{`@media(max-width:900px){.batch-grid{grid-template-columns:1fr!important}}`}</style>

      {/* How It Works */}
      <section className="sec-warm" style={{ padding: '60px 0' }}>
        <div className="w">
          <div style={{ textAlign: 'center' }}>
            <span className="lb reveal">The Process</span>
            <h2 className="reveal reveal-d1" style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 300, letterSpacing: '-.025em', marginBottom: 10 }}>From research to delivery</h2>
            <p className="reveal reveal-d2" style={{ fontSize: 14, color: '#6b6560', maxWidth: 460, margin: '0 auto', fontWeight: 300 }}>Three steps. Uncompromising quality at every one.</p>
          </div>
          <div className="steps-grid">
            {[
              { n: '01', t: 'Browse & Select', d: 'Filter by category or search by compound. Full scientific data, COA details, and multiple strengths available for every peptide in our catalogue.', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=70' },
              { n: '02', t: 'Order on WhatsApp', d: 'One tap sends your itemised order to us on WhatsApp. Pay by UPI, bank transfer, or crypto — confirmed within minutes.', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=70', delay: 'reveal-d1' },
              { n: '03', t: 'Cold-Chain Delivered', d: 'Shipped in temperature-controlled packaging with real-time tracking. Complimentary express delivery on every order, India-wide.', img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=70', delay: 'reveal-d2' },
            ].map(s => (
              <div key={s.n} className={`step-card reveal ${s.delay || ''}`}>
                <div className="step-img-wrap"><img src={s.img} alt={s.t} loading="lazy" /></div>
                <div className="step-num">{s.n}</div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dark banner */}
      <section className="atm-banner reveal">
        <div className="atm-banner-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1400&q=70')" }} />
        <div className="w">
          <div className="atm-inner">
            <span className="lb" style={{ color: 'rgba(200,169,126,.75)' }}>Our Standard</span>
            <h2 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 300, color: '#FAFAF7', letterSpacing: '-.03em', lineHeight: 1.1, marginBottom: 18 }}>Purity you can measure.<br /><em>Science you can trust.</em></h2>
            <p style={{ fontSize: 14, color: 'rgba(250,250,247,.5)', lineHeight: 1.85, maxWidth: 440, fontWeight: 300, marginBottom: 28 }}>Every peptide we ship comes with a full Certificate of Analysis from an independent third-party laboratory. No exceptions. No compromises.</p>
            <a href="/about" className="b" style={{ background: 'transparent', color: '#FAFAF7', border: '1px solid rgba(250,250,247,.3)', fontSize: 10, padding: '14px 36px' }}>Our Quality Process &rarr;</a>
          </div>
        </div>
      </section>

      {/* Consultation */}
      <section style={{ padding: '48px 0' }}>
        <div className="w" style={{ maxWidth: 700, textAlign: 'center' }}>
          <span className="lb">Expert Guidance</span>
          <h2 style={{ fontSize: 32, letterSpacing: '-.02em', marginBottom: 12 }}>Book a Research Consultation</h2>
          <p style={{ fontSize: 14, color: '#6b6560', lineHeight: 1.7, marginBottom: 24 }}>Not sure which peptides fit your research protocol? Our team offers 1-on-1 consultations to help you design your study.</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: '#8a8580' }}><strong style={{ color: '#1a1a1a', fontSize: 20, display: 'block', fontFamily: 'Cormorant Garamond,serif' }}>15/30 min</strong>Session length</div>
            <div style={{ width: 1, height: 32, background: '#e8e4de' }} />
            <div style={{ fontSize: 11, color: '#8a8580' }}><strong style={{ color: '#1a1a1a', fontSize: 20, display: 'block', fontFamily: 'Cormorant Garamond,serif' }}>₹1000</strong>Per session</div>
            <div style={{ width: 1, height: 32, background: '#e8e4de' }} />
            <div style={{ fontSize: 11, color: '#8a8580' }}><strong style={{ color: '#1a1a1a', fontSize: 20, display: 'block', fontFamily: 'Cormorant Garamond,serif' }}>1-on-1</strong>With our team</div>
          </div>
          <a href="https://topmate.io/athenabiolabs/" target="_blank" rel="noopener" className="b b3">Book Your Consultation</a>
        </div>
      </section>

      {/* Featured products */}
      <section style={{ padding: '60px 0' }}>
        <div className="w">
          <div className="ph reveal">
            <div><span className="lb">Most Ordered</span><h2 style={{ fontSize: 'clamp(26px,4vw,38px)', fontWeight: 300, letterSpacing: '-.025em', marginTop: 4 }}>Research Essentials</h2></div>
            <a href="/catalogue" className="b b2" style={{ padding: '12px 28px', fontSize: 10, alignSelf: 'flex-end' }}>View All &rarr;</a>
          </div>
          <div className="feat-grid">
            {featured.map(p => {
              const v = p.variants[0];
              const qty = getQty(p.id, 0);
              return (
                <a key={p.id} href={`/products/${p.slug}`} className="pc" style={{ padding: 0, cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ overflow: 'hidden', height: 220 }}>
                    <img src={`/img/${p.image}`} alt={p.name} style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div style={{ padding: '20px 24px' }}>
                    <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#b5b0a6', marginBottom: 4 }}>{p.category}</div>
                    <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8, letterSpacing: '-.01em' }}>{p.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className="pp" style={{ fontSize: 18 }}>{fmt(v.pr)}</span>
                      <button
                        className="b b1"
                        style={{ padding: '8px 18px', fontSize: 9 }}
                        onClick={e => { e.preventDefault(); e.stopPropagation(); qty > 0 ? adjust(p.id, 0, 1) : add(p.id, 0); window.openCart?.(); }}
                      >
                        {qty > 0 ? `In cart (${qty})` : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="w">
          <span className="lb reveal">What Researchers Say</span>
          <h2 className="reveal reveal-d1">Trusted across India &amp; beyond</h2>
          <div className="test-grid">
            {[
              { body: '"Exceptional purity — the COA matched spec perfectly. Tirzepatide reconstituted cleanly, no particulate. Dispatch was same-day. This is now my go-to supplier."', name: 'Dr. R. Sharma', loc: 'Research Director, Mumbai', delay: '' },
              { body: '"BPC-157 and TB-500 arrived beautifully packaged, clearly labelled, and with all relevant data. The free research guide was genuinely useful — not filler content."', name: 'A. Mehta', loc: 'Sports Science Researcher, Bangalore', delay: 'reveal-d1' },
              { body: '"Ordered GHK-Cu for a collagen synthesis study. The mass spec data was thorough and the team answered my protocol questions within the hour."', name: 'P. Kaur', loc: 'Dermatology Researcher, Delhi', delay: 'reveal-d2' },
            ].map(t => (
              <div key={t.name} className={`test-card reveal ${t.delay}`}>
                <div className="test-stars">★★★★★</div>
                <p>{t.body}</p>
                <div className="test-author"><strong>{t.name}</strong><span>{t.loc}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers bar */}
      <section className="offers-section">
        <div className="w">
          <div className="offers">
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase', color: '#C8A97E', marginBottom: 4 }}>Exclusive Offers</p>
              <p style={{ fontSize: 13, color: 'rgba(250,250,247,.5)' }}>Auto-applied at checkout</p>
            </div>
            <div className="offers-codes">
              <div className="offers-code"><b>FIRST5</b><span>5% off first order</span></div>
              <div className="offers-code"><b>BULK10</b><span>10% off orders 20k+</span></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

declare global {
  interface Window { openCart?: () => void; }
}
