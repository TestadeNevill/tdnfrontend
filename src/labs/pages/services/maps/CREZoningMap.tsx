import { useState } from "react";
import { MapContainer, TileLayer, Polygon, Popup, Marker, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

const LU_STYLES: Record<string, { fill: string; label: string }> = {
  commercial:  { fill: "#3b82f6", label: "Commercial" },
  retail:      { fill: "#8b5cf6", label: "Retail" },
  industrial:  { fill: "#f59e0b", label: "Industrial" },
  residential: { fill: "#10b981", label: "Residential" },
  office:      { fill: "#6366f1", label: "Office" },
  mixed:       { fill: "#06b6d4", label: "Mixed Use" },
};

function luColor(key: string): string {
  return LU_STYLES[key]?.fill ?? "#94a3b8";
}

interface LuFeature {
  id: number;
  landuse: string;
  name?: string;
  positions: [number, number][];
}

interface AmenityCounts {
  restaurants: number;
  shops: number;
  transit: number;
}

function MapFly({ lat, lon, zoom }: { lat: number; lon: number; zoom: number }) {
  const map = useMap();
  useEffect(() => { map.flyTo([lat, lon], zoom, { duration: 1 }); }, [map, lat, lon, zoom]);
  return null;
}

async function geocode(q: string): Promise<{ lat: number; lon: number; name: string } | null> {
  try {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,
      { headers: { "Accept-Language": "en-US" } },
    );
    const d = await r.json();
    if (!d[0]) return null;
    return { lat: parseFloat(d[0].lat), lon: parseFloat(d[0].lon), name: d[0].display_name.split(",")[0] };
  } catch { return null; }
}

async function fetchLanduse(lat: number, lon: number): Promise<LuFeature[]> {
  const dlat = 0.042, dlon = 0.065;
  const bbox = `${lat - dlat},${lon - dlon},${lat + dlat},${lon + dlon}`;
  const query = `[out:json][timeout:25];(way["landuse"~"commercial|retail|industrial|residential|office|mixed"](${bbox}););out geom 50;`;
  const r = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: query });
  const d = await r.json();
  return (d.elements ?? [])
    .filter((el: { geometry?: unknown[] }) => (el.geometry as unknown[])?.length > 2)
    .map((el: { id: number; geometry: { lat: number; lon: number }[]; tags?: Record<string, string> }) => ({
      id: el.id,
      landuse: el.tags?.landuse ?? "other",
      name: el.tags?.name,
      positions: el.geometry.map((p) => [p.lat, p.lon] as [number, number]),
    }));
}

async function fetchAmenities(lat: number, lon: number): Promise<AmenityCounts> {
  const query = `[out:json][timeout:15];(node["amenity"~"restaurant|cafe|fast_food"](around:2000,${lat},${lon});node["shop"](around:2000,${lat},${lon});node["highway"="bus_stop"](around:2000,${lat},${lon});node["railway"~"station|subway_entrance|tram_stop"](around:2500,${lat},${lon}););out 200;`;
  const r = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: query });
  const d = await r.json();
  const els = d.elements ?? [];
  return {
    restaurants: els.filter((e: { tags?: Record<string, string> }) => ["restaurant", "cafe", "fast_food"].includes(e.tags?.amenity ?? "")).length,
    shops: els.filter((e: { tags?: Record<string, string> }) => e.tags?.shop).length,
    transit: els.filter((e: { tags?: Record<string, string> }) => e.tags?.highway === "bus_stop" || ["station", "subway_entrance", "tram_stop"].includes(e.tags?.railway ?? "")).length,
  };
}

const QUICK_CITIES = ["Chicago, IL", "Denver, CO", "Austin, TX", "Atlanta, GA", "Seattle, WA", "Miami, FL"];

type Status = "idle" | "loading" | "done" | "error";

export function CREZoningMap() {
  const [query, setQuery] = useState("");
  const [center, setCenter] = useState<[number, number]>([40.758, -73.985]);
  const [cityName, setCityName] = useState<string | null>(null);
  const [features, setFeatures] = useState<LuFeature[]>([]);
  const [amenities, setAmenities] = useState<AmenityCounts | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  const runSearch = async (q: string) => {
    if (!q.trim()) return;
    setStatus("loading");
    setFeatures([]);
    setAmenities(null);
    const geo = await geocode(q);
    if (!geo) { setStatus("error"); return; }
    setCenter([geo.lat, geo.lon]);
    setCityName(geo.name);
    try {
      const [f, a] = await Promise.all([fetchLanduse(geo.lat, geo.lon), fetchAmenities(geo.lat, geo.lon)]);
      setFeatures(f);
      setAmenities(a);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const luCounts = features.reduce<Record<string, number>>((acc, f) => {
    acc[f.landuse] = (acc[f.landuse] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <p className="max-w-2xl text-base leading-relaxed text-labs-textMuted">
        Search any city to see real commercial, retail, and industrial land use zones from
        OpenStreetMap — with nearby amenity counts. The same pattern powers CRE market analysis,
        franchise site selection, and retail expansion tools.
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runSearch(query)}
          placeholder="City or neighborhood — e.g. Midtown Atlanta, South Loop Chicago…"
          className="min-w-0 flex-1 rounded-md border border-labs-border bg-white/90 px-3 py-2 text-sm text-labs-text focus:border-labs-accent/40 focus:outline-none focus:ring-1 focus:ring-labs-accent/30"
        />
        <button
          type="button"
          onClick={() => runSearch(query)}
          disabled={status === "loading"}
          className="shrink-0 rounded-md border border-labs-accent/40 bg-labs-accent/10 px-4 py-2 text-sm font-semibold text-labs-accent disabled:opacity-60"
        >
          {status === "loading" ? "Loading…" : "Search"}
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {QUICK_CITIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => { setQuery(c); runSearch(c); }}
            className="rounded-full border border-labs-border bg-labs-panel2 px-2.5 py-0.5 text-xs font-medium text-labs-textMuted hover:border-labs-accent/30 hover:text-labs-accent"
          >
            {c}
          </button>
        ))}
      </div>

      {status === "error" && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          City not found or Overpass API unavailable — try a major city name.
        </p>
      )}

      <div className="overflow-hidden rounded-lg border border-labs-border">
        <MapContainer center={center} zoom={14} className="h-80 w-full" scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {cityName && <MapFly lat={center[0]} lon={center[1]} zoom={14} />}
          {features.map((f) => (
            <Polygon
              key={f.id}
              positions={f.positions}
              pathOptions={{ color: luColor(f.landuse), fillOpacity: 0.35, weight: 1.5 }}
            >
              <Popup>
                <strong>{f.name ?? LU_STYLES[f.landuse]?.label ?? f.landuse}</strong><br />
                <span style={{ color: luColor(f.landuse) }}>{LU_STYLES[f.landuse]?.label ?? f.landuse}</span>
              </Popup>
            </Polygon>
          ))}
          {cityName && <Marker position={center}><Popup>{cityName}</Popup></Marker>}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {Object.entries(LU_STYLES).map(([key, val]) => (
          <span key={key} className="flex items-center gap-1.5 text-xs text-labs-textMuted">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: val.fill }} />
            {val.label}{luCounts[key] ? ` (${luCounts[key]})` : ""}
          </span>
        ))}
      </div>

      {status === "idle" && (
        <p className="py-2 text-center text-sm text-labs-textMuted">Enter a city name to load land use zones</p>
      )}

      {amenities && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Restaurants & cafes", val: amenities.restaurants },
            { label: "Retail shops", val: amenities.shops },
            { label: "Transit stops", val: amenities.transit },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-labs-border bg-labs-panel2 p-3 text-center">
              <p className="text-2xl font-bold text-labs-text">{item.val}</p>
              <p className="text-xs text-labs-textMuted leading-tight mt-0.5">{item.label}</p>
              <p className="text-[10px] text-labs-textMuted">within 2 km</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs text-labs-textMuted">
        {[
          { title: "Data sources", body: "OpenStreetMap land use · Nominatim geocoding · OSM amenity & transit nodes" },
          { title: "Use cases", body: "CRE market analysis · Franchise site selection · Retail expansion · Zoning due diligence" },
          { title: "Production adds", body: "County parcel boundaries · Zoning code overlays · Census demographics · Walk score API" },
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
