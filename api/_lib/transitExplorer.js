import { getTransitlandApiKey } from "./transitland.js";
import { buildGridKey, getCached, setCached } from "./gridCache.js";

const TL_BASE = "https://transit.land/api/v2/rest";
const RELATIVE_DAYS = ["MONDAY", "SATURDAY", "SUNDAY"];

function requireKey() {
  const key = getTransitlandApiKey();
  if (!key) {
    const err = new Error("Configure TRANSITLAND_API_KEY for transit data.");
    err.code = "missing_api_key";
    throw err;
  }
  return key;
}

async function tlFetch(path) {
  const key = requireKey();
  const res = await fetch(`${TL_BASE}${path}`, {
    headers: { apikey: key, Accept: "application/json" },
    signal: AbortSignal.timeout(12_000),
  });
  if (res.status === 429) {
    const err = new Error("Transitland rate limit exceeded");
    err.status = 429;
    throw err;
  }
  if (!res.ok) {
    const err = new Error(`Transitland ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

function routeColor(hex) {
  return hex ? `#${String(hex).replace(/^#/, "")}` : "#2563eb";
}

// Normalize a route geometry (LineString | MultiLineString) into an array of
// coordinate arrays so the client can draw one or more polylines.
function geometryToLines(geometry) {
  if (!geometry) return [];
  if (geometry.type === "LineString") return [geometry.coordinates];
  if (geometry.type === "MultiLineString") return geometry.coordinates;
  return [];
}

// ── Deterministic estimated-rider model (no real boarding data exists in GTFS) ──
function hashUnit(str) {
  let h = 2166136261;
  const s = String(str);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

function estimateRiders(stop, idx, total) {
  // No pickup allowed at this stop (drop-off only) → nobody boards here.
  if (stop.pickup_type === 1) return 0;
  const u = hashUnit(stop.stop?.stop_id ?? stop.stop?.stop_name ?? idx);
  const name = String(stop.stop?.stop_name ?? "").toLowerCase();
  const hub = /stat|station|center|transit|mall|downtown|union|terminal|transfer|airport/.test(name) ? 1.9 : 1;
  const p = total > 1 ? idx / (total - 1) : 0;
  // Boardings peak early in the trip (toward the destination) and taper off.
  const posBoost = Math.max(0.2, 1.25 - p * 0.9);
  const base = 4 + u * 14; // 4..18 baseline
  return Math.max(0, Math.round(base * hub * posBoost));
}

// ── Operators ────────────────────────────────────────────────────────────────
export async function fetchTransitOperators({ query }) {
  const q = String(query ?? "").trim();
  if (q.length < 2) return { operators: [] };
  const cacheKey = buildGridKey("tl-ops", 0, 0, 0, q.toLowerCase());
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const data = await tlFetch(`/operators?search=${encodeURIComponent(q)}&limit=8`);
  const operators = (data.operators ?? []).map((o) => ({
    onestopId: o.onestop_id,
    name: o.name ?? o.short_name ?? o.onestop_id,
  }));
  const result = { operators, source: "Transitland" };
  setCached(cacheKey, result, 3600);
  return result;
}

async function resolveOperator({ operator, operatorQuery }) {
  if (operator) return operator;
  const q = String(operatorQuery ?? "").trim();
  if (!q) return null;
  const { operators } = await fetchTransitOperators({ query: q });
  if (operators.length === 0) return null;
  const lower = q.toLowerCase();
  const exact = operators.find((o) => o.name.toLowerCase() === lower);
  return (exact ?? operators[0]).onestopId;
}

// ── Routes for an operator ─────────────────────────────────────────────────────
export async function fetchTransitRoutes({ operator, operatorQuery }) {
  const operatorId = await resolveOperator({ operator, operatorQuery });
  if (!operatorId) return { routes: [], operatorId: null };

  const cacheKey = buildGridKey("tl-routes", 0, 0, 0, operatorId);
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const data = await tlFetch(`/routes?operator_onestop_id=${encodeURIComponent(operatorId)}&limit=80`);
  const routes = (data.routes ?? [])
    .map((r) => ({
      onestopId: r.onestop_id,
      shortName: r.route_short_name ?? "",
      longName: r.route_long_name ?? "",
      color: routeColor(r.route_color),
      routeType: r.route_type,
    }))
    .filter((r) => r.onestopId)
    .sort((a, b) => (a.shortName || a.longName).localeCompare(b.shortName || b.longName, undefined, { numeric: true }));

  const result = { routes, operatorId, source: "Transitland" };
  setCached(cacheKey, result, 3600);
  return result;
}

function fmtTime(t) {
  // GTFS time "HH:MM:SS" (may exceed 24h). Return 12h label.
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  const hh = ((h % 24) + 24) % 24;
  const period = hh < 12 ? "AM" : "PM";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

// ── A representative trip for a route: ordered stops, real times, destination ──
export async function fetchTransitTrip({ route }) {
  const routeId = String(route ?? "").trim();
  if (!routeId) {
    const err = new Error("route is required");
    err.status = 400;
    throw err;
  }

  const cacheKey = buildGridKey("tl-trip", 0, 0, 0, routeId);
  const cached = getCached(cacheKey);
  if (cached) return cached;

  // Route geometry + metadata.
  const routeData = await tlFetch(`/routes/${encodeURIComponent(routeId)}?include_geometry=true`);
  const routeMeta = routeData.routes?.[0] ?? {};
  const lines = geometryToLines(routeMeta.geometry);

  // Find a representative trip on a service day that actually runs.
  let trip = null;
  let serviceDay = null;
  for (const day of RELATIVE_DAYS) {
    const tripsData = await tlFetch(
      `/routes/${encodeURIComponent(routeId)}/trips?relative_date=${day}&limit=1`,
    );
    const candidate = tripsData.trips?.[0];
    if (candidate) {
      trip = candidate;
      serviceDay = day;
      break;
    }
  }

  if (!trip) {
    const result = {
      route: {
        onestopId: routeId,
        shortName: routeMeta.route_short_name ?? "",
        longName: routeMeta.route_long_name ?? "",
        color: routeColor(routeMeta.route_color),
        lines,
      },
      headsign: null,
      serviceDay: null,
      stops: [],
      summary: { stopCount: 0, totalRiders: 0, firstTime: null, lastTime: null },
      caveat: "No scheduled trips found for this route.",
    };
    setCached(cacheKey, result, 600);
    return result;
  }

  // Full trip detail includes ordered stop_times.
  const tripData = await tlFetch(
    `/routes/${encodeURIComponent(routeId)}/trips/${encodeURIComponent(trip.id)}`,
  );
  const detail = tripData.trips?.[0] ?? trip;
  const stopTimes = (detail.stop_times ?? []).filter((st) => st.stop?.geometry?.coordinates);
  const total = stopTimes.length;

  const stops = stopTimes.map((st, idx) => {
    const [lng, lat] = st.stop.geometry.coordinates;
    const estRiders = estimateRiders(st, idx, total);
    return {
      seq: st.stop_sequence ?? idx + 1,
      name: st.stop.stop_name ?? "Stop",
      lat,
      lng,
      arrival: fmtTime(st.arrival_time),
      departure: fmtTime(st.departure_time),
      arrivalRaw: st.arrival_time ?? null,
      pickup: st.pickup_type !== 1,
      dropoff: st.drop_off_type !== 1,
      estRiders,
    };
  });

  const totalRiders = stops.reduce((a, s) => a + s.estRiders, 0);
  const result = {
    route: {
      onestopId: routeId,
      shortName: routeMeta.route_short_name ?? detail.route?.route_short_name ?? "",
      longName: routeMeta.route_long_name ?? "",
      color: routeColor(routeMeta.route_color),
      lines,
    },
    headsign: detail.trip_headsign ?? stops[stops.length - 1]?.name ?? null,
    serviceDay,
    stops,
    summary: {
      stopCount: stops.length,
      totalRiders,
      firstTime: stops[0]?.departure ?? null,
      lastTime: stops[stops.length - 1]?.arrival ?? null,
    },
    source: "Transitland / GTFS",
    attribution: "© Transitland / GTFS contributors",
  };

  setCached(cacheKey, result, 600);
  return result;
}
