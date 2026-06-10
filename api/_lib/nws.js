import { layerResponse } from "./normalizeGeoJSON.js";
import { buildGridKey, getCached, setCached } from "./gridCache.js";

const NWS_BASE = "https://api.weather.gov";

export async function fetchWeather({ lat, lng }) {
  const cacheKey = buildGridKey("weather", lat, lng, 0, "");
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const pointsRes = await fetch(`${NWS_BASE}/points/${lat.toFixed(4)},${lng.toFixed(4)}`, {
    headers: {
      Accept: "application/geo+json",
      "User-Agent": "tdnfrontend-labs (contact@testadenevill.com)",
    },
    signal: AbortSignal.timeout(10_000),
  });

  if (!pointsRes.ok) {
    throw new Error(`NWS points ${pointsRes.status}`);
  }

  const points = await pointsRes.json();
  const forecastUrl = points.properties?.forecast;
  const alertsUrl = `${NWS_BASE}/alerts/active?point=${lat},${lng}`;

  const [forecastRes, alertsRes] = await Promise.all([
    forecastUrl
      ? fetch(forecastUrl, {
          headers: { Accept: "application/geo+json", "User-Agent": "tdnfrontend-labs" },
          signal: AbortSignal.timeout(10_000),
        })
      : Promise.resolve(null),
    fetch(alertsUrl, {
      headers: { Accept: "application/geo+json", "User-Agent": "tdnfrontend-labs" },
      signal: AbortSignal.timeout(10_000),
    }),
  ]);

  const forecast = forecastRes?.ok ? await forecastRes.json() : null;
  const alerts = alertsRes.ok ? await alertsRes.json() : null;
  const periods = forecast?.properties?.periods ?? [];
  const current = periods[0];
  const activeAlerts = (alerts?.features ?? []).map((f) => ({
    event: f.properties?.event,
    headline: f.properties?.headline,
    severity: f.properties?.severity,
  }));

  const temp = current?.temperature;
  const precip = current?.probabilityOfPrecipitation?.value ?? 0;
  const wind = current?.windSpeed ?? "";
  const comfort =
    temp != null && temp >= 55 && temp <= 82 && precip < 30 ? "good" : precip >= 50 ? "poor" : "fair";

  const result = layerResponse(
    { features: [] },
    {
      source: "National Weather Service",
      attribution: "Data courtesy of NOAA/NWS",
      weather: {
        temperature: temp,
        unit: current?.temperatureUnit ?? "F",
        shortForecast: current?.shortForecast,
        detailedForecast: current?.detailedForecast,
        precipChance: precip,
        windSpeed: wind,
        comfort,
        periods: periods.slice(0, 6).map((p) => ({
          name: p.name,
          temperature: p.temperature,
          shortForecast: p.shortForecast,
          precipChance: p.probabilityOfPrecipitation?.value ?? 0,
        })),
      },
      alerts: activeAlerts,
    },
  );

  setCached(cacheKey, result, 600);
  return result;
}
