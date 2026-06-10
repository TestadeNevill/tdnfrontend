import { layerResponse } from "./normalizeGeoJSON.js";
import { buildGridKey, getCached, setCached } from "./gridCache.js";

export function getAirNowApiKey() {
  return process.env.AIRNOW_API_KEY?.trim() ?? "";
}

export async function fetchAqi({ lat, lng }) {
  const cacheKey = buildGridKey("aqi", lat, lng, 0, "");
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const apiKey = getAirNowApiKey();
  let aqiData = null;

  if (apiKey) {
    const url = `https://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&latitude=${lat}&longitude=${lng}&distance=25&API_KEY=${apiKey}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (res.ok) {
      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0) {
        aqiData = rows[0];
      }
    }
  }

  if (!aqiData) {
    try {
      const fallback = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=us_aqi,pm2_5,ozone`,
        { signal: AbortSignal.timeout(10_000) },
      );
      if (fallback.ok) {
        const data = await fallback.json();
        const current = data.current;
        if (current?.us_aqi != null) {
          aqiData = {
            AQI: current.us_aqi,
            ParameterName: "PM2.5",
            Category: categorizeAqi(current.us_aqi),
            source: "open-meteo-dev",
          };
        }
      }
    } catch {
      /* ignore */
    }
  }

  const aqi = aqiData?.AQI ?? null;
  const category = aqiData?.Category?.Name ?? aqiData?.Category ?? categorizeAqi(aqi);
  const status = aqi != null && aqi <= 50 ? "good" : aqi != null && aqi <= 100 ? "moderate" : "poor";

  const result = layerResponse(
    { features: [] },
    {
      source: apiKey ? "AirNow (EPA)" : "Open-Meteo (dev fallback)",
      attribution: apiKey ? "© EPA AirNow" : "© Open-Meteo",
      caveat: apiKey ? undefined : "Configure AIRNOW_API_KEY for production EPA data.",
      aqi: {
        value: aqi,
        category,
        parameter: aqiData?.ParameterName,
        status,
        reportingArea: aqiData?.ReportingArea,
      },
    },
  );

  setCached(cacheKey, result, 900);
  return result;
}

function categorizeAqi(aqi) {
  if (aqi == null) return "Unknown";
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  return "Very Unhealthy";
}
