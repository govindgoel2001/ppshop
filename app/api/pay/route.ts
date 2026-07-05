import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const REF_RE = /^ABL-[A-Z0-9]{4,12}$/;
const UTR_RE = /^\d{12}$/;

// POST /api/pay — customer claims a payment by submitting their UPI UTR.
// Body: { ref, utr }. Flips the order to payment_claimed; the admin
// verifies against the bank app and sets purchased in /admin/orders.
export async function POST(req: Request) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return NextResponse.json({ error: 'Payments are not set up yet.' }, { status: 503 });

  let body: { ref?: string; utr?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 });
  }

  const ref = String(body.ref ?? '').trim().toUpperCase();
  const utr = String(body.utr ?? '').trim();
  if (!REF_RE.test(ref)) return NextResponse.json({ error: 'Invalid order reference.' }, { status: 400 });
  if (!UTR_RE.test(utr)) return NextResponse.json({ error: 'UTR must be 12 digits.' }, { status: 400 });

  const db = createClient(url, key, { auth: { persistSession: false } });

  const { data: order } = await db
    .from('orders')
    .select('id, status')
    .eq('ref', ref)
    .maybeSingle();

  if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });

  const status = (order.status ?? '').toLowerCase();
  if (['purchased', 'shipped', 'delivered'].includes(status)) {
    return NextResponse.json({ error: 'This order is already paid.' }, { status: 409 });
  }
  if (status === 'cancelled') {
    return NextResponse.json({ error: 'This order was cancelled.' }, { status: 409 });
  }

  const { error } = await db
    .from('orders')
    .update({ status: 'payment_claimed', utr })
    .eq('id', order.id);

  if (error) {
    // 23505 = the unique index on utr caught a reused transaction id
    if (error.code === '23505') {
      return NextResponse.json({ error: 'This UTR has already been used on another order.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Could not save. Please try again.' }, { status: 500 });
  }

  await db.from('order_audit').insert({
    order_id: order.id,
    actor: 'customer',
    action: 'payment_claimed',
    detail: `utr ${utr}`,
  });

  return NextResponse.json({ ok: true });
}
