'use client';

import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';

// Only mounted when Clerk is configured. Guests can order directly —
// the account is pitched as a benefit (tracking + coupons), not a wall.
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

  const btnStyle: React.CSSProperties = {
    width: '100%',
    marginTop: 14,
    padding: '18px 40px',
    fontSize: 13,
    opacity: consent ? 1 : 0.5,
    cursor: consent ? 'pointer' : 'not-allowed',
  };

  return (
    <>
      <SignedOut>
        <button className="b b1" style={btnStyle} disabled={!consent} onClick={() => onOrder()}>
          Order on WhatsApp
        </button>
        <p style={{ marginTop: 8, fontSize: 11, color: '#6F6753', textAlign: 'center' }}>
          <SignInButton mode="modal">
            <a style={{ color: '#B8912F', cursor: 'pointer' }}>Sign in</a>
          </SignInButton>{' '}
          to track this order on your dashboard &amp; unlock the FIRST5 coupon.
        </p>
      </SignedOut>
      <SignedIn>
        <button className="b b1" style={btnStyle} disabled={!consent} onClick={() => onOrder(who)}>
          Order on WhatsApp
        </button>
      </SignedIn>
    </>
  );
}
