import { createClient } from '@supabase/supabase-js';
import QRCode from 'qrcode';
import { PayClient } from '@/components/PayClient';
import { fmt } from '@/lib/products';

export const metadata = { title: 'Track your order — AthenaBioLabs' };
export const dynamic = 'force-dynamic';

const REF_RE = /^ABL-[A-Z0-9]{4,12}$/;

const STEPS = ['Chat initiated', 'Purchased', 'Shipped', 'Delivered'];

function stepOf(status: string | null): number {
  switch ((status ?? '').toLowerCase()) {
    case 'purchased':
    case 'confirmed':
    case 'paid':
    case 'verified':
      return 1;
    case 'shipped':
    case 'booked':
    case 'dispatched':
      return 2;
    case 'delivered':
      return 3;
    default:
      return 0;
  }
}

async function getOrder(ref: string) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  const db = createClient(url, key, { auth: { persistSession: false } });
  const { data } = await db
    .from('orders')
    .select('id, ref, items, total, status, utr, eta, dispatch_tracking, created_at')
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
              This link doesn&apos;t match any order. Check the link from your
              WhatsApp chat, or message us and we&apos;ll sort it out.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const statusLc = (order.status ?? '').toLowerCase();
  const step = stepOf(order.status);
  const cancelled = statusLc === 'cancelled';
  const paid = ['purchased', 'shipped', 'delivered', 'booked', 'dispatched', 'confirmed', 'paid', 'verified'].includes(statusLc);
  const claimed = statusLc === 'payment_claimed';

  const vpa = process.env.UPI_VPA ?? '';
  const payee = process.env.UPI_DISPLAY_NAME ?? 'AthenaBioLabs';
  const amount = Number(order.total ?? 0);

  const upiUrl =
    `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(payee)}` +
    `&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(order.ref ?? ref)}`;

  const showQr = !cancelled && !paid && !claimed && !!vpa;
  const qrSvg = showQr
    ? await QRCode.toString(upiUrl, { type: 'svg', margin: 1, width: 240, color: { dark: '#1A1712', light: '#FFFFFF' } })
    : null;

  return (
    <main className="pay">
      <div className="w">
        <div className="pay-card">
          <div className="pay-eyebrow">Order tracking</div>
          <h1>Order {order.ref}</h1>
          {order.items && <p className="pay-items">{order.items}</p>}
          <div className="pay-amount">{fmt(amount)}</div>

          {cancelled ? (
            <div className="acct-cancel" style={{ marginTop: 16 }}>Cancelled</div>
          ) : (
            <div className="acct-steps" style={{ margin: '22px 0 6px', textAlign: 'left' }}>
              {STEPS.map((label, i) => (
                <div key={label} className={'acct-step' + (i <= step ? ' done' : '') + (i === step ? ' now' : '')}>
                  <span className="dot" />
                  <span className="lbl">{label}</span>
                </div>
              ))}
            </div>
          )}

          {!cancelled && claimed && (
            <div className="pay-claimed">
              We&apos;ve received your payment details (UTR ending {String(order.utr ?? '').slice(-4)}) and are
              verifying them — this page will update as soon as it&apos;s confirmed.
            </div>
          )}

          {!cancelled && order.eta && step < 3 && (
            <div className="acct-eta" style={{ marginTop: 12 }}>Expected by <strong>{order.eta}</strong></div>
          )}

          {!cancelled && order.dispatch_tracking && (
            <a
              className="acct-track"
              style={{ marginTop: 12 }}
              href={`https://www.delhivery.com/track-v2/package/${encodeURIComponent(order.dispatch_tracking)}`}
              target="_blank"
              rel="noopener"
            >
              Track with Delhivery — AWB {order.dispatch_tracking}
            </a>
          )}

          {paid && (
            <div className="pay-done" style={{ marginTop: 14 }}>
              ✓ Payment received. Bookmark this page — it updates at every step.
            </div>
          )}

          {showQr && (
            <>
              {qrSvg && <div className="pay-qr" dangerouslySetInnerHTML={{ __html: qrSvg }} />}
              <a className="b b1 pay-upi-btn" href={upiUrl}>Pay {fmt(amount)} with any UPI app</a>
              <p className="pay-note">
                Scan with GPay, PhonePe, Paytm or any UPI app — the amount and order
                reference are pre-filled. Paying to <strong>{vpa}</strong>.
              </p>
              <PayClient orderRef={order.ref ?? ref} />
            </>
          )}
          {!cancelled && !paid && !claimed && !vpa && (
            <p className="pay-note">Payment details are being set up — please pay via the WhatsApp chat for now.</p>
          )}
        </div>
      </div>
    </main>
  );
}
