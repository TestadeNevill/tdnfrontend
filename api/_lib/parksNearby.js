import { searchNearbyParks as googleSearchNearbyParks, isGooglePlacesConfigured } from "./googlePlaces.js";
import { fetchOverpassParks } from "./overpass.js";

export const DEFAULT_RADIUS_M = 2000;
export const MAX_RADIUS_M = 5000;
export const MAX_RESULTS = 10;

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
  if (isGooglePlacesConfigured()) {
    try {
      const parks = await googleSearchNearbyParks(lat, lng, radiusM);
      if (parks.length > 0) {
        return { parks, source: "api" };
      }
    } catch (error) {
      if (error?.code === "missing_api_key") throw error;
    }
  }

  try {
    const parks = await fetchOverpassParks(lat, lng, radiusM);
    return {
      parks,
      source: parks.length > 0 ? "osm" : "fallback",
    };
  } catch {
    const error = new Error("GOOGLE_PLACES_API_KEY is not configured");
    error.status = 502;
    error.code = "missing_api_key";
    throw error;
  }
}

export { fetchOverpassParks };
