import { createClient } from '@supabase/supabase-js';
import QRCode from 'qrcode';
import { PayClient } from '@/components/PayClient';
import { fmt } from '@/lib/products';

export const metadata = { title: 'Pay for your order — AthenaBioLabs' };
export const dynamic = 'force-dynamic';

const REF_RE = /^ABL-[A-Z0-9]{4,12}$/;

async function getOrder(ref: string) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  const db = createClient(url, key, { auth: { persistSession: false } });
  const { data } = await db
    .from('orders')
    .select('id, ref, items, total, status, utr, created_at')
    .eq('ref', ref)
    .maybeSingle();
  return data;
}

export default async function PayPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref: raw } = await params;
  const ref = decodeURIComponent(raw).toUpperCase();

  const order = REF_RE.test(ref) ? await getOrder(ref) : null;

  if (!order) {
    return (
      <main className="pay">
        <div className="w">
          <div className="pay-card">
            <h1>Order not found</h1>
            <p className="pay-sub">
              This payment link doesn&apos;t match any order. Check the link from your
              WhatsApp chat, or message us and we&apos;ll sort it out.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const vpa = process.env.UPI_VPA ?? '';
  const payee = process.env.UPI_DISPLAY_NAME ?? 'AthenaBioLabs';
  const amount = Number(order.total ?? 0);

  const upiUrl =
    `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(payee)}` +
    `&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(order.ref ?? ref)}`;

  const qrSvg = vpa
    ? await QRCode.toString(upiUrl, { type: 'svg', margin: 1, width: 240, color: { dark: '#1A1712', light: '#FFFFFF' } })
    : null;

  const paid = ['purchased', 'shipped', 'delivered'].includes((order.status ?? '').toLowerCase());
  const claimed = (order.status ?? '').toLowerCase() === 'payment_claimed';

  return (
    <main className="pay">
      <div className="w">
        <div className="pay-card">
          <div className="pay-eyebrow">Secure order payment</div>
          <h1>Order {order.ref}</h1>
          {order.items && <p className="pay-items">{order.items}</p>}
          <div className="pay-amount">{fmt(amount)}</div>

          {paid ? (
            <div className="pay-done">✓ Payment received. Track your order on your <a href="/account">dashboard</a>.</div>
          ) : claimed ? (
            <div className="pay-claimed">
              We&apos;ve received your payment details (UTR ending {String(order.utr ?? '').slice(-4)}) and are verifying them.
              Your <a href="/account">dashboard</a> will update shortly.
            </div>
          ) : (
            <>
              {qrSvg ? (
                <>
                  <div className="pay-qr" dangerouslySetInnerHTML={{ __html: qrSvg }} />
                  <a className="b b1 pay-upi-btn" href={upiUrl}>Pay {fmt(amount)} with any UPI app</a>
                  <p className="pay-note">
                    Scan with GPay, PhonePe, Paytm or any UPI app — the amount and order
                    reference are pre-filled. Paying to <strong>{vpa}</strong>.
                  </p>
                </>
              ) : (
                <p className="pay-note">Payment details are being set up — please pay via the WhatsApp chat for now.</p>
              )}
              <PayClient orderRef={order.ref ?? ref} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
