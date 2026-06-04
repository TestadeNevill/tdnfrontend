import type { ParkDetail } from "../types";

export function buildDirectionsUrl(
  userLat: number,
  userLng: number,
  parkLat: number,
  parkLng: number,
  travelMode: "walking" | "driving" | "bicycling" | "transit" = "walking",
): string {
  const origin = `${userLat},${userLng}`;
  const destination = `${parkLat},${parkLng}`;
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=${travelMode}`;
}

export function buildMapsSearchUrl(lat: number, lng: number, address?: string): string {
  if (address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export function buildPhotoProxyUrl(photoRef: string, maxHeight = 80): string {
  return `/api/labs/parks/photo?ref=${encodeURIComponent(photoRef)}&maxHeight=${maxHeight}`;
}

export function enrichParkWithPhotoUrl(park: ParkDetail, maxHeight = 80): ParkDetail {
  if (!park.photoRef) return park;
  return {
    ...park,
    photoUrl: buildPhotoProxyUrl(park.photoRef, maxHeight),
  };
}

export function enrichParksWithPhotoUrls(parks: ParkDetail[], maxHeight = 80): ParkDetail[] {
  return parks.map((park) => enrichParkWithPhotoUrl(park, maxHeight));
}

export function getParkDirectionsUrl(
  park: ParkDetail,
  userLat: number,
  userLng: number,
): string {
  return park.directionsUrl ?? buildDirectionsUrl(userLat, userLng, park.lat, park.lng);
}

export function getParkMapsUrl(park: ParkDetail): string {
  return park.mapsSearchUrl ?? park.googleMapsUri ?? buildMapsSearchUrl(park.lat, park.lng, park.address);
}
