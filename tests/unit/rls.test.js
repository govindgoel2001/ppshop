// Regression: the publishable (anon) Supabase key must not be able to read
// any sensitive table. RLS is enabled with no public policies on these
// tables, so an accidental `create policy` would leak PII or auth state.
//
// Set SUPABASE_URL + SUPABASE_PUBLISHABLE_KEY (or SUPABASE_ANON_KEY) to run.
// Without those, the test skips.

import test from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';

const URL  = process.env.SUPABASE_URL;
const ANON = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;

const SHOULD_NOT_BE_READABLE = [
  'orders',
  'email_otps',
  'admin_sessions',
  'admin_login_tokens',
  'coupon_usage',
  'blocked_emails',
  'otp_attempts',
  'order_audit',
];

test('RLS — anon key cannot read sensitive tables', { skip: !URL || !ANON }, async () => {
  const sb = createClient(URL, ANON);
  for (const t of SHOULD_NOT_BE_READABLE) {
    const { data, error } = await sb.from(t).select('*').limit(1);
    // RLS rejecting (error) OR returning empty (data=[]) both pass.
    if (error) continue;
    assert.deepStrictEqual(
      data, [],
      `anon read of ${t} should be empty, got ${JSON.stringify(data).slice(0, 200)}`,
    );
  }
});
