import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { PRODUCTS } from '@/lib/products';

export const runtime = 'nodejs';

function supa() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function makeRef(): string {
  const t = Date.now().toString(36).toUpperCase().slice(-5);
  const r = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `ABL-${t}${r}`;
}

// GET /api/orders — the signed-in user's own orders, newest first.
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const db = supa();
  if (!db) return NextResponse.json({ orders: [], skipped: 'supabase-not-configured' });

  const { data, error } = await db
    .from('orders')
    .select('id, ref, items, total, coupon, status, eta, dispatch_tracking, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data ?? [] });
}

// POST /api/orders — create an 'initiated' order when the customer opens
// the WhatsApp chat. Body: { items: [{id, vi, q}], coupon? }.
// Prices come from the server-side catalogue, never the client.
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let body: { items?: { id: number; vi: number; q: number }[]; coupon?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 });
  }

  const items = Array.isArray(body.items) ? body.items.slice(0, 40) : [];
  if (items.length === 0) return NextResponse.json({ error: 'empty cart' }, { status: 400 });

  const lines: string[] = [];
  let total = 0;
  for (const it of items) {
    const p = PRODUCTS.find(p => p.id === it.id);
    const v = p?.variants[it.vi];
    const q = Math.min(Math.max(Math.floor(it.q) || 0, 1), 50);
    if (!p || !v) return NextResponse.json({ error: 'unknown item' }, { status: 400 });
    total += v.pr * q;
    lines.push(`${p.name} ${v.ds} × ${q}`);
  }

  const db = supa();
  const ref = makeRef();
  if (!db) return NextResponse.json({ ok: true, ref, skipped: 'supabase-not-configured' });

  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    null;

  const coupon = body.coupon ? String(body.coupon).trim().toUpperCase().slice(0, 24) : null;
  if (coupon) {
    const { data: used } = await db
      .from('coupon_usage')
      .select('id')
      .eq('user_id', userId)
      .eq('code', coupon)
      .maybeSingle();
    if (used) {
      return NextResponse.json({ error: 'coupon already used on this account' }, { status: 409 });
    }
  }

  const { data: order, error } = await db
    .from('orders')
    .insert({
      ref,
      user_id: userId,
      email,
      items: lines.join('; '),
      total,
      coupon,
      status: 'initiated',
    })
    .select('id, ref')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (coupon) {
    await db
      .from('coupon_usage')
      .insert({ user_id: userId, email: email ?? '', code: coupon, order_id: String(order.id) });
  }

  return NextResponse.json({ ok: true, ref: order.ref, id: order.id });
}
