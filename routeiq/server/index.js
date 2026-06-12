import express from 'express'
import cors from 'cors'
import { getStops, addStop, updateStop, removeStop } from './data/stops.js'

const app = express()
app.use(cors())
app.use(express.json())

const ROUTES = ['A', 'B', 'C']

function assignRoute(stop) {
  const school = getStops().find(s => s.type === 'school') ?? { x: 0.5, y: 0.45 }

  const scores = ROUTES.map(routeId => {
    const routeStops = getStops().filter(s => s.route === routeId && s.type === 'stop')

    const cx = routeStops.length > 0
      ? routeStops.reduce((sum, s) => sum + s.x, 0) / routeStops.length
      : school.x
    const cy = routeStops.length > 0
      ? routeStops.reduce((sum, s) => sum + s.y, 0) / routeStops.length
      : school.y

    const dist = Math.sqrt((stop.x - cx) ** 2 + (stop.y - cy) ** 2)
    const totalRiders = routeStops.reduce((sum, s) => sum + (s.riders ?? 0), 0)
    const penalty = totalRiders * 0.3

    return { routeId, score: dist + penalty }
  })

  scores.sort((a, b) => a.score - b.score)
  return scores[0].routeId
}

app.get('/api/stops', (req, res) => {
  res.json(getStops())
})

app.post('/api/stops', (req, res) => {
  const { name, x, y, riders } = req.body
  if (!name || x == null || y == null || riders == null) {
    return res.status(400).json({ error: 'name, x, y, riders required' })
  }
  const stop = addStop({ name, x: Number(x), y: Number(y), riders: Number(riders) })
  stop.route = assignRoute(stop)
  res.status(201).json(stop)
})

app.put('/api/stops/:id', (req, res) => {
  const updated = updateStop(req.params.id, req.body)
  if (!updated) return res.status(404).json({ error: 'Stop not found' })
  res.json(updated)
})

app.delete('/api/stops/:id', (req, res) => {
  const ok = removeStop(req.params.id)
  if (!ok) return res.status(404).json({ error: 'Stop not found' })
  res.status(204).end()
})

app.post('/api/optimize', (req, res) => {
  const pickupStops = getStops().filter(s => s.type === 'stop')
  pickupStops.forEach(s => { s.route = null })
  pickupStops.forEach(stop => {
    stop.route = assignRoute(stop)
  })
  res.json(getStops())
})

const PORT = 3001
app.listen(PORT, () => console.log(`RouteIQ server running on http://localhost:${PORT}`))
