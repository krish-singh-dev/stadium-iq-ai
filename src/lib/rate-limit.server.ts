/**
 * In-memory token-bucket rate limiter. Per-worker, best-effort; a real
 * production deployment should back this with Redis/Durable Objects.
 */
type Bucket = { tokens: number; updatedAt: number };
const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfterMs: number;
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const refillPerMs = limit / windowMs;
  const b = buckets.get(key) ?? { tokens: limit, updatedAt: now };
  const elapsed = now - b.updatedAt;
  b.tokens = Math.min(limit, b.tokens + elapsed * refillPerMs);
  b.updatedAt = now;
  if (b.tokens >= 1) {
    b.tokens -= 1;
    buckets.set(key, b);
    return { allowed: true, retryAfterMs: 0 };
  }
  buckets.set(key, b);
  const missing = 1 - b.tokens;
  return { allowed: false, retryAfterMs: Math.ceil(missing / refillPerMs) };
}
