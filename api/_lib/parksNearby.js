import {
  isGooglePlacesConfigured,
  searchNearbyParks as googleSearchNearbyParks,
} from "./googlePlaces.js";

const OVERPASS_ENDPOINTS = [
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.openstreetmap.ru/api/interpreter",
  "https://overpass-api.de/api/interpreter",
];

export const DEFAULT_RADIUS_M = 2000;
export const MAX_RADIUS_M = 5000;
export const MAX_RESULTS = 10;

const REQUEST_TIMEOUT_MS = 12_000;

function haversineKm(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function buildOverpassQuery(lat, lng, radiusM) {
  return `
[out:json][timeout:10];
(
  way["leisure"="park"]["name"](around:${radiusM},${lat},${lng});
  relation["leisure"="park"]["name"](around:${radiusM},${lat},${lng});
  node["leisure"="park"]["name"](around:${radiusM},${lat},${lng});
  node["leisure"="nature_reserve"]["name"](around:${radiusM},${lat},${lng});
);
out center ${MAX_RESULTS};
`.trim();
}

function parseOverpassElements(elements, originLat, originLng) {
  const parks = [];

  for (const element of elements ?? []) {
    const lat = element.lat ?? element.center?.lat;
    const lng = element.lon ?? element.center?.lon;
    if (lat == null || lng == null) continue;

    const name = element.tags?.name?.trim();
    if (!name) continue;

    const leisure = element.tags?.leisure;
    parks.push({
      name,
      lat,
      lng,
      distanceKm: Number(haversineKm(originLat, originLng, lat, lng).toFixed(2)),
      type: leisure === "nature_reserve" ? "Nature reserve" : "Park",
    });
  }

  parks.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));

  const seen = new Set();
  return parks.filter((park) => {
    const key = `${park.name.toLowerCase()}@${park.lat.toFixed(4)},${park.lng.toFixed(4)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function fetchOverpassParks(lat, lng, radiusM) {
  const query = buildOverpassQuery(lat, lng, radiusM);

  const attempts = OVERPASS_ENDPOINTS.map(async (endpoint) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "User-Agent": "tdnfrontend-labs/1.0 (https://www.testadenevill.com)",
      },
      body: `data=${encodeURIComponent(query)}`,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (response.status === 429) {
      const error = new Error("Overpass rate limit");
      error.status = 429;
      throw error;
    }

    if (!response.ok) {
      throw new Error(`Overpass ${response.status}`);
    }

    const payload = await response.json();
    return parseOverpassElements(payload.elements, lat, lng);
  });

  try {
    return await Promise.any(attempts);
  } catch (error) {
    if (error instanceof AggregateError && error.errors.length > 0) {
      throw error.errors[0];
    }
    throw error;
  }
}

export function normalizeParksRequest(body) {
  const lat = Number(body?.lat);
  const lng = Number(body?.lng);
  const radiusM = Math.min(
    Math.max(Number(body?.radiusMeters ?? DEFAULT_RADIUS_M), 250),
    MAX_RADIUS_M,
  );

  if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
    return { error: "Invalid latitude" };
  }
  if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
    return { error: "Invalid longitude" };
  }

  return { lat, lng, radiusM };
}

export async function fetchNearbyParks(lat, lng, radiusM) {
  if (!isGooglePlacesConfigured()) {
    const error = new Error("GOOGLE_PLACES_API_KEY is not configured");
    error.status = 502;
    error.code = "missing_api_key";
    throw error;
  }

  const parks = await googleSearchNearbyParks(lat, lng, radiusM);
  return {
    parks,
    source: parks.length > 0 ? "api" : "fallback",
  };
}

export { fetchOverpassParks };
