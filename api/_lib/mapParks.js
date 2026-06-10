import { pointFeature, polygonFeature, layerResponse } from "./normalizeGeoJSON.js";
import { searchNearbyParks, isGooglePlacesConfigured } from "./googlePlaces.js";
import { fetchOverpassParks, fetchOverpassAmenities } from "./overpass.js";
import { buildGridKey, getCached, setCached, hashFilters } from "./gridCache.js";

export async function fetchParkIntelligence({ lat, lng, radiusM, filters }) {
  const cacheKey = buildGridKey("parks", lat, lng, radiusM, hashFilters(filters));
  const cached = getCached(cacheKey);
  if (cached) return cached;

  let googleParks = [];
  let source = "osm";

  if (isGooglePlacesConfigured()) {
    try {
      googleParks = await searchNearbyParks(lat, lng, radiusM);
      source = googleParks.length > 0 ? "google" : "osm";
    } catch {
      googleParks = [];
    }
  }

  let osmParks = [];
  try {
    osmParks = await fetchOverpassParks(lat, lng, radiusM);
  } catch {
    osmParks = [];
  }

  const parks = googleParks.length > 0 ? googleParks : osmParks;
  const amenities = await fetchOverpassAmenities(lat, lng, radiusM, filters).catch(() => []);

  const parkFeatures = parks.map((p) =>
    pointFeature(p.id ?? `park-${p.name}`, p.lng, p.lat, {
      layerId: "parks",
      name: p.name,
      distanceKm: p.distanceKm,
      type: p.type,
      address: p.address,
      phone: p.phone,
      website: p.website,
      hours: p.hours,
      photoRef: p.photoRef,
      permittedUses: p.permittedUses,
      prohibitedUses: p.prohibitedUses,
      summary: p.summary,
      source: p.source ?? source,
    }),
  );

  const amenityFeatures = amenities.map((a) =>
    pointFeature(a.id, a.lng, a.lat, {
      layerId: "amenities",
      name: a.name,
      category: a.category,
      wheelchair: a.wheelchair,
      distanceKm: a.distanceKm,
      source: "osm",
    }),
  );

  const result = layerResponse(
    { features: [...parkFeatures, ...amenityFeatures] },
    {
      source: source === "google" ? "Google Places + OSM" : "OpenStreetMap",
      attribution: "© Google / © OpenStreetMap contributors",
      caveat: "Amenity tags from OSM vary by mapper coverage.",
      confidence: googleParks.length > 0 ? "high" : "medium",
      parks: parks.slice(0, 10),
      amenities,
    },
  );

  setCached(cacheKey, result, 300);
  return result;
}

export async function fetchAmenityLayer({ lat, lng, radiusM, filters }) {
  const cacheKey = buildGridKey("amenities", lat, lng, radiusM, hashFilters(filters));
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const amenities = await fetchOverpassAmenities(lat, lng, radiusM, filters);
  const features = amenities.map((a) =>
    pointFeature(a.id, a.lng, a.lat, {
      layerId: "amenities",
      ...a,
    }),
  );

  const result = layerResponse(
    { features },
    {
      source: "OpenStreetMap / Overpass",
      attribution: "© OpenStreetMap contributors",
      caveat: "Coverage varies — verify on site.",
      amenities,
    },
  );

  setCached(cacheKey, result, 300);
  return result;
}
