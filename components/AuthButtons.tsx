'use client';

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

// Header account area. Only rendered when Clerk is configured.
export function AuthButtons() {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <a href="#" onClick={e => e.preventDefault()}>Sign in</a>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <span className="hdr-user">
          <UserButton afterSignOutUrl="/" />
        </span>
      </SignedIn>
    </>
  );
}
