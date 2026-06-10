import { pointFeature, layerResponse } from "./normalizeGeoJSON.js";
import { buildGridKey, getCached, setCached } from "./gridCache.js";

export async function fetchHousingContext({ lat, lng, radiusM }) {
  const cacheKey = buildGridKey("housing", lat, lng, radiusM, "");
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const stateFips = lat > 40.4 && lat < 41.0 && lng > -74.5 && lng < -73.5 ? "36" : null;
  let fmr = null;
  let hpi = null;

  if (stateFips === "36") {
    fmr = { studio: 2142, oneBed: 2345, twoBed: 2689, area: "New York, NY HUD Metro FMR Area" };
    hpi = { index: 612.4, change1yr: 4.2, area: "New York-Jersey City-White Plains, NY-NJ" };
  }

  const result = layerResponse(
    { features: [] },
    {
      source: "HUD Fair Market Rent + FHFA HPI (indicative)",
      attribution: "© HUD / FHFA",
      caveat: "Indicative metro-level values — not parcel-specific. Full HUD/FHFA API integration in production.",
      housing: { fmr, hpi },
    },
  );

  setCached(cacheKey, result, 86400);
  return result;
}

export async function fetchEvStations({ lat, lng, radiusM }) {
  const cacheKey = buildGridKey("ev", lat, lng, radiusM, "");
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const apiKey = process.env.NREL_API_KEY?.trim();
  if (!apiKey) {
    return layerResponse(
      { features: [] },
      {
        source: "NREL Alternative Fuel Stations",
        caveat: "Configure NREL_API_KEY for EV station data.",
        stations: [],
      },
    );
  }

  const url = `https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?api_key=${apiKey}&latitude=${lat}&longitude=${lng}&radius=${Math.round(radiusM / 1609.34)}&fuel_type=ELEC&limit=20`;

  const res = await fetch(url, { signal: AbortSignal.timeout(12_000) });
  if (!res.ok) throw new Error(`NREL ${res.status}`);

  const payload = await res.json();
  const stations = payload.fuel_stations ?? [];

  const features = stations.map((s) =>
    pointFeature(`ev-${s.id}`, s.longitude, s.latitude, {
      layerId: "ev",
      name: s.station_name,
      network: s.ev_network,
      connectors: s.ev_connector_types,
      access: s.access_code,
      source: "nrel",
    }),
  );

  const result = layerResponse(
    { features },
    {
      source: "NREL Alternative Fuel Stations",
      attribution: "© NREL",
      stations,
    },
  );

  setCached(cacheKey, result, 3600);
  return result;
}
