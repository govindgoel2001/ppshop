import type { Metadata } from 'next';
import { PRODUCTS } from '@/lib/products';
import { ProductCard } from '@/components/ProductCard';

export const metadata: Metadata = {
  title: 'Where to Buy Research Peptides in India (2026 Guide)',
  description:
    'Looking for research peptides in India? AthenaBioLabs supplies BPC-157, Retatrutide (Reta), Tirzepatide, TB-500 and more with 99%+ HPLC purity, third-party Janoshik COAs and cold-chain delivery to every Indian city.',
  keywords: [
    'peptides India', 'where to get peptides in India', 'buy peptides India',
    'BPC-157 India', 'reta where to get India', 'Retatrutide India', 'Tirzepatide India',
    'TB-500 India', 'peptide supplier India', 'research peptides Delhi Mumbai Bangalore',
  ],
  alternates: { canonical: '/buy-peptides-india' },
  openGraph: {
    title: 'Where to Buy Research Peptides in India — AthenaBioLabs',
    description:
      'BPC-157, Retatrutide, Tirzepatide and more. 99%+ HPLC purity, third-party COA with every batch, cold-chain delivery pan-India.',
  },
};

const h2Style: React.CSSProperties = {
  fontFamily: "'Space Grotesk',sans-serif",
  fontSize: 'clamp(22px,3vw,30px)',
  fontWeight: 700,
  letterSpacing: '-.02em',
  margin: '48px 0 16px',
};

const pStyle: React.CSSProperties = { fontSize: 14.5, lineHeight: 1.85, color: '#332D22', marginBottom: 14 };

export default function BuyPeptidesIndia() {
  const featured = PRODUCTS.filter(p => !p.oos).slice(0, 6);
  return (
    <main>
      <section style={{ padding: '56px 0 72px' }}>
        <div className="w" style={{ maxWidth: 780 }}>
          <span className="lb">India Buying Guide</span>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(30px,5vw,46px)', fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1.1, marginBottom: 18 }}>
            Where to buy research peptides in India
          </h1>
          <p style={{ ...pStyle, fontSize: 16 }}>
            AthenaBioLabs is an Indian supplier of research-grade peptides — BPC-157, Retatrutide,
            Tirzepatide, TB-500, GHK-Cu and more — with ≥99% HPLC purity, a third-party Janoshik
            Certificate of Analysis on every batch, and cold-chain express delivery to every city
            in India. All compounds are sold strictly for in-vitro laboratory research.
          </p>

          <h2 style={h2Style}>Where can you get peptides in India?</h2>
          <p style={pStyle}>
            Researchers in India have three realistic options: importing from overseas suppliers,
            buying from unverified resellers on social media, or ordering from an India-based
            supplier that publishes third-party lab results. Imports routinely stall at customs and
            arrive after weeks without cold-chain protection. Unverified resellers rarely provide
            any purity documentation at all. AthenaBioLabs ships domestically from within India, so
            orders typically arrive in 2–4 days by express courier, packed in insulated boxes with
            ice gel. Every batch is tested by Janoshik Analytical — an independent laboratory — for
            HPLC purity and mass confirmation, and the certificate is linked by QR code on the vial
            itself, so you can verify exactly what you received. Browse the{' '}
            <a href="/catalogue" style={{ color: '#B8912F' }}>full peptide catalogue</a> or check{' '}
            <a href="/coa" style={{ color: '#B8912F' }}>current lab reports</a>.
          </p>

          <h2 style={h2Style}>Where to get BPC-157 in India?</h2>
          <p style={pStyle}>
            <a href="/products/bpc-157" style={{ color: '#B8912F' }}>BPC-157 is available from AthenaBioLabs</a>{' '}
            as lyophilised 5mg and 10mg vials, shipped anywhere in India with a batch-specific
            Certificate of Analysis. BPC-157 is one of the most studied tissue-repair peptides in
            the research literature, which is why it is also one of the most counterfeited — many
            listings sold in India contain underdosed or degraded material. Before buying BPC-157
            from any source, ask for a recent third-party HPLC purity report and confirm the
            testing lab is independent of the seller. Our current BPC-157 batches test above 99%
            purity at Janoshik Analytical, and every certificate can be verified directly on the
            lab&rsquo;s own website using the task number printed on your COA.
          </p>

          <h2 style={h2Style}>Where to get Retatrutide (Reta) in India?</h2>
          <p style={pStyle}>
            <a href="/products/retatrutide" style={{ color: '#B8912F' }}>Retatrutide — often shortened to
            &ldquo;reta&rdquo; — is available from AthenaBioLabs</a> in 10mg research vials with
            pan-India cold-chain delivery. Retatrutide is a triple agonist (GIP, GLP-1 and glucagon
            receptors) and currently the most requested metabolic research compound in India, which
            has attracted a wave of unverified sellers. Because reta degrades if it is stored or
            shipped warm, buying from a domestic supplier with insulated shipping matters more than
            for almost any other peptide. Our retatrutide ships from within India in temperature-
            controlled packaging, arrives in 2–4 days, and carries a Janoshik-verified purity
            certificate for the exact batch in your box. We also stock{' '}
            <a href="/products/tirzepatide" style={{ color: '#B8912F' }}>Tirzepatide</a> for
            comparative incretin research.
          </p>

          <h2 style={h2Style}>How does delivery work across India?</h2>
          <p style={pStyle}>
            Orders are packed in insulated boxes with ice-gel packs and dispatched within 24 hours
            by express courier. Typical delivery time is 2–4 days to Delhi NCR, Mumbai, Bangalore,
            Hyderabad, Chennai, Pune, Kolkata, Ahmedabad and most other Indian cities, with tracking
            shared on WhatsApp and on your account dashboard. Payment is arranged directly on
            WhatsApp — UPI, bank transfer or crypto — and shipping is complimentary.
          </p>

          <h2 style={h2Style}>How do you verify peptide quality before buying in India?</h2>
          <p style={pStyle}>
            Ask any supplier for three things: a batch-specific HPLC purity report from an
            independent lab, mass-spectrometry confirmation of the molecular weight, and a way to
            verify the certificate on the testing lab&rsquo;s own website. If a seller cannot
            produce all three, the material is unverifiable. Every AthenaBioLabs vial carries a QR
            code linking to its Janoshik certificate, and the same reports are published openly on
            our <a href="/coa" style={{ color: '#B8912F' }}>COA page</a> — no account needed.
          </p>

          <div style={{ marginTop: 40, padding: '20px 24px', background: '#F4F0E5', borderRadius: 14, fontSize: 12.5, lineHeight: 1.7, color: '#6F6753' }}>
            All products sold by AthenaBioLabs are for in-vitro laboratory research only and are
            not for human or animal use. Nothing on this page is medical advice.
          </div>
        </div>

        <div className="w" style={{ marginTop: 64 }}>
          <h2 style={{ ...h2Style, margin: '0 0 20px' }}>Research peptides available in India</h2>
          <div className="feat-grid" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))' }}>
            {featured.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <a href="/catalogue" className="b b1">View Full Catalogue</a>
          </div>
        </div>
      </section>
    </main>
  );
}
