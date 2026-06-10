import { useCallback, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

void L;

type AssetStatus = "ok" | "warn" | "crit";
type AssetType = "Substation" | "Solar" | "BESS" | "Transformer" | "Meter";

interface FieldAsset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  lat: number;
  lng: number;
  lastService: string;
  nextService: string;
  crew: string;
  note: string;
}

const ASSETS: FieldAsset[] = [
  { id: "SUB-001", name: "Astoria Substation",      type: "Substation",  status: "ok",   lat: 40.772, lng: -73.930, lastService: "2026-02-10", nextService: "2026-08-10", crew: "Team 3", note: "All systems nominal" },
  { id: "SOL-001", name: "Bronx Solar Array A",     type: "Solar",       status: "warn", lat: 40.851, lng: -73.890, lastService: "2026-01-05", nextService: "2026-04-05", crew: "Team 1", note: "Inverter efficiency -8% — schedule inspection" },
  { id: "BES-001", name: "Brooklyn BESS",           type: "BESS",        status: "ok",   lat: 40.678, lng: -73.944, lastService: "2026-03-01", nextService: "2026-09-01", crew: "Team 2", note: "Charge cycles normal" },
  { id: "TRF-001", name: "Queens Transformer 12",   type: "Transformer", status: "crit", lat: 40.730, lng: -73.795, lastService: "2025-12-20", nextService: "2026-03-20", crew: "Team 4", note: "OVERDUE — temperature spike reported" },
  { id: "SOL-002", name: "Staten Island Solar B",   type: "Solar",       status: "ok",   lat: 40.579, lng: -74.151, lastService: "2026-02-28", nextService: "2026-08-28", crew: "Team 1", note: "Output tracking to plan" },
  { id: "MET-001", name: "Midtown Meter Bank 3",    type: "Meter",       status: "ok",   lat: 40.754, lng: -73.985, lastService: "2026-03-15", nextService: "2026-09-15", crew: "Team 5", note: "AMI reads clean" },
  { id: "SUB-002", name: "Newark Substation",       type: "Substation",  status: "warn", lat: 40.736, lng: -74.173, lastService: "2026-01-20", nextService: "2026-07-20", crew: "Team 3", note: "Phase B load unbalanced — monitor" },
  { id: "BES-002", name: "Weehawken BESS",          type: "BESS",        status: "ok",   lat: 40.769, lng: -74.020, lastService: "2026-03-10", nextService: "2026-09-10", crew: "Team 2", note: "All systems nominal" },
  { id: "TRF-002", name: "Hoboken Transformer",     type: "Transformer", status: "ok",   lat: 40.744, lng: -74.032, lastService: "2026-02-05", nextService: "2026-08-05", crew: "Team 4", note: "Nominal load" },
  { id: "SOL-003", name: "Harlem Solar Array",      type: "Solar",       status: "warn", lat: 40.812, lng: -73.946, lastService: "2025-11-30", nextService: "2026-02-28", crew: "Team 1", note: "Panel cleaning overdue" },
  { id: "MET-002", name: "JFK Area Meters",         type: "Meter",       status: "ok",   lat: 40.642, lng: -73.780, lastService: "2026-03-20", nextService: "2026-09-20", crew: "Team 5", note: "Smart meter rollout complete" },
  { id: "SUB-003", name: "Long Island City Sub",    type: "Substation",  status: "ok",   lat: 40.742, lng: -73.947, lastService: "2026-03-05", nextService: "2026-09-05", crew: "Team 3", note: "Capacity review Q3" },
  { id: "BES-003", name: "Greenpoint BESS",         type: "BESS",        status: "crit", lat: 40.729, lng: -73.951, lastService: "2025-12-01", nextService: "2026-03-01", crew: "Team 2", note: "FAULT — cell temp alarm triggered" },
  { id: "TRF-003", name: "Yonkers Transformer",     type: "Transformer", status: "ok",   lat: 40.931, lng: -73.889, lastService: "2026-02-15", nextService: "2026-08-15", crew: "Team 4", note: "Nominal" },
  { id: "SOL-004", name: "Flushing Rooftop Solar",  type: "Solar",       status: "ok",   lat: 40.768, lng: -73.833, lastService: "2026-03-12", nextService: "2026-09-12", crew: "Team 1", note: "Seasonal output on track" },
  { id: "MET-003", name: "South Bronx Meters",      type: "Meter",       status: "warn", lat: 40.816, lng: -73.919, lastService: "2026-01-10", nextService: "2026-04-10", crew: "Team 5", note: "3 AMI units offline — dispatch pending" },
];

const STATUS_COLORS: Record<AssetStatus, string> = {
  ok: "#10b981",
  warn: "#f59e0b",
  crit: "#ef4444",
};

const STATUS_LABELS: Record<AssetStatus, string> = {
  ok: "OK",
  warn: "Warning",
  crit: "Critical",
};

const TYPE_LABELS: AssetType[] = ["Substation", "Solar", "BESS", "Transformer", "Meter"];

function haversineKm(la1: number, lo1: number, la2: number, lo2: number): number {
  const R = 6371, d2r = Math.PI / 180;
  const dLa = (la2 - la1) * d2r, dLo = (lo2 - lo1) * d2r;
  const a = Math.sin(dLa / 2) ** 2 + Math.cos(la1 * d2r) * Math.cos(la2 * d2r) * Math.sin(dLo / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function FieldOpsMap() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<AssetType | "All">("All");
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "All">("All");
  const [nearestId, setNearestId] = useState<string | null>(null);

  const visible = ASSETS.filter(
    (a) => (typeFilter === "All" || a.type === typeFilter) && (statusFilter === "All" || a.status === statusFilter),
  );

  const selected = ASSETS.find((a) => a.id === selectedId);

  const locateNearest = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      let nearest = ASSETS[0];
      let minDist = Infinity;
      for (const a of ASSETS) {
        const d = haversineKm(latitude, longitude, a.lat, a.lng);
        if (d < minDist) { minDist = d; nearest = a; }
      }
      setNearestId(nearest.id);
      setSelectedId(nearest.id);
    });
  }, []);

  const critCount = ASSETS.filter((a) => a.status === "crit").length;
  const warnCount = ASSETS.filter((a) => a.status === "warn").length;
  const okCount = ASSETS.filter((a) => a.status === "ok").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-base leading-relaxed text-labs-textMuted">
          Plot and monitor field assets — substations, solar arrays, BESS units, transformers —
          with live status, crew assignment, and service schedules. Filter by type or status, click
          any asset for details. Adaptable to any industry with physical assets in the field.
        </p>
        <button
          type="button"
          onClick={locateNearest}
          className="shrink-0 rounded-md border border-labs-accent/40 bg-labs-accent/10 px-3 py-1.5 text-sm font-semibold text-labs-accent"
        >
          Find nearest asset
        </button>
      </div>

      {/* Status summary strip */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: `${critCount} Critical`, color: "#ef4444", bg: "bg-red-50", border: "border-red-200", text: "text-red-700", filter: "crit" as AssetStatus },
          { label: `${warnCount} Warning`, color: "#f59e0b", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", filter: "warn" as AssetStatus },
          { label: `${okCount} OK`, color: "#10b981", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", filter: "ok" as AssetStatus },
        ].map((s) => (
          <button
            key={s.filter}
            type="button"
            onClick={() => setStatusFilter(statusFilter === s.filter ? "All" : s.filter)}
            className={`rounded-full border px-3 py-0.5 text-xs font-semibold transition-colors ${s.bg} ${s.border} ${s.text} ${statusFilter === s.filter ? "ring-2 ring-offset-1" : ""}`}
            style={statusFilter === s.filter ? { ringColor: s.color } : {}}
          >
            {s.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setStatusFilter("All")}
          className={`rounded-full border border-labs-border px-3 py-0.5 text-xs font-medium text-labs-textMuted ${statusFilter === "All" ? "bg-labs-accent/10 text-labs-accent border-labs-accent/40" : "bg-labs-panel2"}`}
        >
          All statuses
        </button>
      </div>

      {/* Type filter */}
      <div className="flex flex-wrap gap-1.5">
        <span className="py-0.5 text-xs text-labs-textMuted">Type:</span>
        {(["All", ...TYPE_LABELS] as (AssetType | "All")[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTypeFilter(t)}
            className={[
              "rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
              typeFilter === t
                ? "border-labs-accent/40 bg-labs-accent/10 text-labs-accent"
                : "border-labs-border bg-labs-panel2 text-labs-textMuted hover:text-labs-accent",
            ].join(" ")}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-labs-border">
        <MapContainer center={[40.730, -73.950]} zoom={11} className="h-80 w-full" scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {visible.map((asset) => {
            const isSelected = asset.id === selectedId;
            const isNearest = asset.id === nearestId;
            return (
              <CircleMarker
                key={asset.id}
                center={[asset.lat, asset.lng]}
                radius={isSelected ? 12 : 8}
                pathOptions={{
                  color: STATUS_COLORS[asset.status],
                  fillColor: STATUS_COLORS[asset.status],
                  fillOpacity: isSelected ? 0.95 : 0.75,
                  weight: isNearest ? 3 : 2,
                }}
                eventHandlers={{ click: () => setSelectedId(asset.id === selectedId ? null : asset.id) }}
              >
                <Popup>
                  <strong>{asset.name}</strong><br />
                  {asset.type} · <span style={{ color: STATUS_COLORS[asset.status] }}>{STATUS_LABELS[asset.status]}</span><br />
                  {asset.note}
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-labs-textMuted">
        {(["ok", "warn", "crit"] as AssetStatus[]).map((s) => (
          <span key={s} className="flex items-center gap-1">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLORS[s] }} />
            {STATUS_LABELS[s]}
          </span>
        ))}
        <span className="text-labs-textMuted">· Click marker to select</span>
      </div>

      {selected && (
        <div
          className={`rounded-lg border p-4 ${selected.status === "crit" ? "border-red-200 bg-red-50" : selected.status === "warn" ? "border-amber-200 bg-amber-50" : "border-emerald-200 bg-emerald-50"}`}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-labs-text">{selected.name}</p>
              <p className="text-xs text-labs-textMuted">{selected.id} · {selected.type}</p>
            </div>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
              style={{ background: STATUS_COLORS[selected.status] }}
            >
              {STATUS_LABELS[selected.status]}
            </span>
          </div>
          <p className="mt-2 text-sm text-labs-text">{selected.note}</p>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-labs-textMuted">
            <span>Crew: <strong className="text-labs-text">{selected.crew}</strong></span>
            <span>Last service: <strong className="text-labs-text">{selected.lastService}</strong></span>
            <span>Next service: <strong className="text-labs-text">{selected.nextService}</strong></span>
          </div>
        </div>
      )}

      {/* Asset list */}
      <div className="max-h-48 overflow-y-auto rounded-lg border border-labs-border">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-labs-panel2">
            <tr>
              <th className="px-3 py-2 text-left font-labsMono font-semibold uppercase tracking-wider text-labs-textMuted">ID</th>
              <th className="px-3 py-2 text-left font-labsMono font-semibold uppercase tracking-wider text-labs-textMuted">Name</th>
              <th className="px-3 py-2 text-left font-labsMono font-semibold uppercase tracking-wider text-labs-textMuted hidden sm:table-cell">Type</th>
              <th className="px-3 py-2 text-left font-labsMono font-semibold uppercase tracking-wider text-labs-textMuted">Status</th>
              <th className="px-3 py-2 text-left font-labsMono font-semibold uppercase tracking-wider text-labs-textMuted hidden sm:table-cell">Crew</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((a) => (
              <tr
                key={a.id}
                onClick={() => setSelectedId(a.id === selectedId ? null : a.id)}
                className={`cursor-pointer border-t border-labs-border transition-colors ${selectedId === a.id ? "bg-labs-accent/10" : "hover:bg-labs-panel2"}`}
              >
                <td className="px-3 py-1.5 font-labsMono text-labs-textMuted">{a.id}</td>
                <td className="px-3 py-1.5 text-labs-text">{a.name}</td>
                <td className="px-3 py-1.5 text-labs-textMuted hidden sm:table-cell">{a.type}</td>
                <td className="px-3 py-1.5">
                  <span className="font-semibold" style={{ color: STATUS_COLORS[a.status] }}>{STATUS_LABELS[a.status]}</span>
                </td>
                <td className="px-3 py-1.5 text-labs-textMuted hidden sm:table-cell">{a.crew}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs text-labs-textMuted">
        {[
          { title: "Data sources", body: "Static JSON asset dataset · Browser geolocation for nearest-asset · OpenStreetMap base tiles" },
          { title: "Use cases", body: "Utility field ops · Solar & BESS fleet management · Construction site tracking · Property management" },
          { title: "Production adds", body: "Live IoT telemetry feed · CMMS work order integration · Photo upload · Crew mobile app sync" },
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
