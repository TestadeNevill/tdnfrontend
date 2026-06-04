import { fetchParkPhoto } from "../../_lib/parkPhotoProxy.js";
import { createRateLimiter, getClientIp } from "../../_lib/rateLimit.js";

const isRateLimited = createRateLimiter({ windowMs: 60_000, max: 120 });

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Rate limit exceeded" });
  }

  const ref = req.query?.ref;
  const maxHeight = req.query?.maxHeight ?? 80;

  try {
    const { buffer, contentType } = await fetchParkPhoto(ref, maxHeight);
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.status(200).send(buffer);
  } catch (error) {
    if (error?.code === "missing_api_key") {
      return res.status(502).json({
        error: "Google Places API key is not configured",
        code: "missing_api_key",
      });
    }
    if (error?.status === 400) {
      return res.status(400).json({ error: error.message });
    }
    if (error?.status === 429) {
      return res.status(429).json({ error: error.message });
    }
    console.error("parks/photo error:", error);
    return res.status(502).json({ error: "Photo proxy unavailable" });
  }
}
