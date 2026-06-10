import { useCallback, useState } from "react";
import type { MapAnchor } from "./types/mapFeature";

const DEFAULT_CENTER = { lat: 40.758, lng: -73.9855 };
const DEFAULT_RADIUS_M = 2000;

export function useMapAnchor(initial?: Partial<MapAnchor>) {
  const [anchor, setAnchor] = useState<MapAnchor>({
    lat: initial?.lat ?? DEFAULT_CENTER.lat,
    lng: initial?.lng ?? DEFAULT_CENTER.lng,
    radiusM: initial?.radiusM ?? DEFAULT_RADIUS_M,
  });

  const setCenter = useCallback((lat: number, lng: number) => {
    setAnchor((prev) => ({ ...prev, lat, lng }));
  }, []);

  const setRadiusM = useCallback((radiusM: number) => {
    setAnchor((prev) => ({ ...prev, radiusM }));
  }, []);

  const bboxFromAnchor = useCallback((): [number, number, number, number] => {
    const { lat, lng, radiusM } = anchor;
    const dLat = radiusM / 111_000;
    const dLng = radiusM / (111_000 * Math.cos((lat * Math.PI) / 180));
    return [lng - dLng, lat - dLat, lng + dLng, lat + dLat];
  }, [anchor]);

  return { anchor, setAnchor, setCenter, setRadiusM, bboxFromAnchor };
}
