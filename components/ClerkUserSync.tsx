'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

// Renders nothing. When a user is signed in, records/refreshes their row
// in the Supabase `users` table via the server route (service key only).
export function ClerkUserSync() {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isSignedIn) return;
    fetch('/api/sync-user', { method: 'POST' }).catch(() => {});
  }, [isSignedIn, user?.id]);

  return null;
}
