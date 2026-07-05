// Accepted payment methods shown on the landing page.
// Logos are inline SVG so they load without any external request
// (the site CSP blocks third-party images).

function Badge({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="pay-badge" title={title} aria-label={title}>
      {children}
    </div>
  );
}

export function PaymentMethods() {
  return (
    <section className="pay-section">
      <div className="w">
        <div className="pay-head">
          <span className="lb">Payments Accepted</span>
          <h2>UPI · Bank Transfer · Crypto</h2>
          <p>Pay however suits you — confirm your order in one tap on WhatsApp.</p>
        </div>
        <div className="pay-grid">
          {/* BHIM / UPI */}
          <Badge title="BHIM UPI">
            <svg viewBox="0 0 120 40" width="88" height="30" role="img" aria-hidden="true">
              <text x="0" y="27" fontFamily="Inter, sans-serif" fontSize="20" fontWeight="700" fill="#00539F">BHIM</text>
              <text x="62" y="27" fontFamily="Inter, sans-serif" fontSize="20" fontWeight="700" fill="#E8622C">UPI</text>
            </svg>
          </Badge>

          {/* Google Pay */}
          <Badge title="Google Pay">
            <svg viewBox="0 0 120 40" width="96" height="30" role="img" aria-hidden="true">
              <text x="0" y="27" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="500">
                <tspan fill="#4285F4">G</tspan><tspan fill="#EA4335">o</tspan><tspan fill="#FBBC05">o</tspan><tspan fill="#4285F4">g</tspan><tspan fill="#34A853">l</tspan><tspan fill="#EA4335">e</tspan>
              </text>
              <text x="70" y="27" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="500" fill="#5F6368">Pay</text>
            </svg>
          </Badge>

          {/* Visa */}
          <Badge title="Visa">
            <svg viewBox="0 0 120 40" width="70" height="26" role="img" aria-hidden="true">
              <text x="0" y="30" fontFamily="Georgia, serif" fontSize="28" fontStyle="italic" fontWeight="700" fill="#1A1F71">VISA</text>
            </svg>
          </Badge>

          {/* Mastercard */}
          <Badge title="Mastercard">
            <svg viewBox="0 0 60 40" width="56" height="36" role="img" aria-hidden="true">
              <circle cx="23" cy="20" r="13" fill="#EB001B" />
              <circle cx="37" cy="20" r="13" fill="#F79E1B" fillOpacity="0.9" />
              <path d="M30 10 a13 13 0 0 1 0 20 a13 13 0 0 1 0 -20" fill="#FF5F00" />
            </svg>
          </Badge>

          {/* Bank Transfer */}
          <Badge title="Bank Transfer (NEFT / IMPS)">
            <svg viewBox="0 0 60 40" width="40" height="30" role="img" aria-hidden="true">
              <path d="M30 4 L54 16 H6 Z" fill="#3A5A78" />
              <rect x="10" y="18" width="5" height="14" fill="#3A5A78" />
              <rect x="21" y="18" width="5" height="14" fill="#3A5A78" />
              <rect x="34" y="18" width="5" height="14" fill="#3A5A78" />
              <rect x="45" y="18" width="5" height="14" fill="#3A5A78" />
              <rect x="6" y="34" width="48" height="4" fill="#3A5A78" />
            </svg>
          </Badge>

          {/* Crypto */}
          <Badge title="Crypto (BTC / ETH / USDT)">
            <svg viewBox="0 0 40 40" width="34" height="34" role="img" aria-hidden="true">
              <circle cx="20" cy="20" r="18" fill="#F7931A" />
              <text x="20" y="28" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="700" fill="#fff">₿</text>
            </svg>
          </Badge>
        </div>
      </div>
    </section>
  );
}
