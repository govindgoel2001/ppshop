'use client';

import { useEffect } from 'react';
import type { Product } from '@/lib/products';
import { useCartStore } from '@/lib/cart';
import { PaymentMethods } from '@/components/PaymentMethods';
import { ProductCard } from '@/components/ProductCard';
import { ProofCarousel } from '@/components/ProofCarousel';

/** Flowing champagne-silk ribbons — pure SVG, no image needed. */
function SilkWaves() {
  return (
    <svg className="hero-silk" viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <filter id="silkBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="42" /></filter>
        <linearGradient id="silkGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(227,200,120,.05)" />
          <stop offset=".55" stopColor="rgba(227,200,120,.55)" />
          <stop offset="1" stopColor="rgba(184,145,47,.35)" />
        </linearGradient>
      </defs>
      <g filter="url(#silkBlur)">
        <path d="M-100,540 C300,400 620,660 920,500 C1160,370 1360,480 1560,390 L1560,700 L-100,700 Z" fill="url(#silkGrad)" />
        <path d="M-100,620 C360,500 720,710 1060,580 C1260,500 1420,570 1560,520 L1560,700 L-100,700 Z" fill="rgba(184,145,47,.22)" />
        <path d="M860,-40 C980,180 1290,250 1560,160 L1560,-40 Z" fill="rgba(227,200,120,.4)" />
      </g>
    </svg>
  );
}

/** Faint constellation lines — Athena's owl in the night sky. */
function Constellation() {
  return (
    <svg className="hero-constellation" viewBox="0 0 1200 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g stroke="rgba(184,145,47,.16)" strokeWidth="1">
        <line x1="120" y1="90" x2="310" y2="150" /><line x1="310" y1="150" x2="470" y2="80" />
        <line x1="470" y1="80" x2="640" y2="170" /><line x1="640" y1="170" x2="850" y2="110" />
        <line x1="850" y1="110" x2="1060" y2="200" /><line x1="310" y1="150" x2="380" y2="330" />
        <line x1="640" y1="170" x2="590" y2="380" /><line x1="850" y1="110" x2="930" y2="320" />
        <line x1="380" y1="330" x2="590" y2="380" /><line x1="930" y1="320" x2="1120" y2="430" />
        <line x1="160" y1="420" x2="380" y2="330" /><line x1="590" y1="380" x2="700" y2="540" />
      </g>
      <g fill="rgba(184,145,47,.4)">
        {[[120,90],[310,150],[470,80],[640,170],[850,110],[1060,200],[380,330],[590,380],[930,320],[1120,430],[160,420],[700,540]].map(([x,y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" />
        ))}
      </g>
    </svg>
  );
}

function GoldSeal({ dark = false, children }: { dark?: boolean; children: React.ReactNode }) {
  return (
    <span className={`seal${dark ? ' on-dark' : ''}`}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.3 7.2 16.9l.9-5.4-3.9-3.8 5.4-.8L12 2z" fill="currentColor" />
      </svg>
      {children}
    </span>
  );
}

const CATEGORY_TILES = [
  { name: 'Weight Loss', img: 'stock/focus-weight-loss.jpg', desc: 'GLP-1, GIP and triple-agonist compounds for metabolic research.', href: '/catalogue?cat=Weight+Loss' },
  { name: 'Healing & Recovery', img: 'stock/focus-healing.jpg', desc: 'Tissue-repair peptides and pre-blended recovery stacks.', href: '/catalogue?cat=Healing+%26+Recovery' },
  { name: 'Skin & Anti-Aging', img: 'stock/focus-skin.jpg', desc: 'Copper peptides for collagen and skin-regeneration studies.', href: '/catalogue?cat=Skin+%26+Anti-Aging' },
  { name: 'GH & Supplies', img: 'stock/focus-gh.jpg', desc: 'GH secretagogue blends plus bacteriostatic water.', href: '/catalogue?cat=GH' },
];

export function HomeClient({ products, featured, proofs = [] }: { products: Product[]; featured: Product[]; proofs?: string[] }) {
  useEffect(() => {
    if (!window.IntersectionObserver) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <main>
      {/* ── Hero ── */}
      <section className="hero-band">
        <SilkWaves />
        <Constellation />
        <div className="w">
          <div className="hr-grid hr">
            <div>
              <div className="hr-rating">
                <span className="stars" aria-hidden="true">★★★★★</span>
                <span>Trusted by researchers across India</span>
              </div>
              <h1>Every vial <em>verified</em>.<br />Every batch on record<span className="dt">.</span></h1>
              <p>Third-party tested peptides with batch-level Janoshik COAs, ≥99% HPLC purity, and cold-chain express delivery. Research-grade — with the paperwork to prove it.</p>
              <div className="hb">
                <a href="/catalogue" className="b b1">Browse Peptides</a>
                <a href="/coa" className="b b2" style={{ background: '#fff' }}>See Lab Reports</a>
              </div>
              <div className="hr-chips">
                <span className="hr-chip">UPI</span>
                <span className="hr-chip">Bank Transfer</span>
                <span className="hr-chip">Crypto</span>
                <span className="hr-chip">WhatsApp Checkout</span>
              </div>
            </div>
            <div className="hr-imgs">
              <div className="hr-stack">
                <span className="hr-float"><span className="dot" />Janoshik verified</span>
                <img src="/img/tirzepatide.png" alt="Athena Bio Labs Tirzepatide vial" className="v1" />
                <img src="/img/retatrutide.png" alt="Athena Bio Labs Retatrutide vial" className="v2" />
                <span className="hr-float f2">&ge;99% HPLC purity</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-stats">
          <div className="w">
            <div className="hero-stats-grid">
              <div className="hero-stat"><b>{products.length}</b><span>Compounds</span></div>
              <div className="hero-stat"><b>&ge;99%</b><span>Avg Purity</span></div>
              <div className="hero-stat"><b>3PL</b><span>Lab Verified</span></div>
              <div className="hero-stat"><b>24h</b><span>Dispatch</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── As featured in ── */}
      <section className="press">
        <div className="w">
          <p className="press-label">As featured in</p>
          <div className="press-logos">
            <span className="press-mark"><b>EIN</b>&thinsp;Presswire</span>
            <span className="press-mark press-caps">International Business Times</span>
            <span className="press-mark press-net"><b>NBC</b><i /><b>ABC</b><i /><b>FOX</b></span>
            <span className="press-mark press-ital">World Pharmaceutical Review</span>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="cat-showcase">
        <div className="w">
          <span className="lb reveal">Shop by focus</span>
          <h2 className="reveal reveal-d1">Built around your research</h2>
          <div className="cat-grid">
            {CATEGORY_TILES.map((c, i) => (
              <a key={c.name} href={c.href} className={`cat-card reveal reveal-d${Math.min(i, 3)}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div style={{ height: 150, borderRadius: 14, overflow: 'hidden', marginBottom: 20, background: '#fff' }}>
                  <img src={`/img/${c.img}`} alt={c.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3>{c.name}</h3>
                <p>{c.desc}</p>
                <span className="cat-card-link">Explore &rarr;</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured products ── */}
      <section style={{ padding: '24px 0 72px' }}>
        <div className="w">
          <div className="ph reveal">
            <div>
              <span className="lb">Most Ordered</span>
              <h2 style={{ fontSize: 'clamp(26px,4vw,38px)', marginTop: 4 }}>Research essentials</h2>
            </div>
            <a href="/catalogue" className="b b2" style={{ padding: '12px 28px', fontSize: 12, alignSelf: 'flex-end' }}>View All &rarr;</a>
          </div>
          <div className="feat-grid">
            {featured.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* ── Inside a batch ── */}
      <section style={{ background: 'var(--lav-50)', padding: '80px 0' }}>
        <div className="w">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 64, alignItems: 'center' }} className="batch-grid">
            <div>
              <GoldSeal>Janoshik verified</GoldSeal>
              <h2 style={{ fontSize: 'clamp(30px,4vw,48px)', lineHeight: 1.06, letterSpacing: '-.03em', margin: '18px 0 20px' }}>
                What <span style={{ color: 'var(--purple)' }}>99%+ purity</span><br />actually looks like.
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--muted)', margin: '0 0 28px' }}>
                Every vial we ship traces to a single manufacturing lot, with six documented tests in its Certificate of Analysis — and a QR link to verify it yourself.
              </p>
              <a href="/coa" className="b b3">Browse all COAs &rarr;</a>
            </div>
            <div style={{ background: '#fff', border: '1px solid var(--lav-200)', borderRadius: 20, padding: '36px 40px', boxShadow: 'var(--shadow-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 20, borderBottom: '1px solid var(--lav-200)', marginBottom: 22 }}>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700 }}>Retatrutide · 10mg</div>
                  <div style={{ fontFamily: 'ui-monospace,monospace', fontSize: 10, color: 'var(--faint)', marginTop: 4, letterSpacing: '.08em' }}>Task № 157018 · Tested 29 Oct 2025</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>Verified</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'flex-end' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>Third-party lab</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 32px', marginBottom: 24 }}>
                {[
                  { lbl: 'HPLC Purity', val: '99.79%', note: 'Chromatogram ≥99%', green: true },
                  { lbl: 'Mass Spec.', val: '4400.9', note: 'Expected 4400.6 Da' },
                  { lbl: 'Endotoxin', val: '<0.1 EU/mg', note: 'Below threshold', green: true },
                  { lbl: 'Residual Solvent', val: 'ND', note: 'Not detected' },
                  { lbl: 'Appearance', val: 'White', note: '' },
                  { lbl: 'Moisture', val: '1.8%', note: '' },
                ].map(r => (
                  <div key={r.lbl} style={{ paddingBottom: 12, borderBottom: '1px solid var(--lav-100)' }}>
                    <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: 4 }}>{r.lbl}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                      <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 19, fontWeight: 700, color: r.green ? 'var(--green)' : 'var(--ink)' }}>{r.val}</span>
                      {r.note && <span style={{ fontSize: 10, color: 'var(--faint)' }}>{r.note}</span>}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: 'var(--violet-950)', borderRadius: 14, padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(229,205,122,.85)' }}>HPLC Chromatogram · UV 220nm</span>
                  <span style={{ fontSize: 8, fontFamily: 'ui-monospace,monospace', color: 'rgba(255,255,255,.45)', letterSpacing: '.14em' }}>99.79% AREA</span>
                </div>
                <svg width="100%" viewBox="0 0 460 70" style={{ display: 'block' }}>
                  <line x1="0" y1="69" x2="460" y2="69" stroke="rgba(255,255,255,.12)" strokeWidth="1" />
                  <path d="M0,65 L70,65 L80,62 L90,65 L130,65 L140,58 L150,65 L220,65 L225,8 L230,65 L300,65 L310,60 L320,65 L390,65 L395,62 L400,65 L460,65" stroke="#B8912F" strokeWidth="1.5" fill="none" />
                </svg>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8, fontFamily: 'ui-monospace,monospace', color: 'rgba(255,255,255,.35)', marginTop: 4, letterSpacing: '.1em' }}>
                  <span>0.0</span><span>5.0</span><span>10.0</span><span>15.0</span><span>20.0</span><span>25.0 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <style>{`@media(max-width:900px){.batch-grid{grid-template-columns:1fr!important}}`}</style>

      {/* ── How it works ── */}
      <section style={{ padding: '72px 0' }}>
        <div className="w">
          <div style={{ textAlign: 'center' }}>
            <span className="lb reveal">The Process</span>
            <h2 className="reveal reveal-d1" style={{ fontSize: 'clamp(28px,4vw,42px)', marginBottom: 10 }}>From order to bench</h2>
            <p className="reveal reveal-d2" style={{ fontSize: 14, color: 'var(--muted)', maxWidth: 460, margin: '0 auto' }}>Three steps. Verified quality at every one.</p>
          </div>
          <div className="steps-grid">
            {[
              { n: 'Step 1', t: 'Browse & select', d: 'Filter by category or compound. Full scientific data, COA links, and multiple strengths for every peptide in the catalogue.', img: '/img/stock/step-browse.jpg' },
              { n: 'Step 2', t: 'Order on WhatsApp', d: 'One tap sends your itemised order to us on WhatsApp. Pay by UPI, bank transfer, or crypto — confirmed within minutes.', img: '/img/stock/step-whatsapp.jpg', delay: 'reveal-d1' },
              { n: 'Step 3', t: 'Cold-chain delivered', d: 'Insulated packaging with ice gel and real-time tracking. Express courier, typically 2–4 days pan-India.', img: '/img/stock/step-delivery.jpg', delay: 'reveal-d2' },
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

      {/* ── Accepted payments ── */}
      <PaymentMethods />

      {/* ── Dark banner ── */}
      <section className="atm-banner reveal">
        <div className="atm-banner-bg" style={{ backgroundImage: "url('/img/brand/quality-lab.png')" }} />
        <div className="w" style={{ position: 'relative', zIndex: 1 }}>
          <div className="atm-inner">
            <GoldSeal dark>Our Standard</GoldSeal>
            <h2 style={{ fontSize: 'clamp(28px,4vw,52px)', color: '#fff', letterSpacing: '-.03em', lineHeight: 1.08, margin: '18px 0' }}>Purity you can measure.<br /><span style={{ color: 'var(--gold-soft)' }}>Proof you can verify.</span></h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', lineHeight: 1.85, maxWidth: 440, marginBottom: 28 }}>Every peptide ships with a Certificate of Analysis from an independent laboratory, linked by QR to the original test record. No exceptions.</p>
            <a href="/about" className="b" style={{ background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,.35)' }}>Our Quality Process &rarr;</a>
          </div>
        </div>
      </section>

      {/* ── Consultation ── */}
      <section style={{ padding: '72px 0 48px' }}>
        <div className="w" style={{ maxWidth: 700, textAlign: 'center' }}>
          <span className="lb">Expert Guidance</span>
          <h2 style={{ fontSize: 32, marginBottom: 12 }}>Book a research consultation</h2>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24 }}>Not sure which peptides fit your research protocol? Our team offers 1-on-1 consultations to help you design your study.</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}><strong style={{ color: 'var(--ink)', fontSize: 20, display: 'block', fontFamily: "'Space Grotesk',sans-serif" }}>15/30 min</strong>Session length</div>
            <div style={{ width: 1, height: 32, background: 'var(--lav-200)' }} />
            <div style={{ fontSize: 11, color: 'var(--muted)' }}><strong style={{ color: 'var(--ink)', fontSize: 20, display: 'block', fontFamily: "'Space Grotesk',sans-serif" }}>₹1000</strong>Per session</div>
            <div style={{ width: 1, height: 32, background: 'var(--lav-200)' }} />
            <div style={{ fontSize: 11, color: 'var(--muted)' }}><strong style={{ color: 'var(--ink)', fontSize: 20, display: 'block', fontFamily: "'Space Grotesk',sans-serif" }}>1-on-1</strong>With our team</div>
          </div>
          <a href="https://topmate.io/athenabiolabs/" target="_blank" rel="noopener" className="b b1">Book Your Consultation</a>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="testimonials">
        <div className="w">
          <span className="lb reveal">What Researchers Say</span>
          <h2 className="reveal reveal-d1">Trusted across India &amp; beyond</h2>
          <div className="test-grid" style={{ marginTop: 40 }}>
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

      {/* ── Delivery proof ── */}
      <ProofCarousel photos={proofs} />

      {/* ── Offers ── */}
      <section style={{ padding: '64px 0' }}>
        <div className="w">
          <div className="offers">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--gold-soft)', marginBottom: 4 }}>Exclusive Offers</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.6)' }}>Auto-applied at checkout</p>
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
