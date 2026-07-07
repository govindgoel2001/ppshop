import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
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

const COPY: Record<OrderEmailStatus, { preview: string; heading: string; step: number }> = {
  payment_claimed: { preview: 'We got your payment details — verifying now.', heading: 'We got your payment details', step: 0 },
  purchased: { preview: 'Payment verified — your order is confirmed.', heading: 'Payment verified', step: 1 },
  shipped: { preview: 'Your order is on its way.', heading: 'Your order has shipped', step: 2 },
  delivered: { preview: 'Your order has been delivered.', heading: 'Delivered', step: 3 },
};

const STEPS = ['Confirmed', 'Purchased', 'Shipped', 'Delivered'];

const ink = '#1A1712';
const gold = '#B8912F';
const goldSoft = '#E3C878';
const ivory = '#F7F4EC';
const ivoryDeep = '#F4F0E5';
const border = '#E8E1CE';
const muted = '#6F6753';
const faint = '#A79C82';

const serif = "Georgia, 'Times New Roman', serif";
const sans = "Arial, Helvetica, sans-serif";

const st = {
  body: { backgroundColor: ivory, margin: 0, padding: 0 },
  container: { maxWidth: '520px', margin: '0 auto', padding: '36px 20px' },
  brand: { textAlign: 'center' as const, fontSize: '21px', fontFamily: serif, color: ink, margin: '0 0 6px', letterSpacing: '.01em' },
  brandRule: { width: '44px', borderColor: goldSoft, borderWidth: '1px', margin: '0 auto 22px' },
  card: { backgroundColor: '#ffffff', border: `1px solid ${border}`, borderRadius: '18px', padding: '0 0 30px', overflow: 'hidden' as const },
  hero: { backgroundColor: ivoryDeep, padding: '26px 0 0', textAlign: 'center' as const },
  vial: { width: '140px', height: '210px', borderRadius: '12px 12px 0 0', margin: '0 auto', display: 'block' },
  inner: { padding: '26px 30px 0' },
  eyebrow: { fontFamily: sans, fontSize: '10px', fontWeight: 700 as const, letterSpacing: '.26em', textTransform: 'uppercase' as const, color: gold, margin: '0 0 8px', textAlign: 'center' as const },
  h1: { fontFamily: serif, fontSize: '24px', fontWeight: 700 as const, color: ink, margin: '0 0 18px', textAlign: 'center' as const, letterSpacing: '-.01em' },
  text: { fontFamily: serif, fontSize: '14px', lineHeight: '1.8', color: '#332D22', margin: '0 0 12px' },
  stepDotDone: { display: 'inline-block', width: '10px', height: '10px', borderRadius: '10px', backgroundColor: gold },
  stepDotTodo: { display: 'inline-block', width: '10px', height: '10px', borderRadius: '10px', backgroundColor: border },
  stepLbl: { fontFamily: sans, fontSize: '9px', letterSpacing: '.08em', textTransform: 'uppercase' as const, margin: '6px 0 0' },
  etaChip: { backgroundColor: ivoryDeep, borderRadius: '10px', padding: '10px 16px', fontFamily: serif, fontSize: '13px', color: ink, margin: '4px 0 12px', textAlign: 'center' as const },
  button: { backgroundColor: ink, color: '#ffffff', fontFamily: sans, fontSize: '12px', fontWeight: 700 as const, letterSpacing: '.14em', textTransform: 'uppercase' as const, padding: '15px 34px', borderRadius: '999px', textDecoration: 'none', display: 'inline-block' },
  btnWrap: { textAlign: 'center' as const, margin: '6px 0 4px' },
  fine: { fontFamily: serif, fontSize: '12px', color: muted, margin: 0, textAlign: 'center' as const },
  footer: { textAlign: 'center' as const, fontFamily: sans, fontSize: '10.5px', color: faint, marginTop: '20px', lineHeight: '1.7' },
};

function StepRow({ step }: { step: number }) {
  return (
    <Section style={{ margin: '0 0 20px' }}>
      <Row>
        {STEPS.map((label, i) => (
          <Column key={label} style={{ width: '25%', textAlign: 'center' as const }}>
            <span style={i <= step ? st.stepDotDone : st.stepDotTodo} />
            <Text style={{ ...st.stepLbl, color: i <= step ? gold : faint, fontWeight: i === step ? 700 : 400 }}>{label}</Text>
          </Column>
        ))}
      </Row>
    </Section>
  );
}

export function OrderStatusEmail({ status, orderRef, awb, eta }: Props) {
  const c = COPY[status];
  const trackUrl = `${SITE}/pay/${orderRef}`;

  return (
    <Html lang="en">
      <Head />
      <Preview>{c.preview}</Preview>
      <Body style={st.body}>
        <Container style={st.container}>
          <Text style={st.brand}>
            <span style={{ color: gold }}>Athena</span>BioLabs
          </Text>
          <Hr style={st.brandRule} />

          <Section style={st.card}>
            <Section style={st.hero}>
              <Img src={`${SITE}/img/email/vial.jpg`} alt="AthenaBioLabs research vial" width="140" height="210" style={st.vial} />
            </Section>

            <Section style={st.inner}>
              <Text style={st.eyebrow}>Order update · {orderRef}</Text>
              <Heading as="h1" style={st.h1}>{c.heading}</Heading>

              <StepRow step={c.step} />

              {status === 'payment_claimed' && (
                <>
                  <Text style={st.text}>
                    Thanks! We&rsquo;ve received the UTR for order <strong>{orderRef}</strong> and are matching
                    it against our bank now — usually under an hour during business hours.
                  </Text>
                  <Text style={st.text}>You&rsquo;ll get another email the moment it&rsquo;s verified.</Text>
                </>
              )}

              {status === 'purchased' && (
                <Text style={st.text}>
                  Your payment for order <strong>{orderRef}</strong> is confirmed. We&rsquo;re preparing your
                  compounds for dispatch — cold-chain packed within 24 hours.
                </Text>
              )}

              {status === 'shipped' && (
                <>
                  <Text style={st.text}>
                    Order <strong>{orderRef}</strong> left our facility in insulated cold-chain packaging.
                  </Text>
                  {awb && (
                    <Text style={{ ...st.text, textAlign: 'center' as const }}>
                      Delhivery tracking number<br />
                      <strong style={{ fontSize: '16px', letterSpacing: '.04em' }}>{awb}</strong>
                    </Text>
                  )}
                </>
              )}

              {status === 'delivered' && (
                <>
                  <Text style={st.text}>
                    Order <strong>{orderRef}</strong> has been delivered. Store lyophilised vials at −20°C;
                    your QR-linked COA is on each vial.
                  </Text>
                  <Text style={st.text}>
                    Questions about reconstitution or storage? Just reply on WhatsApp — and if you&rsquo;re
                    happy, a delivery photo makes our day.
                  </Text>
                </>
              )}

              {eta && status !== 'delivered' && (
                <Section style={st.etaChip}>Expected delivery: <strong>{eta}</strong></Section>
              )}

              <Section style={st.btnWrap}>
                {status === 'shipped' && awb ? (
                  <Button href={`https://www.delhivery.com/track-v2/package/${encodeURIComponent(awb)}`} style={st.button}>
                    Track with Delhivery
                  </Button>
                ) : status === 'delivered' ? (
                  <Button href={`${SITE}/proof`} style={st.button}>See delivery photos</Button>
                ) : (
                  <Button href={trackUrl} style={st.button}>Track your order</Button>
                )}
              </Section>

              <Hr style={{ borderColor: border, margin: '22px 0 14px' }} />
              <Text style={st.fine}>
                Bookmark <Link href={trackUrl} style={{ color: gold }}>your tracking page</Link> — it updates at
                every step of the journey.
              </Text>
            </Section>
          </Section>

          <Text style={st.footer}>
            99%+ HPLC purity · third-party COA with every batch · cold-chain pan-India
            <br />
            All products are for in-vitro laboratory research only.
            <br />
            AthenaBioLabs · <Link href={SITE} style={{ color: gold }}>athenabiolabs.com</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

OrderStatusEmail.PreviewProps = {
  status: 'shipped',
  orderRef: 'ABL-3F8KQ2WNPX',
  awb: '1234567890123',
  eta: '12 July',
} satisfies Props;

export default OrderStatusEmail;
