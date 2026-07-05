import fs from 'node:fs';
import path from 'node:path';

/**
 * Delivery-proof photos live in public/img/proof/. Drop WhatsApp
 * screenshots / package photos there and they appear on the next build —
 * no code change needed. Sorted by filename, so prefix with 01-, 02-, …
 * to control order.
 */
export function proofPhotos(): string[] {
  try {
    return fs
      .readdirSync(path.join(process.cwd(), 'public', 'img', 'proof'))
      .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
      .sort();
  } catch {
    return [];
  }
}
