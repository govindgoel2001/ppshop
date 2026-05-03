import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { priceItems, applyCoupon, CATALOGUE } from '../../api/_lib/catalogue.js';

test('priceItems sums known items', () => {
  const r = priceItems([{ id: 4, vi: 0, q: 2 }]);  // BPC-157 in stock
  assert.equal(r.errors.length, 0);
  assert.equal(r.subtotal, 1990 * 2);
  assert.equal(r.lines[0].n, 'BPC-157');
});

test('priceItems rejects unknown id', () => {
  const r = priceItems([{ id: 999, vi: 0, q: 1 }]);
  assert.equal(r.errors.length, 1);
  assert.match(r.errors[0], /unknown/i);
});

test('priceItems rejects out-of-stock items', () => {
  const r = priceItems([{ id: 2, vi: 0, q: 1 }]);  // Tirzepatide is oos
  assert.equal(r.errors.length, 1);
  assert.match(r.errors[0], /out of stock/i);
});

test('priceItems rejects invalid quantity', () => {
  const r = priceItems([{ id: 4, vi: 0, q: 0 }]);
  assert.equal(r.errors.length, 1);
});

test('applyCoupon FIRST5 needs verification', () => {
  const r = applyCoupon(1990, 'FIRST5', false);
  assert.equal(r.discount, 0);
  assert.match(r.error, /verify/i);
});

test('applyCoupon FIRST5 verified gives 5%', () => {
  const r = applyCoupon(1990, 'FIRST5', true);
  assert.equal(r.discount, Math.round(1990 * 0.05));
});

test('applyCoupon BULK10 below threshold rejected', () => {
  const r = applyCoupon(15000, 'BULK10', false);
  assert.equal(r.discount, 0);
  assert.match(r.error, /20,000|threshold/i);
});

test('applyCoupon BULK10 above threshold gives 10%', () => {
  const r = applyCoupon(25000, 'BULK10', false);
  assert.equal(r.discount, Math.round(25000 * 0.10));
});

test('CATALOGUE matches client P[] for in-stock items pricing', () => {
  assert.equal(CATALOGUE[4].v[0].pr, 1990);
  assert.equal(CATALOGUE[14].v[0].pr, 799);
});
