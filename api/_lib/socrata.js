import { pointFeature, layerResponse } from "./normalizeGeoJSON.js";
import { buildBboxKey, getCached, setCached, hashFilters } from "./gridCache.js";

const NYC_311_URL = "https://data.cityofnewyork.us/resource/erm2-nwe9.json";

export async function fetchCivic311({ lat, lng, radiusM, bbox, filters }) {
  const days = Math.min(Math.max(Number(filters?.days ?? 90), 30), 365);
  const cacheKey = buildBboxKey("civic311", bbox, hashFilters({ days, category: filters?.category }));
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const [west, south, east, north] = bbox;
  const withinBox = `within_box(geom, ${north}, ${west}, ${south}, ${east})`;
  const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);

  let query = `$select=latitude,longitude,complaint_type,descriptor,created_date,status&$where=${encodeURIComponent(`${withinBox} AND created_date >= '${since}'`)}&$limit=200`;
  if (filters?.category) {
    query += `&complaint_type=${encodeURIComponent(filters.category)}`;
  }

  const res = await fetch(`${NYC_311_URL}?${query}`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    throw new Error(`NYC 311 ${res.status}`);
  }

  const rows = await res.json();
  const grid = aggregateHexbin(rows, bbox, 8);

  const features = grid.map((cell, i) =>
    pointFeature(`311-${i}`, cell.lng, cell.lat, {
      layerId: "civic311",
      count: cell.count,
      topTypes: cell.types.slice(0, 3),
      source: "nyc-open-data",
    }),
  );

  const result = layerResponse(
    { features },
    {
      source: "NYC Open Data (311)",
      attribution: "© NYC Open Data",
      caveat: "Reports filed, not verified outcomes. NYC coverage only.",
      coverage: "New York City",
      totalReports: rows.length,
      days,
      grid,
    },
  );

  setCached(cacheKey, result, 900);
  return result;
}

function aggregateHexbin(rows, bbox, gridSize) {
  const [west, south, east, north] = bbox;
  const cellW = (east - west) / gridSize;
  const cellH = (north - south) / gridSize;
  const cells = new Map();

  for (const row of rows) {
    const plat = Number(row.latitude);
    const plng = Number(row.longitude);
    if (!Number.isFinite(plat) || !Number.isFinite(plng)) continue;

    const gx = Math.floor((plng - west) / cellW);
    const gy = Math.floor((plat - south) / cellH);
    const key = `${gx},${gy}`;
    const existing = cells.get(key) ?? {
      lat: south + (gy + 0.5) * cellH,
      lng: west + (gx + 0.5) * cellW,
      count: 0,
      types: [],
    };
    existing.count += 1;
    const t = row.complaint_type;
    if (t && !existing.types.includes(t)) existing.types.push(t);
    cells.set(key, existing);
  }

  return [...cells.values()].filter((c) => c.count > 0);
}
