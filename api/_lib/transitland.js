import { pointFeature, lineFeature, layerResponse } from "./normalizeGeoJSON.js";
import { buildGridKey, getCached, setCached } from "./gridCache.js";

export function getTransitlandApiKey() {
  return process.env.TRANSITLAND_API_KEY?.trim() ?? "";
}

export async function fetchTransit({ lat, lng, radiusM, bbox }) {
  const cacheKey = buildGridKey("transit", lat, lng, radiusM, "");
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const apiKey = getTransitlandApiKey();
  const [west, south, east, north] = bbox;
  const bboxStr = `${west},${south},${east},${north}`;

  if (!apiKey) {
    return layerResponse(
      { features: [] },
      {
        source: "Transitland",
        caveat: "Configure TRANSITLAND_API_KEY for transit data.",
        stops: [],
        routes: [],
      },
    );
  }

  const headers = { apikey: apiKey, Accept: "application/json" };

  const [stopsRes, routesRes] = await Promise.all([
    fetch(
      `https://transit.land/api/v2/rest/stops?bbox=${bboxStr}&limit=50`,
      { headers, signal: AbortSignal.timeout(12_000) },
    ),
    fetch(
      `https://transit.land/api/v2/rest/routes?bbox=${bboxStr}&limit=20`,
      { headers, signal: AbortSignal.timeout(12_000) },
    ),
  ]);

  const stopsPayload = stopsRes.ok ? await stopsRes.json() : { stops: [] };
  const routesPayload = routesRes.ok ? await routesRes.json() : { routes: [] };

  const stops = (stopsPayload.stops ?? []).slice(0, 50);
  const routes = (routesPayload.routes ?? []).slice(0, 20);

  const stopFeatures = stops.map((s) =>
    pointFeature(`stop-${s.onestop_id ?? s.id}`, s.geometry?.coordinates?.[0] ?? s.lon, s.geometry?.coordinates?.[1] ?? s.lat, {
      layerId: "transit",
      name: s.stop_name ?? s.name,
      mode: s.route_stop_patterns?.[0]?.route?.vehicle_type ?? "transit",
      source: "transitland",
    }),
  );

  const routeFeatures = routes
    .filter((r) => r.geometry?.coordinates?.length > 1)
    .map((r) =>
      lineFeature(`route-${r.onestop_id ?? r.id}`, r.geometry.coordinates, {
        layerId: "transit-routes",
        name: r.route_long_name ?? r.route_short_name,
        color: r.route_color ? `#${r.route_color}` : "#2563eb",
        source: "transitland",
      }),
    );

  const result = layerResponse(
    { features: [...stopFeatures, ...routeFeatures] },
    {
      source: "Transitland",
      attribution: "© Transitland / GTFS contributors",
      stops: stops.length,
      routes: routes.length,
    },
  );

  setCached(cacheKey, result, 600);
  return result;
}
