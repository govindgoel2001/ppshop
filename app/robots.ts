import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/account', '/pay/', '/api/', '/sign-in', '/sign-up'],
      },
    ],
    sitemap: 'https://www.athenabiolabs.com/sitemap.xml',
  };
}
