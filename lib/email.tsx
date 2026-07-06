// Transactional order emails: React Email templates rendered to HTML,
// delivered via Resend's REST API. Fire-and-forget: callers must never
// block or fail on email problems.

import { render } from '@react-email/render';
import { OrderStatusEmail, type OrderEmailStatus } from '@/emails/OrderStatusEmail';

const FROM = 'AthenaBioLabs <support@athenabiolabs.com>';

const SUBJECTS: Record<OrderEmailStatus, (ref: string) => string> = {
  payment_claimed: ref => `Payment details received — order ${ref}`,
  purchased: ref => `Payment verified — order ${ref} confirmed`,
  shipped: ref => `Shipped — order ${ref} is on its way`,
  delivered: ref => `Delivered — order ${ref}`,
};

export async function statusEmail(
  status: string,
  ref: string,
  awb?: string | null,
  eta?: string | null
): Promise<{ subject: string; html: string } | null> {
  if (!(status in SUBJECTS)) return null;
  const s = status as OrderEmailStatus;
  const html = await render(<OrderStatusEmail status={s} orderRef={ref} awb={awb} eta={eta} />);
  return { subject: SUBJECTS[s](ref), html };
}

/** Send without ever throwing — order flow must not depend on email. */
export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to) return;
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });
  } catch {
    // Swallow — status change already succeeded; email is best-effort.
  }
}
