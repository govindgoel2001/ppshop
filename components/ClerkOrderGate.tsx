'use client';

import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';

// Only mounted when Clerk is configured. Enforces sign-in before the
// "Order on WhatsApp" button becomes available.
export function ClerkOrderGate({
  consent,
  onOrder,
}: {
  consent: boolean;
  onOrder: (who?: string) => void;
}) {
  const { user } = useUser();
  const who =
    user?.primaryEmailAddress?.emailAddress ??
    user?.fullName ??
    user?.id ??
    undefined;

  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="b b1" style={{ width: '100%', marginTop: 14, padding: '18px 40px', fontSize: 13 }}>
            Sign in to order
          </button>
        </SignInButton>
        <p style={{ marginTop: 8, fontSize: 11, color: '#6E6590', textAlign: 'center' }}>
          You need an account to place an order.
        </p>
      </SignedOut>
      <SignedIn>
        <button
          className="b b1"
          style={{ width: '100%', marginTop: 14, padding: '18px 40px', fontSize: 13, opacity: consent ? 1 : 0.5, cursor: consent ? 'pointer' : 'not-allowed' }}
          disabled={!consent}
          onClick={() => onOrder(who)}
        >
          Order on WhatsApp
        </button>
      </SignedIn>
    </>
  );
}
