import { layerResponse } from "./normalizeGeoJSON.js";
import { buildGridKey, getCached, setCached } from "./gridCache.js";

export async function geocodeSearch(query) {
  const q = String(query ?? "").trim();
  if (q.length < 3) {
    return layerResponse({ features: [] }, { results: [] });
  }

  const cacheKey = buildGridKey("geocode", 0, 0, 0, q.toLowerCase());
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(q)}&countrycodes=us`,
    {
      headers: {
        Accept: "application/json",
        "User-Agent": "tdnfrontend-labs/1.0 (contact@testadenevill.com)",
      },
      signal: AbortSignal.timeout(10_000),
    },
  );

  if (!res.ok) throw new Error(`Nominatim ${res.status}`);

  const rows = await res.json();
  const results = rows.map((r) => ({
    name: r.display_name,
    lat: Number(r.lat),
    lng: Number(r.lon),
    type: r.type,
  }));

  const result = layerResponse(
    { features: [] },
    {
      source: "Nominatim / OSM",
      attribution: "© OpenStreetMap contributors",
      results,
    },
  );

  setCached(cacheKey, result, 3600);
  return result;
}
