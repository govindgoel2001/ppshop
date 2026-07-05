'use client';

import { useEffect, useState } from 'react';

const KEY = 'abl_age_ok';

export function AgeGate() {
  const [ready, setReady] = useState(false);
  const [ok, setOk] = useState(true);

  useEffect(() => {
    try {
      setOk(localStorage.getItem(KEY) === '1');
    } catch {
      setOk(false);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    // Prevent scrolling behind the gate.
    document.body.style.overflow = ready && !ok ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [ready, ok]);

  if (!ready || ok) return null;

  function accept() {
    try { localStorage.setItem(KEY, '1'); } catch {}
    setOk(true);
  }

  return (
    <div className="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-gate-title">
      <div className="age-gate-card">
        <span className="lb" style={{ color: '#7C3BFF' }}>AthenaBioLabs</span>
        <h1 id="age-gate-title">
          We&apos;re <em>Leveling Up</em>
        </h1>
        <p className="age-gate-lead">
          Better products. Better experience. Before you enter, please confirm the following.
        </p>

        <div className="age-gate-terms">
          <p><strong>This site is strictly for adults aged 18 or over.</strong></p>
          <p>
            Everything sold here is intended <strong>solely for laboratory and research
            purposes</strong>. Nothing on this site is for human or animal consumption, and no
            statement here is medical advice.
          </p>
          <p>
            By entering you accept that <strong>AthenaBioLabs holds no liability</strong> for any
            misuse of, or harm arising from, these products.
          </p>
        </div>

        <button className="b b1 age-gate-btn" onClick={accept}>
          I am 18+ and agree — Enter
        </button>
        <a
          href="https://www.google.com"
          className="age-gate-exit"
          rel="noopener"
        >
          I do not agree — Leave
        </a>
      </div>
    </div>
  );
}
