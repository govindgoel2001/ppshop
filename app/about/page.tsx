import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — AthenaBioLabs',
  description: 'Uncompromising standards in research compounds. HPLC verified, third-party tested, 99%+ purity.',
};

export default function About() {
  return (
    <main>
      <section style={{ padding: '80px 0 64px' }}>
        <div className="w" style={{ maxWidth: 760 }}>
          <span className="lb">About Us</span>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 48, fontWeight: 700, lineHeight: 1.15, letterSpacing: '-.02em', marginBottom: 48 }}>
            Uncompromising standards<br />in research <em style={{ fontWeight: 600 }}>peptides</em>.
          </h1>
          <div className="ab"><h3>Our Philosophy</h3><p>AthenaBioLabs exists at the intersection of rigorous science and refined service. We believe that researchers deserve access to peptides of the highest possible purity.</p></div>
          <div className="gs" style={{ marginBottom: 40 }} />
          <div className="ab"><h3>Quality Assurance</h3><p>Every batch undergoes HPLC analysis confirming 99%+ purity, mass spectrometry for molecular identity, and endotoxin screening by ISO 17025-accredited laboratories. Full Certificates of Analysis are published for complete transparency.</p></div>
          <div className="gs" style={{ marginBottom: 40 }} />
          <div className="ab"><h3>Free Research eBook</h3><p>Every order includes our comprehensive Research Guide — a detailed PDF covering compound science, mechanisms of action, reconstitution protocols, storage guidelines, and a full glossary. Over 15 chapters of research-grade content. <a href="mailto:support@athenabiolabs.com?subject=Research%20Guide%20Preview" style={{ color: '#7C3BFF', textDecoration: 'underline' }}>Request a preview.</a></p></div>
          <div className="gs" style={{ marginBottom: 40 }} />
          <div className="ab"><h3>Research Use</h3><p>All products are sold exclusively for in-vitro laboratory research purposes. Not approved for human or animal use.</p></div>
          <div className="sg">
            <div className="sb"><div className="sn">99%+</div><div className="sl">HPLC Purity</div></div>
            <div className="sb"><div className="sn">9</div><div className="sl">Compounds</div></div>
            <div className="sb"><div className="sn">24h</div><div className="sl">Dispatch Time</div></div>
            <div className="sb"><div className="sn">COA</div><div className="sl">Every Batch</div></div>
          </div>
        </div>
      </section>
    </main>
  );
}
