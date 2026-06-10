import type { LayerApiResponse, PlaceInsight } from "../types/mapFeature";

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.filter((v): v is string => typeof v === "string");
  return items.length > 0 ? items : undefined;
}

/** Build a PlaceInsight from a map feature, enriching from layer meta when available. */
export function placeFromFeature(
  f: GeoJSON.Feature,
  layerResults?: Record<string, LayerApiResponse | null | undefined>,
): PlaceInsight | null {
  if (f.geometry?.type !== "Point") return null;

  const [lng, lat] = (f.geometry as GeoJSON.Point).coordinates;
  const p = f.properties ?? {};
  const layerId = asString(p.layerId) ?? "";
  const id = asString(p.id) ?? String(f.id ?? "");

  let place: PlaceInsight = {
    id,
    name: asString(p.name) ?? "Place",
    lat,
    lng,
    layerId,
    distanceKm: asNumber(p.distanceKm),
    type: asString(p.type) ?? asString(p.category) ?? asString(p.mode),
    address: asString(p.address),
    phone: asString(p.phone),
    website: asString(p.website),
    hours: asStringArray(p.hours),
    photoRef: asString(p.photoRef),
    permittedUses: asStringArray(p.permittedUses),
    prohibitedUses: asStringArray(p.prohibitedUses),
    summary: asString(p.summary),
    googleMapsUri: asString(p.googleMapsUri),
  };

  if (layerId === "parks") {
    return place;
  }

  if (layerId === "business-scout") {
    const businesses =
      (layerResults?.["business-scout"]?.meta?.businesses as Array<{
        id?: string;
        name?: string;
        phone?: string;
        website?: string;
        hours?: string[];
        weakPresence?: boolean;
      }>) ?? [];
    const full = businesses.find((b) => b.id === id || b.name === place.name);
    if (full) {
      place = {
        ...place,
        phone: full.phone ?? place.phone,
        website: full.website ?? place.website,
        hours: full.hours ?? place.hours,
        weakPresence: full.weakPresence,
        type: asString(p.category) ?? "Business",
      };
    } else {
      place.weakPresence = Boolean(p.weakPresence);
      place.type = asString(p.category) ?? "Business";
    }
    return place;
  }

  if (layerId === "amenities") {
    place.type = asString(p.category) ?? "Amenity";
    if (p.wheelchair === "yes") {
      place.permittedUses = ["Wheelchair accessible"];
    } else if (p.wheelchair === "no") {
      place.prohibitedUses = ["Not wheelchair accessible"];
    }
    return place;
  }

  if (layerId === "transit") {
    place.type = asString(p.mode) ?? "Transit stop";
    return place;
  }

  if (layerId === "accessibility") {
    const status = asString(p.wheelchairStatus) ?? "unknown";
    place.type = "Accessibility";
    if (status === "yes") place.permittedUses = ["Wheelchair accessible"];
    else if (status === "no") place.prohibitedUses = ["Not wheelchair accessible"];
    else place.summary = "Wheelchair accessibility unknown";
    return place;
  }

  if (layerId === "civic311" || layerId === "incidents") {
    const count = asNumber(p.count) ?? 1;
    place.type = layerId === "incidents" ? "Incident cluster" : "311 report cluster";
    place.summary = `${count} report${count === 1 ? "" : "s"} in this area`;
    return place;
  }

  if (layerId === "ev") {
    place.type = "EV charging";
    return place;
  }

  return place;
}

/** Map parks-layer feature properties to ParkDetail fields. */
export function parkFromFeature(f: GeoJSON.Feature): PlaceInsight | null {
  if (f.properties?.layerId !== "parks" || f.geometry?.type !== "Point") return null;
  return placeFromFeature(f);
}
