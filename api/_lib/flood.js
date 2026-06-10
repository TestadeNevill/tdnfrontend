import { polygonFeature, layerResponse } from "./normalizeGeoJSON.js";
import { buildBboxKey, getCached, setCached } from "./gridCache.js";

const FEMA_URL =
  "https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28/query";

export async function fetchFloodZones({ bbox }) {
  const cacheKey = buildBboxKey("flood", bbox, "");
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const [west, south, east, north] = bbox;
  const geometry = JSON.stringify({
    xmin: west,
    ymin: south,
    xmax: east,
    ymax: north,
    spatialReference: { wkid: 4326 },
  });

  const url = `${FEMA_URL}?geometry=${encodeURIComponent(geometry)}&geometryType=esriGeometryEnvelope&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=FLD_ZONE,ZONE_SUBTY,SFHA_TF&returnGeometry=true&outSR=4326&f=geojson&resultRecordCount=50`;

  const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });

  if (!res.ok) {
    throw new Error(`FEMA NFHL ${res.status}`);
  }

  const geo = await res.json();
  const features = (geo.features ?? []).map((f, i) => ({
    ...f,
    id: f.id ?? `flood-${i}`,
    properties: {
      ...f.properties,
      layerId: "flood",
      zone: f.properties?.FLD_ZONE,
      subtype: f.properties?.ZONE_SUBTY,
      sfha: f.properties?.SFHA_TF,
      source: "fema-nfhl",
    },
  }));

  const result = layerResponse(
    { features },
    {
      source: "FEMA National Flood Hazard Layer",
      attribution: "© FEMA",
      caveat: "For planning purposes — consult official maps for decisions.",
      coverage: "United States",
    },
  );

  setCached(cacheKey, result, 86400);
  return result;
}
