import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';
import { AdminOrders } from '@/components/AdminOrders';

export const metadata = { title: 'Orders Admin — AthenaBioLabs' };

const authEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default async function AdminOrdersPage() {
  if (!authEnabled) redirect('/');
  const user = await currentUser();
  if (!user) redirect('/sign-in');

  const allowed = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean);
  const emails = user.emailAddresses.map(e => e.emailAddress.toLowerCase());
  if (!emails.some(e => allowed.includes(e))) redirect('/');

  return <AdminOrders />;
}
