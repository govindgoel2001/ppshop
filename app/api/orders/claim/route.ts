import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const REF_RE = /^ABL-[A-Z0-9]{4,12}$/;

// POST /api/orders/claim — attach a guest order to the signed-in account.
// Body: { ref }. Only works for orders that don't belong to anyone yet;
// refs are unguessable, so holding one proves the order is yours.
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return NextResponse.json({ error: 'not configured' }, { status: 503 });

  let body: { ref?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 });
  }

  const ref = String(body.ref ?? '').trim().toUpperCase();
  if (!REF_RE.test(ref)) {
    return NextResponse.json({ error: 'That doesn’t look like an order ref (ABL-…).' }, { status: 400 });
  }

  const db = createClient(url, key, { auth: { persistSession: false } });

  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    null;

  const { data, error } = await db
    .from('orders')
    .update({ user_id: userId, ...(email ? { email } : {}) })
    .eq('ref', ref)
    .is('user_id', null)
    .select('id, ref')
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) {
    return NextResponse.json(
      { error: 'No unclaimed order with that ref. If it’s already on another account, message us on WhatsApp.' },
      { status: 404 }
    );
  }

  await db.from('order_audit').insert({
    order_id: data.id,
    actor: userId,
    action: 'claimed',
    detail: `ref ${ref}`,
  });

  return NextResponse.json({ ok: true, ref: data.ref });
}
