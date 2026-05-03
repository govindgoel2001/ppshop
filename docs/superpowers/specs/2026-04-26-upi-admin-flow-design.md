# UPI QR Payment + Email-Driven Admin Approval — Designn

**Date:** 2026-04-26
**Status:** Approved (pending implementation plan)

## 1. Goals

1. Replace today's placeholder bank/UPI panel with a real, self-service UPI QR payment flow.
2. Capture every order through a server-validated endpoint (kills the client-trusted-total bug).
3. Email an admin on every new order with a one-click link to a protected admin page.
4. Provide an admin dashboard to review full payment details and approve / reject / ship orders.
5. Notify the customer by email at every state change.

Non-goals (explicitly out of scope for this iteration):

- Auto-verification via a payment gateway (Razorpay/PayU). The admin manually verifies UTR vs amount.
- Multi-currency, multi-warehouse, or any inventory tracking beyond `oos:true` flags already in the catalogue.
- Refund flows. A rejected order today means "didn't get paid"; refunds are a manual offline activity.

## 2. State machine

```
                 ┌─→ rejected         (admin: payment did not match)
pending_verif. ──┤
                 └─→ paid ─→ shipped  (admin: payment confirmed, then dispatched)
```

Illegal transitions (server enforces): `rejected → *`, `pending_verification → shipped`, `paid → rejected` (use a refund instead).

## 3. Customer flow

### 3.1 Cart → "Pay via UPI"

The current `bankInfo` block and the disabled Razorpay button are removed from both `index.html` and `shared.js`. Each file gets its own copy of a new function `payViaUpi(total)` (the two files already duplicate the entire cart logic; consolidating them into one shared file is tracked in §10). Both copies open the same modal containing:

1. **Order reference** — 8-char `ABL-XXXXXXXX` slug generated client-side (also used as `tn=` field of the UPI URI).
2. **QR code** — generated client-side from `upi://pay?pa={UPI_VPA}&pn={UPI_DISPLAY_NAME}&am={total}&cu=INR&tn=ABL-{ref}`. The client fetches `UPI_VPA` and `UPI_DISPLAY_NAME` from `GET /api/config` (cached for the page lifetime) — env vars are server-side only, so this endpoint is the bridge. Rendered with [`qrcode-generator`](https://www.npmjs.com/package/qrcode-generator) loaded from jsDelivr (~1.5 KB). If the QR library fails to load, the modal falls back to a clickable `upi://` link plus the copy buttons — payment still works.
3. **UPI ID + amount + reference** displayed in copy-buttons below the QR for desktop users who can't scan.
4. **"I've paid — enter UTR"** button reveals a 12-digit UTR input.
5. On submit, the modal POSTs to `/api/place-order`.

### 3.2 `/api/place-order`

Request body:

```json
{
  "items": [{ "id": 4, "vi": 0, "q": 2 }],
  "coupon": "FIRST5" | "BULK10" | null,
  "contactEmail": "buyer@example.com",
  "otpEmail":     "buyer@example.com" | null,
  "shippingAddress": "free-text",
  "ebook": true,
  "ref":   "X7K2P9QM",
  "utr":   "123456789012"
}
```

Server steps:

1. **Validate** — items array shape, `contactEmail` matches the validator, `utr` is exactly 12 digits, `ref` is 8 alphanumerics, `coupon` is `null` / `FIRST5` / `BULK10`.
2. **Recompute total** — look up each item in `api/_lib/catalogue.js` (single canonical price table), sum, apply coupon. Reject if any item id is unknown or out-of-stock. The client never sets total.
3. **Validate coupon** — `BULK10` requires recomputed subtotal ≥ ₹20,000. `FIRST5` requires `email_otps.verified=true` AND `verified_at` ≤ 30 min for `otpEmail` (same window as `record-coupon`).
4. **Insert** `orders` row with `status='pending_verification'`, `ref`, `utr`, recomputed `total`, `submitted_at=now()`.
5. **If FIRST5**: insert `coupon_usage` row and consume the verified flag (`email_otps.verified=false`). Idempotent on `(email, code)` so duplicates return the existing row.
6. **Audit** — insert `order_audit` row with `actor='customer'`, `action='placed'`.
7. **Email two recipients** via `api/_lib/mailer.js`:
   - Admin alert: subject `New order ABL-XXXX — ₹N,NNN — pending verification`, body shows full details + link `${ADMIN_SITE_URL}/admin/order.html?id={orderId}`. Sent to every address in `ADMIN_EMAILS`.
   - Customer "received": subject `Order ABL-XXXX received — verifying payment`, body lists items, total, UTR, "we'll confirm within 24h".
8. Return `{ ok:true, ref, orderId }`.

The customer-facing modal then shows a success state with the reference.

### 3.3 Failure modes

| Failure | Customer sees | Server side-effect |
|---|---|---|
| Email send fails (admin or customer) | Order still saved; alert says "Order placed. If you don't see a confirmation email in 5 minutes, contact support." | `console.error`, no rollback. |
| Coupon validation fails | "Discount no longer valid — your order has been placed without it." | Order created with `coupon=null` and full `total`. |
| Catalogue recomputed total != client total ± ₹1 (rounding) | "Pricing changed since your cart was loaded — please refresh and try again." | No order created. |
| UTR collision (same UTR already in DB) | "We already have an order with this UTR — please re-check." | No order created. UTR is `unique` in DB. |

## 4. Admin flow

### 4.1 Auth (magic link)

```
1. Admin visits /admin → no cookie → redirected to /admin/login.html
2. Enters email, clicks Send Link → POST /api/admin/login {email}
3. Server: if email ∈ ADMIN_EMAILS env, generate 64-char base64url token,
            insert admin_login_tokens (expires_at = now + 30 min, used = false),
            email link "${ADMIN_SITE_URL}/api/admin/auth?token=…&next=/admin/index.html"
4. Admin clicks email → GET /api/admin/auth?token=…
   → validate (exists, !used, !expired), mark used=true,
     create admin_sessions row (token = 64-char random, expires_at = now + 7 days),
     Set-Cookie: abl_admin=<token>; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800
     302 → next URL.
5. Every /api/admin/* request validates the cookie via api/_lib/session.js's requireAdmin(req).
6. /admin/*.html pages call GET /api/admin/me on load — if 401, JS redirects to /admin/login.html.
```

The admin HTML pages are themselves public (nothing sensitive in the source). All data flows through cookie-gated API routes.

**Login throttling:** `/api/admin/login` is rate-limited per email (max 3 magic links / hour) using the existing `otp_attempts` table with `type='admin_login'`.

**Email allow-list defence-in-depth:** the magic link only succeeds if the *requested* email is in `ADMIN_EMAILS` AND the cookie session's email is in `ADMIN_EMAILS` at action time. Removing an admin from the env var revokes their access on the next request.

### 4.2 Dashboard — `/admin/index.html`

- Filter chips: `Pending` (default), `Paid`, `Shipped`, `Rejected`, `All`.
- Table columns: Ref · Date · Customer · Items (truncated to 60 chars) · Total · UTR · Status · `View →`.
- Sort newest first. Page size 50; cursor-based "Load more" via `?before={created_at}`.

### 4.3 Order detail — `/admin/order.html?id=N`

Two-column layout:

**Left — full details (read-only):**

| Section | Fields |
|---|---|
| Order | ref, status pill, created_at, total (server-recomputed), payment_method (`upi_qr`) |
| Customer | contactEmail, otpEmail (if different + verified-at), shipping address |
| Items | name · variant · qty · unit price · line total |
| Coupon | code, discount %, FIRST5-verified flag, verified_at |
| Payment | UPI VPA paid to, UTR (large monospaced + copy button), submitted_at |
| Audit | All `order_audit` rows newest first: `placed → approved (by admin@x.com 2026-04-26 10:14) → shipped (tracking ABCD)` |

**Right — action panel:**

- **Approve** button — confirms the dialog → `POST /api/admin/order-action {orderId, action:'approve'}`.
- **Reject** — opens a textarea for the reason → `POST … {action:'reject', reason}`.
- **Mark Shipped** — opens an input for the tracking number → `POST … {action:'ship', tracking}`.
- **Internal notes** — auto-saving textarea → `POST … {action:'note', notes}`. Not emailed.

Buttons gray out when the current status disallows the transition.

### 4.4 `/api/admin/order-action`

```js
// POST { orderId: number, action: 'approve'|'reject'|'ship'|'note', payload: {...} }
1. requireAdmin(req) → 401 if not logged in
2. Fetch order; if missing → 404
3. Switch on action:
   - 'approve': require status==='pending_verification' → status='paid'; mailer.sendApproved
   - 'reject':  require status==='pending_verification' → status='rejected', rejection_reason=payload.reason; mailer.sendRejected
   - 'ship':    require status==='paid' → status='shipped', dispatch_tracking=payload.tracking; mailer.sendShipped
   - 'note':    set admin_notes=payload.notes; no email
4. Insert order_audit { actor: session.email, action, detail: payload-summary }
5. Return updated order
```

**Idempotence:** if the action's target status is already set, return success without re-sending the email.

## 5. Schema deltas

```sql
-- orders
alter table orders add column if not exists ref               text unique;
alter table orders add column if not exists utr               text;
alter table orders add column if not exists shipping_address  text;
alter table orders add column if not exists dispatch_tracking text;
alter table orders add column if not exists rejection_reason  text;
alter table orders add column if not exists admin_notes       text;
alter table orders add column if not exists submitted_at      timestamptz default now();
create unique index if not exists orders_utr_unique
  on orders(utr) where utr is not null;

-- magic-link tokens
create table if not exists admin_login_tokens (
  token       text primary key,
  email       text not null,
  expires_at  timestamptz not null,
  used        boolean not null default false,
  created_at  timestamptz not null default now()
);
alter table admin_login_tokens enable row level security;

-- admin sessions
create table if not exists admin_sessions (
  token       text primary key,
  email       text not null,
  expires_at  timestamptz not null,
  created_at  timestamptz not null default now()
);
alter table admin_sessions enable row level security;
create index if not exists admin_sessions_email_idx on admin_sessions(email);

-- audit log
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
```

All four new tables / column additions have RLS enabled and **no** public policies — only the service key (used by `/api/*`) can touch them.

The existing `anon can insert orders` policy is removed: orders are now inserted by the service-key-backed `/api/place-order` only. The schema migration drops that policy.

## 6. New files

| Path | Purpose |
|---|---|
| `api/_lib/catalogue.js` | Canonical product + price table. Exports `priceItems(items)` and `applyCoupon(subtotal, code, isVerifiedFirst5)`. |
| `api/_lib/session.js` | `requireAdmin(req)` validates cookie against `admin_sessions`; `setSessionCookie(res, token)`; `clearSessionCookie(res)`. |
| `api/_lib/mailer.js` | Resend wrapper with 5 templates: `adminAlert`, `customerPlaced`, `customerApproved`, `customerRejected`, `customerShipped`. All sent `from: "AthenaBioLabs <support@athenabiolabs.com>"` (matches the existing `send-otp` sender). |
| `api/config.js` | GET → `{ upiVpa, upiDisplayName }`. Public endpoint, no auth, cache-friendly. |
| `api/place-order.js` | The new server-validated order endpoint. |
| `api/admin/login.js` | POST `{email}` → email magic link if email ∈ `ADMIN_EMAILS`. |
| `api/admin/auth.js` | GET `?token=&next=` → set session cookie, 302. |
| `api/admin/logout.js` | DELETE session, clear cookie. |
| `api/admin/me.js` | GET → `{email}` or 401. |
| `api/admin/orders.js` | GET list (`?status=&before=`) or single (`?id=`). |
| `api/admin/order-action.js` | POST `{orderId, action, payload}` → state transition + customer email. |
| `admin/login.html` | Email-input form, posts to `/api/admin/login`. |
| `admin/index.html` | Order list page. |
| `admin/order.html` | Order detail + action panel. |
| `admin/admin.js` | Shared helpers: `apiFetch` (auto-handles 401), status-pill renderer, formatters. |

## 7. New env vars

```
ADMIN_EMAILS=admin@athenabiolabs.com           # comma-separated allow-list
ADMIN_SITE_URL=https://athenabiolabs.com       # used to build absolute links in emails
UPI_VPA=athenabiolabs@okhdfcbank               # the receiving UPI ID
UPI_DISPLAY_NAME=AthenaBioLabs
```

Existing env (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `RESEND_API_KEY`) is reused.

## 8. Removals

- `index.html`: the `payNow()` Razorpay function and its `Pay Now` button. (The `SITE_CONFIG.razorpayKey` and `SITE_CONFIG.upi.*` placeholders remain so a future Razorpay integration can re-introduce that path; they're just unused.)
- `index.html` + `shared.js`: the inline `bankInfo` panel and its placeholder fallback.
- `shared.js`: client-side `SUPA.from('orders').insert(…)` call in `confirmBankTransfer`. The function is replaced by `payViaUpi(total)`.
- Schema: the `anon can insert orders` policy on the `orders` table.

## 9. Testing approach

- **Unit-ish (`node --check` and small fetch-stub harness)**: `api/_lib/catalogue.js`'s `priceItems` and `applyCoupon` for the four cases (no coupon, FIRST5 valid, FIRST5 invalid, BULK10 above/below threshold).
- **API smoke (Playwright + stubbed fetch)**: customer place-order success, place-order with mismatched total, admin login → magic link → /admin/me happy path, admin order-action approve/reject/ship.
- **Manual verification per CLAUDE.md**: viewport 375 / 768 / 1280 on the new modal, on `/admin/index.html`, on `/admin/order.html`. Confirm the QR scans on at least one UPI app before merging.

## 10. Open follow-ups (not in this spec)

- Migrate `index.html` and `shared.js` to a single source for `P[]` (today both files duplicate it; the new `api/_lib/catalogue.js` becomes the obvious canonical version, but client refactor is its own ticket).
- Two-admin sign-off for high-value orders (≥ ₹50k) — pure addition, no schema change beyond a `requires_secondary_approval` column.
- Razorpay re-introduction once the gateway account is approved — would slot in alongside `payViaUpi` without disturbing the admin flow.
