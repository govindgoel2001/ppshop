// ─────────────────────────────────────────────────────────────
// Central site configuration.
//
// ⚠️ WHATSAPP_NUMBER — the number every "Order on WhatsApp" / "Chat"
// button points at. Two numbers exist across the old site
// (919818697569 on the coming-soon + contact pages, 919560397569 on
// the new-build floating button + UPI id). Change the ONE line below
// if this is not the right number.
// Format: country code + number, digits only, no "+".
// ─────────────────────────────────────────────────────────────
export const WHATSAPP_NUMBER = '919818697569';

export const CONSENT_TEXT =
  'I confirm I am 18 years of age or older. I understand every product is sold strictly for laboratory / research use and NOT for human or animal consumption, and I agree that AthenaBioLabs accepts no liability for any misuse or harm arising from these products.';

/** Build a wa.me deep link with a pre-filled message. */
export function waLink(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
