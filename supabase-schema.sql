-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- Safe to re-run — all statements use IF NOT EXISTS / IF EXISTS.

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

alter table orders enable row level security;

-- Drop any overly permissive existing policies
drop policy if exists "Allow anon insert" on orders;
drop policy if exists "Allow all" on orders;

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
-- Indexes for performance
-- ─────────────────────────────────────────────
create index if not exists coupon_usage_email_idx on coupon_usage (email);
create index if not exists orders_email_idx on orders (email);
