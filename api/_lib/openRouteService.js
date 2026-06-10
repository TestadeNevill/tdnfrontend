import { polygonFeature, layerResponse } from "./normalizeGeoJSON.js";
import { buildGridKey, getCached, setCached } from "./gridCache.js";

const ORS_URL = "https://api.openrouteservice.org/v2/isochrones/foot-walking";

export function getOrsApiKey() {
  return process.env.OPENROUTESERVICE_API_KEY?.trim() ?? "";
}

export function isOrsConfigured() {
  return getOrsApiKey().length > 0;
}

export async function fetchIsochrone({ lat, lng, radiusM, filters }) {
  const minutes = Math.min(Math.max(Number(filters?.minutes ?? 10), 5), 20);
  const profile = filters?.profile === "cycling" ? "cycling-regular" : "foot-walking";
  const cacheKey = buildGridKey(`iso-${profile}`, lat, lng, minutes * 100, "");
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const apiKey = getOrsApiKey();
  if (!apiKey) {
    const dLat = (radiusM / 111_000) * (minutes / 10);
    const dLng = (radiusM / (111_000 * Math.cos((lat * Math.PI) / 180))) * (minutes / 10);
    const ring = [
      [lng - dLng, lat - dLat],
      [lng + dLng, lat - dLat],
      [lng + dLng, lat + dLat],
      [lng - dLng, lat + dLat],
      [lng - dLng, lat - dLat],
    ];
    const fallback = layerResponse(
      { features: [polygonFeature("iso-fallback", [ring], { minutes, profile, source: "estimate" })] },
      {
        source: "Estimated circle (configure OPENROUTESERVICE_API_KEY for real isochrones)",
        confidence: "low",
        caveat: "Approximate reach area — not routing-accurate.",
        minutes,
      },
    );
    setCached(cacheKey, fallback, 600);
    return fallback;
  }

  const url = profile === "cycling-regular"
    ? "https://api.openrouteservice.org/v2/isochrones/cycling-regular"
    : ORS_URL;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      locations: [[lng, lat]],
      range: [minutes * 60],
    }),
    signal: AbortSignal.timeout(12_000),
  });

  if (response.status === 429) {
    const error = new Error("OpenRouteService rate limit exceeded");
    error.status = 429;
    throw error;
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`ORS ${response.status}: ${detail.slice(0, 150)}`);
  }

  const geojson = await response.json();
  const features = (geojson.features ?? []).map((f, i) => ({
    ...f,
    properties: {
      ...f.properties,
      layerId: "isochrone",
      minutes,
      profile,
      source: "openrouteservice",
    },
    id: f.id ?? `iso-${i}`,
  }));

  const result = layerResponse(
    { features },
    {
      source: "OpenRouteService",
      attribution: "© OpenRouteService contributors",
      minutes,
      profile,
    },
  );

  setCached(cacheKey, result, 900);
  return result;
}
