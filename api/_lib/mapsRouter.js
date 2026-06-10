import { createRateLimiter, getClientIp } from "../_lib/rateLimit.js";
import { createMapHandler, readJsonBody, sendJson, normalizeAnchorRequest, normalizeBboxRequest } from "../_lib/mapRequest.js";
import { fetchParkIntelligence } from "../_lib/mapParks.js";
import { fetchIsochrone } from "../_lib/openRouteService.js";
import { fetchWeather } from "../_lib/nws.js";
import { fetchAqi } from "../_lib/airnow.js";
import { fetchTransit } from "../_lib/transitland.js";
import { fetchCivic311 } from "../_lib/socrata.js";
import { fetchAccessibility } from "../_lib/accessibility.js";
import { fetchIncidents } from "../_lib/incidents.js";
import { fetchCensusTracts } from "../_lib/census.js";
import { fetchFloodZones } from "../_lib/flood.js";
import { fetchBusinessScout } from "../_lib/businessScout.js";
import { fetchHousingContext, fetchEvStations } from "../_lib/housing.js";
import { geocodeSearch } from "../_lib/geocode.js";

const mapsRateLimit = createRateLimiter({ max: 90 });

const LAYER_HANDLERS = {
  parks: { fetch: fetchParkIntelligence, useBbox: false },
  isochrone: { fetch: fetchIsochrone, useBbox: false },
  weather: { fetch: fetchWeather, useBbox: false },
  aqi: { fetch: fetchAqi, useBbox: false },
  transit: { fetch: fetchTransit, useBbox: true },
  civic311: { fetch: fetchCivic311, useBbox: true },
  accessibility: { fetch: fetchAccessibility, useBbox: false },
  incidents: { fetch: fetchIncidents, useBbox: true },
  census: { fetch: fetchCensusTracts, useBbox: true },
  flood: { fetch: fetchFloodZones, useBbox: true },
  "business-scout": { fetch: fetchBusinessScout, useBbox: false },
  housing: { fetch: fetchHousingContext, useBbox: false },
  ev: { fetch: fetchEvStations, useBbox: false },
  geocode: {
    fetch: async (req) => geocodeSearch(req.filters?.query ?? req.query ?? ""),
    useBbox: false,
  },
};

export async function handleMapsApi(req, res, layerId) {
  const ip = getClientIp(req) ?? req.socket?.remoteAddress ?? "local";
  if (mapsRateLimit(ip)) {
    return sendJson(res, 429, { error: "Rate limit exceeded" });
  }

  const config = LAYER_HANDLERS[layerId];
  if (!config) {
    return sendJson(res, 404, { error: `Unknown layer: ${layerId}` });
  }

  try {
    let body = {};
    if (req.method === "POST") {
      body = await readJsonBody(req);
    } else if (req.method === "GET") {
      const url = new URL(req.url, "http://localhost");
      body = {
        lat: url.searchParams.get("lat"),
        lng: url.searchParams.get("lng"),
        radiusMeters: url.searchParams.get("radiusMeters"),
        filters: { query: url.searchParams.get("q") },
      };
    } else {
      return sendJson(res, 405, { error: "Method not allowed" });
    }

    const normalized = config.useBbox ? normalizeBboxRequest(body) : normalizeAnchorRequest(body);
    if (normalized.error) {
      return sendJson(res, 400, { error: normalized.error });
    }

    if (layerId === "geocode") {
      normalized.query = body.filters?.query ?? body.query;
    }

    const result = await config.fetch(normalized);
    return sendJson(res, 200, result);
  } catch (error) {
    if (error?.code === "missing_api_key") {
      return sendJson(res, 502, { error: error.message, code: "missing_api_key" });
    }
    if (error?.status === 429) {
      return sendJson(res, 429, { error: error.message ?? "Upstream rate limit exceeded" });
    }
    console.error(`maps/${layerId} error:`, error);
    return sendJson(res, error?.status ?? 502, {
      error: error?.message ?? "Layer data unavailable",
    });
  }
}

export function createMapsRoute(layerId) {
  return async function handler(req, res) {
    return handleMapsApi(req, res, layerId);
  };
}

export { LAYER_HANDLERS };
