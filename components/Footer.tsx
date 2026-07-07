export function Footer() {
  return (
    <footer className="ft">
      <div className="w">
        <div className="ftg">
          <div className="ftb">
            <div className="fl2">
              <span><em>Athena</em>BioLabs</span>
            </div>
            <p>Research peptides verified by independent lab analysis. Batch-level COAs, 99%+ HPLC purity, cold-chain delivery across India.</p>
          </div>
          <div className="ftc">
            <h4>Navigate</h4>
            <a href="/">Home</a>
            <a href="/catalogue">Peptides</a>
            <a href="/buy-peptides-india">Peptides in India</a>
            <a href="/guides">Research Guides</a>
            <a href="/coa">COA</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </div>
          <div className="ftc">
            <h4>Reach Us</h4>
            <a href="mailto:support@athenabiolabs.com">support@athenabiolabs.com</a>
            <p>Mon - Sat, 9-7 IST</p>
          </div>
          <div className="ftl">
            <h4 style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 16 }}>Legal Notice</h4>
            <p>All products are sold strictly for in-vitro research purposes. Not intended for human or animal consumption.</p>
          </div>
        </div>
        <div className="fbt">
          <span>2026 AthenaBioLabs. All rights reserved.</span>
          <span>For research use only</span>
        </div>
      </div>
    </footer>
  );
}
