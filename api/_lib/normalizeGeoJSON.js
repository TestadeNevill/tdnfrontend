export function featureCollection(features) {
  return {
    type: "FeatureCollection",
    features: features.filter(Boolean),
  };
}

export function pointFeature(id, lng, lat, properties = {}) {
  return {
    type: "Feature",
    id,
    geometry: { type: "Point", coordinates: [lng, lat] },
    properties: { id, ...properties },
  };
}

export function polygonFeature(id, coordinates, properties = {}) {
  return {
    type: "Feature",
    id,
    geometry: { type: "Polygon", coordinates },
    properties: { id, ...properties },
  };
}

export function lineFeature(id, coordinates, properties = {}) {
  return {
    type: "Feature",
    id,
    geometry: { type: "LineString", coordinates },
    properties: { id, ...properties },
  };
}

export function layerResponse(geojson, meta = {}) {
  return {
    type: "FeatureCollection",
    features: geojson?.features ?? [],
    meta: {
      source: meta.source ?? "unknown",
      updated: meta.updated ?? new Date().toISOString(),
      coverage: meta.coverage ?? "viewport",
      confidence: meta.confidence ?? "medium",
      caveat: meta.caveat,
      attribution: meta.attribution,
      ...meta,
    },
  };
}
