'use client';

import { useEffect, useRef, useState } from 'react';

const promos = [
  { code: 'FIRST5', txt: '5% off your first order' },
  { code: 'BULK10', txt: '10% off orders above Rs 20,000' },
];

export function PromoBanner() {
  const [idx, setIdx] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx(i => (i + 1) % promos.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const p = promos[idx];

  return (
    <div className="pb" id="promoBanner">
      <div className="pb-inner" ref={ref} key={idx}>
        <span>Use code</span> <b>{p.code}</b> <span>&mdash; {p.txt}</span>
      </div>
    </div>
  );
}
