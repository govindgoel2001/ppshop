export function Footer() {
  return (
    <footer className="ft">
      <div className="w">
        <div className="ftg">
          <div className="ftb" style={{ textAlign: 'center' }}>
            <div className="fl2">
              <em style={{ fontWeight: 600, fontStyle: 'normal', color: '#C8A97E' }}>Athena</em>BioLabs
            </div>
            <p style={{ maxWidth: 400, margin: '0 auto' }}>Premium research compounds. HPLC verified. Third-party tested. 99%+ purity guaranteed.</p>
          </div>
          <div className="ftc">
            <h4>Navigate</h4>
            <a href="/">Home</a>
            <a href="/catalogue">Peptides</a>
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
            <h4 style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase', color: '#b5b0a6', marginBottom: 16 }}>Legal Notice</h4>
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
