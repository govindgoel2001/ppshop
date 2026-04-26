# UPI QR + Admin Approval Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace today's placeholder bank/Razorpay checkout with a real UPI-QR flow whose orders are server-validated, recorded with the customer's UTR, and approved or rejected by an admin via a magic-link-protected dashboard.

**Architecture:** Client opens a QR modal pointing at a fixed VPA. The customer scans, pays, enters their UTR, and POSTs to `/api/place-order`, which recomputes total from a server-side catalogue, writes `orders` + `coupon_usage` + `order_audit`, and emails both the admin (with a deep link) and the customer (confirmation). The admin authenticates by magic link, lands on a static `/admin` page, and uses cookie-gated `/api/admin/*` endpoints to approve/reject/ship — every state change appends to `order_audit` and emails the customer.

**Tech Stack:** Vanilla HTML/JS, Vercel serverless functions (Node.js 22, ESM), Supabase (`@supabase/supabase-js` v2), Resend (`resend` v4), `qrcode-generator` from jsDelivr, Node.js built-in `node:test` for unit tests, Playwright for UI smoke.

**Spec:** `docs/superpowers/specs/2026-04-26-upi-admin-flow-design.md`

---

## File Structure

| File | Status | Purpose |
|---|---|---|
| `tests/run.sh` | new | One-command test runner (`node --test tests/unit/*.test.js`). |
| `tests/unit/catalogue.test.js` | new | Tests for `priceItems`, `applyCoupon`. |
| `tests/unit/session.test.js` | new | Tests for cookie helpers + `requireAdmin` shape. |
| `tests/smoke/api.sh` | new | curl-based smoke for `/api/*` against a running `vercel dev`. |
| `supabase-schema.sql` | modify | Add columns + tables from spec §5. Drop the old `anon can insert orders` policy. |
| `api/_lib/catalogue.js` | new | Canonical product+price source, `priceItems`, `applyCoupon`. |
| `api/_lib/session.js` | new | `newToken`, cookie read/write, `requireAdmin`. |
| `api/_lib/mailer.js` | new | Resend wrapper + 5 templates. |
| `api/config.js` | new | GET → `{ upiVpa, upiDisplayName }`. |
| `api/place-order.js` | new | Server-validated order placement. |
| `api/admin/login.js` | new | POST magic link request, throttled. |
| `api/admin/auth.js` | new | GET magic-link verify → set cookie → 302. |
| `api/admin/logout.js` | new | POST clear cookie + delete session. |
| `api/admin/me.js` | new | GET → `{email}` or 401. |
| `api/admin/orders.js` | new | GET list (`?status=&before=`) or single (`?id=`). |
| `api/admin/order-action.js` | new | POST approve/reject/ship/note. |
| `admin/login.html` | new | Email input + send-magic-link form. |
| `admin/index.html` | new | Order list dashboard. |
| `admin/order.html` | new | Order detail + action panel. |
| `admin/admin.js` | new | Shared client helpers. |
| `index.html` | modify | Replace `payNow` + `bankInfo` with `payViaUpi`. |
| `shared.js` | modify | Same modal logic as `index.html`. |
| `vercel.json` | modify | Add admin clean-URL rewrites. |
| `package.json` | modify | Add `test` script + `qrcode-generator` *(optional — currently CDN-loaded)*. |

---

## Task 0: Test infrastructure

**Files:**
- Create: `tests/run.sh`
- Modify: `package.json:scripts`

- [ ] **Step 1: Add the test runner script**

Create `tests/run.sh`:

```sh
#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
node --test --test-reporter=spec tests/unit/*.test.js
```

- [ ] **Step 2: Make it executable**

Run: `chmod +x tests/run.sh`

- [ ] **Step 3: Wire `npm test` into package.json**

Modify `package.json` so the `scripts` block reads:

```json
"scripts": {
  "dev": "vercel dev",
  "deploy": "vercel deploy",
  "deploy:prod": "vercel deploy --prod",
  "test": "tests/run.sh"
}
```

- [ ] **Step 4: Verify the runner reports zero specs without erroring**

Run: `npm test`
Expected output: contains `tests 0` and exits 0 (the glob expands to nothing so node:test runs no files).

- [ ] **Step 5: Commit**

```bash
git add tests/run.sh package.json
git commit -m "chore: add node:test runner scaffold"
```

---

## Task 1: Schema migration

**Files:**
- Modify: `supabase-schema.sql`

- [ ] **Step 1: Append the new columns and tables**

Append the following to `supabase-schema.sql` (after the existing content, before any trailing newline):

```sql
-- ─────────────────────────────────────────────
-- UPI + admin flow additions
-- ─────────────────────────────────────────────

-- orders: payment + admin metadata
alter table orders add column if not exists ref               text;
alter table orders add column if not exists utr               text;
alter table orders add column if not exists shipping_address  text;
alter table orders add column if not exists dispatch_tracking text;
alter table orders add column if not exists rejection_reason  text;
alter table orders add column if not exists admin_notes       text;
alter table orders add column if not exists submitted_at      timestamptz default now();

create unique index if not exists orders_ref_unique on orders(ref) where ref is not null;
create unique index if not exists orders_utr_unique on orders(utr) where utr is not null;

-- Server-validated order placement now happens through the service key,
-- so the anon insert policy is no longer needed.
drop policy if exists "anon can insert orders" on orders;

-- magic-link tokens (one-time, short-lived)
create table if not exists admin_login_tokens (
  token       text primary key,
  email       text not null,
  expires_at  timestamptz not null,
  used        boolean not null default false,
  created_at  timestamptz not null default now()
);
alter table admin_login_tokens enable row level security;
create index if not exists admin_login_tokens_email_idx on admin_login_tokens(email);

-- admin sessions (long-lived cookie)
create table if not exists admin_sessions (
  token       text primary key,
  email       text not null,
  expires_at  timestamptz not null,
  created_at  timestamptz not null default now()
);
alter table admin_sessions enable row level security;
create index if not exists admin_sessions_email_idx on admin_sessions(email);

-- audit log so the admin page can show history
create table if not exists order_audit (
  id          bigint generated always as identity primary key,
  order_id    bigint not null references orders(id) on delete cascade,
  actor       text,
  action      text not null,
  detail      text,
  created_at  timestamptz not null default now()
);
alter table order_audit enable row level security;
create index if not exists order_audit_order_idx on order_audit(order_id);

-- Allow 'admin_login' as a third otp_attempts type (for magic-link throttling).
-- otp_attempts.type is free-form text, so this is a no-op constraint update — kept here
-- as documentation that the API will write rows with type='admin_login'.
```

- [ ] **Step 2: Sanity-check by running the SQL through Postgres locally if available**

If you have `psql` and a sandbox database, run: `psql "$DATABASE_URL" -f supabase-schema.sql`
Otherwise rely on Supabase SQL Editor before deploy. Either way, confirm no syntax errors using a free linter:

Run: `python3 -c "import sys; open('supabase-schema.sql').read()"; echo OK`
Expected: prints `OK`.

- [ ] **Step 3: Commit**

```bash
git add supabase-schema.sql
git commit -m "feat(schema): orders/admin/audit columns for UPI flow"
```

---

## Task 2: Canonical catalogue + pricing helpers

**Files:**
- Create: `api/_lib/catalogue.js`
- Test: `tests/unit/catalogue.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/catalogue.test.js`:

```js
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
  // BPC-157 must agree with shared.js / index.html
  assert.equal(CATALOGUE[4].v[0].pr, 1990);
  assert.equal(CATALOGUE[14].v[0].pr, 799);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: `Cannot find module ... catalogue.js`, exit code != 0.

- [ ] **Step 3: Write `api/_lib/catalogue.js`**

```js
// api/_lib/catalogue.js
// Canonical price table — this is the single source of truth used by the server
// to recompute order totals. The client P[] arrays in shared.js / index.html
// drive display only and must be kept in sync (lint-tracked manually for now).

export const CATALOGUE = {
  2:  { n: 'Tirzepatide',         oos: true,  v: [{ ds: '10mg', pr: 2400 }, { ds: '20mg', pr: 3800 }] },
  3:  { n: 'Retatrutide',         oos: false, v: [{ ds: '10mg', pr: 2899 }, { ds: '20mg', pr: 4500 }] },
  4:  { n: 'BPC-157',             oos: false, v: [{ ds: '10mg', pr: 1990 }] },
  5:  { n: 'TB-500',              oos: true,  v: [{ ds: '10mg', pr: 3400 }] },
  6:  { n: 'BPC+TB Combo',        oos: true,  v: [{ ds: '10mg', pr: 3200 }] },
  8:  { n: 'GHK-Cu',              oos: false, v: [{ ds: '50mg', pr: 1500 }] },
  11: { n: 'CJC-1295 (no DAC)',   oos: true,  v: [{ ds: '5mg',  pr: 2800 }] },
  12: { n: 'CJC+IPA Combo',       oos: true,  v: [{ ds: '10mg', pr: 3750 }] },
  13: { n: 'KLOW Blend',          oos: true,  v: [{ ds: '80mg', pr: 3990 }] },
  14: { n: 'BAC Water',           oos: false, v: [{ ds: '10ml', pr: 799  }] },
};

export const BULK10_THRESHOLD = 20000;

/**
 * Recompute totals from the server-side catalogue.
 * @param {Array<{id:number, vi:number, q:number}>} items
 * @returns {{lines: Array, subtotal: number, errors: string[]}}
 */
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
    lines.push({
      id, vi, q,
      n: product.n,
      ds: variant.ds,
      pr: variant.pr,
      lineTotal,
    });
  }

  return { lines, subtotal, errors };
}

/**
 * Compute the discount for a given subtotal + coupon.
 * @param {number} subtotal
 * @param {'FIRST5'|'BULK10'|null|undefined} code
 * @param {boolean} isVerifiedFirst5  -- true only if the OTP verification is fresh and unconsumed
 * @returns {{discount: number, code: string|null, message: string, error?: string}}
 */
export function applyCoupon(subtotal, code, isVerifiedFirst5) {
  if (!code) return { discount: 0, code: null, message: '' };

  const upper = String(code).trim().toUpperCase();

  if (upper === 'FIRST5') {
    if (!isVerifiedFirst5) {
      return { discount: 0, code: null, message: '', error: 'FIRST5 requires email verification.' };
    }
    return { discount: Math.round(subtotal * 0.05), code: 'FIRST5', message: 'FIRST5 applied: 5% off' };
  }

  if (upper === 'BULK10') {
    if (subtotal < BULK10_THRESHOLD) {
      return { discount: 0, code: null, message: '', error: `BULK10 needs subtotal ≥ ₹${BULK10_THRESHOLD.toLocaleString('en-IN')} (threshold not met).` };
    }
    return { discount: Math.round(subtotal * 0.10), code: 'BULK10', message: 'BULK10 applied: 10% off' };
  }

  return { discount: 0, code: null, message: '', error: 'Unknown coupon.' };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: all 9 catalogue tests pass.

- [ ] **Step 5: Commit**

```bash
git add api/_lib/catalogue.js tests/unit/catalogue.test.js
git commit -m "feat(api): canonical server-side catalogue + pricing helpers"
```

---

## Task 3: Mailer wrapper + templates

**Files:**
- Create: `api/_lib/mailer.js`

- [ ] **Step 1: Implement the wrapper**

```js
// api/_lib/mailer.js
import { Resend } from 'resend';

const FROM = 'AthenaBioLabs <support@athenabiolabs.com>';
const SITE_URL = process.env.ADMIN_SITE_URL || 'https://athenabiolabs.com';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function fmtINR(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

function itemsToHtml(lines) {
  return lines.map(l =>
    `<tr><td>${escapeHtml(l.n)} (${escapeHtml(l.ds)})</td><td>×${l.q}</td><td>${fmtINR(l.lineTotal)}</td></tr>`
  ).join('');
}

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

async function send({ to, subject, html }) {
  const resend = getResend();
  const { error } = await resend.emails.send({ from: FROM, to, subject, html });
  if (error) console.error('mailer error:', error);
  return { ok: !error, error };
}

export async function sendAdminAlert({ adminEmails, order, lines }) {
  const subject = `New order ${order.ref} — ${fmtINR(order.total)} — pending verification`;
  const link = `${SITE_URL}/admin/order.html?id=${order.id}`;
  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px 24px">
      <h2 style="font-weight:400;margin-bottom:8px">New order: ${escapeHtml(order.ref)}</h2>
      <p>${escapeHtml(order.email)} · UTR ${escapeHtml(order.utr || '—')}</p>
      <table style="border-collapse:collapse;width:100%;margin:16px 0">${itemsToHtml(lines)}</table>
      <p><strong>Total: ${fmtINR(order.total)}</strong> ${order.coupon ? `(coupon ${order.coupon})` : ''}</p>
      <p style="margin-top:24px"><a href="${link}" style="background:#1a1a1a;color:#fff;padding:12px 20px;text-decoration:none">Review &amp; verify</a></p>
    </div>`;
  return send({ to: adminEmails, subject, html });
}

export async function sendCustomerPlaced({ to, order, lines }) {
  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px 24px">
      <h2 style="font-weight:400">Order ${escapeHtml(order.ref)} received</h2>
      <p>We've received your UTR <code>${escapeHtml(order.utr)}</code>. We typically verify within 24 hours.</p>
      <table style="border-collapse:collapse;width:100%;margin:16px 0">${itemsToHtml(lines)}</table>
      <p><strong>Total: ${fmtINR(order.total)}</strong></p>
      <p style="font-size:12px;color:#888">If you didn't place this order, reply to this email.</p>
    </div>`;
  return send({ to, subject: `Order ${order.ref} received — verifying payment`, html });
}

export async function sendCustomerApproved({ to, order }) {
  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px 24px">
      <h2 style="font-weight:400">Order ${escapeHtml(order.ref)} confirmed</h2>
      <p>Your payment is verified and we'll dispatch within 24 hours.</p>
    </div>`;
  return send({ to, subject: `Order ${order.ref} confirmed — dispatch within 24h`, html });
}

export async function sendCustomerRejected({ to, order, reason }) {
  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px 24px">
      <h2 style="font-weight:400">Order ${escapeHtml(order.ref)} could not be verified</h2>
      <p>Reason: ${escapeHtml(reason || 'Payment not received.')}</p>
      <p>Reply with a fresh UTR or use a different payment method.</p>
    </div>`;
  return send({ to, subject: `Order ${order.ref} — payment not verified`, html });
}

export async function sendCustomerShipped({ to, order, tracking }) {
  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px 24px">
      <h2 style="font-weight:400">Order ${escapeHtml(order.ref)} has shipped</h2>
      <p>Tracking number: <strong>${escapeHtml(tracking)}</strong></p>
    </div>`;
  return send({ to, subject: `Order ${order.ref} shipped`, html });
}

export async function sendAdminLoginLink({ to, link }) {
  const html = `
    <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:32px 24px">
      <h2 style="font-weight:400">AthenaBioLabs admin sign-in</h2>
      <p>Click to sign in. This link expires in 30 minutes and works once.</p>
      <p><a href="${link}" style="background:#1a1a1a;color:#fff;padding:12px 20px;text-decoration:none">Sign in</a></p>
      <p style="font-size:12px;color:#888">If this wasn't you, ignore this email.</p>
    </div>`;
  return send({ to, subject: 'AthenaBioLabs admin sign-in link', html });
}
```

- [ ] **Step 2: Syntax-check**

Run: `node --check api/_lib/mailer.js`
Expected: silent (exit 0).

- [ ] **Step 3: Commit**

```bash
git add api/_lib/mailer.js
git commit -m "feat(api): mailer wrapper with admin + customer templates"
```

---

## Task 4: Session helper + tests

**Files:**
- Create: `api/_lib/session.js`
- Test: `tests/unit/session.test.js`

- [ ] **Step 1: Write the failing test**

Create `tests/unit/session.test.js`:

```js
import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { newToken, readSessionCookie, buildSessionCookie, buildClearCookie } from '../../api/_lib/session.js';

test('newToken returns a 64+ char base64url string', () => {
  const t = newToken();
  assert.match(t, /^[A-Za-z0-9_-]{60,}$/);
});

test('readSessionCookie extracts abl_admin', () => {
  const req = { headers: { cookie: 'foo=1; abl_admin=abc.def; bar=2' } };
  assert.equal(readSessionCookie(req), 'abc.def');
});

test('readSessionCookie returns null when absent', () => {
  assert.equal(readSessionCookie({ headers: {} }), null);
  assert.equal(readSessionCookie({ headers: { cookie: 'x=1' } }), null);
});

test('buildSessionCookie includes HttpOnly + Secure + SameSite', () => {
  const c = buildSessionCookie('TOK');
  assert.match(c, /^abl_admin=TOK;/);
  assert.match(c, /HttpOnly/);
  assert.match(c, /Secure/);
  assert.match(c, /SameSite=Strict/);
  assert.match(c, /Max-Age=\d+/);
});

test('buildClearCookie zeroes Max-Age', () => {
  assert.match(buildClearCookie(), /Max-Age=0/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: `Cannot find module ... session.js`.

- [ ] **Step 3: Implement `api/_lib/session.js`**

```js
// api/_lib/session.js
import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const SESSION_TTL_DAYS = 7;
const COOKIE_NAME = 'abl_admin';

export function newToken() {
  return crypto.randomBytes(48).toString('base64url');
}

export function readSessionCookie(req) {
  const c = req && req.headers && req.headers.cookie;
  if (!c) return null;
  const m = String(c).match(/(?:^|;\s*)abl_admin=([^;]+)/);
  return m ? m[1] : null;
}

export function buildSessionCookie(token) {
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_DAYS * 86400}`;
}

export function buildClearCookie() {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

export function setSessionCookie(res, token) {
  res.setHeader('Set-Cookie', buildSessionCookie(token));
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', buildClearCookie());
}

export function adminAllowList() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
}

/**
 * Throws an Error with code 'UNAUTHENTICATED' or 'REVOKED' on failure.
 * Returns { email } on success.
 */
export async function requireAdmin(req) {
  const token = readSessionCookie(req);
  if (!token) { const e = new Error('No session'); e.code = 'UNAUTHENTICATED'; throw e; }

  const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const { data } = await supa
    .from('admin_sessions')
    .select('email, expires_at')
    .eq('token', token)
    .maybeSingle();

  if (!data) { const e = new Error('Bad session'); e.code = 'UNAUTHENTICATED'; throw e; }
  if (new Date(data.expires_at) < new Date()) {
    const e = new Error('Expired'); e.code = 'UNAUTHENTICATED'; throw e;
  }
  if (!adminAllowList().includes(data.email.toLowerCase())) {
    const e = new Error('Not in allow-list'); e.code = 'REVOKED'; throw e;
  }
  return { email: data.email };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test`
Expected: 5 session tests pass alongside the catalogue tests.

- [ ] **Step 5: Commit**

```bash
git add api/_lib/session.js tests/unit/session.test.js
git commit -m "feat(api): admin session helper + tests"
```

---

## Task 5: Public config endpoint

**Files:**
- Create: `api/config.js`

- [ ] **Step 1: Implement**

```js
// api/config.js
// Public — returns just the bits the cart needs to render the QR.
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  return res.status(200).json({
    upiVpa:         process.env.UPI_VPA || '',
    upiDisplayName: process.env.UPI_DISPLAY_NAME || 'AthenaBioLabs',
  });
}
```

- [ ] **Step 2: Syntax-check**

Run: `node --check api/config.js`
Expected: silent.

- [ ] **Step 3: Commit**

```bash
git add api/config.js
git commit -m "feat(api): /api/config returns UPI display values for client"
```

---

## Task 6: Server-validated `/api/place-order`

**Files:**
- Create: `api/place-order.js`

- [ ] **Step 1: Implement**

```js
// api/place-order.js
// POST { items, coupon, contactEmail, otpEmail, shippingAddress, ebook, ref, utr }
// Recomputes total server-side, writes orders + coupon_usage + order_audit, emails admin + customer.

import { createClient } from '@supabase/supabase-js';
import { priceItems, applyCoupon } from './_lib/catalogue.js';
import { adminAllowList } from './_lib/session.js';
import { sendAdminAlert, sendCustomerPlaced } from './_lib/mailer.js';
import { validateEmail, getIp } from './_lib/validate.js';

const REF_RE = /^[A-Z0-9]{8}$/;
const UTR_RE = /^\d{12}$/;

const supa = () => createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const body = req.body || {};
  const items = Array.isArray(body.items) ? body.items : [];
  const coupon = body.coupon ? String(body.coupon).trim().toUpperCase() : null;
  const contactEmail = (body.contactEmail || '').trim().toLowerCase();
  const otpEmail     = body.otpEmail ? String(body.otpEmail).trim().toLowerCase() : null;
  const shippingAddress = typeof body.shippingAddress === 'string' ? body.shippingAddress.trim().slice(0, 1000) : '';
  const ebook = body.ebook !== false;
  const ref   = String(body.ref || '').toUpperCase();
  const utr   = String(body.utr || '').trim();

  if (!validateEmail(contactEmail)) return res.status(400).json({ error: 'Invalid contact email.' });
  if (!REF_RE.test(ref))            return res.status(400).json({ error: 'Invalid order reference.' });
  if (!UTR_RE.test(utr))            return res.status(400).json({ error: 'UTR must be 12 digits.' });

  // 1. Server-side pricing
  const priced = priceItems(items);
  if (priced.errors.length) return res.status(400).json({ error: priced.errors[0] });
  const subtotal = priced.subtotal;
  if (subtotal <= 0) return res.status(400).json({ error: 'Cart is empty.' });

  // 2. Coupon
  let discount = 0, finalCoupon = null, isVerifiedFirst5 = false;
  if (coupon === 'FIRST5') {
    if (!otpEmail || !validateEmail(otpEmail)) {
      return res.status(400).json({ error: 'FIRST5 needs a verified email.' });
    }
    const { data: otpRec } = await supa()
      .from('email_otps').select('verified, verified_at')
      .eq('email', otpEmail).maybeSingle();
    if (otpRec?.verified && otpRec.verified_at) {
      const age = Date.now() - new Date(otpRec.verified_at).getTime();
      if (age < 30 * 60 * 1000) isVerifiedFirst5 = true;
    }
  }
  if (coupon) {
    const c = applyCoupon(subtotal, coupon, isVerifiedFirst5);
    if (!c.error) { discount = c.discount; finalCoupon = c.code; }
  }
  const total = subtotal - discount;

  // 3. Insert order
  const sb = supa();
  const { data: inserted, error: insErr } = await sb
    .from('orders')
    .insert({
      ref,
      utr,
      items: priced.lines.map(l => `${l.n} (${l.ds}) x${l.q}`).join(', '),
      total,
      coupon: finalCoupon,
      payment_method: 'upi_qr',
      status: 'pending_verification',
      ebook,
      email: contactEmail,
      shipping_address: shippingAddress || null,
      submitted_at: new Date().toISOString(),
    })
    .select('id, ref, total, coupon, email, utr')
    .single();

  if (insErr) {
    console.error('place-order insert error:', insErr);
    if (insErr.code === '23505') return res.status(409).json({ error: 'Duplicate UTR or order reference.' });
    return res.status(500).json({ error: 'Could not save your order. Please contact support.' });
  }

  const order = inserted;

  // 4. Coupon-usage + consume verified flag
  if (finalCoupon === 'FIRST5' && otpEmail) {
    await sb.from('coupon_usage').insert({ email: otpEmail, code: 'FIRST5', order_id: String(order.id) }).then(() => {});
    await sb.from('email_otps').update({ verified: false }).eq('email', otpEmail);
  }

  // 5. Audit
  await sb.from('order_audit').insert({
    order_id: order.id, actor: 'customer', action: 'placed',
    detail: `UTR ${utr}, contact ${contactEmail}, IP ${getIp(req)}`,
  });

  // 6. Emails (best-effort)
  const admins = adminAllowList();
  if (admins.length) {
    sendAdminAlert({ adminEmails: admins, order, lines: priced.lines }).catch(e => console.error(e));
  }
  sendCustomerPlaced({ to: contactEmail, order, lines: priced.lines }).catch(e => console.error(e));

  return res.status(200).json({ ok: true, ref: order.ref, orderId: order.id });
}
```

- [ ] **Step 2: Syntax-check**

Run: `node --check api/place-order.js`
Expected: silent.

- [ ] **Step 3: Commit**

```bash
git add api/place-order.js
git commit -m "feat(api): server-validated /api/place-order"
```

---

## Task 7: Customer UPI modal in shared.js + index.html

**Files:**
- Modify: `shared.js` — replace `confirmBankTransfer` and the `bankInfo` panel with `payViaUpi`.
- Modify: `index.html` — same.

- [ ] **Step 1: Add `payViaUpi` to `shared.js`**

Locate the `// PAYMENT` section (currently containing `showBankDetails` and `confirmBankTransfer`). Replace the entire section with:

```js
// =====================
// PAYMENT — UPI QR
// =====================
function genRef(){
  // 8 chars, A-Z + 0-9, easy to read
  var s='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',out='';
  for(var i=0;i<8;i++)out+=s.charAt(Math.floor(Math.random()*s.length));
  return out;
}

var _qrLibPromise=null;
function loadQrLib(){
  if(window.qrcode)return Promise.resolve(window.qrcode);
  if(_qrLibPromise)return _qrLibPromise;
  _qrLibPromise=new Promise(function(resolve,reject){
    var s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js';
    s.onload=function(){resolve(window.qrcode);};
    s.onerror=function(){reject(new Error('qr-failed'));};
    document.head.appendChild(s);
  });
  return _qrLibPromise;
}

var _upiCfgPromise=null;
function loadUpiConfig(){
  if(_upiCfgPromise)return _upiCfgPromise;
  _upiCfgPromise=fetch('/api/config').then(function(r){return r.json();}).catch(function(){return{upiVpa:'',upiDisplayName:'AthenaBioLabs'};});
  return _upiCfgPromise;
}

function payViaUpi(total){
  if(coupon==='FIRST5'&&otpState!=='verified'){
    alert('Please verify your email via OTP to use FIRST5.');
    return;
  }
  var ce=document.getElementById('custEmail');
  var EMAIL_RE=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var contact=((ce&&ce.value)||customerEmail||'').trim().toLowerCase();
  if(!EMAIL_RE.test(contact)){
    alert('Please enter a valid contact email so we can confirm your order.');
    if(ce)ce.focus();
    return;
  }
  customerEmail=contact;
  var ref=genRef();
  // Build modal
  var ov=document.createElement('div');
  ov.id='upiOv';
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px';
  ov.innerHTML=
    '<div style="background:#FAFAF7;max-width:420px;width:100%;padding:28px 24px;font-family:DM Sans,sans-serif;color:#1a1a1a">'+
    '  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">'+
    '    <h3 style="font-family:Cormorant Garamond,serif;font-size:22px;font-weight:500;margin:0">Pay via UPI</h3>'+
    '    <button id="upiX" style="background:none;border:none;font-size:22px;cursor:pointer;color:#888">&times;</button>'+
    '  </div>'+
    '  <p style="font-size:11px;color:#6a6560;margin:0 0 14px">Order reference <strong id="upiRef">'+esc(ref)+'</strong> &middot; Amount <strong>'+fmt(total)+'</strong></p>'+
    '  <div id="upiQr" style="display:flex;justify-content:center;padding:14px;background:#fff;border:1px solid #e8e3dc;min-height:220px"></div>'+
    '  <div id="upiFallback" style="margin-top:10px;font-size:11px;color:#8a8580;text-align:center"></div>'+
    '  <div style="margin-top:14px;font-size:11px;color:#6a6560"><strong>UPI ID:</strong> <span id="upiVpa">…</span></div>'+
    '  <button id="upiPaid" style="margin-top:18px;width:100%;padding:13px;background:#1a1a1a;color:#FAFAF7;border:none;font-size:11px;font-weight:600;letter-spacing:.18em;cursor:pointer">I&rsquo;VE PAID &mdash; ENTER UTR</button>'+
    '  <div id="upiUtrWrap" style="display:none;margin-top:14px">'+
    '    <label style="font-size:11px;color:#6a6560;display:block;margin-bottom:6px">12-digit UTR / Reference number</label>'+
    '    <input id="upiUtr" inputmode="numeric" maxlength="12" placeholder="123456789012" style="width:100%;box-sizing:border-box;padding:11px;border:1px solid #d4cfc8;font-family:DM Mono,monospace;letter-spacing:.18em;background:#fafaf7">'+
    '    <div id="upiMsg" style="font-size:11px;margin-top:6px;min-height:14px"></div>'+
    '    <button id="upiSubmit" style="margin-top:10px;width:100%;padding:13px;background:#1a1a1a;color:#FAFAF7;border:none;font-size:11px;font-weight:600;letter-spacing:.18em;cursor:pointer">CONFIRM ORDER</button>'+
    '  </div>'+
    '</div>';
  document.body.appendChild(ov);
  document.getElementById('upiX').onclick=function(){ov.remove();};
  document.getElementById('upiPaid').onclick=function(){
    document.getElementById('upiUtrWrap').style.display='block';
    document.getElementById('upiPaid').style.display='none';
    document.getElementById('upiUtr').focus();
  };
  document.getElementById('upiSubmit').onclick=function(){
    submitUpiOrder(ref,total,contact);
  };

  Promise.all([loadUpiConfig(),loadQrLib().catch(function(){return null;})]).then(function(arr){
    var cfg=arr[0]||{},qrlib=arr[1];
    var vpa=cfg.upiVpa||'',name=cfg.upiDisplayName||'AthenaBioLabs';
    document.getElementById('upiVpa').textContent=vpa||'(configured on server)';
    var uri='upi://pay?pa='+encodeURIComponent(vpa)+'&pn='+encodeURIComponent(name)+'&am='+encodeURIComponent(String(total))+'&cu=INR&tn=ABL-'+encodeURIComponent(ref);
    var qrEl=document.getElementById('upiQr');
    var fallback=document.getElementById('upiFallback');
    if(qrlib&&vpa){
      var q=qrlib(0,'M');q.addData(uri);q.make();
      qrEl.innerHTML=q.createSvgTag({scalable:true,margin:1,cellSize:5});
      fallback.innerHTML='Scan with any UPI app (GPay, PhonePe, Paytm).';
    } else {
      qrEl.innerHTML='<a href="'+uri+'" style="word-break:break-all;font-size:11px;color:#C8A97E">'+esc(uri)+'</a>';
      fallback.innerHTML='Tap the link above on a phone to open your UPI app.';
    }
  });
}

function submitUpiOrder(ref,total,contact){
  var utrEl=document.getElementById('upiUtr'),msg=document.getElementById('upiMsg'),btn=document.getElementById('upiSubmit');
  var utr=(utrEl.value||'').replace(/\D/g,'').slice(0,12);
  if(utr.length!==12){msg.style.color='#c44';msg.textContent='Enter the 12-digit UTR shown in your UPI app.';return;}
  btn.disabled=true;btn.textContent='SAVING…';msg.textContent='';
  var payload={
    items:cart.map(function(c){return{id:c.id,vi:c.vi,q:c.q};}),
    coupon:coupon||null,
    contactEmail:contact,
    otpEmail:(otpState==='verified'&&otpEmail)?otpEmail:null,
    shippingAddress:'',
    ebook:!!includeEbook,
    ref:ref,
    utr:utr
  };
  fetch('/api/place-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
    .then(function(r){return r.json().then(function(d){return{status:r.status,d:d};});})
    .then(function(res){
      if(res.status===200&&res.d.ok){
        trackEvent('Purchase',{value:total,currency:'INR',transaction_id:res.d.ref,coupon:coupon||null});
        var ov=document.getElementById('upiOv');
        if(ov)ov.innerHTML='<div style="background:#FAFAF7;max-width:420px;width:100%;padding:32px 28px;text-align:center;font-family:DM Sans,sans-serif"><h3 style="font-family:Cormorant Garamond,serif;font-size:22px;font-weight:500;margin:0 0 12px">Order placed</h3><p style="font-size:12px;color:#6a6560">Reference <strong>'+esc(res.d.ref)+'</strong>. We’ll verify your payment and email you within 24 hours.</p><button onclick="document.getElementById(\'upiOv\').remove()" style="margin-top:18px;padding:12px 24px;background:#1a1a1a;color:#FAFAF7;border:none;font-size:11px;font-weight:600;letter-spacing:.18em;cursor:pointer">CLOSE</button></div>';
        cart=[];saveCart();uB();coupon='';couponMsg='';otpState='idle';otpEmail='';customerEmail='';rC();closeCart();
      } else {
        btn.disabled=false;btn.textContent='CONFIRM ORDER';
        msg.style.color='#c44';msg.textContent=esc((res.d&&res.d.error)||'Could not save your order. Please try again.');
      }
    })
    .catch(function(){btn.disabled=false;btn.textContent='CONFIRM ORDER';msg.style.color='#c44';msg.textContent='Network error. Try again.';});
}
```

- [ ] **Step 2: Update the cart-render `Pay via Bank / UPI` button to call `payViaUpi`**

In `shared.js`'s `rC()`, find the line:

```js
  h+='<button class="b b1" style="width:100%;margin-top:16px;padding:18px 40px;font-size:13px" onclick="showBankDetails()">Pay via Bank / UPI &middot; '+fmt(total)+'</button>';
```

and the entire `bankInfo` block immediately following it. Replace both with:

```js
  h+='<button class="b b1" style="width:100%;margin-top:16px;padding:18px 40px;font-size:13px" onclick="payViaUpi('+total+')">Pay via UPI &middot; '+fmt(total)+'</button>';
```

(The mailto "Email Order" link directly below it stays unchanged.)

- [ ] **Step 3: Mirror the same changes in `index.html`**

Inside `index.html`'s inline script block, perform the equivalent two changes: (a) add the `payViaUpi` / `submitUpiOrder` / `loadQrLib` / `loadUpiConfig` / `genRef` functions next to the existing `showBankDetails` / `confirmBankTransfer`, and (b) replace the `Pay Now` Razorpay button + `bankInfo` block with a single `payViaUpi(total)` button. Keep the customerEmail field, the `cpIn` coupon input, and the OTP modal — only the payment buttons change.

The exact replacement inside `rC()`:

```js
  h+='<button class="b b1" style="width:100%;margin-top:16px;padding:18px 40px;font-size:13px;position:relative" onclick="payViaUpi('+total+')"><span style="position:absolute;left:16px;top:50%;transform:translateY(-50%)">&#128274;</span> Pay via UPI &middot; '+fmt(total)+'</button>';
  h+='<a href="mailto:support@athenabiolabs.com?subject=AthenaBioLabs%20Order" class="b b2" style="display:block;text-align:center;margin-top:8px;padding:12px 16px;font-size:9px">Email Order</a>';
```

(Removes both the secondary `Bank / UPI Transfer` toggle and the `bankInfo` block; the Razorpay-style "Secured by" footer line goes too.)

- [ ] **Step 4: Browser-verify the modal opens and renders**

Start the dev server (in a separate terminal): `python3 -m http.server 8765 --bind 127.0.0.1`
Drive Playwright through these steps:

1. Navigate to `http://127.0.0.1:8765/index.html`.
2. `aC(4)` to add BPC-157 to the cart, `openCart()`.
3. Click the new `Pay via UPI` button.
4. Confirm `#upiOv` is in the DOM, `#upiQr` contains either an `<svg>` or the fallback `<a>` link.

Run the equivalent on `/catalogue.html` (which uses `shared.js`).

- [ ] **Step 5: Commit**

```bash
git add shared.js index.html
git commit -m "feat(checkout): UPI QR modal + place-order submission"
```

---

## Task 8: Remove the dead Razorpay path

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Delete the now-unused `payNow` function and its call sites**

Search `index.html` for `function payNow(`. Remove the entire `payNow` function (the Razorpay options object block) and any remaining reference to `SITE_CONFIG.razorpayKey` inside the cart UI. Leave `SITE_CONFIG.upi.*` alone — the new modal reads from `/api/config`, but the legacy field is harmless and may be reused later.

- [ ] **Step 2: Remove the unused Razorpay script tag**

Locate `<script src="https://checkout.razorpay.com/v1/checkout.js"></script>` in `index.html` and delete it. (Leave it in `products/*.html` for now — they're regenerated by `make_page.sh` and the script tag costs only a network round-trip when the file is unused.)

Run: `grep -n payNow index.html`
Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "chore(checkout): remove unused Razorpay path"
```

---

## Task 9: Admin login (magic-link request)

**Files:**
- Create: `api/admin/login.js`

- [ ] **Step 1: Implement**

```js
// api/admin/login.js
// POST { email } — sends a magic-link email if the address is in ADMIN_EMAILS.
// Always returns { ok: true } so attackers can't enumerate admins.

import { createClient } from '@supabase/supabase-js';
import { newToken, adminAllowList } from '../_lib/session.js';
import { sendAdminLoginLink } from '../_lib/mailer.js';
import { recordOtpAttempt } from '../_lib/ratelimit.js';
import { validateEmail, getIp } from '../_lib/validate.js';

const TOKEN_TTL_MIN = 30;
const SITE_URL = process.env.ADMIN_SITE_URL || 'https://athenabiolabs.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const email = String((req.body && req.body.email) || '').trim().toLowerCase();
  if (!validateEmail(email)) return res.status(400).json({ error: 'Invalid email.' });

  const ip = getIp(req);
  const allowed = adminAllowList();
  if (!allowed.includes(email)) {
    // Still record the attempt + return ok so we don't leak the allow-list
    await recordOtpAttempt(email, 'admin_login', ip);
    return res.status(200).json({ ok: true });
  }

  // Throttle: max 3 admin-login attempts per email per hour
  const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supa
    .from('otp_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('email', email).eq('type', 'admin_login').gte('created_at', since);
  if ((count || 0) >= 3) return res.status(429).json({ error: 'Too many sign-in attempts. Try later.' });

  const token = newToken();
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MIN * 60 * 1000).toISOString();

  const { error } = await supa.from('admin_login_tokens')
    .insert({ token, email, expires_at: expiresAt, used: false });
  if (error) {
    console.error('admin/login token insert error:', error);
    return res.status(500).json({ error: 'Could not send link.' });
  }

  await recordOtpAttempt(email, 'admin_login', ip);

  const next = typeof req.body.next === 'string' && req.body.next.startsWith('/admin/') ? req.body.next : '/admin/index.html';
  const link = `${SITE_URL}/api/admin/auth?token=${encodeURIComponent(token)}&next=${encodeURIComponent(next)}`;
  await sendAdminLoginLink({ to: email, link });

  return res.status(200).json({ ok: true });
}
```

- [ ] **Step 2: Syntax-check**

Run: `node --check api/admin/login.js`
Expected: silent.

- [ ] **Step 3: Commit**

```bash
git add api/admin/login.js
git commit -m "feat(api): admin magic-link request"
```

---

## Task 10: Admin auth-verify, logout, me

**Files:**
- Create: `api/admin/auth.js`
- Create: `api/admin/logout.js`
- Create: `api/admin/me.js`

- [ ] **Step 1: `api/admin/auth.js`**

```js
// GET /api/admin/auth?token=...&next=...
// Validates the magic-link token, creates a session, sets cookie, redirects.
import { createClient } from '@supabase/supabase-js';
import { newToken, setSessionCookie, adminAllowList } from '../_lib/session.js';

const SESSION_TTL_DAYS = 7;

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const token = String(req.query.token || '');
  const next  = typeof req.query.next === 'string' && req.query.next.startsWith('/admin/')
    ? req.query.next : '/admin/index.html';

  if (!token) return res.status(400).send('Missing token.');

  const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const { data: row } = await supa
    .from('admin_login_tokens')
    .select('email, expires_at, used')
    .eq('token', token)
    .maybeSingle();

  if (!row || row.used || new Date(row.expires_at) < new Date()) {
    return res.status(400).send('This sign-in link is invalid or expired.');
  }
  if (!adminAllowList().includes(row.email.toLowerCase())) {
    return res.status(403).send('Access revoked.');
  }

  // Single-use: mark token used
  await supa.from('admin_login_tokens').update({ used: true }).eq('token', token);

  const sessionTok = newToken();
  const expiresAt  = new Date(Date.now() + SESSION_TTL_DAYS * 86400 * 1000).toISOString();
  await supa.from('admin_sessions').insert({ token: sessionTok, email: row.email, expires_at: expiresAt });

  setSessionCookie(res, sessionTok);
  res.statusCode = 302;
  res.setHeader('Location', next);
  res.end();
}
```

- [ ] **Step 2: `api/admin/logout.js`**

```js
import { createClient } from '@supabase/supabase-js';
import { readSessionCookie, clearSessionCookie } from '../_lib/session.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const tok = readSessionCookie(req);
  if (tok) {
    const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    await supa.from('admin_sessions').delete().eq('token', tok);
  }
  clearSessionCookie(res);
  return res.status(200).json({ ok: true });
}
```

- [ ] **Step 3: `api/admin/me.js`**

```js
import { requireAdmin } from '../_lib/session.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const { email } = await requireAdmin(req);
    return res.status(200).json({ email });
  } catch (e) {
    return res.status(401).json({ error: 'Unauthenticated.' });
  }
}
```

- [ ] **Step 4: Syntax-check all three**

Run: `node --check api/admin/auth.js api/admin/logout.js api/admin/me.js`
Expected: silent.

- [ ] **Step 5: Commit**

```bash
git add api/admin/auth.js api/admin/logout.js api/admin/me.js
git commit -m "feat(api): admin auth verify + logout + me"
```

---

## Task 11: Admin login HTML

**Files:**
- Create: `admin/login.html`

- [ ] **Step 1: Implement**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Admin sign-in — AthenaBioLabs</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  body{margin:0;font-family:'DM Sans',sans-serif;background:#FAFAF7;color:#1a1a1a;display:flex;align-items:center;justify-content:center;min-height:100vh}
  .card{background:#fff;border:1px solid #e8e3dc;padding:40px 32px;width:100%;max-width:400px}
  h1{font-family:'Cormorant Garamond',serif;font-weight:400;font-size:32px;margin:0 0 18px}
  label{display:block;font-size:11px;color:#6a6560;margin-bottom:6px}
  input{width:100%;box-sizing:border-box;padding:11px;border:1px solid #d4cfc8;background:#fafaf7;font-size:13px}
  button{margin-top:14px;width:100%;padding:13px;background:#1a1a1a;color:#FAFAF7;border:none;font-size:11px;font-weight:600;letter-spacing:.18em;cursor:pointer}
  button:disabled{opacity:.6;cursor:wait}
  .msg{margin-top:12px;font-size:12px;color:#6a6560;min-height:18px}
</style>
</head>
<body>
<div class="card">
  <h1>Admin sign-in</h1>
  <label>Email</label>
  <input id="email" type="email" placeholder="admin@athenabiolabs.com" autocomplete="email">
  <button id="submit">SEND SIGN-IN LINK</button>
  <div id="msg" class="msg"></div>
</div>
<script>
var params=new URLSearchParams(location.search),next=params.get('next')||'/admin/index.html';
document.getElementById('submit').onclick=function(){
  var email=document.getElementById('email').value.trim().toLowerCase();
  var btn=document.getElementById('submit'),msg=document.getElementById('msg');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){msg.textContent='Enter a valid email.';return;}
  btn.disabled=true;btn.textContent='SENDING…';msg.textContent='';
  fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email,next:next})})
    .then(function(r){return r.json();})
    .then(function(){btn.textContent='LINK SENT';msg.textContent='Check your inbox. The link is valid for 30 minutes.';})
    .catch(function(){btn.disabled=false;btn.textContent='SEND SIGN-IN LINK';msg.textContent='Network error. Try again.';});
};
</script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add admin/login.html
git commit -m "feat(admin): magic-link sign-in page"
```

---

## Task 12: Admin orders endpoint

**Files:**
- Create: `api/admin/orders.js`

- [ ] **Step 1: Implement**

```js
// GET /api/admin/orders?status=pending|paid|rejected|shipped|all (default pending)
// GET /api/admin/orders?id=N — single order with audit log
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '../_lib/session.js';

const STATUS_MAP = {
  pending: 'pending_verification',
  paid: 'paid',
  rejected: 'rejected',
  shipped: 'shipped',
};

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  try { await requireAdmin(req); }
  catch { return res.status(401).json({ error: 'Unauthenticated.' }); }

  const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  if (req.query.id) {
    const id = Number.parseInt(req.query.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Bad id.' });
    const { data: order } = await supa.from('orders').select('*').eq('id', id).maybeSingle();
    if (!order) return res.status(404).json({ error: 'Not found.' });
    const { data: audit } = await supa.from('order_audit')
      .select('*').eq('order_id', id).order('created_at', { ascending: false });
    return res.status(200).json({ order, audit: audit || [] });
  }

  const status = req.query.status || 'pending';
  const limit  = Math.min(Number.parseInt(req.query.limit, 10) || 50, 100);

  let q = supa.from('orders').select('*').order('created_at', { ascending: false }).limit(limit);
  if (status !== 'all') {
    const dbStatus = STATUS_MAP[status];
    if (!dbStatus) return res.status(400).json({ error: 'Bad status filter.' });
    q = q.eq('status', dbStatus);
  }
  if (req.query.before) q = q.lt('created_at', req.query.before);

  const { data, error } = await q;
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ orders: data || [] });
}
```

- [ ] **Step 2: Syntax-check**

Run: `node --check api/admin/orders.js`
Expected: silent.

- [ ] **Step 3: Commit**

```bash
git add api/admin/orders.js
git commit -m "feat(api): admin orders list + detail"
```

---

## Task 13: Admin order-action endpoint

**Files:**
- Create: `api/admin/order-action.js`

- [ ] **Step 1: Implement**

```js
// POST { orderId, action: 'approve'|'reject'|'ship'|'note', payload?: {...} }
import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '../_lib/session.js';
import {
  sendCustomerApproved, sendCustomerRejected, sendCustomerShipped,
} from '../_lib/mailer.js';

const TRANSITIONS = {
  approve: { from: 'pending_verification', to: 'paid'      },
  reject:  { from: 'pending_verification', to: 'rejected'  },
  ship:    { from: 'paid',                 to: 'shipped'   },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  let session;
  try { session = await requireAdmin(req); }
  catch { return res.status(401).json({ error: 'Unauthenticated.' }); }

  const { orderId, action, payload } = req.body || {};
  const id = Number.parseInt(orderId, 10);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'Bad orderId.' });

  const supa = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const { data: order } = await supa.from('orders').select('*').eq('id', id).maybeSingle();
  if (!order) return res.status(404).json({ error: 'Order not found.' });

  if (action === 'note') {
    const notes = String((payload && payload.notes) || '').slice(0, 4000);
    await supa.from('orders').update({ admin_notes: notes }).eq('id', id);
    await supa.from('order_audit').insert({
      order_id: id, actor: session.email, action: 'note', detail: notes.slice(0, 200),
    });
    return res.status(200).json({ ok: true });
  }

  const t = TRANSITIONS[action];
  if (!t) return res.status(400).json({ error: 'Unknown action.' });

  // Idempotence — if already in target state, return ok without re-emailing
  if (order.status === t.to) return res.status(200).json({ ok: true, already: true });
  if (order.status !== t.from) {
    return res.status(409).json({ error: `Cannot ${action} from status ${order.status}.` });
  }

  const update = { status: t.to };
  let detail = '';
  if (action === 'reject') {
    update.rejection_reason = String((payload && payload.reason) || '').slice(0, 1000);
    detail = update.rejection_reason;
  }
  if (action === 'ship') {
    update.dispatch_tracking = String((payload && payload.tracking) || '').slice(0, 200);
    detail = update.dispatch_tracking;
    if (!update.dispatch_tracking) return res.status(400).json({ error: 'Tracking number required.' });
  }

  const { error } = await supa.from('orders').update(update).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });

  await supa.from('order_audit').insert({
    order_id: id, actor: session.email, action, detail,
  });

  // Email customer (best-effort)
  const updatedOrder = { ...order, ...update };
  if (action === 'approve') sendCustomerApproved({ to: order.email, order: updatedOrder }).catch(e => console.error(e));
  if (action === 'reject')  sendCustomerRejected({ to: order.email, order: updatedOrder, reason: update.rejection_reason }).catch(e => console.error(e));
  if (action === 'ship')    sendCustomerShipped({ to: order.email, order: updatedOrder, tracking: update.dispatch_tracking }).catch(e => console.error(e));

  return res.status(200).json({ ok: true, status: t.to });
}
```

- [ ] **Step 2: Syntax-check**

Run: `node --check api/admin/order-action.js`
Expected: silent.

- [ ] **Step 3: Commit**

```bash
git add api/admin/order-action.js
git commit -m "feat(api): admin order-action approve/reject/ship/note"
```

---

## Task 14: Admin shared client + dashboard list

**Files:**
- Create: `admin/admin.js`
- Create: `admin/index.html`

- [ ] **Step 1: `admin/admin.js`**

```js
// admin/admin.js — shared admin client helpers
window.ADMIN = (function(){
  function fmtINR(n){return '₹'+Number(n||0).toLocaleString('en-IN');}
  function fmtDate(s){if(!s)return '—';var d=new Date(s);return d.toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'});}
  function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
  function statusPill(s){
    var color={'pending_verification':'#C8A97E','paid':'#7a9a6d','rejected':'#c44','shipped':'#4a8fbb'}[s]||'#888';
    var label={'pending_verification':'PENDING','paid':'PAID','rejected':'REJECTED','shipped':'SHIPPED'}[s]||s;
    return '<span style="display:inline-block;padding:3px 9px;font-size:9px;font-weight:600;letter-spacing:.14em;background:'+color+';color:#fff">'+esc(label)+'</span>';
  }
  function api(path,opts){
    return fetch(path,opts).then(function(r){
      if(r.status===401){location.href='/admin/login.html?next='+encodeURIComponent(location.pathname+location.search);throw new Error('UNAUTH');}
      return r.json().then(function(d){return{status:r.status,d:d};});
    });
  }
  function requireSession(then){
    api('/api/admin/me').then(function(res){
      if(res.status===200&&res.d.email){then(res.d.email);}
    }).catch(function(){});
  }
  function logout(){
    fetch('/api/admin/logout',{method:'POST'}).then(function(){location.href='/admin/login.html';});
  }
  return {fmtINR:fmtINR,fmtDate:fmtDate,esc:esc,statusPill:statusPill,api:api,requireSession:requireSession,logout:logout};
})();
```

- [ ] **Step 2: `admin/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Orders — Admin</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  body{margin:0;font-family:'DM Sans',sans-serif;background:#FAFAF7;color:#1a1a1a}
  header{background:#1a1a1a;color:#FAFAF7;padding:14px 24px;display:flex;justify-content:space-between;align-items:center}
  header h1{font-family:'Cormorant Garamond',serif;font-weight:400;font-size:22px;margin:0}
  header button{background:none;border:1px solid rgba(250,250,247,.3);color:#FAFAF7;font-size:10px;letter-spacing:.18em;padding:7px 14px;cursor:pointer}
  main{max-width:1200px;margin:0 auto;padding:24px}
  .filters{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:18px}
  .filters button{font-size:10px;letter-spacing:.16em;padding:8px 14px;background:transparent;border:1px solid #d4cfc8;cursor:pointer}
  .filters button.on{background:#1a1a1a;color:#FAFAF7;border-color:#1a1a1a}
  table{width:100%;border-collapse:collapse;background:#fff}
  th,td{text-align:left;padding:12px;font-size:13px;border-bottom:1px solid #e8e3dc;vertical-align:top}
  th{font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:#888;background:#fafaf7}
  tbody tr:hover{background:#fafaf7;cursor:pointer}
  td.utr{font-family:'DM Mono',monospace;letter-spacing:.08em}
  .empty{padding:60px 24px;text-align:center;color:#888;font-style:italic}
</style>
</head>
<body>
<header><h1>Orders</h1><div><span id="who" style="font-size:11px;letter-spacing:.1em;margin-right:14px"></span><button onclick="ADMIN.logout()">SIGN OUT</button></div></header>
<main>
  <div class="filters" id="filters"></div>
  <table id="tbl"><thead><tr><th>Ref</th><th>Date</th><th>Customer</th><th>Items</th><th>Total</th><th>UTR</th><th>Status</th></tr></thead><tbody id="rows"></tbody></table>
  <div class="empty" id="empty" style="display:none">No orders match this filter.</div>
</main>
<script src="/admin/admin.js"></script>
<script>
var FILTERS=[['pending','Pending'],['paid','Paid'],['shipped','Shipped'],['rejected','Rejected'],['all','All']];
var current='pending';
function renderFilters(){
  document.getElementById('filters').innerHTML=FILTERS.map(function(f){
    return '<button class="'+(f[0]===current?'on':'')+'" data-k="'+f[0]+'">'+f[1].toUpperCase()+'</button>';
  }).join('');
  document.querySelectorAll('.filters button').forEach(function(b){
    b.addEventListener('click',function(){current=b.dataset.k;renderFilters();load();});
  });
}
function load(){
  ADMIN.api('/api/admin/orders?status='+encodeURIComponent(current)).then(function(res){
    var orders=(res.d&&res.d.orders)||[];
    if(!orders.length){document.getElementById('rows').innerHTML='';document.getElementById('empty').style.display='block';return;}
    document.getElementById('empty').style.display='none';
    document.getElementById('rows').innerHTML=orders.map(function(o){
      return '<tr onclick="location.href=\'/admin/order.html?id='+o.id+'\'">'+
        '<td><strong>'+ADMIN.esc(o.ref||('#'+o.id))+'</strong></td>'+
        '<td>'+ADMIN.fmtDate(o.created_at)+'</td>'+
        '<td>'+ADMIN.esc(o.email||'—')+'</td>'+
        '<td style="max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+ADMIN.esc(o.items||'')+'</td>'+
        '<td><strong>'+ADMIN.fmtINR(o.total)+'</strong></td>'+
        '<td class="utr">'+ADMIN.esc(o.utr||'—')+'</td>'+
        '<td>'+ADMIN.statusPill(o.status)+'</td>'+
        '</tr>';
    }).join('');
  });
}
ADMIN.requireSession(function(email){document.getElementById('who').textContent=email;renderFilters();load();});
</script>
</body>
</html>
```

- [ ] **Step 3: Commit**

```bash
git add admin/admin.js admin/index.html
git commit -m "feat(admin): orders list dashboard"
```

---

## Task 15: Admin order detail page

**Files:**
- Create: `admin/order.html`

- [ ] **Step 1: Implement**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Order — Admin</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  body{margin:0;font-family:'DM Sans',sans-serif;background:#FAFAF7;color:#1a1a1a}
  header{background:#1a1a1a;color:#FAFAF7;padding:14px 24px;display:flex;justify-content:space-between;align-items:center}
  header h1{font-family:'Cormorant Garamond',serif;font-weight:400;font-size:22px;margin:0}
  header a,header button{color:#FAFAF7;text-decoration:none;border:1px solid rgba(250,250,247,.3);font-size:10px;letter-spacing:.18em;padding:7px 14px;cursor:pointer;background:transparent}
  main{max-width:1200px;margin:0 auto;padding:24px;display:grid;grid-template-columns:2fr 1fr;gap:24px}
  @media(max-width:900px){main{grid-template-columns:1fr}}
  section{background:#fff;border:1px solid #e8e3dc;padding:20px}
  h2{font-family:'Cormorant Garamond',serif;font-weight:500;font-size:18px;margin:0 0 12px;letter-spacing:-.01em}
  .row{display:grid;grid-template-columns:120px 1fr;gap:8px;font-size:13px;padding:6px 0}
  .row span{color:#888;font-size:11px}
  .utr{font-family:'DM Mono',monospace;font-size:18px;letter-spacing:.16em;background:#F4F1EB;padding:10px 14px;display:inline-block;border:1px solid #e8e3dc}
  .audit{font-size:12px;color:#666}
  .audit li{padding:6px 0;border-bottom:1px solid #f0ede7;list-style:none}
  ul{padding:0;margin:0}
  textarea,input{width:100%;box-sizing:border-box;padding:9px;border:1px solid #d4cfc8;background:#fafaf7;font-family:inherit;font-size:13px;margin-top:6px}
  button.action{display:block;width:100%;padding:13px;font-size:11px;font-weight:600;letter-spacing:.18em;border:none;cursor:pointer;margin-bottom:8px}
  button.approve{background:#7a9a6d;color:#fff}
  button.reject{background:#c44;color:#fff}
  button.ship{background:#4a8fbb;color:#fff}
  button:disabled{opacity:.4;cursor:not-allowed}
  .msg{margin-top:8px;font-size:12px;color:#666;min-height:16px}
</style>
</head>
<body>
<header><h1>Order detail</h1><div><a href="/admin/index.html">← BACK</a> <button onclick="ADMIN.logout()">SIGN OUT</button></div></header>
<main>
  <div>
    <section id="orderInfo"></section>
    <section style="margin-top:24px"><h2>Audit log</h2><ul id="audit" class="audit"></ul></section>
  </div>
  <section>
    <h2>Actions</h2>
    <div id="actionPanel"></div>
    <h2 style="margin-top:24px">Internal notes</h2>
    <textarea id="notes" rows="4" placeholder="Visible only to admins."></textarea>
    <button class="action" style="background:#1a1a1a;color:#fff;margin-top:8px" onclick="saveNotes()">SAVE NOTES</button>
    <div class="msg" id="msg"></div>
  </section>
</main>
<script src="/admin/admin.js"></script>
<script>
var ID=Number.parseInt(new URLSearchParams(location.search).get('id'),10);
var ORDER=null;
function render(o,audit){
  ORDER=o;
  document.getElementById('orderInfo').innerHTML=
    '<h2>'+ADMIN.esc(o.ref||('#'+o.id))+' '+ADMIN.statusPill(o.status)+'</h2>'+
    '<div class="row"><span>Created</span><div>'+ADMIN.fmtDate(o.created_at)+'</div></div>'+
    '<div class="row"><span>Customer</span><div>'+ADMIN.esc(o.email||'—')+'</div></div>'+
    '<div class="row"><span>Total</span><div><strong>'+ADMIN.fmtINR(o.total)+'</strong>'+(o.coupon?' (coupon '+ADMIN.esc(o.coupon)+')':'')+'</div></div>'+
    '<div class="row"><span>Items</span><div>'+ADMIN.esc(o.items||'—')+'</div></div>'+
    '<div class="row"><span>Method</span><div>'+ADMIN.esc(o.payment_method||'—')+'</div></div>'+
    '<div class="row"><span>UTR</span><div><span class="utr">'+ADMIN.esc(o.utr||'—')+'</span> <button onclick="navigator.clipboard&&navigator.clipboard.writeText(\''+ADMIN.esc(o.utr||'')+'\')" style="margin-left:8px;font-size:10px;padding:6px 10px;border:1px solid #d4cfc8;background:#fff;cursor:pointer">COPY</button></div></div>'+
    '<div class="row"><span>Address</span><div>'+ADMIN.esc(o.shipping_address||'(not provided)')+'</div></div>'+
    (o.dispatch_tracking?'<div class="row"><span>Tracking</span><div>'+ADMIN.esc(o.dispatch_tracking)+'</div></div>':'')+
    (o.rejection_reason?'<div class="row"><span>Rejected</span><div>'+ADMIN.esc(o.rejection_reason)+'</div></div>':'');
  document.getElementById('audit').innerHTML=(audit||[]).map(function(a){
    return '<li><strong>'+ADMIN.esc(a.action)+'</strong> · '+ADMIN.esc(a.actor||'system')+' · '+ADMIN.fmtDate(a.created_at)+(a.detail?'<br><span style="color:#999">'+ADMIN.esc(a.detail)+'</span>':'')+'</li>';
  }).join('');
  document.getElementById('notes').value=o.admin_notes||'';
  renderActions(o);
}
function renderActions(o){
  var h='';
  if(o.status==='pending_verification'){
    h+='<button class="action approve" onclick="act(\'approve\')">APPROVE — MARK PAID</button>';
    h+='<label style="font-size:11px;color:#6a6560">Rejection reason</label><textarea id="rejReason" rows="2" placeholder="UTR not received, amount mismatch…"></textarea>';
    h+='<button class="action reject" onclick="act(\'reject\',{reason:document.getElementById(\'rejReason\').value})">REJECT</button>';
  } else if(o.status==='paid'){
    h+='<label style="font-size:11px;color:#6a6560">Tracking number</label><input id="trk" placeholder="ABCD1234567">';
    h+='<button class="action ship" onclick="act(\'ship\',{tracking:document.getElementById(\'trk\').value})">MARK SHIPPED</button>';
  } else {
    h+='<p style="font-size:12px;color:#888">No further actions for status <strong>'+ADMIN.esc(o.status)+'</strong>.</p>';
  }
  document.getElementById('actionPanel').innerHTML=h;
}
function act(action,payload){
  if(!confirm('Confirm '+action+'?'))return;
  ADMIN.api('/api/admin/order-action',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId:ID,action:action,payload:payload||{}})}).then(function(res){
    if(res.status!==200){document.getElementById('msg').textContent='Error: '+(res.d.error||'unknown');return;}
    load();
  });
}
function saveNotes(){
  ADMIN.api('/api/admin/order-action',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId:ID,action:'note',payload:{notes:document.getElementById('notes').value}})}).then(function(){
    document.getElementById('msg').textContent='Notes saved.';
  });
}
function load(){
  ADMIN.api('/api/admin/orders?id='+ID).then(function(res){
    if(res.status!==200){document.getElementById('orderInfo').innerHTML='<p>Order not found.</p>';return;}
    render(res.d.order,res.d.audit);
  });
}
ADMIN.requireSession(function(){load();});
</script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add admin/order.html
git commit -m "feat(admin): order detail + approve/reject/ship UI"
```

---

## Task 16: Vercel rewrites

**Files:**
- Modify: `vercel.json`

- [ ] **Step 1: Add admin clean-URL rewrites**

Edit `vercel.json` so the `rewrites` array becomes:

```json
{
  "outputDirectory": ".",
  "cleanUrls": true,
  "functions": {
    "api/*.js":         { "maxDuration": 10 },
    "api/admin/*.js":   { "maxDuration": 10 }
  },
  "rewrites": [
    { "source": "/about",      "destination": "/index.html" },
    { "source": "/coa",        "destination": "/index.html" },
    { "source": "/contact",    "destination": "/index.html" },
    { "source": "/shop",       "destination": "/index.html" },
    { "source": "/catalogue",  "destination": "/catalogue.html" },
    { "source": "/calculator", "destination": "/calculator.html" },
    { "source": "/admin",      "destination": "/admin/index.html" },
    { "source": "/admin/login","destination": "/admin/login.html" },
    { "source": "/admin/order","destination": "/admin/order.html" }
  ]
}
```

- [ ] **Step 2: Validate JSON**

Run: `python3 -c "import json,sys;json.load(open('vercel.json'));print('OK')"`
Expected: prints `OK`.

- [ ] **Step 3: Commit**

```bash
git add vercel.json
git commit -m "chore(deploy): admin rewrites + nested-api function config"
```

---

## Task 17: End-to-end Playwright smoke

**Files:**
- Create: `tests/smoke/e2e.md` (a manual checklist — automation is the next iteration)

- [ ] **Step 1: Write the checklist**

```md
# UPI + Admin smoke checklist

Pre-reqs: `npm run dev` on http://localhost:3000 with `.env.local` populated by `vercel env pull`.

## Customer flow
1. Open `/`, add BPC-157 to cart.
2. Open cart, type `FIRST5` → Apply → enter your email → click Send → check inbox → enter the OTP → click Verify. Coupon line should read `FIRST5 applied`.
3. Type a contact email in the cart's `Contact email` field.
4. Click `Pay via UPI`. Modal opens, QR renders (or fallback link), UPI ID shows.
5. Click `I've paid — enter UTR`. Type `123456789012`. Click `CONFIRM ORDER`.
6. Modal switches to "Order placed" with a reference like `ABL-X7K2P9QM`.
7. Inbox: customer "received" email, admin alert email. Both arrive within ~30 s.

## Admin flow
8. Click the link in the admin email. Should land on `/admin/order.html?id=...` after one redirect via `/api/admin/auth`.
9. Browser should be sitting on the order detail page; the audit log shows `placed` row.
10. Click `APPROVE — MARK PAID`. Confirm dialog. Status pill flips to `PAID`. Audit log gains an `approve` row. Customer inbox: "Order confirmed" email.
11. Click `MARK SHIPPED`, enter `ABCD123`, confirm. Status flips to `SHIPPED`. Audit row added. Customer inbox: "Order shipped" email.
12. Sign out from the header. Reload `/admin/index.html`. Should redirect to `/admin/login.html`.

## Negative paths
13. Visit `/admin/index.html` in a private window without a session — should redirect to login.
14. Submit a UTR that's < 12 digits — modal should refuse without hitting the network.
15. With FIRST5 verified once, place an order, then try to verify FIRST5 again on a fresh cart — the OTP `verified` flag is now consumed, so the OTP request flow runs anew but `coupon_usage` already has the email, so verify-coupon returns `Already used`.
```

- [ ] **Step 2: Commit**

```bash
git add tests/smoke/e2e.md
git commit -m "docs(smoke): manual checklist for UPI + admin flow"
```

---

## Task 18: Spec self-review pass

This task is for the implementer (you) to read the spec and walk every requirement against the code that was just written.

- [ ] **Step 1: Re-read `docs/superpowers/specs/2026-04-26-upi-admin-flow-design.md`**

- [ ] **Step 2: Verify each spec section has corresponding code**

| Spec section | Where it landed |
|---|---|
| §3.1 customer modal | Task 7 (`payViaUpi` in `shared.js` + `index.html`) |
| §3.2 server validation | Task 6 (`api/place-order.js`) |
| §3.3 failure modes (UTR collision, mismatched total) | Task 6 — UTR via DB unique index, total via `priceItems` recompute |
| §4.1 magic-link auth | Tasks 9–10 (`/api/admin/login`, `/api/admin/auth`) |
| §4.2 dashboard list | Task 14 (`admin/index.html`) |
| §4.3 order detail | Task 15 (`admin/order.html`) |
| §4.4 order-action transitions | Task 13 (`api/admin/order-action.js`) |
| §5 schema | Task 1 (`supabase-schema.sql`) |
| §6 file list | Tasks 2, 4, 3, 5, 6, 9, 10, 11, 12, 13, 14, 15 — every file in §6 has a task |
| §7 env vars | Documented in spec; runtime read in Tasks 5, 6, 9, 10 |
| §8 removals | Task 8 (Razorpay) + replacement in Task 7 (bankInfo block) |
| §9 testing | Tasks 0, 2, 4, 17 |

- [ ] **Step 3: Run all unit tests + syntax check + smoke checklist**

```bash
npm test
node --check api/place-order.js api/admin/login.js api/admin/auth.js api/admin/logout.js api/admin/me.js api/admin/orders.js api/admin/order-action.js api/_lib/session.js api/_lib/catalogue.js api/_lib/mailer.js api/config.js
```

Then walk `tests/smoke/e2e.md` against `vercel dev`.

- [ ] **Step 4: Final commit if anything moved**

```bash
git add -A
git commit -m "chore: post-review fixes"
```

---

## Self-review (plan author)

- **Spec coverage:** every numbered section in the spec maps to at least one task above (audit table in Task 18).
- **Placeholder scan:** no "TBD"/"TODO" inside steps. Every code-changing step contains the actual code.
- **Type / naming consistency:** `requireAdmin`, `setSessionCookie`, `clearSessionCookie`, `priceItems`, `applyCoupon`, `sendAdminAlert`, `sendCustomerPlaced`, `sendCustomerApproved`, `sendCustomerRejected`, `sendCustomerShipped`, `sendAdminLoginLink`, `payViaUpi`, `submitUpiOrder` — names match across tasks. `STATUS_MAP` keys (`pending`/`paid`/`rejected`/`shipped`/`all`) match the filter chips in the dashboard. `TRANSITIONS` keys (`approve`/`reject`/`ship`) match the action UI buttons.
- **Order of operations:** schema (Task 1) precedes any code that reads/writes the new tables. The mailer (Task 3) and session (Task 4) are needed by all later API routes, so they sit before them. The UPI customer flow (Tasks 6–8) is independent of the admin flow, so it ships first as a smaller PR-sized chunk.
