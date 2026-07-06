import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'react-email';

const SITE = 'https://www.athenabiolabs.com';

export type OrderEmailStatus = 'payment_claimed' | 'purchased' | 'shipped' | 'delivered';

type Props = {
  status: OrderEmailStatus;
  orderRef: string;
  awb?: string | null;
  eta?: string | null;
};

const COPY: Record<OrderEmailStatus, { preview: string; heading: string }> = {
  payment_claimed: { preview: 'We got your payment details — verifying now.', heading: 'We got your payment details' },
  purchased: { preview: 'Payment verified — your order is confirmed.', heading: 'Payment verified ✓' },
  shipped: { preview: 'Your order is on its way.', heading: 'Your order has shipped' },
  delivered: { preview: 'Your order has been delivered.', heading: 'Delivered ✓' },
};

const ink = '#1A1712';
const gold = '#B8912F';
const muted = '#6F6753';

const styles = {
  body: { backgroundColor: '#F7F4EC', fontFamily: "Georgia, 'Times New Roman', serif", margin: 0, padding: 0 },
  container: { maxWidth: '520px', margin: '0 auto', padding: '32px 20px' },
  brand: { textAlign: 'center' as const, fontSize: '20px', color: ink, paddingBottom: '18px', margin: 0 },
  card: { backgroundColor: '#ffffff', border: '1px solid #E8E1CE', borderRadius: '14px', padding: '28px 26px' },
  h1: { fontSize: '20px', margin: '0 0 12px', color: ink, fontWeight: 700 },
  text: { fontSize: '14px', lineHeight: '1.75', color: '#332D22', margin: '0 0 12px' },
  button: {
    backgroundColor: ink,
    color: '#ffffff',
    fontSize: '13px',
    padding: '12px 26px',
    borderRadius: '999px',
    textDecoration: 'none',
    display: 'inline-block',
    marginTop: '6px',
  },
  footer: { textAlign: 'center' as const, fontSize: '11px', color: '#A79C82', marginTop: '18px', lineHeight: '1.6' },
};

export function OrderStatusEmail({ status, orderRef, awb, eta }: Props) {
  const c = COPY[status];
  const trackUrl = `${SITE}/pay/${orderRef}`;

  return (
    <Html lang="en">
      <Head />
      <Preview>{c.preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.brand}>
            <span style={{ color: gold }}>Athena</span>BioLabs
          </Text>

          <Section style={styles.card}>
            <Heading as="h1" style={styles.h1}>{c.heading}</Heading>

            {status === 'payment_claimed' && (
              <>
                <Text style={styles.text}>
                  Thanks! We&rsquo;ve received the UTR for order <strong>{orderRef}</strong> and are matching it
                  against our bank now. This usually takes under an hour during business hours.
                </Text>
                <Text style={styles.text}>You&rsquo;ll get another email the moment it&rsquo;s verified.</Text>
                <Button href={trackUrl} style={styles.button}>Track your order</Button>
              </>
            )}

            {status === 'purchased' && (
              <>
                <Text style={styles.text}>
                  Your payment for order <strong>{orderRef}</strong> is confirmed. We&rsquo;re preparing your
                  compounds for dispatch — cold-chain packed within 24 hours.
                </Text>
                {eta && <Text style={styles.text}>Expected delivery: <strong>{eta}</strong>.</Text>}
                <Button href={trackUrl} style={styles.button}>Track your order</Button>
              </>
            )}

            {status === 'shipped' && (
              <>
                <Text style={styles.text}>
                  Order <strong>{orderRef}</strong> left our facility in insulated cold-chain packaging.
                </Text>
                {awb && <Text style={styles.text}>Tracking number (Delhivery): <strong>{awb}</strong></Text>}
                <Button
                  href={awb ? `https://www.delhivery.com/track-v2/package/${encodeURIComponent(awb)}` : trackUrl}
                  style={styles.button}
                >
                  {awb ? 'Track with Delhivery' : 'Track your order'}
                </Button>
                {eta && <Text style={{ ...styles.text, marginTop: '14px' }}>Expected delivery: <strong>{eta}</strong>.</Text>}
              </>
            )}

            {status === 'delivered' && (
              <>
                <Text style={styles.text}>
                  Order <strong>{orderRef}</strong> has been delivered. Store lyophilised vials at −20°C; your
                  QR-linked COA is on each vial.
                </Text>
                <Text style={styles.text}>
                  Questions about reconstitution or storage? Just reply on WhatsApp — and if you&rsquo;re happy,
                  a delivery photo makes our day.
                </Text>
                <Button href={`${SITE}/proof`} style={styles.button}>See delivery photos</Button>
              </>
            )}

            <Hr style={{ borderColor: '#E8E1CE', margin: '20px 0 12px' }} />
            <Text style={{ ...styles.text, fontSize: '12px', color: muted, margin: 0 }}>
              Order ref <strong>{orderRef}</strong> · bookmark{' '}
              <Link href={trackUrl} style={{ color: gold }}>your tracking page</Link> — it updates at every step.
            </Text>
          </Section>

          <Text style={styles.footer}>
            All products are for in-vitro laboratory research only.
            <br />
            AthenaBioLabs · <Link href={SITE} style={{ color: gold }}>athenabiolabs.com</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default OrderStatusEmail;
