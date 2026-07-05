import type { Metadata } from 'next';
import { waLink } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact — AthenaBioLabs',
  description: 'Reach AthenaBioLabs on WhatsApp or by email.',
};

export default function Contact() {
  return (
    <main>
      <section style={{ padding: '80px 0' }}>
        <div className="w" style={{ maxWidth: 620, textAlign: 'center' }}>
          <span className="lb">Get in touch</span>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(32px,5vw,48px)', fontWeight: 700, letterSpacing: '-.02em', margin: '10px 0 16px' }}>
            We&apos;re here to <em style={{ fontWeight: 600 }}>help</em>.
          </h1>
          <p style={{ fontSize: 14, color: '#6F6753', lineHeight: 1.8, marginBottom: 32, fontWeight: 300 }}>
            Questions about a compound, your order, or a Certificate of Analysis? The fastest way to
            reach us is WhatsApp — we reply Mon–Sat, 9–7 IST.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={waLink('Hi AthenaBioLabs, I have a question.')} target="_blank" rel="noopener" className="b b1">Chat on WhatsApp</a>
            <a href="mailto:support@athenabiolabs.com" className="b b2">support@athenabiolabs.com</a>
          </div>
        </div>
      </section>
    </main>
  );
}
