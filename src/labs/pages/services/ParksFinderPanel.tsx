import { useCallback, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import fallbackCenters from "../../data/park-fallback-centers.json";
import type { ParkDetail } from "../../types";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

export function ParksFinderPanel() {
  const [center, setCenter] = useState<[number, number]>([40.758, -73.9855]);
  const [parks, setParks] = useState<ParkDetail[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "mock" | "rate-limited" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const loadParks = useCallback(async (lat: number, lng: number) => {
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/labs/parks/nearby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng }),
      });
      if (res.status === 429) {
        setStatus("rate-limited");
        setMessage("Rate limit reached — showing static fallback centers.");
        setParks(fallbackCenters as ParkDetail[]);
        return;
      }
      if (!res.ok) throw new Error("API unavailable");
      const data = (await res.json()) as { parks: ParkDetail[]; source?: string };
      setParks(data.parks);
      setStatus(data.source === "api" && data.parks.length > 0 ? "idle" : "mock");
      if (data.source !== "api" || data.parks.length === 0) {
        setMessage("No named parks found nearby — showing static fallback centers.");
        if (data.parks.length === 0) {
          setParks(fallbackCenters as ParkDetail[]);
        }
      }
    } catch {
      setStatus("mock");
      setMessage("Mock-only mode — no parks API configured. Showing static fallback centers.");
      setParks(fallbackCenters as ParkDetail[]);
    }
  }, []);

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setMessage("Geolocation not supported in this browser.");
      loadParks(center[0], center[1]);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCenter([latitude, longitude]);
        loadParks(latitude, longitude);
      },
      () => {
        setMessage("Could not get location — using default NYC center.");
        loadParks(center[0], center[1]);
      },
    );
  }, [center, loadParks]);

  useEffect(() => {
    loadParks(center[0], center[1]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-labs-text">Nearest Parks Finder</h3>
          <p className="mt-1 text-base text-labs-textMuted">
            Geolocation map with Overpass-backed lookup when API is available.
          </p>
        </div>
        <button
          type="button"
          onClick={locate}
          disabled={status === "loading"}
          className="rounded-md border border-labs-accent/40 bg-labs-accent/10 px-3 py-1.5 text-sm font-semibold text-labs-accent disabled:opacity-60"
        >
          {status === "loading" ? "Searching…" : "Use my location"}
        </button>
      </div>

      {(status === "mock" || status === "rate-limited") && message != null && (
        <p
          className={`rounded-md border px-3 py-2 text-xs ${status === "rate-limited" ? "border-labs-warning/30 bg-labs-warning/10 text-labs-warning" : "border-labs-border bg-labs-panel2 text-labs-textMuted"}`}
        >
          {message}
        </p>
      )}

      <div className="h-64 overflow-hidden rounded-lg border border-labs-border">
        <MapContainer center={center} zoom={12} className="h-full w-full" scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapRecenter lat={center[0]} lng={center[1]} />
          <Marker position={center}>
            <Popup>Your location</Popup>
          </Marker>
          {parks.map((park) => (
            <Marker key={`${park.name}-${park.lat}`} position={[park.lat, park.lng]}>
              <Popup>
                <strong>{park.name}</strong>
                {park.type != null && <br />}
                {park.type}
              </Popup>
            </Marker>
          ))}
          <Circle center={center} radius={2000} pathOptions={{ color: "#059669", fillOpacity: 0.05 }} />
        </MapContainer>
      </div>

      {parks.length > 0 && (
        <ul className="space-y-1.5 text-base text-labs-textMuted">
          {parks.map((park) => (
            <li key={park.name}>
              <span className="font-semibold text-labs-text">{park.name}</span>
              {park.type != null && ` — ${park.type}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
