import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

// Upserts the signed-in Clerk user into the Supabase `users` table.
// Called client-side by <ClerkUserSync/> whenever a session is active.
export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    // Supabase not wired yet — succeed quietly so sign-in isn't blocked.
    return NextResponse.json({ ok: true, skipped: 'supabase-not-configured' });
  }

  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    null;

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase
    .from('users')
    .upsert(
      {
        id: userId,
        email,
        first_name: user?.firstName ?? null,
        last_name: user?.lastName ?? null,
        last_seen_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
