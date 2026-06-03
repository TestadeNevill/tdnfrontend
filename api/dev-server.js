import { fetchNearbyParks, normalizeParksRequest } from "./_lib/parksNearby.js";
import { completeAiTask, normalizeAiRequest } from "./_lib/openai.js";
import { createRateLimiter } from "./_lib/rateLimit.js";

const parksRateLimit = createRateLimiter({ max: 60 });
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
      if (error?.status === 429) {
        return sendJson(res, 429, { error: "Overpass rate limit exceeded" });
      }
      console.error("dev parks/nearby error:", error);
      return sendJson(res, 502, { error: "Parks lookup unavailable" });
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
        return sendJson(res, 429, { error: "OpenAI rate limit exceeded" });
      }
      console.error("dev ai/complete error:", error);
      return sendJson(res, error?.status ?? 502, { error: "AI completion unavailable" });
    }
  }

  return false;
}
