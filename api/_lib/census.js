import { polygonFeature, layerResponse } from "./normalizeGeoJSON.js";
import { buildBboxKey, getCached, setCached, hashFilters } from "./gridCache.js";

const CENSUS_KEY = process.env.CENSUS_API_KEY?.trim() ?? "";

export async function fetchCensusTracts({ bbox, filters }) {
  const metric = filters?.metric ?? "median_income";
  const cacheKey = buildBboxKey("census", bbox, hashFilters({ metric }));
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const [west, south, east, north] = bbox;
  const centerLat = (south + north) / 2;
  const centerLng = (west + east) / 2;

  const tigerUrl = `https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_ACS2022/MapServer/8/query?geometry=${centerLng},${centerLat}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&distance=3000&units=esriSRUnit_Meter&outFields=GEOID,NAME&returnGeometry=true&f=geojson`;

  const geoRes = await fetch(tigerUrl, { signal: AbortSignal.timeout(15_000) });
  let tractFeatures = [];
  if (geoRes.ok) {
    const geo = await geoRes.json();
    tractFeatures = geo.features ?? [];
  }

  const geoids = tractFeatures.map((f) => f.properties?.GEOID).filter(Boolean).slice(0, 5);
  let stats = {};

  if (geoids.length > 0 && CENSUS_KEY) {
    const vars = "B19013_001E,B01003_001E,B25003_003E,B08201_002E";
    const url = `https://api.census.gov/data/2022/acs/acs5?get=NAME,${vars}&for=tract:${geoids.map((g) => g.slice(-6)).join(",")}&in=state:${geoids[0].slice(0, 2)}%20county:${geoids[0].slice(2, 5)}&key=${CENSUS_KEY}`;
    try {
      const statRes = await fetch(url, { signal: AbortSignal.timeout(12_000) });
      if (statRes.ok) {
        const rows = await statRes.json();
        const headers = rows[0];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          const obj = {};
          headers.forEach((h, j) => {
            obj[h] = row[j];
          });
          stats[obj.tract] = {
            name: obj.NAME,
            medianIncome: Number(obj.B19013_001E),
            population: Number(obj.B01003_001E),
            renterOccupied: Number(obj.B25003_003E),
            noVehicle: Number(obj.B08201_002E),
          };
        }
      }
    } catch {
      /* census stats optional */
    }
  }

  const features = tractFeatures.map((f) => {
    const geoid = f.properties?.GEOID;
    const tractId = geoid?.slice(-6);
    const s = stats[tractId] ?? {};
    return {
      ...f,
      properties: {
        ...f.properties,
        layerId: "census",
        medianIncome: s.medianIncome,
        population: s.population,
        renterOccupied: s.renterOccupied,
        noVehicle: s.noVehicle,
        metricValue: s[metric] ?? s.medianIncome,
        source: "census-acs",
      },
    };
  });

  const result = layerResponse(
    { features },
    {
      source: "U.S. Census ACS",
      attribution: "© U.S. Census Bureau",
      caveat: CENSUS_KEY ? undefined : "Configure CENSUS_API_KEY for tract statistics.",
      metric,
      stats,
    },
  );

  setCached(cacheKey, result, 86400);
  return result;
}
