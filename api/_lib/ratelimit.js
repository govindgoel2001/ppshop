// api/_lib/ratelimit.js
// Shared rate limiters. Files prefixed with _ are not treated as Vercel API routes.

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv(); // uses UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN

// 3 OTP sends per email per hour
export const otpEmailLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  prefix: 'rl:otp:email',
});

// 10 OTP send requests per IP per 10 minutes (catches bots hitting different emails)
export const otpIpLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 m'),
  prefix: 'rl:otp:ip',
});

// 5 verify attempts per IP per 10 minutes
export const verifyIpLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 m'),
  prefix: 'rl:verify:ip',
});
