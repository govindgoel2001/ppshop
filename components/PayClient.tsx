'use client';

import { useState } from 'react';

// UTR submission form on the /pay/[ref] page. After the customer pays via
// UPI, they paste the 12-digit UTR here; the order flips to payment_claimed
// for admin verification.
export function PayClient({ orderRef }: { orderRef: string }) {
  const [utr, setUtr] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'done'>('idle');
  const [err, setErr] = useState<string | null>(null);

  const valid = /^\d{12}$/.test(utr.trim());

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || state === 'busy') return;
    setState('busy');
    setErr(null);
    try {
      const res = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref: orderRef, utr: utr.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Could not submit. Please try again.');
      setState('done');
    } catch (e) {
      setState('idle');
      setErr(e instanceof Error ? e.message : 'Could not submit. Please try again.');
    }
  }

  if (state === 'done') {
    return (
      <div className="pay-claimed">
        ✓ Got it — we&apos;re verifying your payment. Your <a href="/account">dashboard</a> will
        update once it&apos;s confirmed.
      </div>
    );
  }

  return (
    <form className="pay-utr" onSubmit={submit}>
      <label>Paid? Enter the 12-digit UTR / transaction ID from your UPI app</label>
      <div className="pay-utr-row">
        <input
          inputMode="numeric"
          maxLength={12}
          placeholder="e.g. 415023987651"
          value={utr}
          onChange={e => setUtr(e.target.value.replace(/\D/g, ''))}
        />
        <button className="b b1" type="submit" disabled={!valid || state === 'busy'}>
          {state === 'busy' ? 'Submitting…' : 'Submit'}
        </button>
      </div>
      {err && <div className="pay-err">{err}</div>}
    </form>
  );
}
