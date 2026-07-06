import { PRODUCTS } from '@/lib/products';
import { HomeClient } from '@/components/HomeClient';
import { proofPhotos } from '@/lib/proof';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AthenaBioLabs — Research Peptides India | 99%+ HPLC, COA Included',
  description: 'Buy research peptides in India: BPC-157, Retatrutide, Tirzepatide, TB-500 and more. 99%+ HPLC purity, third-party Janoshik COA with every batch, cold-chain delivery pan-India.',
  alternates: { canonical: '/' },
};

export default function Home() {
  const featured = PRODUCTS.filter(p => !p.oos).slice(0, 3);
  return <HomeClient products={PRODUCTS} featured={featured} proofs={proofPhotos()} />;
}
