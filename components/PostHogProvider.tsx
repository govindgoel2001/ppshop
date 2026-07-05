'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init('phc_DcnPXXtaBQZzZJ5H9sFTtujfzQGeJFJ7bJjG6ZRDAHJ4', {
      api_host: 'https://us.i.posthog.com',
      person_profiles: 'identified_only',
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
