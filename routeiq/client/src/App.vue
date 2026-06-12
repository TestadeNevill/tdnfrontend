<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import MapView from './components/MapView.vue'
import StopPanel from './components/StopPanel.vue'
import AddStopModal from './components/AddStopModal.vue'

const ROUTES = [
  { id: 'A', label: 'Route A', color: '#185FA5', capacity: 48 },
  { id: 'B', label: 'Route B', color: '#639922', capacity: 48 },
  { id: 'C', label: 'Route C', color: '#D85A30', capacity: 48 },
]

const MODES = ['routes', 'coverage', 'density']

const stops = ref([])
const mode = ref('routes')
const selectedStopId = ref(null)
const showModal = ref(false)
const optimizing = ref(false)

const mapRef = ref(null)

async function fetchStops() {
  const { data } = await axios.get('/api/stops')
  stops.value = data
  mapRef.value?.refreshMap(data)
}

async function onOptimize() {
  optimizing.value = true
  try {
    const { data } = await axios.post('/api/optimize')
    stops.value = data
    mapRef.value?.refreshMap(data)
  } finally {
    optimizing.value = false
  }
}

function onStopSelected(id) {
  selectedStopId.value = id
}

function onStopAdded(newStop) {
  stops.value = [...stops.value, newStop]
  mapRef.value?.refreshMap(stops.value)
  showModal.value = false
}

onMounted(fetchStops)
</script>

<template>
  <header class="toolbar">
    <span class="toolbar__title">RouteIQ</span>
    <span class="toolbar__divider" />

    <div class="mode-tabs">
      <button
        v-for="m in MODES"
        :key="m"
        class="mode-tab"
        :class="{ active: mode === m }"
        @click="mode = m"
      >
        {{ m.charAt(0).toUpperCase() + m.slice(1) }}
      </button>
    </div>

    <span class="toolbar__spacer" />

    <button class="btn" @click="showModal = true">+ Add Stop</button>
    <button
      class="btn btn--primary"
      :disabled="optimizing"
      @click="onOptimize"
    >
      {{ optimizing ? 'Optimizing…' : 'Optimize Routes' }}
    </button>
  </header>

  <div class="app-layout">
    <StopPanel
      :stops="stops"
      :routes="ROUTES"
      :selected-stop-id="selectedStopId"
      @select-stop="onStopSelected"
    />
    <div class="map-wrap">
      <MapView
        ref="mapRef"
        :mode="mode"
        @stop-selected="onStopSelected"
      />
    </div>
  </div>

  <AddStopModal
    v-if="showModal"
    @stop-added="onStopAdded"
    @close="showModal = false"
  />
</template>
