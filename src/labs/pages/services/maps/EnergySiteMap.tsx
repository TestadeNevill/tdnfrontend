import { useCallback, useEffect, useState } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

// Latitude-based GHI proxy (kWh/m²/day)
function latGHI(lat: number): number {
  const a = Math.abs(lat);
  if (a < 25) return 5.8;
  if (a < 30) return 5.5;
  if (a < 33) return 5.2;
  if (a < 37) return 4.9;
  if (a < 40) return 4.5;
  if (a < 43) return 4.1;
  if (a < 46) return 3.7;
  return 3.3;
}

function solarScore(ghi: number): number {
  return Math.max(8, Math.round(((ghi - 3.3) / 2.5) * 38));
}

function gridScore(km: number | null): number {
  if (km === null) return 5;
  if (km < 2) return 40;
  if (km < 8) return 35;
  if (km < 20) return 28;
  if (km < 40) return 18;
  if (km < 60) return 10;
  return 5;
}

const LAND_SCORES: Record<string, number> = {
  farmland: 20, meadow: 20, brownfield: 20, industrial: 18,
  grass: 17, commercial: 15, retail: 13, residential: 8,
  forest: 4, wetland: 3, nature_reserve: 2, national_park: 2,
};

function landScore(use: string): number {
  return LAND_SCORES[use] ?? 10;
}

function haversineKm(la1: number, lo1: number, la2: number, lo2: number): number {
  const R = 6371, d2r = Math.PI / 180;
  const dLa = (la2 - la1) * d2r, dLo = (lo2 - lo1) * d2r;
  const a = Math.sin(dLa / 2) ** 2 + Math.cos(la1 * d2r) * Math.cos(la2 * d2r) * Math.sin(dLo / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function scoreColor(total: number): string {
  if (total >= 70) return "#059669";
  if (total >= 50) return "#d97706";
  return "#dc2626";
}

function scoreLabel(total: number): string {
  if (total >= 70) return "Strong candidate";
  if (total >= 50) return "Moderate — review needed";
  return "Challenging constraints";
}

interface Substation {
  id: number;
  lat: number;
  lon: number;
  name?: string;
  distKm: number;
}

function ClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onMapClick(e.latlng.lat, e.latlng.lng) });
  return null;
}

type Status = "idle" | "loading" | "done" | "error";

export function EnergySiteMap() {
  const [pin, setPin] = useState<[number, number] | null>(null);
  const [subs, setSubs] = useState<Substation[]>([]);
  const [landUse, setLandUse] = useState<string>("unknown");
  const [status, setStatus] = useState<Status>("idle");

  const analyze = useCallback(async (lat: number, lng: number) => {
    setPin([lat, lng]);
    setSubs([]);
    setLandUse("unknown");
    setStatus("loading");
    try {
      const [subsData, landData] = await Promise.allSettled([
        fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          body: `[out:json][timeout:20];(node["power"="substation"](around:60000,${lat},${lng});way["power"="substation"](around:60000,${lat},${lng}););out center 20;`,
        }).then((r) => r.json()),
        fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          body: `[out:json][timeout:10];(way["landuse"](around:200,${lat},${lng}););out tags 3;`,
        }).then((r) => r.json()),
      ]);

      if (subsData.status === "fulfilled") {
        const parsed: Substation[] = (subsData.value.elements ?? [])
          .map((el: { id: number; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string> }) => {
            const elLat = el.lat ?? el.center?.lat ?? 0;
            const elLon = el.lon ?? el.center?.lon ?? 0;
            return { id: el.id, lat: elLat, lon: elLon, name: el.tags?.name, distKm: haversineKm(lat, lng, elLat, elLon) };
          })
          .filter((s: Substation) => s.lat !== 0)
          .sort((a: Substation, b: Substation) => a.distKm - b.distKm);
        setSubs(parsed);
      }

      if (landData.status === "fulfilled") {
        const lu = landData.value.elements?.[0]?.tags?.landuse ?? "unknown";
        setLandUse(lu);
      }

      setStatus("done");
    } catch {
      setStatus("error");
    }
  }, []);

  const locate = useCallback(() => {
    if (!navigator.geolocation) { analyze(37.5, -119); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => analyze(p.coords.latitude, p.coords.longitude),
      () => analyze(37.5, -119),
    );
  }, [analyze]);

  const nearestKm = subs[0]?.distKm ?? null;
  const ghi = pin ? latGHI(pin[0]) : 0;
  const ss = pin ? solarScore(ghi) : 0;
  const gs = gridScore(nearestKm);
  const ls = landScore(landUse);
  const total = ss + gs + ls;

  const subIcon = L.divIcon({
    className: "",
    html: `<div style="width:10px;height:10px;background:#d97706;border:2px solid white;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,.4)"></div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-base leading-relaxed text-labs-textMuted">
          Click anywhere on the map to screen a renewable energy site. Real substation locations
          from OpenStreetMap plus a latitude-based solar resource estimate — the same first-pass
          signals used in early-stage solar and BESS site selection.
        </p>
        <button
          type="button"
          onClick={locate}
          className="shrink-0 rounded-md border border-labs-accent/40 bg-labs-accent/10 px-3 py-1.5 text-sm font-semibold text-labs-accent"
        >
          Use my location
        </button>
      </div>

      {status === "loading" && (
        <p className="text-xs text-labs-textMuted animate-pulse">Fetching substation data from OpenStreetMap…</p>
      )}
      {status === "error" && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          Could not reach Overpass API — check connection and try again.
        </p>
      )}

      <div className="overflow-hidden rounded-lg border border-labs-border" style={{ cursor: "crosshair" }}>
        <MapContainer center={[38, -98]} zoom={4} className="h-80 w-full" scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onMapClick={analyze} />
          {pin && (
            <>
              <Marker position={pin}>
                <Popup>Candidate site<br />{pin[0].toFixed(4)}, {pin[1].toFixed(4)}</Popup>
              </Marker>
              <Circle
                center={pin}
                radius={60000}
                pathOptions={{ color: "#059669", fillOpacity: 0.04, weight: 1.5, dashArray: "6 4" }}
              />
            </>
          )}
          {subs.slice(0, 6).map((sub) => (
            <Marker key={sub.id} position={[sub.lat, sub.lon]} icon={subIcon}>
              <Popup>
                <strong>Substation</strong><br />
                {sub.name ?? "Unnamed"}<br />
                {sub.distKm.toFixed(1)} km from site
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {!pin && status === "idle" && (
        <p className="py-2 text-center text-sm text-labs-textMuted">Click anywhere on the map to drop a candidate site pin</p>
      )}

      {status === "done" && pin && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-labs-border bg-labs-panel2 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-labs-text">Site Score</span>
              <span className="text-2xl font-bold" style={{ color: scoreColor(total) }}>
                {total}<span className="text-sm font-normal text-labs-textMuted">/100</span>
              </span>
            </div>
            <p className="mt-0.5 text-xs" style={{ color: scoreColor(total) }}>{scoreLabel(total)}</p>
            <div className="mt-3 space-y-3">
              {[
                { label: "Solar resource", val: ss, max: 38, note: `${ghi.toFixed(1)} kWh/m²/day est. (latitude proxy)` },
                { label: "Grid proximity", val: gs, max: 40, note: nearestKm ? `${nearestKm.toFixed(1)} km to nearest substation` : "No substation found in 60 km" },
                { label: "Land use", val: ls, max: 20, note: landUse === "unknown" ? "No OSM landuse tag at this point" : landUse },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex justify-between text-xs">
                    <span className="text-labs-textMuted">{row.label}</span>
                    <span className="font-labsMono text-labs-text">{row.val}/{row.max}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/60">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(row.val / row.max) * 100}%`, background: scoreColor(total) }}
                    />
                  </div>
                  <p className="mt-0.5 text-[10px] text-labs-textMuted">{row.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-labs-border bg-labs-panel2 p-4">
            <p className="text-sm font-semibold text-labs-text">Nearest substations</p>
            <div className="mt-1 mb-2 flex gap-3 text-[10px] text-labs-textMuted">
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
                Substation (OSM)
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Candidate site
              </span>
            </div>
            {subs.length === 0 ? (
              <p className="text-xs text-labs-textMuted">None found within 60 km</p>
            ) : (
              <ul className="space-y-1.5">
                {subs.slice(0, 6).map((sub) => (
                  <li key={sub.id} className="flex items-center justify-between text-xs">
                    <span className="truncate max-w-[60%] text-labs-text">{sub.name ?? "Unnamed substation"}</span>
                    <span className="font-labsMono text-labs-textMuted">{sub.distKm.toFixed(1)} km</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-[10px] text-labs-textMuted leading-relaxed">
              Substation data: OpenStreetMap · Solar: latitude proxy · Screening-grade only — not bankable feasibility
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs text-labs-textMuted">
        {[
          { title: "Data sources", body: "OpenStreetMap substations · Latitude-based GHI estimate · OSM land use polygons" },
          { title: "Use cases", body: "Solar & BESS site screening · Hydrogen land search · Utility-scale project origination" },
          { title: "Production adds", body: "NREL PVWatts API · EIA transmission lines · HIFLD protected lands · Parcel data" },
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
