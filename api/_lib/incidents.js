import { pointFeature, layerResponse } from "./normalizeGeoJSON.js";
import { buildBboxKey, getCached, setCached, hashFilters } from "./gridCache.js";

const NYPD_URL = "https://data.cityofnewyork.us/resource/qgea-i56i.json";

export async function fetchIncidents({ bbox, filters }) {
  const days = Math.min(Math.max(Number(filters?.days ?? 90), 30), 365);
  const cacheKey = buildBboxKey("incidents", bbox, hashFilters({ days }));
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const [west, south, east, north] = bbox;
  const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
  const where = encodeURIComponent(
    `latitude between ${south} and ${north} AND longitude between ${west} and ${east} AND cmplnt_fr_dt >= '${since}'`,
  );

  const res = await fetch(
    `${NYPD_URL}?$select=latitude,longitude,ofns_desc,law_cat_cd,cmplnt_fr_dt&$where=${where}&$limit=500`,
    { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(15_000) },
  );

  if (!res.ok) {
    throw new Error(`NYPD open data ${res.status}`);
  }

  const rows = await res.json();
  const grid = aggregateHexbin(rows, bbox, 8);

  const features = grid.map((cell, i) =>
    pointFeature(`inc-${i}`, cell.lng, cell.lat, {
      layerId: "incidents",
      count: cell.count,
      topOffenses: cell.types.slice(0, 3),
      source: "nypd-open-data",
    }),
  );

  const result = layerResponse(
    { features },
    {
      source: "NYPD Open Data",
      attribution: "© NYPD / NYC Open Data",
      caveat: "Reported incidents — not a safety score. Aggregated by area.",
      coverage: "New York City",
      totalReports: rows.length,
      days,
      grid,
    },
  );

  setCached(cacheKey, result, 1800);
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
    const t = row.ofns_desc;
    if (t && !existing.types.includes(t)) existing.types.push(t);
    cells.set(key, existing);
  }

  return [...cells.values()].filter((c) => c.count > 0);
}
