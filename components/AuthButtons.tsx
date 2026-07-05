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
        <a href="/account">My orders</a>
        <span className="hdr-user">
          <UserButton afterSignOutUrl="/">
            <UserButton.MenuItems>
              <UserButton.Link label="My orders" labelIcon={<span>📦</span>} href="/account" />
            </UserButton.MenuItems>
          </UserButton>
        </span>
      </SignedIn>
    </>
  );
}
