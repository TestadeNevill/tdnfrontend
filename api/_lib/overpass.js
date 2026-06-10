const OVERPASS_ENDPOINTS = [
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.openstreetmap.ru/api/interpreter",
  "https://overpass-api.de/api/interpreter",
];

const REQUEST_TIMEOUT_MS = 12_000;
const USER_AGENT = "tdnfrontend-labs/1.0 (https://www.testadenevill.com)";

function haversineKm(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export { haversineKm };

function buildParksQuery(lat, lng, radiusM, limit = 10) {
  return `
[out:json][timeout:12];
(
  way["leisure"="park"]["name"](around:${radiusM},${lat},${lng});
  relation["leisure"="park"]["name"](around:${radiusM},${lat},${lng});
  node["leisure"="park"]["name"](around:${radiusM},${lat},${lng});
  node["leisure"="nature_reserve"]["name"](around:${radiusM},${lat},${lng});
);
out center ${limit};
`.trim();
}

function buildAmenitiesQuery(lat, lng, radiusM, limit = 50) {
  return `
[out:json][timeout:12];
(
  node["amenity"="toilets"](around:${radiusM},${lat},${lng});
  node["leisure"="playground"](around:${radiusM},${lat},${lng});
  node["amenity"="drinking_water"](around:${radiusM},${lat},${lng});
  node["leisure"="dog_park"](around:${radiusM},${lat},${lng});
  node["leisure"="pitch"](around:${radiusM},${lat},${lng});
  node["amenity"="bench"](around:${radiusM},${lat},${lng});
  node["highway"="path"]["name"](around:${radiusM},${lat},${lng});
  node["wheelchair"](around:${radiusM},${lat},${lng});
  way["wheelchair"](around:${radiusM},${lat},${lng});
);
out center ${limit};
`.trim();
}

function buildAccessibilityQuery(lat, lng, radiusM, limit = 40) {
  return `
[out:json][timeout:12];
(
  node["wheelchair"](around:${radiusM},${lat},${lng});
  way["wheelchair"](around:${radiusM},${lat},${lng});
  node["toilets:wheelchair"](around:${radiusM},${lat},${lng});
  node["amenity"="toilets"]["wheelchair"](around:${radiusM},${lat},${lng});
  node["highway"="elevator"](around:${radiusM},${lat},${lng});
);
out center ${limit};
`.trim();
}

async function runOverpassQuery(query) {
  const attempts = OVERPASS_ENDPOINTS.map(async (endpoint) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        "User-Agent": USER_AGENT,
      },
      body: `data=${encodeURIComponent(query)}`,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (response.status === 429) {
      const error = new Error("Overpass rate limit");
      error.status = 429;
      throw error;
    }
    if (!response.ok) throw new Error(`Overpass ${response.status}`);
    return response.json();
  });

  try {
    return await Promise.any(attempts);
  } catch (error) {
    if (error instanceof AggregateError && error.errors.length > 0) {
      throw error.errors[0];
    }
    throw error;
  }
}

function amenityLabel(tags) {
  if (tags.leisure === "playground") return "Playground";
  if (tags.leisure === "dog_park") return "Dog park";
  if (tags.leisure === "pitch") return "Sports court";
  if (tags.amenity === "toilets") return "Restroom";
  if (tags.amenity === "drinking_water") return "Drinking water";
  if (tags.amenity === "bench") return "Bench";
  if (tags.highway === "path") return "Trail";
  if (tags.wheelchair) return `Wheelchair: ${tags.wheelchair}`;
  return tags.name ?? "Amenity";
}

function parseElements(elements, originLat, originLng, mapper) {
  const items = [];
  for (const element of elements ?? []) {
    const lat = element.lat ?? element.center?.lat;
    const lng = element.lon ?? element.center?.lon;
    if (lat == null || lng == null) continue;
    items.push(mapper(element, lat, lng, originLat, originLng));
  }
  return items.filter(Boolean);
}

export async function fetchOverpassParks(lat, lng, radiusM, limit = 10) {
  const payload = await runOverpassQuery(buildParksQuery(lat, lng, radiusM, limit));
  const parks = parseElements(payload.elements, lat, lng, (el, plat, plng) => {
    const name = el.tags?.name?.trim();
    if (!name) return null;
    return {
      id: `osm-${el.type}-${el.id}`,
      name,
      lat: plat,
      lng: plng,
      distanceKm: Number(haversineKm(lat, lng, plat, plng).toFixed(2)),
      type: el.tags?.leisure === "nature_reserve" ? "Nature reserve" : "Park",
      source: "osm",
    };
  });

  parks.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  const seen = new Set();
  return parks.filter((p) => {
    const key = `${p.name.toLowerCase()}@${p.lat.toFixed(4)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function fetchOverpassAmenities(lat, lng, radiusM, filters = {}) {
  const payload = await runOverpassQuery(buildAmenitiesQuery(lat, lng, radiusM));
  const amenities = parseElements(payload.elements, lat, lng, (el, plat, plng) => {
    const tags = el.tags ?? {};
    const category = amenityLabel(tags);
    const wheelchair = tags.wheelchair ?? tags["toilets:wheelchair"];

    if (filters.bathroom && tags.amenity !== "toilets") return null;
    if (filters.playground && tags.leisure !== "playground") return null;
    if (filters.dogRun && tags.leisure !== "dog_park") return null;
    if (filters.waterFountain && tags.amenity !== "drinking_water") return null;
    if (filters.wheelchair && wheelchair !== "yes") return null;

    return {
      id: `osm-amenity-${el.type}-${el.id}`,
      name: tags.name ?? category,
      lat: plat,
      lng: plng,
      category,
      wheelchair: wheelchair ?? "unknown",
      distanceKm: Number(haversineKm(lat, lng, plat, plng).toFixed(2)),
      source: "osm",
    };
  });

  amenities.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  return amenities.slice(0, 50);
}

export async function fetchOverpassAccessibility(lat, lng, radiusM) {
  const payload = await runOverpassQuery(buildAccessibilityQuery(lat, lng, radiusM));
  return parseElements(payload.elements, lat, lng, (el, plat, plng) => {
    const tags = el.tags ?? {};
    const status = tags.wheelchair ?? tags["toilets:wheelchair"] ?? "unknown";
    return {
      id: `osm-access-${el.type}-${el.id}`,
      name: tags.name ?? amenityLabel(tags),
      lat: plat,
      lng: plng,
      wheelchairStatus: status,
      category: amenityLabel(tags),
      distanceKm: Number(haversineKm(lat, lng, plat, plng).toFixed(2)),
      source: "osm",
    };
  }).slice(0, 40);
}
