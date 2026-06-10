import { DEFAULT_RADIUS_M, MAX_RADIUS_M } from "./parksNearby.js";

export function normalizeAnchorRequest(body) {
  const lat = Number(body?.lat);
  const lng = Number(body?.lng);
  const radiusM = Math.min(
    Math.max(Number(body?.radiusMeters ?? body?.radiusM ?? DEFAULT_RADIUS_M), 250),
    MAX_RADIUS_M,
  );

  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    return { error: "Invalid latitude" };
  }
  if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
    return { error: "Invalid longitude" };
  }

  return { lat, lng, radiusM, filters: body?.filters ?? {} };
}

export function normalizeBboxRequest(body) {
  const anchor = normalizeAnchorRequest(body);
  if (anchor.error) return anchor;

  const bbox = body?.bbox;
  if (Array.isArray(bbox) && bbox.length === 4) {
    const [west, south, east, north] = bbox.map(Number);
    if ([west, south, east, north].every(Number.isFinite)) {
      return { ...anchor, bbox: [west, south, east, north] };
    }
  }

  const { lat, lng, radiusM } = anchor;
  const dLat = radiusM / 111_000;
  const dLng = radiusM / (111_000 * Math.cos((lat * Math.PI) / 180));
  return {
    ...anchor,
    bbox: [lng - dLng, lat - dLat, lng + dLng, lat + dLat],
  };
}

export async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  return JSON.parse(raw);
}

export function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
  return true;
}

export function createMapHandler({ fetchData, cacheTtlSeconds = 300, useBbox = false }) {
  return async function handle(req, res, rateLimiter, ip) {
    if (rateLimiter?.(ip)) {
      return sendJson(res, 429, { error: "Rate limit exceeded" });
    }

    try {
      const body = await readJsonBody(req);
      const normalized = useBbox ? normalizeBboxRequest(body) : normalizeAnchorRequest(body);
      if (normalized.error) {
        return sendJson(res, 400, { error: normalized.error });
      }
      const result = await fetchData(normalized, body);
      return sendJson(res, 200, result);
    } catch (error) {
      if (error?.code === "missing_api_key") {
        return sendJson(res, 502, {
          error: error.message,
          code: "missing_api_key",
        });
      }
      if (error?.status === 429) {
        return sendJson(res, 429, { error: error.message ?? "Upstream rate limit exceeded" });
      }
      console.error("map handler error:", error);
      return sendJson(res, error?.status ?? 502, {
        error: error?.message ?? "Layer data unavailable",
      });
    }
  };
}
