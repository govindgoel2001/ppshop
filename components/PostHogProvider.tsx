'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Public client token for the dedicated AthenaBioLabs PostHog project
    // (id 500451); NEXT_PUBLIC_POSTHOG_KEY env wins if set.
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY ?? 'phc_rxREhLCdw3QmXFZJmxLbxfJ2SF3W8DjQFjJVGbTAuMQu', {
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
