import type { MetadataRoute } from 'next';
import { PRODUCTS } from '@/lib/products';
import { GUIDES } from '@/lib/guides';

const BASE = 'https://www.athenabiolabs.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/catalogue`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/buy-peptides-india`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/coa`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE}/proof`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
  ];
  for (const g of GUIDES) {
    pages.push({
      url: `${BASE}/guides/${g.slug}`,
      lastModified: new Date(g.updated),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }
  for (const p of PRODUCTS) {
    pages.push({
      url: `${BASE}/products/${p.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }
  return pages;
}
