import { prisma } from './db';

interface RateLimitOptions {
  key: string;
  windowMs: number;
  maxRequests: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * Database-backed rate limiter using sliding window.
 */
export async function checkRateLimit(options: RateLimitOptions): Promise<RateLimitResult> {
  const { key, windowMs, maxRequests } = options;
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMs);

  try {
    const existing = await prisma.rateLimit.findUnique({
      where: { key },
    });

    if (!existing || existing.windowStart < windowStart) {
      // Create or reset the window
      await prisma.rateLimit.upsert({
        where: { key },
        update: { count: 1, windowStart: now },
        create: { key, count: 1, windowStart: now },
      });
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetAt: new Date(now.getTime() + windowMs),
      };
    }

    if (existing.count >= maxRequests) {
      const resetAt = new Date(existing.windowStart.getTime() + windowMs);
      return {
        allowed: false,
        remaining: 0,
        resetAt,
      };
    }

    await prisma.rateLimit.update({
      where: { key },
      data: { count: { increment: 1 } },
    });

    return {
      allowed: true,
      remaining: maxRequests - existing.count - 1,
      resetAt: new Date(existing.windowStart.getTime() + windowMs),
    };
  } catch (error) {
    // If rate limiting fails, allow the request (fail open)
    console.error('Rate limiting error:', error);
    return {
      allowed: true,
      remaining: maxRequests,
      resetAt: new Date(now.getTime() + windowMs),
    };
  }
}

/**
 * Create a rate limit key from an IP address and action.
 */
export function rateLimitKey(ip: string, action: string): string {
  return `${action}:${ip}`;
}
