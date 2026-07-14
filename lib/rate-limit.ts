import { NextRequest } from "next/server";

type Bucket = { count: number; resetAt: number };

// Per-instance in-memory store. On serverless platforms each cold instance
// has its own counters, so this is a best-effort abuse guard, not a durable
// limiter. Swap for Upstash Redis if cross-instance accuracy is needed.
const buckets = new Map<string, Bucket>();

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export function rateLimit(
  req: NextRequest,
  key: string,
  limit: number,
  windowMs: number
): { success: true } | { success: false; retryAfterSeconds: number } {
  const ip = getClientIp(req);
  const bucketKey = `${key}:${ip}`;
  const now = Date.now();

  // Occasionally sweep expired entries so the map doesn't grow unbounded
  // over a long-lived instance lifetime.
  if (Math.random() < 0.01) {
    for (const [k, v] of buckets) {
      if (v.resetAt <= now) buckets.delete(k);
    }
  }

  const bucket = buckets.get(bucketKey);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return { success: true };
  }

  if (bucket.count >= limit) {
    return {
      success: false,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { success: true };
}
