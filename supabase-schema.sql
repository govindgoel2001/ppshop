-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- Safe to re-run — all statements use IF NOT EXISTS / IF EXISTS.

-- ─────────────────────────────────────────────
-- email_otps: one active OTP per email
-- ─────────────────────────────────────────────
create table if not exists email_otps (
  email        text primary key,
  otp          text not null,
  expires_at   timestamptz not null,
  verified     boolean not null default false,
  verified_at  timestamptz,
  fail_count   integer not null default 0,
  created_at   timestamptz not null default now()
);

-- Add columns to existing deployments
alter table email_otps add column if not exists verified_at timestamptz;
alter table email_otps add column if not exists fail_count integer not null default 0;

alter table email_otps enable row level security;
-- No public policies: only the service key (API functions) can read/write this table.

-- ─────────────────────────────────────────────
-- coupon_usage: permanent record of coupon use per email
-- ─────────────────────────────────────────────
create table if not exists coupon_usage (
  id         bigint generated always as identity primary key,
  email      text not null,
  code       text not null,
  order_id   text,
  created_at timestamptz not null default now(),
  constraint coupon_usage_email_code_unique unique (email, code)
);

alter table coupon_usage enable row level security;
-- No public policies: service key only.

-- Remove old visitor_id column if it exists from previous version
alter table coupon_usage drop column if exists visitor_id;

-- ─────────────────────────────────────────────
-- orders: order ledger. Created here so a fresh deploy works.
-- ─────────────────────────────────────────────
create table if not exists orders (
  id              bigint generated always as identity primary key,
  items           text,
  total           numeric(10,2),
  coupon          text,
  payment_method  text,
  status          text default 'pending_verification',
  ebook           boolean default true,
  email           text,
  created_at      timestamptz not null default now()
);

alter table orders add column if not exists email text;
alter table orders add column if not exists ebook boolean default true;

alter table orders enable row level security;

-- Drop any overly permissive existing policies
drop policy if exists "Allow anon insert" on orders;
drop policy if exists "Allow all" on orders;
drop policy if exists "anon can insert orders" on orders;

-- Anon users can only INSERT (place an order), never read others' orders.
-- NOTE: total is client-supplied; treat it as untrusted in fulfillment.
create policy "anon can insert orders"
  on orders for insert
  to anon
  with check (true);

-- ─────────────────────────────────────────────
-- contact_submissions: contact form (used by index.html sendC)
-- ─────────────────────────────────────────────
create table if not exists contact_submissions (
  id         bigint generated always as identity primary key,
  name       text not null,
  email      text not null,
  subject    text,
  message    text not null,
  created_at timestamptz not null default now()
);

alter table contact_submissions enable row level security;

drop policy if exists "anon can insert contact" on contact_submissions;
create policy "anon can insert contact"
  on contact_submissions for insert
  to anon
  with check (length(name) > 0 and length(email) > 0 and length(message) > 0);

-- ─────────────────────────────────────────────
-- subscribers: newsletter (used by index.html subEmail)
-- ─────────────────────────────────────────────
create table if not exists subscribers (
  email      text primary key,
  created_at timestamptz not null default now()
);

alter table subscribers enable row level security;

drop policy if exists "anon can subscribe" on subscribers;
create policy "anon can subscribe"
  on subscribers for insert
  to anon
  with check (length(email) > 0);

-- ─────────────────────────────────────────────
-- blocked_emails: emails that bounced or abused the OTP system
-- ─────────────────────────────────────────────
create table if not exists blocked_emails (
  email      text primary key,
  reason     text,
  created_at timestamptz not null default now()
);

alter table blocked_emails enable row level security;
-- No public policies: service key only.

-- ─────────────────────────────────────────────
-- otp_attempts: rate limiting log (send + verify + record)
-- ─────────────────────────────────────────────
create table if not exists otp_attempts (
  id         bigint generated always as identity primary key,
  email      text,
  type       text not null, -- 'send' | 'verify' | 'record'
  ip         text,
  created_at timestamptz not null default now()
);

-- Existing deployments may have NOT NULL on email; record-rate uses ip-only with email NULL.
alter table otp_attempts alter column email drop not null;

alter table otp_attempts enable row level security;
-- No public policies: service key only.

-- Auto-clean records older than 24 hours via a scheduled Supabase function (optional)
-- or just let it grow — it'll be tiny at your traffic volume.

-- ─────────────────────────────────────────────
-- Indexes for performance
-- ─────────────────────────────────────────────
create index if not exists coupon_usage_email_idx on coupon_usage (email);
create index if not exists orders_email_idx       on orders (email);
create index if not exists otp_attempts_email_idx on otp_attempts (email);
create index if not exists otp_attempts_ip_idx    on otp_attempts (ip);
create index if not exists otp_attempts_type_time on otp_attempts (type, created_at);

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

-- ─────────────────────────────────────────────
-- users: Clerk-backed user base. Rows are written server-side by
-- app/api/sync-user (service key) whenever a signed-in session is seen.
-- id = Clerk user id (e.g. "user_2ab...").
-- ─────────────────────────────────────────────
create table if not exists users (
  id           text primary key,
  email        text,
  first_name   text,
  last_name    text,
  created_at   timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index if not exists users_email_idx on users (email);

alter table users enable row level security;
-- No public policies: only the service key (sync-user route) reads/writes this table.

-- ─────────────────────────────────────────────
-- User dashboard (/account): orders tied to Clerk accounts.
-- Status flow (set manually from the Supabase table editor for now):
--   initiated  → customer opened the WhatsApp chat with their cart
--   purchased  → payment received, order confirmed
--   shipped    → booked with Delhivery; put the AWB in dispatch_tracking
--   delivered  → done
--   cancelled  → shows a cancelled badge
-- eta is free text shown to the customer, e.g. "12 July" or "3–4 days".
-- ─────────────────────────────────────────────
alter table orders add column if not exists user_id text;
alter table orders add column if not exists eta     text;

create index if not exists orders_user_idx on orders (user_id);

-- Coupons become one-use-per-account (Clerk user), replacing the old
-- email-OTP verification flow. email column kept for legacy rows.
alter table coupon_usage add column if not exists user_id text;
create unique index if not exists coupon_usage_user_code_unique
  on coupon_usage (user_id, code) where user_id is not null;
