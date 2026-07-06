'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Public client token for the PostHog project; env wins if set.
    // Shop traffic is distinguishable in the shared project by $host.
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? 'phc_y7VFBvVgJfSNnmQbm9DtJhcRkHLm8YYQQ6wHD5F5GB9n', {
      api_host: 'https://us.i.posthog.com',
      defaults: '2025-05-24',
      person_profiles: 'identified_only',
    });
    // Components fire conversion events via window.posthog (e.g. WhatsAppOrder
    // in CartDrawer); the npm SDK doesn't attach itself to window.
    window.posthog = posthog;
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
