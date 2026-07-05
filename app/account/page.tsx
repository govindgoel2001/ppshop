import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { AccountClient } from '@/components/AccountClient';

export const metadata = { title: 'My Account — AthenaBioLabs' };

const authEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default async function AccountPage() {
  if (!authEnabled) redirect('/');
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  const name =
    user.firstName ??
    user.primaryEmailAddress?.emailAddress?.split('@')[0] ??
    'Researcher';

  return <AccountClient name={name} />;
}
