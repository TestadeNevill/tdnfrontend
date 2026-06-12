<script setup>
import { onMounted, onBeforeUnmount, watch, ref } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import * as turf from '@turf/turf'

const props = defineProps({
  mode: { type: String, default: 'routes' }
})

const emit = defineEmits(['stop-selected'])

const mapContainer = ref(null)
let map = null
let popup = null
let pendingStops = null

const ROUTE_COLORS = {
  A: '#185FA5',
  B: '#639922',
  C: '#D85A30',
  null: '#888888',
}

// Transform normalized [0,1] coords to lon/lat near origin
function toCoord(x, y) {
  return [x - 0.5, 0.5 - y]
}

function nearestNeighborOrder(school, routeStops) {
  if (routeStops.length === 0) return []
  const unvisited = [...routeStops]
  const ordered = []
  let current = school

  while (unvisited.length > 0) {
    let minDist = Infinity
    let nearest = null
    let nearestIdx = -1

    unvisited.forEach((stop, idx) => {
      const dx = stop.x - current.x
      const dy = stop.y - current.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < minDist) { minDist = dist; nearest = stop; nearestIdx = idx }
    })

    ordered.push(nearest)
    unvisited.splice(nearestIdx, 1)
    current = nearest
  }
  return ordered
}

function buildStopsGeoJSON(stops) {
  return {
    type: 'FeatureCollection',
    features: stops.map(stop => ({
      type: 'Feature',
      properties: {
        id: stop.id,
        name: stop.name,
        type: stop.type,
        riders: stop.riders ?? 0,
        route: stop.route,
        circleColor: stop.type === 'school'
          ? '#185FA5'
          : (ROUTE_COLORS[stop.route] ?? '#888888'),
      },
      geometry: { type: 'Point', coordinates: toCoord(stop.x, stop.y) },
    })),
  }
}

function buildRoutesGeoJSON(stops) {
  const school = stops.find(s => s.type === 'school')
  if (!school) return { type: 'FeatureCollection', features: [] }

  const features = ['A', 'B', 'C'].map(routeId => {
    const routeStops = stops.filter(s => s.route === routeId && s.type === 'stop')
    if (routeStops.length === 0) return null

    const ordered = nearestNeighborOrder(school, routeStops)
    const coords = [toCoord(school.x, school.y), ...ordered.map(s => toCoord(s.x, s.y))]

    return {
      type: 'Feature',
      properties: { routeId, color: ROUTE_COLORS[routeId] },
      geometry: { type: 'LineString', coordinates: coords },
    }
  }).filter(Boolean)

  return { type: 'FeatureCollection', features }
}

function buildCoverageGeoJSON(stops) {
  const pickupStops = stops.filter(s => s.type === 'stop')
  const features = pickupStops.map(stop => {
    const pt = turf.point(toCoord(stop.x, stop.y))
    const buffered = turf.buffer(pt, 0.6, { units: 'kilometers' })
    return {
      ...buffered,
      properties: {
        ...buffered.properties,
        color: ROUTE_COLORS[stop.route] ?? '#888888',
      },
    }
  })
  return { type: 'FeatureCollection', features }
}

function applyStops(stops) {
  if (!map || !map.isStyleLoaded()) {
    pendingStops = stops
    return
  }

  map.getSource('stops-source')?.setData(buildStopsGeoJSON(stops))
  map.getSource('routes-source')?.setData(buildRoutesGeoJSON(stops))
  map.getSource('coverage-source')?.setData(buildCoverageGeoJSON(stops))
}

function applyMode(newMode) {
  if (!map || !map.isStyleLoaded()) return
  map.setLayoutProperty('routes-layer', 'visibility', newMode === 'routes' ? 'visible' : 'none')
  map.setLayoutProperty('coverage-layer', 'visibility', newMode === 'coverage' ? 'visible' : 'none')
  map.setLayoutProperty('density-layer', 'visibility', newMode === 'density' ? 'visible' : 'none')
}

onMounted(() => {
  map = new maplibregl.Map({
    container: mapContainer.value,
    style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    center: [0, 0],
    zoom: 7,
    attributionControl: false,
  })

  popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false })

  map.on('load', () => {
    // Sources
    map.addSource('stops-source', { type: 'geojson', data: buildStopsGeoJSON([]) })
    map.addSource('routes-source', { type: 'geojson', data: buildRoutesGeoJSON([]) })
    map.addSource('coverage-source', { type: 'geojson', data: buildCoverageGeoJSON([]) })

    // Coverage fill (hidden by default)
    map.addLayer({
      id: 'coverage-layer',
      type: 'fill',
      source: 'coverage-source',
      paint: {
        'fill-color': ['get', 'color'],
        'fill-opacity': 0.15,
      },
      layout: { visibility: 'none' },
    })

    // Route lines
    map.addLayer({
      id: 'routes-layer',
      type: 'line',
      source: 'routes-source',
      layout: { 'line-join': 'round', 'line-cap': 'round', visibility: 'visible' },
      paint: {
        'line-color': ['get', 'color'],
        'line-width': 2.5,
      },
    })

    // Density heatmap (hidden by default)
    map.addLayer({
      id: 'density-layer',
      type: 'heatmap',
      source: 'stops-source',
      paint: {
        'heatmap-weight': ['/', ['get', 'riders'], 15],
        'heatmap-intensity': 1.2,
        'heatmap-radius': 25,
        'heatmap-color': [
          'interpolate', ['linear'], ['heatmap-density'],
          0,   'rgba(0,0,255,0)',
          0.2, 'royalblue',
          0.4, 'cyan',
          0.6, 'lime',
          0.8, 'yellow',
          1,   'red',
        ],
        'heatmap-opacity': 0.75,
      },
      layout: { visibility: 'none' },
    })

    // Stop circles (always on top)
    map.addLayer({
      id: 'stops-layer',
      type: 'circle',
      source: 'stops-source',
      paint: {
        'circle-radius': ['match', ['get', 'type'], 'school', 10, 7],
        'circle-color': ['get', 'circleColor'],
        'circle-stroke-color': '#fff',
        'circle-stroke-width': 1.5,
      },
    })

    // Hover popup
    map.on('mouseenter', 'stops-layer', (e) => {
      map.getCanvas().style.cursor = 'pointer'
      const feature = e.features[0]
      const coords = feature.geometry.coordinates.slice()
      const { name, riders, route, type } = feature.properties
      const label = type === 'school'
        ? `<strong>${name}</strong><br>School (destination)`
        : `<strong>${name}</strong><br>Route ${route} · ${riders} riders`
      popup.setLngLat(coords).setHTML(label).addTo(map)
    })

    map.on('mouseleave', 'stops-layer', () => {
      map.getCanvas().style.cursor = ''
      popup.remove()
    })

    map.on('click', 'stops-layer', (e) => {
      const id = e.features[0].properties.id
      emit('stop-selected', id)
    })

    // Apply any data that arrived before the map was ready
    if (pendingStops) {
      applyStops(pendingStops)
      pendingStops = null
    }
    applyMode(props.mode)
  })
})

onBeforeUnmount(() => {
  map?.remove()
})

watch(() => props.mode, applyMode)

function refreshMap(stops) {
  applyStops(stops)
}

defineExpose({ refreshMap })
</script>

<template>
  <div ref="mapContainer" style="width: 100%; height: 100%;" />
</template>
