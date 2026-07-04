'use client';

import { ClerkProvider } from '@clerk/nextjs';

/** True when Clerk publishable key is set at build time. */
export const AUTH_ENABLED = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!AUTH_ENABLED) return <>{children}</>;
  return (
    <ClerkProvider
      appearance={{ variables: { colorPrimary: '#C8A97E' } }}
    >
      {children}
    </ClerkProvider>
  );
}
