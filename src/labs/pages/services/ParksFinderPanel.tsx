import { useCallback, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import fallbackCenters from "../../data/park-fallback-centers.json";
import type { ParkDetail } from "../../types";
import { ParkMarker } from "../../components/parks/ParkMarker";
import { ParkDetailModal } from "../../components/parks/ParkDetailModal";
import { enrichParksWithPhotoUrls, buildPhotoProxyUrl } from "../../utils/parkLinks";

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

type LoadStatus = "idle" | "loading" | "error" | "fallback" | "rate-limited" | "no-key";

const MAP_TOOLS = [
  "Leaflet / React-Leaflet",
  "OpenStreetMap & tile layers",
  "Google Maps Platform & Places",
  "Browser geolocation",
  "Secure server-side API proxies",
  "QGIS & geospatial exports",
  "PostGIS / spatial databases",
  "Custom GeoJSON & shapefiles",
] as const;

const MAP_CAPABILITIES = [
  "Interactive web maps embedded in sites and apps",
  "Nearest-place and radius search from any anchor point",
  "Custom markers, clusters, popups, and detail modals",
  "Photos, hours, contact, and directions from place APIs",
  "Search radii, polygons, and multi-layer overlays",
  "Branded UI that matches your product (not generic embeds)",
  "Graceful fallbacks when APIs rate-limit or keys are offline",
  "Mobile-friendly layouts with list + map sync",
] as const;

const BUSINESS_USE_CASES = [
  "Recreation & tourism — parks, trails, attractions near a visitor",
  "Retail & franchises — stores, dealers, or service territories",
  "Field operations — crews, assets, or job sites on a live map",
  "Real estate & development — parcels, comps, and amenity context",
  "Logistics & hubs — yards, ports, and multi-modal routing views",
  "Utilities & infrastructure — assets, outages, and work zones",
  "Municipal & community — libraries, clinics, cooling centers, events",
  "Marketing sites — “find us near you” with real place data",
] as const;

export function ParksFinderPanel() {
  const [center, setCenter] = useState<[number, number]>([40.758, -73.9855]);
  const [parks, setParks] = useState<ParkDetail[]>([]);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [selectedPark, setSelectedPark] = useState<ParkDetail | null>(null);

  const applyFallback = useCallback((msg: string, statusKind: LoadStatus = "fallback") => {
    setStatus(statusKind);
    setMessage(msg);
    setParks(enrichParksWithPhotoUrls(fallbackCenters as ParkDetail[]));
  }, []);

  const loadParks = useCallback(
    async (lat: number, lng: number) => {
      setStatus("loading");
      setMessage(null);
      setSelectedPark(null);

      try {
        const res = await fetch("/api/labs/parks/nearby", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat, lng }),
        });

        const data = (await res.json()) as {
          parks?: ParkDetail[];
          source?: string;
          error?: string;
          code?: string;
        };

        if (res.status === 429) {
          applyFallback("Rate limit reached — showing static fallback parks.", "rate-limited");
          return;
        }

        if (data.code === "missing_api_key" || res.status === 502 && data.code === "missing_api_key") {
          setStatus("no-key");
          setMessage(
            data.error ??
              "Google Places API key is not configured. Set GOOGLE_PLACES_API_KEY in environment variables.",
          );
          setParks([]);
          return;
        }

        if (!res.ok) {
          applyFallback(data.error ?? "Parks lookup unavailable — showing static fallback parks.");
          return;
        }

        const enriched = enrichParksWithPhotoUrls(data.parks ?? []).slice(0, 10);
        setParks(enriched);

        if (data.source === "api" && enriched.length > 0) {
          setStatus("idle");
          setMessage(null);
        } else {
          applyFallback("No parks found nearby — showing static fallback parks.");
        }
      } catch {
        applyFallback("Network error — showing static fallback parks.");
      }
    },
    [applyFallback],
  );

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

  const statusBannerClass =
    status === "no-key"
      ? "border-labs-warning/30 bg-labs-warning/10 text-labs-warning"
      : status === "rate-limited"
        ? "border-labs-warning/30 bg-labs-warning/10 text-labs-warning"
        : "border-labs-border bg-labs-panel2 text-labs-textMuted";

  return (
    <div className="space-y-6">
      <style>{`.park-marker-icon{background:transparent!important;border:none!important}`}</style>

      <div>
        <h3 className="text-base font-semibold text-labs-text">Custom maps &amp; place intelligence</h3>
        <p className="mt-2 max-w-4xl text-base leading-relaxed text-labs-textMuted">
          I build maps of all kinds — from simple “what’s near me?” finders to multi-layer
          infrastructure and logistics views. The live demo below is one example: nearest parks
          with photos, hours, and directions. The same patterns apply to stores, assets, sites,
          or any dataset you need on a map.
        </p>
      </div>

      <div>
        <h4 className="text-sm font-labsMono font-semibold uppercase tracking-wider text-labs-textMuted">
          Tools &amp; platforms
        </h4>
        <ul className="mt-2 flex flex-wrap gap-2">
          {MAP_TOOLS.map((tool) => (
            <li
              key={tool}
              className="rounded-full border border-labs-border bg-labs-panel2 px-3 py-1 text-sm font-medium text-labs-text"
            >
              {tool}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-labs-border bg-labs-panel2 p-4">
          <h4 className="text-sm font-semibold text-labs-text">Capabilities</h4>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-labs-textMuted">
            {MAP_CAPABILITIES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-labs-border bg-labs-panel2 p-4">
          <h4 className="text-sm font-semibold text-labs-text">Business use cases</h4>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-labs-textMuted">
            {BUSINESS_USE_CASES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-labs-border pt-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h4 className="text-base font-semibold text-labs-text">Live demo — Nearest Parks Finder</h4>
            <p className="mt-1 text-base text-labs-textMuted">
              Ten nearest parks from your location (or NYC by default) — photos, hours, contact
              info, and Google directions.
            </p>
          </div>
          <button
            type="button"
            onClick={locate}
            disabled={status === "loading" || status === "no-key"}
            className="rounded-md border border-labs-accent/40 bg-labs-accent/10 px-3 py-1.5 text-sm font-semibold text-labs-accent disabled:opacity-60"
          >
            {status === "loading" ? "Searching…" : "Use my location"}
          </button>
        </div>
      </div>

      {message != null && status !== "idle" && (
        <p className={`rounded-md border px-3 py-2 text-xs ${statusBannerClass}`}>{message}</p>
      )}

      <div className="min-h-[320px] overflow-hidden rounded-lg border border-labs-border">
        <MapContainer
          center={center}
          zoom={12}
          className="h-80 w-full"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapRecenter lat={center[0]} lng={center[1]} />
          <Marker position={center}>
            <Popup>Your location</Popup>
          </Marker>
          {parks.map((park) => (
            <ParkMarker
              key={park.id ?? `${park.name}-${park.lat}`}
              park={park}
              selected={selectedPark?.id === park.id || selectedPark?.name === park.name}
              onSelect={setSelectedPark}
            />
          ))}
          <Circle
            center={center}
            radius={2000}
            pathOptions={{ color: "#059669", fillOpacity: 0.05 }}
          />
        </MapContainer>
      </div>

      {parks.length > 0 && (
        <ul className="space-y-2">
          {parks.map((park) => {
            const thumb =
              park.photoUrl ??
              (park.photoRef ? buildPhotoProxyUrl(park.photoRef, 48) : undefined);
            const isSelected =
              selectedPark?.id === park.id || selectedPark?.name === park.name;

            return (
              <li key={park.id ?? `${park.name}-${park.lat}`}>
                <button
                  type="button"
                  onClick={() => setSelectedPark(park)}
                  className={`flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left transition-colors ${
                    isSelected
                      ? "border-labs-accent/50 bg-labs-accent/10"
                      : "border-labs-border bg-labs-panel2 hover:bg-white/60"
                  }`}
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-labs-border bg-emerald-100">
                    {thumb != null ? (
                      <img
                        src={thumb}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-emerald-600/30 text-xs font-semibold text-emerald-800">
                        Park
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-labs-text">{park.name}</span>
                    <span className="text-base text-labs-textMuted">
                      {[park.type, park.distanceKm != null ? `${park.distanceKm} km` : null]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <ParkDetailModal
        park={selectedPark}
        userLat={center[0]}
        userLng={center[1]}
        onClose={() => setSelectedPark(null)}
      />
    </div>
  );
}
