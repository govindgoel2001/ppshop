'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/lib/cart';
import { AUTH_ENABLED } from '@/components/AuthProvider';
import { AuthButtons } from '@/components/AuthButtons';

export function Header() {
  const qty = useCartStore(s => s.totalQty());
  const [mobOpen, setMobOpen] = useState(false);

  useEffect(() => {
    const nav = document.getElementById('mobNav');
    const btn = document.getElementById('hamBtn');
    if (nav) nav.className = 'mob-nav' + (mobOpen ? ' open' : '');
    if (btn) btn.className = 'ham' + (mobOpen ? ' open' : '');
  }, [mobOpen]);

  return (
    <nav className="bn">
      <div className="w">
        <a href="/" className="nl">
          <span><em>Athena</em>BioLabs</span>
        </a>
        <div className="nk">
          <a href="/">Home</a>
          <div className="nav-dd">
            <a href="/catalogue" className="nav-dd-trigger">Peptides &#9662;</a>
            <div className="nav-dd-menu">
              <a href="/catalogue">All Peptides</a>
              <a href="/catalogue?cat=Weight+Loss">Weight Loss</a>
              <a href="/catalogue?cat=Healing+%26+Recovery">Healing &amp; Recovery</a>
              <a href="/catalogue?cat=Skin+%26+Anti-Aging">Skin &amp; Anti-Aging</a>
              <a href="/catalogue?cat=GH">GH</a>
              <a href="/catalogue?cat=Supplies">Supplies</a>
            </div>
          </div>
          <a href="/guides">Guides</a>
          <a href="/coa">COA</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a
            href="#"
            id="cL"
            className="b b1"
            style={{ padding: '10px 22px', fontSize: 12 }}
            onClick={e => { e.preventDefault(); window.openCart?.(); }}
          >
            Cart{qty > 0 && <span className="cc" style={{ background: '#fff', color: '#B8912F' }}>{qty}</span>}
          </a>
          {AUTH_ENABLED && <AuthButtons />}
        </div>
        <button
          className="ham"
          id="hamBtn"
          onClick={() => setMobOpen(o => !o)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}

declare global {
  interface Window {
    openCart?: () => void;
  }
}
