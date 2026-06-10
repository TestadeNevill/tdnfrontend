import { useCallback, useState } from "react";
import { Circle, MapContainer, Popup, TileLayer, Marker, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

interface Tower {
  id: number;
  lat: number;
  lon: number;
  name?: string;
  height?: string;
  type?: string;
}

function haversineKm(la1: number, lo1: number, la2: number, lo2: number): number {
  const R = 6371, d2r = Math.PI / 180;
  const dLa = (la2 - la1) * d2r, dLo = (lo2 - lo1) * d2r;
  const a = Math.sin(dLa / 2) ** 2 + Math.cos(la1 * d2r) * Math.cos(la2 * d2r) * Math.sin(dLo / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function MapFly({ lat, lon, zoom }: { lat: number; lon: number; zoom: number }) {
  const map = useMap();
  useEffect(() => { map.flyTo([lat, lon], zoom, { duration: 1 }); }, [map, lat, lon, zoom]);
  return null;
}

async function geocode(q: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
      { headers: { "Accept-Language": "en-US" } },
    );
    const d = await r.json();
    if (!d[0]) return null;
    return { lat: parseFloat(d[0].lat), lon: parseFloat(d[0].lon) };
  } catch { return null; }
}

async function fetchTowers(lat: number, lon: number, radiusM = 20000): Promise<Tower[]> {
  const query = `[out:json][timeout:25];(node["man_made"="mast"]["tower:type"="communication"](around:${radiusM},${lat},${lon});node["man_made"="communications_tower"](around:${radiusM},${lat},${lon});node["man_made"="antenna"](around:${radiusM},${lat},${lon});way["man_made"="mast"](around:${radiusM},${lat},${lon});way["man_made"="communications_tower"](around:${radiusM},${lat},${lon}););out center 100;`;
  const r = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: query });
  const d = await r.json();
  return (d.elements ?? []).map((el: {
    id: number;
    lat?: number; lon?: number;
    center?: { lat: number; lon: number };
    tags?: Record<string, string>;
  }) => ({
    id: el.id,
    lat: el.lat ?? el.center?.lat ?? 0,
    lon: el.lon ?? el.center?.lon ?? 0,
    name: el.tags?.name,
    height: el.tags?.height,
    type: el.tags?.["tower:type"] ?? el.tags?.["man_made"],
  })).filter((t: Tower) => t.lat !== 0);
}

function towerIcon(selected: boolean) {
  const bg = selected ? "#059669" : "#6366f1";
  const size = selected ? 14 : 10;
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;background:${bg};border:2px solid white;border-radius:2px;box-shadow:0 1px 4px rgba(0,0,0,.5)"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const PRESETS = [
  { label: "New York", lat: 40.758, lon: -73.985 },
  { label: "Chicago", lat: 41.878, lon: -87.630 },
  { label: "Los Angeles", lat: 34.052, lon: -118.244 },
  { label: "Dallas", lat: 32.779, lon: -96.808 },
  { label: "Philadelphia", lat: 39.952, lon: -75.165 },
];

type Status = "idle" | "loading" | "done" | "error";

export function TelecomSiteMap() {
  const [center, setCenter] = useState<[number, number]>([40.758, -73.985]);
  const [towers, setTowers] = useState<Tower[]>([]);
  const [coverageM, setCoverageM] = useState(2000);
  const [status, setStatus] = useState<Status>("idle");
  const [cityQuery, setCityQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [moved, setMoved] = useState(false);

  const load = useCallback(async (lat: number, lon: number) => {
    setCenter([lat, lon]);
    setMoved(true);
    setTowers([]);
    setStatus("loading");
    setSelectedId(null);
    try {
      const t = await fetchTowers(lat, lon, 20000);
      setTowers(t);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }, []);

  const handlePreset = (p: { lat: number; lon: number }) => load(p.lat, p.lon);

  const handleCitySearch = async () => {
    if (!cityQuery.trim()) return;
    const geo = await geocode(cityQuery);
    if (geo) load(geo.lat, geo.lon);
  };

  const locate = () => {
    if (!navigator.geolocation) { load(40.758, -73.985); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => load(p.coords.latitude, p.coords.longitude),
      () => load(40.758, -73.985),
    );
  };

  const selectedTower = towers.find((t) => t.id === selectedId);
  const searchAreaKm2 = Math.PI * 20 * 20;
  const density = towers.length > 0 ? (towers.length / searchAreaKm2).toFixed(2) : "—";
  const coverageKm2 = towers.length * Math.PI * (coverageM / 1000) ** 2;
  const coveragePct = Math.min(100, Math.round((coverageKm2 / searchAreaKm2) * 100));

  return (
    <div className="space-y-4">
      <p className="max-w-2xl text-base leading-relaxed text-labs-textMuted">
        Locate existing communication towers from OpenStreetMap, visualize coverage radius, and
        identify coverage gaps — the same first step in any wireless site acquisition or network
        densification workflow. Adjust the coverage slider to model different antenna ranges.
      </p>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => handlePreset(p)}
            disabled={status === "loading"}
            className="rounded-full border border-labs-border bg-labs-panel2 px-3 py-1 text-xs font-medium text-labs-textMuted hover:border-labs-accent/30 hover:text-labs-accent disabled:opacity-50"
          >
            {p.label}
          </button>
        ))}
        <div className="flex gap-1.5">
          <input
            type="text"
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCitySearch()}
            placeholder="Other city…"
            className="w-32 rounded-md border border-labs-border bg-white/90 px-2 py-1 text-xs text-labs-text focus:border-labs-accent/40 focus:outline-none"
          />
          <button type="button" onClick={locate} className="rounded-md border border-labs-border bg-labs-panel2 px-2 py-1 text-xs text-labs-textMuted hover:text-labs-accent">
            My location
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-labs-textMuted">
          Coverage radius:
          <input
            type="range"
            min={500}
            max={5000}
            step={500}
            value={coverageM}
            onChange={(e) => setCoverageM(Number(e.target.value))}
            className="w-28 accent-labs-accent"
          />
          <span className="font-labsMono text-xs text-labs-text w-12">{(coverageM / 1000).toFixed(1)} km</span>
        </label>
      </div>

      {status === "loading" && (
        <p className="text-xs text-labs-textMuted animate-pulse">Fetching tower data from OpenStreetMap…</p>
      )}
      {status === "error" && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          Could not fetch tower data — check connection and try again.
        </p>
      )}

      {status === "idle" && (
        <p className="py-2 text-center text-sm text-labs-textMuted">Select a city above to load tower data</p>
      )}

      <div className="overflow-hidden rounded-lg border border-labs-border">
        <MapContainer center={center} zoom={12} className="h-80 w-full" scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {moved && <MapFly lat={center[0]} lon={center[1]} zoom={12} />}
          {towers.map((tower) => (
            <Circle
              key={`ring-${tower.id}`}
              center={[tower.lat, tower.lon]}
              radius={coverageM}
              pathOptions={{ color: "#6366f1", fillOpacity: 0.06, weight: 1 }}
            />
          ))}
          {towers.map((tower) => (
            <Marker
              key={tower.id}
              position={[tower.lat, tower.lon]}
              icon={towerIcon(selectedId === tower.id)}
              eventHandlers={{ click: () => setSelectedId(tower.id === selectedId ? null : tower.id) }}
            >
              <Popup>
                <strong>{tower.name ?? "Tower"}</strong><br />
                Type: {tower.type ?? "unknown"}<br />
                {tower.height && <>Height: {tower.height}<br /></>}
                {haversineKm(center[0], center[1], tower.lat, tower.lon).toFixed(1)} km from center
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="flex flex-wrap gap-2 text-[10px] text-labs-textMuted">
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-indigo-500" /> Tower (OSM)</span>
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-emerald-500" /> Selected tower</span>
        <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full border border-indigo-400 bg-indigo-100" /> Coverage ring ({(coverageM / 1000).toFixed(1)} km radius)</span>
      </div>

      {status === "done" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Towers found", val: towers.length.toString() },
            { label: "Density", val: `${density}/km²` },
            { label: "Est. coverage", val: `${coveragePct}%` },
            { label: "Search radius", val: "20 km" },
          ].map((m) => (
            <div key={m.label} className="rounded-lg border border-labs-border bg-labs-panel2 p-3 text-center">
              <p className="text-xl font-bold text-labs-text">{m.val}</p>
              <p className="text-xs text-labs-textMuted">{m.label}</p>
            </div>
          ))}
        </div>
      )}

      {selectedTower && (
        <div className="rounded-lg border border-labs-accent/30 bg-labs-accent/5 p-3 text-sm">
          <p className="font-semibold text-labs-text">{selectedTower.name ?? "Unnamed tower"}</p>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-labs-textMuted">
            <span>Type: {selectedTower.type ?? "unknown"}</span>
            {selectedTower.height && <span>Height: {selectedTower.height}</span>}
            <span>{haversineKm(center[0], center[1], selectedTower.lat, selectedTower.lon).toFixed(1)} km from center</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs text-labs-textMuted">
        {[
          { title: "Data sources", body: "OpenStreetMap communication towers & masts · Nominatim geocoding" },
          { title: "Use cases", body: "Site acquisition screening · Network densification planning · Rooftop lease origination · Coverage gap analysis" },
          { title: "Production adds", body: "FCC ASR tower registry · Building height data · Coverage model API · Zoning overlay for antenna permits" },
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
