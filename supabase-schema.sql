-- Run this in your Supabase SQL editor (Dashboard → SQL Editor → New query)

-- Table: email_otps
-- Stores one active OTP per email. Upserted on each send request.
create table if not exists email_otps (
  email       text primary key,
  otp         text not null,
  expires_at  timestamptz not null,
  verified    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Table: coupon_usage
-- Permanently records which emails have used which coupon codes.
-- One row per (email, code) pair — unique constraint prevents double-use.
create table if not exists coupon_usage (
  id         bigint generated always as identity primary key,
  email      text not null,
  code       text not null,
  order_id   text,
  created_at timestamptz not null default now(),
  constraint coupon_usage_email_code_unique unique (email, code)
);

-- Add email column to orders if it doesn't exist
alter table orders add column if not exists email text;

-- Remove old visitor_id column from coupon_usage if it exists
-- (previously tracked by device, now tracked by verified email)
alter table coupon_usage drop column if exists visitor_id;

-- RLS: email_otps and coupon_usage are server-only (service key only)
-- The anon key should NOT have access to these tables.
alter table email_otps enable row level security;
alter table coupon_usage enable row level security;

-- No public policies — all access goes through the API functions using the service key.
-- This means even if someone finds your anon key, they cannot read/write OTPs or coupon records.
