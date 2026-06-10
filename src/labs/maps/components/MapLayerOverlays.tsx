import { GeoJSON, CircleMarker, Polyline } from "react-leaflet";
import type { LayerApiResponse, PlaceInsight } from "../types/mapFeature";
import type { ParkDetail } from "../../types";
import { ParkMarker } from "../../components/parks/ParkMarker";
import { placeFromFeature } from "../utils/placeFromFeature";

interface MapLayerOverlaysProps {
  layerResults: Record<string, LayerApiResponse | null | undefined>;
  visibility: Record<string, boolean>;
  parks: ParkDetail[];
  selectedPlace: PlaceInsight | null;
  onSelectPlace: (place: PlaceInsight) => void;
  anchorLat: number;
  anchorLng: number;
}

function selectFeature(
  f: GeoJSON.Feature,
  layerResults: Record<string, LayerApiResponse | null | undefined>,
  onSelectPlace: (place: PlaceInsight) => void,
) {
  const place = placeFromFeature(f, layerResults);
  if (place) onSelectPlace(place);
}

export function MapLayerOverlays({
  layerResults,
  visibility,
  parks,
  selectedPlace,
  onSelectPlace,
  anchorLat,
  anchorLng,
}: MapLayerOverlaysProps) {
  const isoFeatures =
    layerResults.isochrone?.features?.filter(
      (f) => f.geometry?.type === "Polygon" || f.geometry?.type === "MultiPolygon",
    ) ?? [];

  const amenityFeatures =
    layerResults.parks?.features?.filter((f) => f.properties?.layerId === "amenities") ?? [];

  const transitStops =
    layerResults.transit?.features?.filter((f) => f.properties?.layerId === "transit") ?? [];
  const transitRoutes =
    layerResults.transit?.features?.filter((f) => f.properties?.layerId === "transit-routes") ?? [];

  const hex311 = visibility.civic311 ? (layerResults.civic311?.features ?? []) : [];
  const hexIncidents = visibility.incidents ? (layerResults.incidents?.features ?? []) : [];
  const accessFeatures = visibility.accessibility
    ? (layerResults.accessibility?.features ?? [])
    : [];
  const businessFeatures = visibility["business-scout"]
    ? (layerResults["business-scout"]?.features ?? [])
    : [];
  const evFeatures = visibility.ev ? (layerResults.ev?.features ?? []) : [];

  const isSelected = (place: PlaceInsight | ParkDetail) =>
    selectedPlace?.id === place.id || selectedPlace?.name === place.name;

  return (
    <>
      {visibility.isochrone &&
        isoFeatures.map((f, i) => (
          <GeoJSON
            key={`iso-${i}`}
            data={f as GeoJSON.GeoJsonObject}
            style={{ color: "#059669", fillColor: "#059669", fillOpacity: 0.08, weight: 2 }}
          />
        ))}

      {visibility.flood &&
        (layerResults.flood?.features ?? []).map((f, i) => (
          <GeoJSON
            key={`flood-${i}`}
            data={f as GeoJSON.GeoJsonObject}
            style={{ color: "#2563eb", fillColor: "#3b82f6", fillOpacity: 0.15, weight: 1 }}
          />
        ))}

      {visibility.census &&
        (layerResults.census?.features ?? []).map((f, i) => (
          <GeoJSON
            key={`census-${i}`}
            data={f as GeoJSON.GeoJsonObject}
            style={{ color: "#7c3aed", fillColor: "#a78bfa", fillOpacity: 0.12, weight: 1 }}
          />
        ))}

      {transitRoutes.map((f, i) => {
        const coords = (f.geometry as GeoJSON.LineString)?.coordinates?.map(
          ([lng, lat]) => [lat, lng] as [number, number],
        );
        if (!coords) return null;
        return (
          <Polyline
            key={`route-${i}`}
            positions={coords}
            pathOptions={{
              color: String(f.properties?.color ?? "#2563eb"),
              weight: 3,
              opacity: 0.7,
            }}
          />
        );
      })}

      {amenityFeatures.map((f) => {
        const [lng, lat] = (f.geometry as GeoJSON.Point).coordinates;
        const place = placeFromFeature(f, layerResults);
        const selected = place ? isSelected(place) : false;
        return (
          <CircleMarker
            key={String(f.id)}
            center={[lat, lng]}
            radius={selected ? 8 : 6}
            pathOptions={{
              color: selected ? "#b45309" : "#f59e0b",
              fillColor: "#fbbf24",
              fillOpacity: selected ? 1 : 0.8,
              weight: selected ? 3 : 1,
            }}
            eventHandlers={{
              click: () => selectFeature(f, layerResults, onSelectPlace),
            }}
          />
        );
      })}

      {[...hex311, ...hexIncidents].map((f) => {
        const [lng, lat] = (f.geometry as GeoJSON.Point).coordinates;
        const count = Number(f.properties?.count ?? 1);
        const radius = Math.min(24, 6 + count * 2);
        const place = placeFromFeature(f, layerResults);
        const selected = place ? isSelected(place) : false;
        return (
          <CircleMarker
            key={String(f.id)}
            center={[lat, lng]}
            radius={selected ? radius + 2 : radius}
            pathOptions={{
              color: f.properties?.layerId === "incidents" ? "#dc2626" : "#ea580c",
              fillColor: f.properties?.layerId === "incidents" ? "#fca5a5" : "#fdba74",
              fillOpacity: selected ? 0.75 : 0.5,
              weight: selected ? 3 : 1,
            }}
            eventHandlers={{
              click: () => selectFeature(f, layerResults, onSelectPlace),
            }}
          />
        );
      })}

      {transitStops.map((f) => {
        const [lng, lat] = (f.geometry as GeoJSON.Point).coordinates;
        const place = placeFromFeature(f, layerResults);
        const selected = place ? isSelected(place) : false;
        return (
          <CircleMarker
            key={String(f.id)}
            center={[lat, lng]}
            radius={selected ? 7 : 5}
            pathOptions={{
              color: "#1d4ed8",
              fillColor: "#3b82f6",
              fillOpacity: selected ? 1 : 0.9,
              weight: selected ? 3 : 1,
            }}
            eventHandlers={{
              click: () => selectFeature(f, layerResults, onSelectPlace),
            }}
          />
        );
      })}

      {accessFeatures.map((f) => {
        const [lng, lat] = (f.geometry as GeoJSON.Point).coordinates;
        const status = String(f.properties?.wheelchairStatus ?? "unknown");
        const color = status === "yes" ? "#16a34a" : status === "no" ? "#dc2626" : "#ca8a04";
        const place = placeFromFeature(f, layerResults);
        const selected = place ? isSelected(place) : false;
        return (
          <CircleMarker
            key={String(f.id)}
            center={[lat, lng]}
            radius={selected ? 7 : 5}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: selected ? 1 : 0.8,
              weight: selected ? 3 : 1,
            }}
            eventHandlers={{
              click: () => selectFeature(f, layerResults, onSelectPlace),
            }}
          />
        );
      })}

      {businessFeatures.map((f) => {
        const [lng, lat] = (f.geometry as GeoJSON.Point).coordinates;
        const weak = Boolean(f.properties?.weakPresence);
        const place = placeFromFeature(f, layerResults);
        const selected = place ? isSelected(place) : false;
        return (
          <CircleMarker
            key={String(f.id)}
            center={[lat, lng]}
            radius={selected ? 8 : 6}
            pathOptions={{
              color: weak ? "#c026d3" : "#64748b",
              fillColor: weak ? "#e879f9" : "#94a3b8",
              fillOpacity: selected ? 1 : 0.85,
              weight: selected ? 3 : 1,
            }}
            eventHandlers={{
              click: () => selectFeature(f, layerResults, onSelectPlace),
            }}
          />
        );
      })}

      {evFeatures.map((f) => {
        const [lng, lat] = (f.geometry as GeoJSON.Point).coordinates;
        const place = placeFromFeature(f, layerResults);
        const selected = place ? isSelected(place) : false;
        return (
          <CircleMarker
            key={String(f.id)}
            center={[lat, lng]}
            radius={selected ? 8 : 6}
            pathOptions={{
              color: "#0d9488",
              fillColor: "#2dd4bf",
              fillOpacity: selected ? 1 : 0.9,
              weight: selected ? 3 : 1,
            }}
            eventHandlers={{
              click: () => selectFeature(f, layerResults, onSelectPlace),
            }}
          />
        );
      })}

      {visibility.parks &&
        parks.map((park) => (
          <ParkMarker
            key={park.id ?? `${park.name}-${park.lat}`}
            park={park}
            selected={isSelected(park)}
            onSelect={onSelectPlace}
          />
        ))}
    </>
  );
}
