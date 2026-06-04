const PLACES_NEARBY_URL = "https://places.googleapis.com/v1/places:searchNearby";
const REQUEST_TIMEOUT_MS = 12_000;
const MAX_RESULTS = 10;

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.types",
  "places.googleMapsUri",
  "places.nationalPhoneNumber",
  "places.internationalPhoneNumber",
  "places.websiteUri",
  "places.regularOpeningHours",
  "places.photos",
  "places.allowsDogs",
  "places.goodForChildren",
  "places.restroom",
  "places.outdoorSeating",
  "places.accessibilityOptions",
  "places.parkingOptions",
  "places.editorialSummary",
].join(",");

function haversineKm(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getGooglePlacesApiKey() {
  return process.env.GOOGLE_PLACES_API_KEY?.trim() ?? "";
}

export function isGooglePlacesConfigured() {
  return getGooglePlacesApiKey().length > 0;
}

function formatParkType(types) {
  if (!Array.isArray(types) || types.length === 0) return "Park";
  const priority = [
    ["national_park", "National park"],
    ["state_park", "State park"],
    ["park", "Park"],
    ["tourist_attraction", "Tourist attraction"],
  ];
  for (const [key, label] of priority) {
    if (types.includes(key)) return label;
  }
  return types[0].replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function deriveUses(place) {
  const permitted = [];
  const prohibited = [];

  if (place.allowsDogs === true) permitted.push("Dogs allowed");
  else if (place.allowsDogs === false) prohibited.push("Dogs not allowed");

  if (place.goodForChildren === true) permitted.push("Good for children");
  if (place.restroom === true) permitted.push("Restrooms available");
  if (place.outdoorSeating === true) permitted.push("Outdoor areas");

  const wheelchair = place.accessibilityOptions?.wheelchairAccessibleEntrance;
  if (wheelchair === true) permitted.push("Wheelchair accessible entrance");
  else if (wheelchair === false) prohibited.push("Not wheelchair accessible");

  const parking = place.parkingOptions;
  if (parking?.freeParking === true) permitted.push("Free parking");
  else if (parking?.paidParking === true) permitted.push("Paid parking available");
  else if (parking?.freeParking === false && parking?.paidParking === false) {
    prohibited.push("No parking on site");
  }

  return { permittedUses: permitted, prohibitedUses: prohibited };
}

export function buildDirectionsUrl(originLat, originLng, destLat, destLng) {
  const origin = `${originLat},${originLng}`;
  const destination = `${destLat},${destLng}`;
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=walking`;
}

export function buildMapsSearchUrl(lat, lng, address) {
  if (address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

function normalizePlace(place, originLat, originLng) {
  const lat = place.location?.latitude;
  const lng = place.location?.longitude;
  if (lat == null || lng == null) return null;

  const name = place.displayName?.text?.trim();
  if (!name) return null;

  const { permittedUses, prohibitedUses } = deriveUses(place);
  const hours = place.regularOpeningHours?.weekdayDescriptions ?? [];
  const photoRef = place.photos?.[0]?.name ?? undefined;

  return {
    id: place.id,
    name,
    lat,
    lng,
    distanceKm: Number(haversineKm(originLat, originLng, lat, lng).toFixed(2)),
    type: formatParkType(place.types),
    address: place.formattedAddress ?? undefined,
    phone: place.nationalPhoneNumber ?? place.internationalPhoneNumber ?? undefined,
    website: place.websiteUri ?? undefined,
    hours: hours.length > 0 ? hours : undefined,
    photoRef,
    permittedUses: permittedUses.length > 0 ? permittedUses : undefined,
    prohibitedUses: prohibitedUses.length > 0 ? prohibitedUses : undefined,
    googleMapsUri: place.googleMapsUri ?? undefined,
    directionsUrl: buildDirectionsUrl(originLat, originLng, lat, lng),
    mapsSearchUrl: buildMapsSearchUrl(lat, lng, place.formattedAddress),
    summary: place.editorialSummary?.text ?? undefined,
  };
}

export async function searchNearbyParks(lat, lng, radiusM) {
  const apiKey = getGooglePlacesApiKey();
  if (!apiKey) {
    const error = new Error("GOOGLE_PLACES_API_KEY is not configured");
    error.status = 502;
    error.code = "missing_api_key";
    throw error;
  }

  const response = await fetch(PLACES_NEARBY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify({
      includedTypes: ["park", "national_park"],
      maxResultCount: MAX_RESULTS,
      rankPreference: "DISTANCE",
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: radiusM,
        },
      },
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (response.status === 429) {
    const error = new Error("Google Places rate limit exceeded");
    error.status = 429;
    throw error;
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    const error = new Error(`Google Places ${response.status}: ${detail.slice(0, 200)}`);
    error.status = response.status >= 500 ? 502 : response.status;
    throw error;
  }

  const payload = await response.json();
  const parks = (payload.places ?? [])
    .map((place) => normalizePlace(place, lat, lng))
    .filter(Boolean)
    .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0))
    .slice(0, MAX_RESULTS);

  return parks;
}

export function getPhotoMediaUrl(photoRef, maxHeightPx = 80) {
  const apiKey = getGooglePlacesApiKey();
  if (!apiKey || !photoRef) return null;
  return `https://places.googleapis.com/v1/${photoRef}/media?maxHeightPx=${maxHeightPx}&key=${apiKey}`;
}

export function isValidPhotoRef(ref) {
  return typeof ref === "string" && /^places\/.+\/photos\/.+/.test(ref);
}
