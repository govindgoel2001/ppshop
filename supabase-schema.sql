-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- Safe to re-run — all statements use IF NOT EXISTS / IF EXISTS.

-- ─────────────────────────────────────────────
-- orders: main orders table
-- (if your Supabase project is fresh, create this first)
-- ─────────────────────────────────────────────
create table if not exists orders (
  id               bigserial primary key,
  email            text,
  customer_name    text,
  shipping_address text,
  items            text,
  total            numeric,
  coupon           text,
  payment_method   text default 'bank_transfer',
  status           text default 'pending_verification',
  ebook            boolean default true,
  confirm_token    text,
  utr              text,
  customer_notified boolean not null default false,
  created_at       timestamptz default now()
);

alter table orders enable row level security;
drop policy if exists "anon can insert orders" on orders;
create policy "anon can insert orders"
  on orders for insert to anon with check (true);

-- ─────────────────────────────────────────────
-- subscribers: email newsletter list
-- ─────────────────────────────────────────────
create table if not exists subscribers (
  id         bigserial primary key,
  email      text not null unique,
  created_at timestamptz default now()
);

alter table subscribers enable row level security;
create policy "anon can subscribe"
  on subscribers for insert to anon with check (true);

-- ─────────────────────────────────────────────
-- email_otps: one active OTP per email
-- ─────────────────────────────────────────────
create table if not exists email_otps (
  email       text primary key,
  otp         text not null,
  expires_at  timestamptz not null,
  verified    boolean not null default false,
  created_at  timestamptz not null default now()
);

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
-- orders: add email column, lock down RLS
-- ─────────────────────────────────────────────
alter table orders add column if not exists email text;
alter table orders add column if not exists customer_name text;
alter table orders add column if not exists shipping_address text;
alter table orders add column if not exists confirm_token text;
alter table orders add column if not exists utr text;
alter table orders add column if not exists customer_notified boolean not null default false;

alter table orders enable row level security;

-- Drop any overly permissive existing policies
drop policy if exists "Allow anon insert" on orders;
drop policy if exists "Allow all" on orders;
drop policy if exists "anon can insert orders" on orders;

-- Anon users can only INSERT (place an order), never read others' orders
create policy "anon can insert orders"
  on orders for insert
  to anon
  with check (true);

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
-- otp_attempts: rate limiting log (send + verify)
-- ─────────────────────────────────────────────
create table if not exists otp_attempts (
  id         bigint generated always as identity primary key,
  email      text not null,
  type       text not null, -- 'send' or 'verify'
  ip         text,
  created_at timestamptz not null default now()
);

alter table otp_attempts enable row level security;
-- No public policies: service key only.

-- Auto-clean records older than 24 hours via a scheduled Supabase function (optional)
-- or just let it grow — it'll be tiny at your traffic volume.

-- ─────────────────────────────────────────────
-- Indexes for performance
-- ─────────────────────────────────────────────
create index if not exists coupon_usage_email_idx on coupon_usage (email);
create index if not exists orders_email_idx on orders (email);

-- ─────────────────────────────────────────────
-- contact_submissions: website contact form
-- ─────────────────────────────────────────────
create table if not exists contact_submissions (
  id          bigserial primary key,
  name        text not null,
  email       text not null,
  subject     text,
  message     text not null,
  created_at  timestamptz default now()
);

-- ─────────────────────────────────────────────
-- Auto-trigger: send confirmation email when order is confirmed
--
-- Uses pg_net (built into Supabase) to POST to /api/order-webhook
-- whenever an order's status changes to 'confirmed'.
-- Covers: merchant updates status directly in Supabase dashboard.
-- The confirm-order.js email-link path works independently.
--
-- HOW TO RUN:
--   Supabase Dashboard → SQL Editor → paste and run this entire block.
--   Then add  WEBHOOK_SECRET=REPLACE_WITH_YOUR_WEBHOOK_SECRET
--   to your Vercel project environment variables.
-- ─────────────────────────────────────────────

-- Trigger function: fires after every UPDATE on orders
create or replace function _notify_order_confirmed()
returns trigger language plpgsql security definer as $$
begin
  if NEW.status = 'confirmed'
     and (OLD.status is null or OLD.status <> 'confirmed')
  then
    perform net.http_post(
      url     := 'https://athenabiolabs.com/api/order-webhook',
      headers := jsonb_build_object('Content-Type', 'application/json'),
      body    := jsonb_build_object(
        'type',       'UPDATE',
        'table',      'orders',
        'record',     to_jsonb(NEW),
        'old_record', to_jsonb(OLD)
      )::text
    );
  end if;
  return NEW;
end;
$$;

-- Attach trigger (drop first so re-running is safe)
drop trigger if exists trg_notify_order_confirmed on orders;
create trigger trg_notify_order_confirmed
  after update on orders
  for each row execute function _notify_order_confirmed();

