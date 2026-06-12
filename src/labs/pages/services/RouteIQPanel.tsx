import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// ── Types ──────────────────────────────────────────────────────────────────

interface RouteItem {
  onestopId: string;
  shortName: string;
  longName: string;
  color: string;
  routeType?: number;
}

interface TripStop {
  seq: number;
  name: string;
  lat: number;
  lng: number;
  arrival: string | null;
  departure: string | null;
  pickup: boolean;
  dropoff: boolean;
  estRiders: number;
}

interface TripData {
  route: { onestopId: string; shortName: string; longName: string; color: string; lines: number[][][] };
  headsign: string | null;
  serviceDay: string | null;
  stops: TripStop[];
  summary: { stopCount: number; totalRiders: number; firstTime: string | null; lastTime: string | null };
  caveat?: string;
}

// ── City / operator presets ─────────────────────────────────────────────────

const CITIES = [
  { label: "Denver", agency: "RTD", query: "Regional Transportation District" },
  { label: "San Francisco", agency: "SFMTA", query: "San Francisco Municipal Transportation Agency" },
  { label: "Portland", agency: "TriMet", query: "TriMet" },
  { label: "Seattle", agency: "King County Metro", query: "King County Metro" },
  { label: "Chicago", agency: "CTA", query: "Chicago Transit Authority" },
  { label: "Boston", agency: "MBTA", query: "MBTA" },
] as const;

type City = (typeof CITIES)[number];

// ── GeoJSON builders ─────────────────────────────────────────────────────────

function buildLineGJ(trip: TripData | null): GeoJSON.FeatureCollection {
  const features = (trip?.route.lines ?? []).map((coords, i) => ({
    type: "Feature" as const,
    id: `line-${i}`,
    properties: {},
    geometry: { type: "LineString" as const, coordinates: coords },
  }));
  return { type: "FeatureCollection", features };
}

function buildStopsGJ(trip: TripData | null): GeoJSON.FeatureCollection {
  const stops = trip?.stops ?? [];
  const last = stops.length - 1;
  const features = stops.map((s, i) => ({
    type: "Feature" as const,
    id: s.seq,
    properties: {
      seq: s.seq,
      name: s.name,
      time: s.departure ?? s.arrival ?? "",
      estRiders: s.estRiders,
      pickup: s.pickup,
      dropoff: s.dropoff,
      role: i === 0 ? "origin" : i === last ? "destination" : "stop",
    },
    geometry: { type: "Point" as const, coordinates: [s.lng, s.lat] },
  }));
  return { type: "FeatureCollection", features };
}

function popupHTML(p: Record<string, unknown>): string {
  const role = p.role === "origin" ? "Origin" : p.role === "destination" ? "Destination" : "Stop";
  const flags = [
    p.pickup ? "" : "<span style='color:#b45309'>no pickup</span>",
    p.dropoff ? "" : "<span style='color:#b45309'>no drop-off</span>",
  ].filter(Boolean).join(" · ");
  return (
    `<div style="font-size:12px;line-height:1.45;max-width:200px">` +
    `<strong>${p.name}</strong><br/>` +
    `<span style="color:#64748b">${role} · ${p.time}</span><br/>` +
    `~${p.estRiders} riders board <span style="color:#94a3b8">(est.)</span>` +
    (flags ? `<br/>${flags}` : "") +
    `</div>`
  );
}

// ── API ────────────────────────────────────────────────────────────────────

async function apiRoutes(query: string): Promise<{ routes: RouteItem[]; operatorId: string | null }> {
  const res = await fetch(`/api/labs/maps/transit-routes?operatorQuery=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`routes ${res.status}`);
  return res.json();
}

async function apiTrip(routeId: string): Promise<TripData> {
  const res = await fetch(`/api/labs/maps/transit-trip?route=${encodeURIComponent(routeId)}`);
  if (!res.ok) throw new Error(`trip ${res.status}`);
  return res.json();
}

// ── Component ──────────────────────────────────────────────────────────────

export function RouteIQPanel() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const mapLoadedRef = useRef(false);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  const [city, setCity] = useState<City>(CITIES[0]);
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>("");
  const [trip, setTrip] = useState<TripData | null>(null);
  const [routesStatus, setRoutesStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [tripStatus, setTripStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [selectedSeq, setSelectedSeq] = useState<number | null>(null);

  const routeColor = trip?.route.color ?? "#2563eb";

  // ── Load routes when the city changes ──
  useEffect(() => {
    let cancelled = false;
    setRoutesStatus("loading");
    setRoutes([]);
    setSelectedRouteId("");
    setTrip(null);
    apiRoutes(city.query)
      .then((data) => {
        if (cancelled) return;
        setRoutes(data.routes);
        setRoutesStatus("done");
        if (data.routes.length > 0) setSelectedRouteId(data.routes[0].onestopId);
      })
      .catch(() => !cancelled && setRoutesStatus("error"));
    return () => { cancelled = true; };
  }, [city]);

  // ── Load trip when the selected route changes ──
  useEffect(() => {
    if (!selectedRouteId) return;
    let cancelled = false;
    setTripStatus("loading");
    setSelectedSeq(null);
    apiTrip(selectedRouteId)
      .then((data) => {
        if (cancelled) return;
        setTrip(data);
        setTripStatus("done");
      })
      .catch(() => !cancelled && setTripStatus("error"));
    return () => { cancelled = true; };
  }, [selectedRouteId]);

  // ── Map init ──
  useEffect(() => {
    if (!mapContainerRef.current) return;
    let destroyed = false;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
            maxzoom: 19,
          },
        },
        layers: [{ id: "osm-tiles", type: "raster", source: "osm" }],
      },
      center: [-104.99, 39.74],
      zoom: 11,
      attributionControl: false,
    });
    mapRef.current = map;
    popupRef.current = new maplibregl.Popup({ closeButton: false, closeOnClick: false });

    map.on("load", () => {
      if (destroyed) return;
      map.addSource("route-source", { type: "geojson", data: buildLineGJ(null) });
      map.addSource("stops-source", { type: "geojson", data: buildStopsGJ(null) });

      map.addLayer({ id: "route-casing", type: "line", source: "route-source",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#ffffff", "line-width": 7, "line-opacity": 0.9 } });
      map.addLayer({ id: "route-line", type: "line", source: "route-source",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#2563eb", "line-width": 4 } });

      map.addLayer({ id: "stops-highlight", type: "circle", source: "stops-source",
        filter: ["==", ["get", "seq"], -1],
        paint: { "circle-radius": 13, "circle-color": "rgba(0,0,0,0)", "circle-stroke-color": "#185FA5", "circle-stroke-width": 3 } });

      map.addLayer({ id: "stops-layer", type: "circle", source: "stops-source",
        paint: {
          "circle-radius": ["match", ["get", "role"], "origin", 7, "destination", 8, 4.5],
          "circle-color": ["match", ["get", "role"], "destination", "#185FA5", "#ffffff"],
          "circle-stroke-color": ["match", ["get", "role"], "destination", "#ffffff", "#2563eb"],
          "circle-stroke-width": 2,
        },
      });

      map.on("mouseenter", "stops-layer", (e) => {
        map.getCanvas().style.cursor = "pointer";
        const f = e.features?.[0];
        if (!f) return;
        popupRef.current?.setLngLat((f.geometry as GeoJSON.Point).coordinates as [number, number])
          .setHTML(popupHTML(f.properties as Record<string, unknown>)).addTo(map);
      });
      map.on("mouseleave", "stops-layer", () => {
        map.getCanvas().style.cursor = "";
        popupRef.current?.remove();
      });
      map.on("click", "stops-layer", (e) => {
        const seq = e.features?.[0]?.properties?.seq;
        if (typeof seq === "number") setSelectedSeq((prev) => (prev === seq ? null : seq));
      });

      mapLoadedRef.current = true;
    });

    return () => {
      destroyed = true;
      mapLoadedRef.current = false;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ── Sync trip to map ──
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoadedRef.current) return;
    (map.getSource("route-source") as maplibregl.GeoJSONSource | undefined)?.setData(buildLineGJ(trip));
    (map.getSource("stops-source") as maplibregl.GeoJSONSource | undefined)?.setData(buildStopsGJ(trip));
    map.setPaintProperty("route-line", "line-color", trip?.route.color ?? "#2563eb");
    map.setPaintProperty("stops-layer", "circle-stroke-color", ["match", ["get", "role"], "destination", "#ffffff", trip?.route.color ?? "#2563eb"]);

    if (trip && trip.stops.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      trip.stops.forEach((s) => bounds.extend([s.lng, s.lat]));
      map.fitBounds(bounds, { padding: 50, animate: true, duration: 700 });
    }
  }, [trip]);

  // ── Sync selection to map ──
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoadedRef.current) return;
    map.setFilter("stops-highlight", ["==", ["get", "seq"], selectedSeq ?? -1]);
    if (selectedSeq == null || !trip) return;
    const stop = trip.stops.find((s) => s.seq === selectedSeq);
    if (stop) {
      map.flyTo({ center: [stop.lng, stop.lat], zoom: 14, duration: 700 });
      popupRef.current?.setLngLat([stop.lng, stop.lat]).setHTML(popupHTML({
        name: stop.name, time: stop.departure ?? stop.arrival ?? "", estRiders: stop.estRiders,
        pickup: stop.pickup, dropoff: stop.dropoff, role: "stop",
      })).addTo(map);
    }
  }, [selectedSeq, trip]);

  const selectStop = useCallback((seq: number) => {
    setSelectedSeq((prev) => (prev === seq ? null : seq));
  }, []);

  const selectedRoute = useMemo(
    () => routes.find((r) => r.onestopId === selectedRouteId),
    [routes, selectedRouteId],
  );

  return (
    <div className="space-y-3">
      {/* Header */}
      <div>
        <h3 className="text-base font-semibold text-labs-text">RouteIQ — Live Transit Explorer</h3>
        <p className="mt-1 text-sm text-labs-textMuted">
          Real GTFS routes &amp; stops via Transitland · scheduled times · MapLibre GL JS · rider counts are estimated
        </p>
      </div>

      {/* City presets */}
      <div className="flex flex-wrap gap-1.5">
        {CITIES.map((c) => (
          <button
            key={c.label}
            onClick={() => setCity(c)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              city.label === c.label
                ? "border-[#185FA5] bg-[#185FA5] text-white"
                : "border-labs-border bg-white text-labs-textMuted hover:bg-labs-panel2"
            }`}
          >
            {c.label} <span className="opacity-70">· {c.agency}</span>
          </button>
        ))}
      </div>

      {/* Route picker */}
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs font-medium text-labs-textMuted">Route</label>
        <select
          value={selectedRouteId}
          onChange={(e) => setSelectedRouteId(e.target.value)}
          disabled={routesStatus !== "done" || routes.length === 0}
          className="h-8 max-w-md flex-1 rounded border border-labs-border bg-white px-2 text-xs text-labs-text outline-none focus:border-[#185FA5] disabled:opacity-60"
        >
          {routesStatus === "loading" && <option>Loading routes…</option>}
          {routesStatus === "error" && <option>Failed to load routes</option>}
          {routesStatus === "done" && routes.length === 0 && <option>No routes found for this agency</option>}
          {routes.map((r) => (
            <option key={r.onestopId} value={r.onestopId}>
              {r.shortName ? `${r.shortName} — ` : ""}{r.longName || r.onestopId}
            </option>
          ))}
        </select>
        {routesStatus === "done" && (
          <span className="text-[11px] text-labs-textMuted">{routes.length} routes</span>
        )}
      </div>

      {/* Main panel: sidebar + map */}
      <div className="flex overflow-hidden rounded-lg border border-labs-border">
        {/* Sidebar */}
        <div className="w-52 flex-shrink-0 overflow-y-auto border-r border-labs-border bg-white p-3 flex flex-col gap-3 text-xs" style={{ height: 480 }}>
          {/* Trip summary */}
          <div>
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-labs-textMuted border-b border-labs-border pb-1">Trip</div>
            {tripStatus === "loading" && <p className="text-labs-textMuted animate-pulse">Loading schedule…</p>}
            {tripStatus === "error" && <p className="text-labs-danger">Failed to load trip.</p>}
            {tripStatus === "done" && trip && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="rounded px-1.5 py-0.5 text-[11px] font-bold text-white" style={{ background: routeColor }}>
                    {selectedRoute?.shortName || "•"}
                  </span>
                  <span className="font-medium text-labs-text truncate">{selectedRoute?.longName}</span>
                </div>
                {trip.headsign && (
                  <div className="text-labs-textMuted">to <span className="font-semibold text-labs-text">{trip.headsign}</span></div>
                )}
                {trip.caveat ? (
                  <p className="text-labs-textMuted">{trip.caveat}</p>
                ) : (
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {[
                      ["Stops", trip.summary.stopCount],
                      ["Est. riders", trip.summary.totalRiders],
                      ["First", trip.summary.firstTime ?? "—"],
                      ["Last", trip.summary.lastTime ?? "—"],
                    ].map(([label, value]) => (
                      <div key={String(label)} className="rounded bg-labs-panel2 px-2 py-1">
                        <div className="text-labs-textMuted text-[10px]">{label}</div>
                        <div className="font-semibold text-labs-text">{value}</div>
                      </div>
                    ))}
                  </div>
                )}
                {trip.serviceDay && (
                  <div className="text-[10px] text-labs-textMuted pt-0.5">Schedule: weekday ({trip.serviceDay.toLowerCase()})</div>
                )}
              </div>
            )}
          </div>

          {/* Ordered stops */}
          {trip && trip.stops.length > 0 && (
            <div>
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-labs-textMuted border-b border-labs-border pb-1">
                Stops &amp; pickups
              </div>
              <div className="space-y-0.5">
                {trip.stops.map((s) => (
                  <div
                    key={s.seq}
                    onClick={() => selectStop(s.seq)}
                    className={`flex cursor-pointer items-center gap-1.5 rounded px-1.5 py-1 transition-colors ${
                      selectedSeq === s.seq ? "bg-blue-50" : "hover:bg-labs-panel2"
                    }`}
                  >
                    <span className="w-12 flex-shrink-0 font-labsMono text-[10px] text-labs-textMuted">{s.departure ?? s.arrival ?? ""}</span>
                    <span className="flex-1 truncate text-labs-text">{s.name}</span>
                    <span className="flex-shrink-0 text-labs-textMuted">{s.estRiders}r</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        <div ref={mapContainerRef} className="flex-1 min-w-0" style={{ height: 480 }} />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-labs-textMuted">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full ring-2 ring-white" style={{ background: routeColor }} />
          Pickup stop
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#185FA5]" />
          Destination
        </span>
        <span>“r” = estimated riders boarding (no real boarding data exists in public GTFS)</span>
      </div>
    </div>
  );
}
