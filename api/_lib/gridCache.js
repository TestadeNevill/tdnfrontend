const store = new Map();

export function buildGridKey(layerId, lat, lng, radiusM, filtersHash = "") {
  const roundedLat = Math.round(lat * 1000) / 1000;
  const roundedLng = Math.round(lng * 1000) / 1000;
  const roundedRadius = Math.round(radiusM / 100) * 100;
  return `${layerId}:${roundedLat},${roundedLng}:${roundedRadius}:${filtersHash}`;
}

export function buildBboxKey(layerId, bbox, filtersHash = "") {
  const rounded = bbox.map((n) => Math.round(n * 1000) / 1000).join(",");
  return `${layerId}:bbox:${rounded}:${filtersHash}`;
}

export function getCached(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

export function setCached(key, value, ttlSeconds = 300) {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

export function hashFilters(filters) {
  if (!filters || typeof filters !== "object") return "";
  return JSON.stringify(filters);
}
