// api/_lib/catalogue.js
// Canonical price table — single source of truth used by the server to recompute totals.

export const CATALOGUE = {
  2:  { n: 'Tirzepatide',   oos: true,  v: [{ ds: '10mg', pr: 2799 }, { ds: '20mg', pr: 3999 }] },
  3:  { n: 'Retatrutide',   oos: false, v: [{ ds: '10mg', pr: 3499 }, { ds: '20mg', pr: 4999 }] },
  4:  { n: 'BPC-157',       oos: false, v: [{ ds: '10mg', pr: 2199 }] },
  5:  { n: 'TB-500',        oos: true,  v: [{ ds: '10mg', pr: 3599 }] },
  6:  { n: 'BPC+TB Combo',  oos: true,  v: [{ ds: '10mg', pr: 3499 }] },
  8:  { n: 'GHK-Cu',        oos: false, v: [{ ds: '50mg', pr: 1799 }] },
  12: { n: 'CJC+IPA Combo', oos: true,  v: [{ ds: '10mg', pr: 3999 }] },
  13: { n: 'KLOW Blend',    oos: true,  v: [{ ds: '80mg', pr: 4299 }] },
  14: { n: 'BAC Water',     oos: false, v: [{ ds: '10ml', pr: 899  }] },
  15: { n: 'Tesamorelin',   oos: false, v: [{ ds: '10mg', pr: 3999 }] },
};

export const BULK10_THRESHOLD = 20000;

export function priceItems(items) {
  const errors = [];
  const lines = [];
  let subtotal = 0;

  if (!Array.isArray(items) || items.length === 0) {
    return { lines, subtotal: 0, errors: ['No items in cart.'] };
  }

  for (const it of items) {
    const id = Number.parseInt(it && it.id, 10);
    const vi = Number.parseInt(it && it.vi, 10);
    const q  = Number.parseInt(it && it.q,  10);
    if (!Number.isFinite(id) || !Number.isFinite(vi) || !Number.isFinite(q) || q <= 0 || q > 99) {
      errors.push(`Invalid line: ${JSON.stringify(it)}`);
      continue;
    }
    const product = CATALOGUE[id];
    if (!product) { errors.push(`unknown product id ${id}`); continue; }
    if (product.oos) { errors.push(`${product.n} is out of stock`); continue; }
    const variant = product.v[vi];
    if (!variant) { errors.push(`unknown variant ${vi} for ${product.n}`); continue; }

    const lineTotal = variant.pr * q;
    subtotal += lineTotal;
    lines.push({ id, vi, q, n: product.n, ds: variant.ds, pr: variant.pr, lineTotal });
  }

  return { lines, subtotal, errors };
}

export function applyCoupon(subtotal, code, isVerifiedFirst5) {
  if (!code) return { discount: 0, code: null, message: '' };
  const upper = String(code).trim().toUpperCase();

  if (upper === 'FIRST5') {
    if (!isVerifiedFirst5) return { discount: 0, code: null, message: '', error: 'FIRST5 requires email verify first.' };
    return { discount: Math.round(subtotal * 0.05), code: 'FIRST5', message: 'FIRST5 applied: 5% off' };
  }

  if (upper === 'BULK10') {
    if (subtotal < BULK10_THRESHOLD) return { discount: 0, code: null, message: '', error: `BULK10 needs subtotal ≥ ₹${BULK10_THRESHOLD.toLocaleString('en-IN')} (threshold not met).` };
    return { discount: Math.round(subtotal * 0.10), code: 'BULK10', message: 'BULK10 applied: 10% off' };
  }

  return { discount: 0, code: null, message: '', error: 'Unknown coupon.' };
}
