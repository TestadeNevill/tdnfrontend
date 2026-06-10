import { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { ParkDetail } from "../types";
import type {
  ComparisonPin,
  PlaceInsight,
  ScenarioPresetId,
} from "./types/mapFeature";
import { useMapAnchor } from "./hooks/useMapAnchor";
import { useMultipleLayers } from "./hooks/useLayerData";
import {
  LAYER_REGISTRY,
  getPresetById,
  layersForPreset,
} from "./layerRegistry";
import { PresetSelector } from "./components/PresetSelector";
import { LayerPanel } from "./components/LayerPanel";
import { PlaceInsightPanel } from "./components/PlaceInsightPanel";
import { MapLayerOverlays } from "./components/MapLayerOverlays";
import { ComparisonTray } from "./components/ComparisonTray";
import { LayerMetadataStrip } from "./components/LayerMetadataStrip";
import { computeMatchScore } from "./scoring/matchScore";
import { enrichParksWithPhotoUrls, buildPhotoProxyUrl } from "../utils/parkLinks";
import { parkFromFeature } from "./utils/placeFromFeature";
import fallbackCenters from "../data/park-fallback-centers.json";

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

export function MapWorkbench() {
  const { anchor, setCenter, setRadiusM, bboxFromAnchor } = useMapAnchor();
  const [presetId, setPresetId] = useState<ScenarioPresetId>("park-finder");
  const [visibility, setVisibility] = useState<Record<string, boolean>>({});
  const [filtersByLayer, setFiltersByLayer] = useState<Record<string, Record<string, unknown>>>({});
  const [parks, setParks] = useState<ParkDetail[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceInsight | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [comparisonPins, setComparisonPins] = useState<ComparisonPin[]>([]);

  const preset = getPresetById(presetId);
  const activeLayers = useMemo(() => layersForPreset(presetId), [presetId]);
  const bbox = useMemo(() => bboxFromAnchor(), [bboxFromAnchor]);

  useEffect(() => {
    const vis: Record<string, boolean> = {};
    const filters: Record<string, Record<string, unknown>> = {};

    LAYER_REGISTRY.forEach((layer) => {
      vis[layer.id] = preset?.layers.includes(layer.id) ?? layer.defaultVisible;
      const layerFilters: Record<string, unknown> = {};
      layer.filters.forEach((f) => {
        if (f.defaultValue !== undefined) layerFilters[f.id] = f.defaultValue;
      });
      if (layer.id === "isochrone" && preset?.isochroneMinutes) {
        layerFilters.minutes = String(preset.isochroneMinutes);
      }
      if (layer.id === "parks" && preset?.amenityFilters) {
        preset.amenityFilters.forEach((af) => {
          if (af === "playground") layerFilters.playground = true;
          if (af === "bathroom") layerFilters.bathroom = true;
          if (af === "waterFountain") layerFilters.waterFountain = true;
        });
      }
      filters[layer.id] = layerFilters;
    });

    setVisibility(vis);
    setFiltersByLayer(filters);
  }, [presetId, preset]);

  const layerResults = useMultipleLayers(activeLayers, visibility, anchor, filtersByLayer, bbox);

  useEffect(() => {
    const parksData = layerResults.parks?.data;
    if (!parksData) return;

    const metaParks = (parksData.meta?.parks as ParkDetail[]) ?? [];
    if (metaParks.length > 0) {
      setParks(enrichParksWithPhotoUrls(metaParks));
      setStatusMessage(null);
    } else if (parksData.features?.length) {
      const fromFeatures: ParkDetail[] = parksData.features
        .map((f) => parkFromFeature(f))
        .filter((p): p is PlaceInsight => p != null);
      if (fromFeatures.length > 0) {
        setParks(enrichParksWithPhotoUrls(fromFeatures));
      }
    }
  }, [layerResults.parks?.data]);

  const layerDataMap = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(layerResults).map(([k, v]) => [k, v.data]),
      ) as Record<string, (typeof layerResults)[string]["data"]>,
    [layerResults],
  );

  useEffect(() => {
    setSelectedPlace((prev) => {
      if (!prev) return null;
      const isPark = !prev.layerId || prev.layerId === "parks";
      if (!isPark) return prev;

      const matchScore = computeMatchScore({
        park: prev,
        anchorLat: anchor.lat,
        anchorLng: anchor.lng,
        layerResults: layerDataMap,
        presetId,
        isochroneMinutes: preset?.isochroneMinutes,
      });

      if (
        prev.matchScore?.score === matchScore.score &&
        prev.matchScore?.presetId === matchScore.presetId
      ) {
        return prev;
      }

      return { ...prev, matchScore };
    });
  }, [presetId, preset, layerDataMap, anchor.lat, anchor.lng]);

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      setStatusMessage("Geolocation not supported.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter(pos.coords.latitude, pos.coords.longitude);
        setStatusMessage(null);
      },
      () => setStatusMessage("Could not get location — using NYC default."),
    );
  }, [setCenter]);

  const handleSearch = useCallback(async () => {
    if (searchQuery.trim().length < 3) return;
    setLoading(true);
    try {
      const res = await fetch("/api/labs/maps/geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: anchor.lat,
          lng: anchor.lng,
          filters: { query: searchQuery },
        }),
      });
      const data = await res.json();
      const first = data.meta?.results?.[0];
      if (first) {
        setCenter(first.lat, first.lng);
        setStatusMessage(`Moved to ${first.name}`);
      }
    } catch {
      setStatusMessage("Search failed.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, anchor, setCenter]);

  const handleSelectPlace = useCallback(
    (place: PlaceInsight) => {
      const isPark = !place.layerId || place.layerId === "parks";
      const matchScore = isPark
        ? computeMatchScore({
            park: place,
            anchorLat: anchor.lat,
            anchorLng: anchor.lng,
            layerResults: layerDataMap,
            presetId,
            isochroneMinutes: preset?.isochroneMinutes,
          })
        : undefined;

      setSelectedPlace({ ...place, layerId: place.layerId ?? "parks", matchScore });
    },
    [layerDataMap, anchor, presetId, preset],
  );

  const handleComparePin = useCallback(() => {
    if (!selectedPlace) return;
    setComparisonPins((prev) => {
      const next: ComparisonPin = {
        id: prev.length === 0 ? "A" : "B",
        lat: selectedPlace.lat,
        lng: selectedPlace.lng,
        label: selectedPlace.name,
        score: selectedPlace.matchScore,
      };
      if (prev.length >= 2) return [next];
      return [...prev, next];
    });
  }, [selectedPlace]);

  const handleToggleLayer = useCallback((layerId: string) => {
    setVisibility((v) => ({ ...v, [layerId]: !v[layerId] }));
  }, []);

  const handleFilterChange = useCallback(
    (layerId: string, filterId: string, value: unknown) => {
      setFiltersByLayer((f) => ({
        ...f,
        [layerId]: { ...f[layerId], [filterId]: value },
      }));
    },
    [],
  );

  const handleExportScout = useCallback(() => {
    const scoutData = layerResults["business-scout"]?.data;
    const rows = scoutData?.meta?.exportRows as Record<string, unknown>[] | undefined;
    if (!rows?.length) {
      setStatusMessage("No business scout data to export.");
      return;
    }
    const headers = ["name", "lat", "lng", "website", "phone", "weakPresence"];
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        headers.map((h) => JSON.stringify(r[h] ?? "")).join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "business-scout-leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [layerResults]);

  const anyLoading = Object.values(layerResults).some((r) => r.loading);
  const parksMeta = layerResults.parks?.data?.meta;
  const parksLoading = layerResults.parks?.loading ?? false;
  const displayParks =
    parks.length > 0
      ? parks
      : visibility.parks && !parksLoading
        ? enrichParksWithPhotoUrls(fallbackCenters as ParkDetail[])
        : [];

  return (
    <div className="space-y-6">
      <style>{`.park-marker-icon{background:transparent!important;border:none!important}`}</style>

      <div>
        <h3 className="text-base font-semibold text-labs-text">
          Park &amp; neighborhood decision map
        </h3>
        <p className="mt-2 max-w-4xl text-base leading-relaxed text-labs-textMuted">
          A decision map that answers &ldquo;Is this place good for my situation?&rdquo; — walk
          time, amenities, weather, air quality, transit, civic context, and explainable match
          scores. NYC-first demo powered by free-tier APIs.
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[200px] flex-1">
          <label htmlFor="map-search" className="text-xs text-labs-textMuted">
            Search address
          </label>
          <div className="mt-1 flex gap-2">
            <input
              id="map-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g. Central Park, NYC"
              className="flex-1 rounded-md border border-labs-border bg-labs-panel2 px-3 py-1.5 text-sm"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="rounded-md border border-labs-border px-3 py-1.5 text-sm"
            >
              Search
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLocate}
          className="rounded-md border border-labs-accent/40 bg-labs-accent/10 px-3 py-1.5 text-sm font-semibold text-labs-accent"
        >
          Near me
        </button>
      </div>

      {statusMessage && (
        <p className="rounded-md border border-labs-border bg-labs-panel2 px-3 py-2 text-xs text-labs-textMuted">
          {statusMessage}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <aside className="space-y-4 xl:col-span-3">
          <PresetSelector value={presetId} onChange={setPresetId} />
          <div>
            <label htmlFor="radius-slider" className="text-xs text-labs-textMuted">
              Search radius: {Math.round(anchor.radiusM / 100) / 10} km
            </label>
            <input
              id="radius-slider"
              type="range"
              min={500}
              max={5000}
              step={250}
              value={anchor.radiusM}
              onChange={(e) => setRadiusM(Number(e.target.value))}
              className="mt-1 w-full"
            />
          </div>
          <LayerPanel
            layers={LAYER_REGISTRY}
            visibility={visibility}
            filtersByLayer={filtersByLayer}
            onToggle={handleToggleLayer}
            onFilterChange={handleFilterChange}
          />
        </aside>

        <div className="space-y-3 xl:col-span-6">
          <div className="min-h-[360px] overflow-hidden rounded-lg border border-labs-border">
            <MapContainer
              center={[anchor.lat, anchor.lng]}
              zoom={13}
              className="h-96 w-full"
              scrollWheelZoom
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapRecenter lat={anchor.lat} lng={anchor.lng} />
              <Marker position={[anchor.lat, anchor.lng]}>
                <Popup>Your anchor</Popup>
              </Marker>
              <MapLayerOverlays
                layerResults={layerDataMap}
                visibility={visibility}
                parks={displayParks}
                selectedPlace={selectedPlace}
                onSelectPlace={handleSelectPlace}
                anchorLat={anchor.lat}
                anchorLng={anchor.lng}
              />
            </MapContainer>
          </div>

          {anyLoading && (
            <p className="text-xs text-labs-textMuted">Loading map layers…</p>
          )}

          <LayerMetadataStrip meta={parksMeta ?? undefined} />

          {visibility["business-scout"] && (
            <button
              type="button"
              onClick={handleExportScout}
              className="rounded-md border border-labs-border px-3 py-1.5 text-xs text-labs-text"
            >
              Export scout leads (CSV)
            </button>
          )}

          <ComparisonTray pins={comparisonPins} onClear={() => setComparisonPins([])} />

          {displayParks.length > 0 && (
            <ul className="max-h-48 space-y-1 overflow-y-auto">
              {displayParks.map((park) => {
                const thumb =
                  park.photoUrl ??
                  (park.photoRef ? buildPhotoProxyUrl(park.photoRef, 48) : undefined);
                const isSelected =
                  selectedPlace?.id === park.id || selectedPlace?.name === park.name;
                return (
                  <li key={park.id ?? park.name}>
                    <button
                      type="button"
                      onClick={() => handleSelectPlace({ ...park, layerId: "parks" })}
                      className={`flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-sm ${
                        isSelected
                          ? "border-labs-accent/50 bg-labs-accent/10"
                          : "border-labs-border bg-labs-panel2"
                      }`}
                    >
                      {thumb && (
                        <img src={thumb} alt="" className="h-8 w-8 rounded-full object-cover" />
                      )}
                      <span className="truncate font-medium">{park.name}</span>
                      {park.distanceKm != null && (
                        <span className="ml-auto text-xs text-labs-textMuted">
                          {park.distanceKm} km
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <aside className="xl:col-span-3">
          <PlaceInsightPanel
            place={selectedPlace}
            userLat={anchor.lat}
            userLng={anchor.lng}
            layerResults={layerDataMap}
            onClose={() => setSelectedPlace(null)}
            onComparePin={handleComparePin}
          />
        </aside>
      </div>
    </div>
  );
}
