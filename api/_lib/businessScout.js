import { isGooglePlacesConfigured } from "./googlePlaces.js";
import { pointFeature, layerResponse } from "./normalizeGeoJSON.js";
import { buildGridKey, getCached, setCached, hashFilters } from "./gridCache.js";

const PLACES_URL = "https://places.googleapis.com/v1/places:searchNearby";

async function searchNearbyBusinesses(lat, lng, radiusM, includedTypes) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!apiKey) return [];

  const response = await fetch(PLACES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.location,places.types,places.websiteUri,places.nationalPhoneNumber,places.regularOpeningHours",
    },
    body: JSON.stringify({
      includedTypes,
      maxResultCount: 20,
      rankPreference: "DISTANCE",
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: radiusM,
        },
      },
    }),
    signal: AbortSignal.timeout(12_000),
  });

  if (!response.ok) return [];
  const payload = await response.json();
  return (payload.places ?? []).map((p) => ({
    id: p.id,
    name: p.displayName?.text,
    lat: p.location?.latitude,
    lng: p.location?.longitude,
    website: p.websiteUri,
    phone: p.nationalPhoneNumber,
    hours: p.regularOpeningHours?.weekdayDescriptions,
    types: p.types,
    weakPresence: !p.websiteUri && !p.nationalPhoneNumber,
  }));
}

export async function fetchBusinessScout({ lat, lng, radiusM, filters }) {
  const category = filters?.category ?? "restaurant";
  const cacheKey = buildGridKey("business-scout", lat, lng, radiusM, hashFilters({ category }));
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const typeMap = {
    restaurant: ["restaurant"],
    cafe: ["cafe", "coffee_shop"],
    retail: ["store", "shopping_mall"],
    service: ["hair_care", "beauty_salon", "laundry"],
  };

  const types = typeMap[category] ?? ["restaurant"];
  let businesses = [];

  if (isGooglePlacesConfigured()) {
    for (const t of types.slice(0, 1)) {
      const results = await searchNearbyBusinesses(lat, lng, radiusM, [t]);
      businesses = businesses.concat(results);
    }
  }

  const features = businesses
    .filter((b) => b.lat != null && b.lng != null)
    .map((b) =>
      pointFeature(b.id ?? b.name, b.lng, b.lat, {
        layerId: "business-scout",
        name: b.name,
        category,
        weakPresence: b.weakPresence,
        hasWebsite: Boolean(b.website),
        hasPhone: Boolean(b.phone),
        hasHours: Boolean(b.hours?.length),
        source: "google-places",
      }),
    );

  const weakCount = businesses.filter((b) => b.weakPresence).length;

  const result = layerResponse(
    { features },
    {
      source: "Google Places",
      attribution: "© Google",
      caveat: "Weak online presence is inferred from missing website/phone — verify manually.",
      businesses,
      weakCount,
      exportRows: businesses.map((b) => ({
        name: b.name,
        lat: b.lat,
        lng: b.lng,
        website: b.website ?? "",
        phone: b.phone ?? "",
        weakPresence: b.weakPresence,
      })),
    },
  );

  setCached(cacheKey, result, 600);
  return result;
}
