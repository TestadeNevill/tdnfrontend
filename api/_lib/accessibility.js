import { fetchOverpassAccessibility } from "./overpass.js";
import { pointFeature, layerResponse } from "./normalizeGeoJSON.js";
import { buildGridKey, getCached, setCached } from "./gridCache.js";

export async function fetchAccessibility({ lat, lng, radiusM }) {
  const cacheKey = buildGridKey("accessibility", lat, lng, radiusM, "");
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const items = await fetchOverpassAccessibility(lat, lng, radiusM);
  const features = items.map((a) =>
    pointFeature(a.id, a.lng, a.lat, {
      layerId: "accessibility",
      ...a,
    }),
  );

  const result = layerResponse(
    { features },
    {
      source: "OpenStreetMap wheelchair tags",
      attribution: "© OpenStreetMap contributors",
      caveat: "Coverage varies — always verify on site.",
      items,
    },
  );

  setCached(cacheKey, result, 600);
  return result;
}
