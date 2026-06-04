import { fetchNearbyParks, normalizeParksRequest } from "./_lib/parksNearby.js";
import { completeAiTask, normalizeAiRequest } from "./_lib/openai.js";
import { fetchParkPhoto } from "./_lib/parkPhotoProxy.js";
import { isGooglePlacesConfigured } from "./_lib/googlePlaces.js";
import { createRateLimiter } from "./_lib/rateLimit.js";

const parksRateLimit = createRateLimiter({ max: 60 });
const photoRateLimit = createRateLimiter({ max: 120 });
const aiRateLimit = createRateLimiter({ max: 30 });

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw);
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
  return true;
}

export async function handleLabsApi(req, res, url) {
  if (url.pathname === "/api/labs/health" && req.method === "GET") {
    return sendJson(res, 200, {
      ok: true,
      services: {
        parksNearby: true,
        googlePlaces: isGooglePlacesConfigured(),
        aiComplete: true,
        formspree: Boolean(process.env.VITE_FORMSPREE_ID?.trim()),
        openai: Boolean(process.env.OPENAI_API_KEY?.trim()),
      },
    });
  }

  if (url.pathname === "/api/labs/parks/nearby" && req.method === "POST") {
    const ip = req.socket?.remoteAddress ?? "local";
    if (parksRateLimit(ip)) {
      return sendJson(res, 429, { error: "Rate limit exceeded" });
    }

    try {
      const body = await readJsonBody(req);
      const normalized = normalizeParksRequest(body);
      if (normalized.error) {
        return sendJson(res, 400, { error: normalized.error });
      }

      const result = await fetchNearbyParks(
        normalized.lat,
        normalized.lng,
        normalized.radiusM,
      );
      return sendJson(res, 200, result);
    } catch (error) {
      if (error?.code === "missing_api_key") {
        return sendJson(res, 502, {
          error: "Google Places API key is not configured. Set GOOGLE_PLACES_API_KEY in environment variables.",
          code: "missing_api_key",
        });
      }
      if (error?.status === 429) {
        return sendJson(res, 429, { error: "Google Places rate limit exceeded" });
      }
      console.error("dev parks/nearby error:", error);
      return sendJson(res, 502, { error: error?.message ?? "Parks lookup unavailable" });
    }
  }

  if (url.pathname === "/api/labs/parks/photo" && req.method === "GET") {
    const ip = req.socket?.remoteAddress ?? "local";
    if (photoRateLimit(ip)) {
      return sendJson(res, 429, { error: "Rate limit exceeded" });
    }

    const ref = url.searchParams.get("ref");
    const maxHeight = url.searchParams.get("maxHeight") ?? "80";

    try {
      const { buffer, contentType } = await fetchParkPhoto(ref, maxHeight);
      res.statusCode = 200;
      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.end(buffer);
      return true;
    } catch (error) {
      if (error?.code === "missing_api_key") {
        return sendJson(res, 502, {
          error: "Google Places API key is not configured",
          code: "missing_api_key",
        });
      }
      if (error?.status === 400) {
        return sendJson(res, 400, { error: error.message });
      }
      if (error?.status === 429) {
        return sendJson(res, 429, { error: error.message });
      }
      console.error("dev parks/photo error:", error);
      return sendJson(res, 502, { error: "Photo proxy unavailable" });
    }
  }

  if (url.pathname === "/api/labs/ai/complete" && req.method === "POST") {
    const ip = req.socket?.remoteAddress ?? "local";
    if (aiRateLimit(ip)) {
      return sendJson(res, 429, { error: "Rate limit exceeded" });
    }

    try {
      const body = await readJsonBody(req);
      const normalized = normalizeAiRequest(body);
      if (normalized.error) {
        return sendJson(res, 400, { error: normalized.error });
      }

      const result = await completeAiTask(normalized.task, normalized.userContent);
      return sendJson(res, 200, result);
    } catch (error) {
      if (error?.status === 429) {
        return sendJson(res, 429, {
          error: error.message ?? "OpenAI rate limit exceeded",
          code: error.code ?? "rate_limit",
        });
      }
      console.error("dev ai/complete error:", error);
      return sendJson(res, error?.status ?? 502, { error: "AI completion unavailable" });
    }
  }

  return false;
}
