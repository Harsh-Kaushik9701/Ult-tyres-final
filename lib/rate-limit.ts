/**
 * Simple in-memory fixed-window rate limiter.
 *
 * Works per server instance. That's enough for a single Node server (and for
 * localhost); on a multi-instance/serverless deployment add a shared store
 * (e.g. Upstash Redis or a MongoDB TTL collection) for global limits.
 */
type Bucket = { count: number; resetAt: number };

declare global {
  var _utRateLimit: Map<string, Bucket> | undefined;
}

const buckets: Map<string, Bucket> = (globalThis._utRateLimit ??= new Map());

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (buckets.size > 10_000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

export function resetRateLimit(key: string) {
  buckets.delete(key);
}
