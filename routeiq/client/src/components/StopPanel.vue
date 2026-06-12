<script setup>
import { computed } from 'vue'

const props = defineProps({
  stops: { type: Array, default: () => [] },
  routes: { type: Array, default: () => [] },
  selectedStopId: { type: String, default: null },
})

const emit = defineEmits(['select-stop'])

const ROUTE_COLORS = {
  A: '#185FA5',
  B: '#639922',
  C: '#D85A30',
}

function routeColorFor(routeId) {
  return ROUTE_COLORS[routeId] ?? '#888888'
}

const school = computed(() => props.stops.find(s => s.type === 'school'))

function nnDistance(school, routeStops) {
  if (!school || routeStops.length === 0) return 0
  const SCALE = 5
  let dist = 0
  let current = school
  const unvisited = [...routeStops]

  while (unvisited.length > 0) {
    let minD = Infinity
    let nearest = null
    let nIdx = -1
    unvisited.forEach((s, i) => {
      const d = Math.sqrt((s.x - current.x) ** 2 + (s.y - current.y) ** 2)
      if (d < minD) { minD = d; nearest = s; nIdx = i }
    })
    dist += minD
    current = nearest
    unvisited.splice(nIdx, 1)
  }
  dist += Math.sqrt((current.x - school.x) ** 2 + (current.y - school.y) ** 2)
  return dist * SCALE
}

const routeStats = computed(() => {
  return props.routes.map(route => {
    const routeStops = props.stops.filter(s => s.route === route.id && s.type === 'stop')
    const riders = routeStops.reduce((sum, s) => sum + (s.riders ?? 0), 0)
    const distanceMiles = nnDistance(school.value, routeStops)
    const loadPct = Math.min(100, Math.round((riders / route.capacity) * 100))
    return { ...route, stopCount: routeStops.length, riders, distanceMiles, loadPct }
  })
})

const fleetStats = computed(() => {
  const pickupStops = props.stops.filter(s => s.type === 'stop')
  const totalRiders = pickupStops.reduce((sum, s) => sum + (s.riders ?? 0), 0)
  const totalDist = routeStats.value.reduce((sum, r) => sum + r.distanceMiles, 0)
  return {
    stops: pickupStops.length,
    routes: routeStats.value.filter(r => r.stopCount > 0).length,
    riders: totalRiders,
    distance: totalDist.toFixed(1),
  }
})

const pickupStops = computed(() => props.stops.filter(s => s.type === 'stop'))
</script>

<template>
  <aside class="sidebar">
    <!-- Fleet overview -->
    <div>
      <div class="sidebar__section-title">Fleet Overview</div>
      <div class="fleet-stats">
        <div class="fleet-stat">
          <span class="fleet-stat__label">Total stops</span>
          <span class="fleet-stat__value">{{ fleetStats.stops }}</span>
        </div>
        <div class="fleet-stat">
          <span class="fleet-stat__label">Active routes</span>
          <span class="fleet-stat__value">{{ fleetStats.routes }}</span>
        </div>
        <div class="fleet-stat">
          <span class="fleet-stat__label">Total riders</span>
          <span class="fleet-stat__value">{{ fleetStats.riders }}</span>
        </div>
        <div class="fleet-stat">
          <span class="fleet-stat__label">Est. distance</span>
          <span class="fleet-stat__value">{{ fleetStats.distance }} mi</span>
        </div>
      </div>
    </div>

    <!-- Routes with capacity bars -->
    <div>
      <div class="sidebar__section-title">Routes</div>
      <div class="route-rows">
        <div v-for="route in routeStats" :key="route.id">
          <div class="route-row__header">
            <span class="route-dot" :style="{ background: route.color }" />
            <span class="route-row__label">{{ route.label }}</span>
            <span class="route-row__count">{{ route.riders }}/{{ route.capacity }}</span>
          </div>
          <div class="progress">
            <div
              class="progress__fill"
              :style="{ width: route.loadPct + '%', background: route.color }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Stop list -->
    <div>
      <div class="sidebar__section-title">Stops</div>
      <div class="stop-list">
        <div
          v-for="stop in pickupStops"
          :key="stop.id"
          class="stop-item"
          :class="{ selected: stop.id === selectedStopId }"
          @click="emit('select-stop', stop.id)"
        >
          <span class="route-dot" :style="{ background: routeColorFor(stop.route) }" />
          <span class="stop-item__name">{{ stop.name }}</span>
          <span class="stop-item__riders">{{ stop.riders }}r</span>
        </div>
      </div>
    </div>
  </aside>
</template>
