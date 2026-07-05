import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const STATUSES = ['initiated', 'payment_claimed', 'purchased', 'shipped', 'delivered', 'cancelled'];

function supa() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

// Admin = signed-in Clerk user whose email is in ADMIN_EMAILS (comma-separated).
async function adminEmail(): Promise<string | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const allowed = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
  if (allowed.length === 0) return null;
  const user = await currentUser();
  const emails = (user?.emailAddresses ?? []).map(e => e.emailAddress.toLowerCase());
  const match = emails.find(e => allowed.includes(e));
  return match ?? null;
}

// GET /api/admin/orders — all recent orders.
export async function GET() {
  const admin = await adminEmail();
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const db = supa();
  if (!db) return NextResponse.json({ orders: [], skipped: 'supabase-not-configured' });

  const { data, error } = await db
    .from('orders')
    .select('id, ref, email, items, total, coupon, status, utr, eta, dispatch_tracking, admin_notes, created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data ?? [] });
}

// PATCH /api/admin/orders — update one order.
// Body: { id, status?, eta?, dispatch_tracking?, admin_notes? }
export async function PATCH(req: Request) {
  const admin = await adminEmail();
  if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const db = supa();
  if (!db) return NextResponse.json({ error: 'supabase not configured' }, { status: 503 });

  let body: {
    id?: number;
    status?: string;
    eta?: string | null;
    dispatch_tracking?: string | null;
    admin_notes?: string | null;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 });
  }

  const id = Number(body.id);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'bad id' }, { status: 400 });
  }

  const patch: Record<string, string | null> = {};
  if (body.status !== undefined) {
    const s = String(body.status).toLowerCase();
    if (!STATUSES.includes(s)) return NextResponse.json({ error: 'bad status' }, { status: 400 });
    patch.status = s;
  }
  if (body.eta !== undefined) patch.eta = body.eta ? String(body.eta).slice(0, 80) : null;
  if (body.dispatch_tracking !== undefined)
    patch.dispatch_tracking = body.dispatch_tracking
      ? String(body.dispatch_tracking).slice(0, 40)
      : null;
  if (body.admin_notes !== undefined)
    patch.admin_notes = body.admin_notes ? String(body.admin_notes).slice(0, 2000) : null;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'nothing to update' }, { status: 400 });
  }

  const { data, error } = await db
    .from('orders')
    .update(patch)
    .eq('id', id)
    .select('id, ref, email, items, total, coupon, status, utr, eta, dispatch_tracking, admin_notes, created_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await db.from('order_audit').insert({
    order_id: id,
    actor: admin,
    action: 'update',
    detail: JSON.stringify(patch),
  });

  return NextResponse.json({ ok: true, order: data });
}
