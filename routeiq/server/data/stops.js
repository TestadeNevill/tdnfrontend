import { v4 as uuidv4 } from 'uuid'

export const stops = [
  { id: uuidv4(), name: 'Lincoln Elementary', x: 0.50, y: 0.45, type: 'school', riders: 0, route: null },
  { id: uuidv4(), name: '14 Oak Street',  x: 0.18, y: 0.22, type: 'stop', riders: 22, route: 'A' },
  { id: uuidv4(), name: '7 Maple Ave',    x: 0.28, y: 0.30, type: 'stop', riders: 18, route: 'A' },
  { id: uuidv4(), name: '55 Elm Court',   x: 0.35, y: 0.18, type: 'stop', riders: 25, route: 'A' },
  { id: uuidv4(), name: '103 Pine Rd',    x: 0.22, y: 0.55, type: 'stop', riders: 20, route: 'B' },
  { id: uuidv4(), name: '88 Cedar Blvd',  x: 0.15, y: 0.70, type: 'stop', riders: 30, route: 'B' },
  { id: uuidv4(), name: '44 Birch Way',   x: 0.32, y: 0.78, type: 'stop', riders: 15, route: 'B' },
  { id: uuidv4(), name: '67 Walnut Dr',   x: 0.42, y: 0.72, type: 'stop', riders: 28, route: 'B' },
  { id: uuidv4(), name: '91 Spruce Ln',   x: 0.72, y: 0.25, type: 'stop', riders: 19, route: 'C' },
  { id: uuidv4(), name: '33 Ash Court',   x: 0.82, y: 0.38, type: 'stop', riders: 22, route: 'C' },
  { id: uuidv4(), name: '19 Hickory St',  x: 0.78, y: 0.60, type: 'stop', riders: 24, route: 'C' },
  { id: uuidv4(), name: '5 Willow Ave',   x: 0.65, y: 0.70, type: 'stop', riders: 25, route: 'C' },
]

export function getStops() {
  return stops
}

export function addStop(data) {
  const stop = { id: uuidv4(), type: 'stop', route: null, ...data }
  stops.push(stop)
  return stop
}

export function updateStop(id, fields) {
  const idx = stops.findIndex(s => s.id === id)
  if (idx === -1) return null
  Object.assign(stops[idx], fields)
  return stops[idx]
}

export function removeStop(id) {
  const idx = stops.findIndex(s => s.id === id)
  if (idx === -1) return false
  stops.splice(idx, 1)
  return true
}
