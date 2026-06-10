import { useCallback, useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// No default markers used here — CircleMarker only.
void L;

interface AQISensor {
  id: string;
  name: string;
  lat: number;
  lon: number;
  pm25?: number;
  pm10?: number;
  lastUpdated?: string;
}

interface TransitStop {
  id: number;
  lat: number;
  lon: number;
  name?: string;
  mode: "bus" | "rail";
}

function aqiColor(pm25?: number): string {
  if (pm25 === undefined) return "#94a3b8";
  if (pm25 < 12) return "#10b981";
  if (pm25 < 35.4) return "#f59e0b";
  if (pm25 < 55.4) return "#f97316";
  return "#ef4444";
}

function aqiLabel(pm25?: number): string {
  if (pm25 === undefined) return "No PM2.5 data";
  if (pm25 < 12) return "Good";
  if (pm25 < 35.4) return "Moderate";
  if (pm25 < 55.4) return "Unhealthy (sensitive)";
  return "Unhealthy";
}

function MapFly({ lat, lon, zoom }: { lat: number; lon: number; zoom: number }) {
  const map = useMap();
  useEffect(() => { map.flyTo([lat, lon], zoom, { duration: 1 }); }, [map, lat, lon, zoom]);
  return null;
}

async function fetchAQI(lat: number, lon: number): Promise<AQISensor[]> {
  const url = `https://api.openaq.org/v2/latest?coordinates=${lat},${lon}&radius=30000&limit=25&order_by=distance`;
  const r = await fetch(url, { headers: { Accept: "application/json" } });
  if (!r.ok) throw new Error("OpenAQ unavailable");
  const d = await r.json();
  return (d.results ?? []).map((loc: {
    location: string;
    coordinates: { latitude: number; longitude: number };
    measurements: { parameter: string; value: number; lastUpdated: string }[];
  }) => {
    const pm25m = loc.measurements.find((m) => m.parameter === "pm25");
    const pm10m = loc.measurements.find((m) => m.parameter === "pm10");
    return {
      id: `${loc.coordinates.latitude},${loc.coordinates.longitude}`,
      name: loc.location,
      lat: loc.coordinates.latitude,
      lon: loc.coordinates.longitude,
      pm25: pm25m && pm25m.value >= 0 ? pm25m.value : undefined,
      pm10: pm10m && pm10m.value >= 0 ? pm10m.value : undefined,
      lastUpdated: pm25m?.lastUpdated,
    };
  });
}

async function fetchTransit(lat: number, lon: number): Promise<TransitStop[]> {
  const query = `[out:json][timeout:20];(node["highway"="bus_stop"](around:5000,${lat},${lon});node["amenity"="bus_station"](around:5000,${lat},${lon});node["railway"~"station|subway_entrance|tram_stop"](around:8000,${lat},${lon});node["public_transport"="station"](around:8000,${lat},${lon}););out 120;`;
  const r = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: query });
  const d = await r.json();
  return (d.elements ?? []).map((el: {
    id: number; lat: number; lon: number;
    tags?: Record<string, string>;
  }) => ({
    id: el.id,
    lat: el.lat,
    lon: el.lon,
    name: el.tags?.name,
    mode: ["station", "subway_entrance", "tram_stop"].includes(el.tags?.railway ?? "") || el.tags?.public_transport === "station"
      ? "rail" as const
      : "bus" as const,
  }));
}

const CITIES = [
  { label: "New York", lat: 40.748, lon: -73.985 },
  { label: "Chicago", lat: 41.878, lon: -87.630 },
  { label: "Los Angeles", lat: 34.052, lon: -118.244 },
  { label: "Denver", lat: 39.739, lon: -104.990 },
  { label: "Seattle", lat: 47.606, lon: -122.332 },
  { label: "Houston", lat: 29.760, lon: -95.370 },
];

type Status = "idle" | "loading" | "done" | "error";

export function TransitAQIMap() {
  const [city, setCity] = useState(CITIES[0]);
  const [sensors, setSensors] = useState<AQISensor[]>([]);
  const [stops, setStops] = useState<TransitStop[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [aqiStatus, setAqiStatus] = useState<"ok" | "fallback">("ok");
  const [showBus, setShowBus] = useState(true);
  const [showRail, setShowRail] = useState(true);
  const [showAQI, setShowAQI] = useState(true);

  const load = useCallback(async (c: typeof CITIES[0]) => {
    setCity(c);
    setStatus("loading");
    setSensors([]);
    setStops([]);
    const [aqiResult, transitResult] = await Promise.allSettled([
      fetchAQI(c.lat, c.lon),
      fetchTransit(c.lat, c.lon),
    ]);
    if (aqiResult.status === "fulfilled") {
      setSensors(aqiResult.value);
      setAqiStatus("ok");
    } else {
      setAqiStatus("fallback");
    }
    if (transitResult.status === "fulfilled") setStops(transitResult.value);
    setStatus("done");
  }, []);

  useEffect(() => { load(CITIES[0]); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const avgPm25 = sensors.filter((s) => s.pm25 !== undefined).reduce<number[]>((a, s) => [...a, s.pm25!], []);
  const meanPm25 = avgPm25.length > 0 ? (avgPm25.reduce((a, b) => a + b, 0) / avgPm25.length).toFixed(1) : "—";
  const railCount = stops.filter((s) => s.mode === "rail").length;
  const busCount = stops.filter((s) => s.mode === "bus").length;

  return (
    <div className="space-y-4">
      <p className="max-w-2xl text-base leading-relaxed text-labs-textMuted">
        Fuse real air quality sensor readings (OpenAQ) with live transit stop locations from
        OpenStreetMap — a multi-layer urban intelligence view for planners, transit agencies, and
        smart city teams. AQI markers are colored by PM2.5 level.
      </p>

      <div className="flex flex-wrap gap-1.5">
        {CITIES.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => load(c)}
            disabled={status === "loading"}
            className={[
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50",
              city.label === c.label
                ? "border-labs-accent/40 bg-labs-accent/10 text-labs-accent"
                : "border-labs-border bg-labs-panel2 text-labs-textMuted hover:border-labs-accent/30 hover:text-labs-accent",
            ].join(" ")}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {[
          { label: "AQI sensors", state: showAQI, set: setShowAQI, color: "#10b981" },
          { label: "Bus stops", state: showBus, set: setShowBus, color: "#3b82f6" },
          { label: "Rail & subway", state: showRail, set: setShowRail, color: "#8b5cf6" },
        ].map((toggle) => (
          <button
            key={toggle.label}
            type="button"
            onClick={() => toggle.set(!toggle.state)}
            className={[
              "flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
              toggle.state
                ? "border-labs-border bg-labs-panel2 text-labs-text"
                : "border-labs-border bg-white/40 text-labs-textMuted opacity-50",
            ].join(" ")}
          >
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: toggle.color }} />
            {toggle.label}
          </button>
        ))}
      </div>

      {status === "loading" && (
        <p className="text-xs text-labs-textMuted animate-pulse">Loading AQI sensors and transit stops…</p>
      )}
      {aqiStatus === "fallback" && status === "done" && (
        <p className="rounded-md border border-labs-warning/30 bg-labs-warning/10 px-3 py-2 text-xs text-labs-warning">
          OpenAQ API unavailable — AQI layer hidden. Transit data from OpenStreetMap is live.
        </p>
      )}

      <div className="overflow-hidden rounded-lg border border-labs-border">
        <MapContainer center={[city.lat, city.lon]} zoom={13} className="h-80 w-full" scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapFly lat={city.lat} lon={city.lon} zoom={13} />

          {showAQI && sensors.map((s) => (
            <CircleMarker
              key={s.id}
              center={[s.lat, s.lon]}
              radius={10}
              pathOptions={{ color: aqiColor(s.pm25), fillColor: aqiColor(s.pm25), fillOpacity: 0.75, weight: 1.5 }}
            >
              <Popup>
                <strong>{s.name}</strong><br />
                PM2.5: {s.pm25 !== undefined ? `${s.pm25.toFixed(1)} µg/m³` : "N/A"}<br />
                AQI: <span style={{ color: aqiColor(s.pm25) }}>{aqiLabel(s.pm25)}</span>
                {s.lastUpdated && <><br /><span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{new Date(s.lastUpdated).toLocaleString()}</span></>}
              </Popup>
            </CircleMarker>
          ))}

          {showBus && stops.filter((s) => s.mode === "bus").map((stop) => (
            <CircleMarker
              key={stop.id}
              center={[stop.lat, stop.lon]}
              radius={4}
              pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.7, weight: 1 }}
            >
              <Popup>
                <strong>{stop.name ?? "Bus stop"}</strong><br />
                Bus stop
              </Popup>
            </CircleMarker>
          ))}

          {showRail && stops.filter((s) => s.mode === "rail").map((stop) => (
            <CircleMarker
              key={stop.id}
              center={[stop.lat, stop.lon]}
              radius={7}
              pathOptions={{ color: "#8b5cf6", fillColor: "#8b5cf6", fillOpacity: 0.8, weight: 1.5 }}
            >
              <Popup>
                <strong>{stop.name ?? "Station"}</strong><br />
                Rail / Subway
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* AQI legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-labs-textMuted">
        <span className="font-medium text-labs-text">PM2.5 AQI:</span>
        {[
          { label: "Good (<12)", color: "#10b981" },
          { label: "Moderate (<35)", color: "#f59e0b" },
          { label: "Sensitive (>35)", color: "#f97316" },
          { label: "Unhealthy (>55)", color: "#ef4444" },
          { label: "No data", color: "#94a3b8" },
        ].map((l) => (
          <span key={l.label} className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>

      {status === "done" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "AQI sensors", val: sensors.length > 0 ? sensors.length.toString() : "—" },
            { label: "Avg PM2.5", val: meanPm25 !== "—" ? `${meanPm25} µg/m³` : "—" },
            { label: "Rail stops", val: railCount.toString() },
            { label: "Bus stops", val: busCount.toString() },
          ].map((m) => (
            <div key={m.label} className="rounded-lg border border-labs-border bg-labs-panel2 p-3 text-center">
              <p className="text-xl font-bold text-labs-text">{m.val}</p>
              <p className="text-xs text-labs-textMuted">{m.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs text-labs-textMuted">
        {[
          { title: "Data sources", body: "OpenAQ v2 air quality sensors (live) · OpenStreetMap transit nodes · No API key required" },
          { title: "Use cases", body: "Urban planning & mobility analysis · Transit agency dashboards · Smart city AQI monitoring · EV & e-bike siting" },
          { title: "Production adds", body: "GTFS real-time feeds · Historical AQI trends · Census demographics · Equity index overlay" },
        ].map((c) => (
          <div key={c.title} className="rounded-lg border border-labs-border bg-labs-panel2 p-3">
            <p className="font-semibold text-labs-text text-sm">{c.title}</p>
            <p className="mt-1">{c.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
