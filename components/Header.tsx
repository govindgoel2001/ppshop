'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from '@/lib/cart';
import { AUTH_ENABLED } from '@/components/AuthProvider';
import { AuthButtons } from '@/components/AuthButtons';

/** Minimal geometric owl — the Athena mark. */
export function OwlMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#1E1A12" />
      <circle cx="11.5" cy="13.5" r="4.6" stroke="#E3C878" strokeWidth="1.6" />
      <circle cx="20.5" cy="13.5" r="4.6" stroke="#E3C878" strokeWidth="1.6" />
      <circle cx="11.5" cy="13.5" r="1.5" fill="#E3C878" />
      <circle cx="20.5" cy="13.5" r="1.5" fill="#E3C878" />
      <path d="M14.6 20.5 L16 23.5 L17.4 20.5" stroke="#B8912F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
          <OwlMark />
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
