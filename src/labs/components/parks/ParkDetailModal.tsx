import { useEffect, useRef } from "react";
import type { ParkDetail } from "../../types";
import {
  buildPhotoProxyUrl,
  getParkDirectionsUrl,
  getParkMapsUrl,
} from "../../utils/parkLinks";

interface ParkDetailModalProps {
  park: ParkDetail | null;
  userLat: number;
  userLng: number;
  onClose: () => void;
}

export function ParkDetailModal({ park, userLat, userLng, onClose }: ParkDetailModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!park) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [park, onClose]);

  if (!park) return null;

  const heroPhoto =
    park.photoUrl ?? (park.photoRef ? buildPhotoProxyUrl(park.photoRef, 400) : undefined);
  const directionsUrl = getParkDirectionsUrl(park, userLat, userLng);
  const mapsUrl = getParkMapsUrl(park);
  const hasUses =
    (park.permittedUses?.length ?? 0) > 0 || (park.prohibitedUses?.length ?? 0) > 0;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-end justify-center sm:items-center"
      role="presentation"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="park-detail-title"
        tabIndex={-1}
        className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-xl border border-labs-border bg-labs-panel shadow-xl sm:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {heroPhoto != null ? (
          <div className="relative h-40 w-full overflow-hidden bg-emerald-100">
            <img
              src={heroPhoto}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        ) : (
          <div className="flex h-24 items-center justify-center bg-emerald-600/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="h-12 w-12 text-emerald-700"
              aria-hidden="true"
            >
              <circle cx="24" cy="24" r="22" fill="currentColor" opacity="0.2" />
              <path
                fill="currentColor"
                d="M24 10c-1 6-4 9-4 14a4 4 0 0 0 8 0c0-5-3-8-4-14zm-8 18c-2 1-3 3-3 5h22c0-2-1-4-3-5-2 2-4 3-8 3s-6-1-8-3z"
              />
            </svg>
          </div>
        )}

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="park-detail-title" className="text-lg font-semibold text-labs-text">
                {park.name}
              </h2>
              <p className="mt-0.5 text-base text-labs-textMuted">
                {[park.type, park.distanceKm != null ? `${park.distanceKm} km away` : null]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-labs-border px-2 py-1 text-sm text-labs-textMuted hover:bg-labs-panel2"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {park.summary != null && (
            <p className="mt-3 text-base text-labs-textMuted">{park.summary}</p>
          )}

          <section className="mt-4">
            <h3 className="text-xs font-labsMono font-semibold uppercase tracking-wider text-labs-textMuted">
              Rules & amenities
            </h3>
            {hasUses ? (
              <div className="mt-2 space-y-2">
                {park.permittedUses != null && park.permittedUses.length > 0 && (
                  <ul className="space-y-1">
                    {park.permittedUses.map((use) => (
                      <li key={use} className="flex items-start gap-2 text-base text-labs-ok">
                        <span aria-hidden="true">✓</span>
                        {use}
                      </li>
                    ))}
                  </ul>
                )}
                {park.prohibitedUses != null && park.prohibitedUses.length > 0 && (
                  <ul className="space-y-1">
                    {park.prohibitedUses.map((use) => (
                      <li key={use} className="flex items-start gap-2 text-base text-red-600">
                        <span aria-hidden="true">✗</span>
                        {use}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <p className="mt-2 text-base text-labs-textMuted">Not available from Google</p>
            )}
          </section>

          <section className="mt-4">
            <h3 className="text-xs font-labsMono font-semibold uppercase tracking-wider text-labs-textMuted">
              Hours
            </h3>
            {park.hours != null && park.hours.length > 0 ? (
              <ul className="mt-2 space-y-0.5 text-base text-labs-text">
                {park.hours.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-base text-labs-textMuted">Hours not available</p>
            )}
          </section>

          <section className="mt-4">
            <h3 className="text-xs font-labsMono font-semibold uppercase tracking-wider text-labs-textMuted">
              Contact
            </h3>
            <div className="mt-2 space-y-1 text-base">
              {park.phone != null ? (
                <p>
                  <a href={`tel:${park.phone}`} className="text-labs-accent hover:underline">
                    {park.phone}
                  </a>
                </p>
              ) : (
                <p className="text-labs-textMuted">Phone not available</p>
              )}
              {park.website != null && (
                <p>
                  <a
                    href={park.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-labs-accent hover:underline"
                  >
                    Website
                  </a>
                </p>
              )}
            </div>
          </section>

          <section className="mt-4">
            <h3 className="text-xs font-labsMono font-semibold uppercase tracking-wider text-labs-textMuted">
              Address
            </h3>
            {park.address != null ? (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-base text-labs-accent hover:underline"
              >
                {park.address}
              </a>
            ) : (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-base text-labs-accent hover:underline"
              >
                View on Google Maps
              </a>
            )}
          </section>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex w-full items-center justify-center rounded-md border border-labs-accent/40 bg-labs-accent/10 px-4 py-2.5 text-sm font-semibold text-labs-accent hover:bg-labs-accent/20"
          >
            Get directions
          </a>
        </div>
      </div>
    </div>
  );
}
