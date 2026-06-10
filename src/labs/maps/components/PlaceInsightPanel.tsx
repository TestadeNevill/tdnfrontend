import type { PlaceInsight } from "../types/mapFeature";
import type { LayerApiResponse } from "../types/mapFeature";
import { MatchScoreBadge } from "./MatchScoreBadge";
import {
  buildPhotoProxyUrl,
  getParkDirectionsUrl,
  getParkMapsUrl,
} from "../../utils/parkLinks";

interface PlaceInsightPanelProps {
  place: PlaceInsight | null;
  userLat: number;
  userLng: number;
  layerResults: Record<string, LayerApiResponse | null | undefined>;
  onClose: () => void;
  onComparePin?: () => void;
}

export function PlaceInsightPanel({
  place,
  userLat,
  userLng,
  layerResults,
  onClose,
  onComparePin,
}: PlaceInsightPanelProps) {
  if (!place) {
    return (
      <div className="rounded-lg border border-labs-border bg-labs-panel2 p-4 text-sm text-labs-textMuted">
        Click a marker on the map — parks, transit stops, businesses, amenities, and civic
        clusters all open details here. Match scores update when you change scenario.
      </div>
    );
  }

  const isPark = !place.layerId || place.layerId === "parks";
  const layerLabel =
    place.layerId === "transit"
      ? "Transit stop"
      : place.layerId === "business-scout"
        ? "Business"
        : place.layerId === "amenities"
          ? "Amenity"
          : place.layerId === "accessibility"
            ? "Accessibility"
            : place.layerId === "civic311"
              ? "311 reports"
              : place.layerId === "incidents"
                ? "Incidents"
                : place.layerId === "ev"
                  ? "EV charging"
                  : "Park";

  const heroPhoto =
    place.photoUrl ?? (place.photoRef ? buildPhotoProxyUrl(place.photoRef, 200) : undefined);
  const weather = layerResults.weather?.meta?.weather as {
    temperature?: number;
    unit?: string;
    shortForecast?: string;
    comfort?: string;
  } | undefined;
  const aqi = layerResults.aqi?.meta?.aqi as {
    value?: number;
    category?: string;
    status?: string;
  } | undefined;

  return (
    <div className="flex max-h-[70vh] flex-col overflow-y-auto rounded-lg border border-labs-border bg-labs-panel2">
      {heroPhoto && (
        <div className="h-28 shrink-0 overflow-hidden bg-emerald-100">
          <img src={heroPhoto} alt="" className="h-full w-full object-cover" />
        </div>
      )}

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-labs-text">{place.name}</h3>
            <p className="text-sm text-labs-textMuted">
              {[layerLabel, place.type, place.distanceKm != null ? `${place.distanceKm} km` : null]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-labs-border px-2 py-0.5 text-xs text-labs-textMuted"
          >
            ✕
          </button>
        </div>

        {place.matchScore && <MatchScoreBadge result={place.matchScore} />}

        {place.weakPresence && (
          <p className="rounded-md border border-fuchsia-300/40 bg-fuchsia-50 px-2 py-1 text-xs text-fuchsia-800">
            Weak online presence — missing website or phone on Google.
          </p>
        )}

        {place.hours && place.hours.length > 0 && (
          <div className="text-sm">
            <p className="text-xs font-labsMono uppercase text-labs-textMuted">Hours</p>
            <ul className="mt-1 space-y-0.5 text-labs-textMuted">
              {place.hours.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        )}

        {(place.phone || place.website) && (
          <div className="space-y-1 text-sm">
            {place.phone && (
              <p>
                <a href={`tel:${place.phone}`} className="text-labs-accent hover:underline">
                  {place.phone}
                </a>
              </p>
            )}
            {place.website && (
              <p>
                <a
                  href={place.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-labs-accent hover:underline"
                >
                  Website
                </a>
              </p>
            )}
          </div>
        )}

        {place.address && (
          <p className="text-sm text-labs-textMuted">{place.address}</p>
        )}

        {place.matchScore && place.matchScore.factors.length > 0 && (
          <ul className="space-y-1 text-sm">
            {place.matchScore.factors.map((f) => (
              <li
                key={f.label}
                className={
                  f.kind === "positive"
                    ? "text-labs-ok"
                    : f.kind === "negative"
                      ? "text-red-600"
                      : "text-labs-textMuted"
                }
              >
                {f.kind === "positive" ? "+ " : f.kind === "negative" ? "− " : "· "}
                {f.label}
              </li>
            ))}
          </ul>
        )}

        <div className="grid grid-cols-2 gap-2">
          {isPark && weather && (
            <div className="rounded-md border border-labs-border bg-labs-panel p-2">
              <p className="text-xs font-labsMono uppercase text-labs-textMuted">Weather</p>
              <p className="text-sm font-semibold text-labs-text">
                {weather.temperature != null ? `${weather.temperature}°${weather.unit ?? "F"}` : "—"}
              </p>
              <p className="text-xs text-labs-textMuted">{weather.shortForecast}</p>
            </div>
          )}
          {isPark && aqi && (
            <div className="rounded-md border border-labs-border bg-labs-panel p-2">
              <p className="text-xs font-labsMono uppercase text-labs-textMuted">Air quality</p>
              <p className="text-sm font-semibold text-labs-text">
                {aqi.value != null ? `AQI ${aqi.value}` : "—"}
              </p>
              <p className="text-xs text-labs-textMuted">{aqi.category ?? aqi.status}</p>
            </div>
          )}
        </div>

        {(() => {
          const housing = layerResults.housing?.meta?.housing as {
            fmr?: { oneBed?: number; area?: string };
            hpi?: { index?: number; change1yr?: number };
          } | undefined;
          if (!housing?.fmr && !housing?.hpi) return null;
          return (
            <div className="rounded-md border border-labs-border bg-labs-panel p-2 text-sm">
              <p className="text-xs font-labsMono uppercase text-labs-textMuted">Housing context</p>
              {housing.fmr && (
                <p className="text-labs-text">
                  1BR FMR: ${housing.fmr.oneBed?.toLocaleString()} ({housing.fmr.area})
                </p>
              )}
              {housing.hpi && (
                <p className="text-labs-textMuted">
                  HPI {housing.hpi.index} ({housing.hpi.change1yr}% YoY)
                </p>
              )}
            </div>
          );
        })()}

        {place.summary && <p className="text-sm text-labs-textMuted">{place.summary}</p>}

        {place.permittedUses && place.permittedUses.length > 0 && (
          <ul className="space-y-0.5 text-sm text-labs-ok">
            {place.permittedUses.map((u) => (
              <li key={u}>✓ {u}</li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-2">
          <a
            href={getParkDirectionsUrl(place, userLat, userLng)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-labs-accent/40 bg-labs-accent/10 px-3 py-1.5 text-xs font-semibold text-labs-accent"
          >
            Directions
          </a>
          <a
            href={getParkMapsUrl(place)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-labs-border px-3 py-1.5 text-xs text-labs-text"
          >
            Google Maps
          </a>
          {onComparePin && isPark && (
            <button
              type="button"
              onClick={onComparePin}
              className="rounded-md border border-labs-border px-3 py-1.5 text-xs text-labs-text"
            >
              Pin for compare
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
