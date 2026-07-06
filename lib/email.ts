// Transactional order emails via Resend's REST API (no SDK needed).
// Fire-and-forget: callers must never block or fail on email problems.

const FROM = 'AthenaBioLabs <support@athenabiolabs.com>';
const SITE = 'https://www.athenabiolabs.com';

function shell(title: string, body: string): string {
  return `<!doctype html><body style="margin:0;padding:0;background:#F7F4EC;font-family:Georgia,'Times New Roman',serif;">
  <div style="max-width:520px;margin:0 auto;padding:32px 20px;">
    <div style="text-align:center;padding-bottom:18px;">
      <span style="font-size:20px;letter-spacing:.02em;color:#1A1712;"><em style="color:#B8912F;font-style:normal;">Athena</em>BioLabs</span>
    </div>
    <div style="background:#ffffff;border:1px solid #E8E1CE;border-radius:14px;padding:28px 26px;">
      <h1 style="font-size:20px;margin:0 0 12px;color:#1A1712;">${title}</h1>
      <div style="font-size:14px;line-height:1.75;color:#332D22;">${body}</div>
    </div>
    <p style="text-align:center;font-size:11px;color:#A79C82;margin-top:18px;line-height:1.6;">
      All products are for in-vitro laboratory research only.<br/>
      AthenaBioLabs · <a href="${SITE}" style="color:#B8912F;">athenabiolabs.com</a>
    </p>
  </div></body>`;
}

const btn = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;margin-top:14px;background:#1A1712;color:#ffffff;text-decoration:none;font-size:13px;padding:12px 26px;border-radius:999px;">${label}</a>`;

export function statusEmail(status: string, ref: string, awb?: string | null, eta?: string | null): { subject: string; html: string } | null {
  switch (status) {
    case 'payment_claimed':
      return {
        subject: `Payment details received — order ${ref}`,
        html: shell('We got your payment details', `
          <p>Thanks! We've received the UTR for order <strong>${ref}</strong> and are matching it against our bank now. This usually takes under an hour during business hours.</p>
          <p>You'll get another email the moment it's verified.</p>
          ${btn(`${SITE}/account`, 'Track your order')}`),
      };
    case 'purchased':
      return {
        subject: `Payment verified — order ${ref} confirmed`,
        html: shell('Payment verified ✓', `
          <p>Your payment for order <strong>${ref}</strong> is confirmed. We're preparing your compounds for dispatch — cold-chain packed within 24 hours.</p>
          ${eta ? `<p>Expected delivery: <strong>${eta}</strong>.</p>` : ''}
          ${btn(`${SITE}/account`, 'Track your order')}`),
      };
    case 'shipped':
      return {
        subject: `Shipped — order ${ref} is on its way`,
        html: shell('Your order has shipped', `
          <p>Order <strong>${ref}</strong> left our facility in insulated cold-chain packaging.</p>
          ${awb ? `<p>Tracking number (Delhivery): <strong>${awb}</strong></p>${btn(`https://www.delhivery.com/track-v2/package/${encodeURIComponent(awb)}`, 'Track with Delhivery')}` : btn(`${SITE}/account`, 'Track your order')}
          ${eta ? `<p style="margin-top:14px;">Expected delivery: <strong>${eta}</strong>.</p>` : ''}`),
      };
    case 'delivered':
      return {
        subject: `Delivered — order ${ref}`,
        html: shell('Delivered ✓', `
          <p>Order <strong>${ref}</strong> has been delivered. Store lyophilised vials at −20°C; your QR-linked COA is on each vial.</p>
          <p>Questions about reconstitution or storage? Just reply on WhatsApp — and if you're happy, a delivery photo makes our day.</p>
          ${btn(`${SITE}/proof`, 'See delivery photos')}`),
      };
    default:
      return null;
  }
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
