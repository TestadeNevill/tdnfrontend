import { useEffect, useMemo, useState } from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";
import type { ParkDetail } from "../../types";
import { buildPhotoProxyUrl } from "../../utils/parkLinks";

const FALLBACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
  <circle cx="24" cy="24" r="22" fill="#059669" stroke="#fff" stroke-width="2"/>
  <path fill="#fff" d="M24 10c-1 6-4 9-4 14a4 4 0 0 0 8 0c0-5-3-8-4-14zm-8 18c-2 1-3 3-3 5h22c0-2-1-4-3-5-2 2-4 3-8 3s-6-1-8-3z"/>
</svg>`;

function buildMarkerHtml(photoUrl: string | undefined, selected: boolean): string {
  const ring = selected ? "ring-4 ring-labs-accent ring-offset-2" : "";
  const inner = photoUrl
    ? `<img src="${photoUrl}" alt="" class="h-full w-full object-cover" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
       <div class="hidden h-full w-full items-center justify-center bg-emerald-600">${FALLBACK_SVG}</div>`
    : `<div class="flex h-full w-full items-center justify-center bg-emerald-600">${FALLBACK_SVG}</div>`;

  return `<div class="park-marker ${ring} h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow-md">${inner}</div>`;
}

interface ParkMarkerProps {
  park: ParkDetail;
  selected: boolean;
  onSelect: (park: ParkDetail) => void;
}

export function ParkMarker({ park, selected, onSelect }: ParkMarkerProps) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const photoUrl =
    park.photoUrl ??
    (park.photoRef && !photoFailed ? buildPhotoProxyUrl(park.photoRef, 80) : undefined);

  const icon = useMemo(() => {
    const html = buildMarkerHtml(photoUrl, selected);
    return L.divIcon({
      className: "park-marker-icon",
      html,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
      popupAnchor: [0, -24],
    });
  }, [photoUrl, selected]);

  useEffect(() => {
    if (!photoUrl) return;
    const img = new Image();
    img.onerror = () => setPhotoFailed(true);
    img.src = photoUrl;
  }, [photoUrl]);

  return (
    <Marker
      position={[park.lat, park.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onSelect(park),
      }}
      zIndexOffset={selected ? 1000 : 0}
    />
  );
}
