'use client';

export function MobileNav() {
  function close() {
    document.getElementById('mobNav')?.classList.remove('open');
    document.getElementById('hamBtn')?.classList.remove('open');
  }

  return (
    <div className="mob-nav" id="mobNav">
      <a href="/" onClick={close}>Home</a>
      <a href="/catalogue" onClick={close}>All Peptides</a>
      <div className="mob-sub">
        <a href="/catalogue?cat=Weight+Loss" onClick={close}>Weight Loss</a>
        <a href="/catalogue?cat=Healing+%26+Recovery" onClick={close}>Healing &amp; Recovery</a>
        <a href="/catalogue?cat=Skin+%26+Anti-Aging" onClick={close}>Skin &amp; Anti-Aging</a>
        <a href="/catalogue?cat=GH" onClick={close}>GH</a>
      </div>
      <a href="/coa" onClick={close}>COA</a>
      <a href="/about" onClick={close}>About</a>
      <a href="/contact" onClick={close}>Contact</a>
      <a href="#" onClick={e => { e.preventDefault(); close(); window.openCart?.(); }}>Cart</a>
    </div>
  );
}

declare global {
  interface Window {
    openCart?: () => void;
  }
}
