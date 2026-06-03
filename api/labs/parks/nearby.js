import { fetchNearbyParks, normalizeParksRequest } from "../../_lib/parksNearby.js";

const rateLimit = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress ?? "unknown";
}

function isRateLimited(ip) {
  const now = Date.now();
  const bucket = rateLimit.get(ip) ?? [];
  const recent = bucket.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimit.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateLimit.set(ip, recent);
  return false;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Rate limit exceeded" });
  }

  const normalized = normalizeParksRequest(req.body);
  if (normalized.error) {
    return res.status(400).json({ error: normalized.error });
  }

  try {
    const result = await fetchNearbyParks(
      normalized.lat,
      normalized.lng,
      normalized.radiusM,
    );
    return res.status(200).json(result);
  } catch (error) {
    if (error?.status === 429) {
      return res.status(429).json({ error: "Overpass rate limit exceeded" });
    }
    console.error("parks/nearby error:", error);
    return res.status(502).json({ error: "Parks lookup unavailable" });
  }
}
