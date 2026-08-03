import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let ratelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '15 m'), // 10 requests per 15 minutes (matches PHP limit)
    analytics: true,
    prefix: '@upstash/ratelimit/login',
  });
}

export async function checkLoginRateLimit(ip: string): Promise<{ success: boolean }> {
  if (!ratelimit) {
    // If Upstash is not configured, pass through (e.g. local dev fallback)
    return { success: true };
  }
  const result = await ratelimit.limit(ip);
  return { success: result.success };
}
