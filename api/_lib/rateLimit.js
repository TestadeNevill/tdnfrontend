export function createRateLimiter({ windowMs = 60_000, max = 30 } = {}) {
  const buckets = new Map();

  return function isRateLimited(key) {
    const now = Date.now();
    const bucket = buckets.get(key) ?? [];
    const recent = bucket.filter((ts) => now - ts < windowMs);
    if (recent.length >= max) {
      buckets.set(key, recent);
      return true;
    }
    recent.push(now);
    buckets.set(key, recent);
    return false;
  };
}

export function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress ?? "unknown";
}
