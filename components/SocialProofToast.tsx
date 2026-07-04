'use client';

import { useEffect } from 'react';
import { PRODUCTS } from '@/lib/products';

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Kochi', 'Indore', 'Goa', 'Noida', 'Gurgaon', 'Dubai', 'Singapore', 'London', 'New York'];
const times = ['just now', '2 min ago', '5 min ago', '8 min ago', '12 min ago'];

export function SocialProofToast() {
  useEffect(() => {
    function show() {
      const p = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const time = times[Math.floor(Math.random() * times.length)];
      const txt = document.getElementById('spTxt');
      const toast = document.getElementById('spToast');
      if (!txt || !toast) return;
      txt.innerHTML = `Someone from <b>${city}</b> purchased <b>${p.name}</b><span class="sp-time">${time}</span>`;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 5000);
    }

    const t1 = setTimeout(show, 8000);
    const t2 = setInterval(show, 25000);
    return () => { clearTimeout(t1); clearInterval(t2); };
  }, []);

  return (
    <div className="sp-toast" id="spToast">
      <div className="sp-dot" />
      <div className="sp-txt" id="spTxt" />
      <button className="sp-close" onClick={() => document.getElementById('spToast')?.classList.remove('show')}>&times;</button>
    </div>
  );
}
