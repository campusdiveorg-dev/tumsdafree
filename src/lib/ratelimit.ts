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
    // If Upstash is not configured, pass through
    return { success: true };
  }
  try {
    const timeoutPromise = new Promise<{ success: boolean }>((resolve) =>
      setTimeout(() => resolve({ success: true }), 2000)
    );
    const limitPromise = ratelimit.limit(ip).then((res) => ({ success: res.success }));
    return await Promise.race([limitPromise, timeoutPromise]);
  } catch (err) {
    console.warn('[RateLimit warning] Upstash Redis check failed, allowing request:', err);
    return { success: true };
  }
}
