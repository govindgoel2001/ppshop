import { PRODUCTS } from '@/lib/products';
import { HomeClient } from '@/components/HomeClient';
import { proofPhotos } from '@/lib/proof';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AthenaBioLabs — Premium Research Peptides',
  description: 'HPLC-verified peptides with 99%+ purity. Each batch third-party tested. Full COA included. Temperature-controlled shipping.',
};

export default function Home() {
  const featured = PRODUCTS.filter(p => !p.oos).slice(0, 3);
  return <HomeClient products={PRODUCTS} featured={featured} proofs={proofPhotos()} />;
}
