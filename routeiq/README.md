# RouteIQ — School Bus Route Optimizer

RouteIQ is an interactive school bus route optimization tool built as a portfolio project for Tyler Technologies. It visualizes pickup stop assignments across three bus routes using a nearest-centroid clustering algorithm with load balancing, rendered on a full-screen MapLibre GL JS map. The app demonstrates end-to-end spatial engineering competency: GIS mapping, service-area coverage analysis, rider-density heatmaps, nearest-neighbor TSP route ordering, and a REST API that rebalances routes on demand — all built with the Vue 3 / Express stack that mirrors Tyler Tech's own architecture.

## Live demo

[View on testadenevill.com/lab/routeiq](https://testadenevill.com/lab/routeiq)

## Tech stack & competency mapping

| Capability | This project | Tyler Tech equivalent |
|---|---|---|
| Interactive GIS map | MapLibre GL JS 3 | ESRI ArcGIS JavaScript API |
| Spatial analysis | Turf.js (service area buffers, heatmap) | ArcGIS spatial analysis |
| Network routing | Nearest-neighbor TSP, route optimization | ArcGIS Network Analyst |
| Component framework | Vue 3 Composition API | Vue.js / Angular |
| REST API | Express Web API, JSON over HTTP | ASP.NET Web API 2 |
| Data layer | In-memory store with typed schema | Microsoft SQL Server |
| Cloud ready | Vercel (frontend) + Railway (API) | Cloud hosting |

## Features

- **Three map modes** toggled from the toolbar:
  - **Routes** — colored polylines per route drawn in nearest-neighbor order from school to each stop
  - **Coverage** — 600 m service-area buffer circles per stop at 15% opacity, colored by route
  - **Density** — rider-weighted heatmap showing demand concentration across the district
- **Fleet overview sidebar** — total stops, active routes, total riders, estimated round-trip distance per route
- **Route capacity bars** — progress bars showing riders vs. 48-seat bus capacity for each route
- **Stop list** — all pickup stops with colored route indicator and rider count; click to highlight on map
- **Hover popups** — stop name, route assignment, and rider count on mouse-over
- **Add Stop** — modal form to place a new stop at a random grid position; auto-assigned to a route via nearest-centroid
- **Optimize Routes** — POST to the API triggers full re-clustering of all stops with live map refresh

## Running locally

```bash
# Prerequisites: Node.js 18+

git clone https://github.com/TestadeNevill/tdnfrontend.git
cd tdnfrontend/routeiq

npm install          # install concurrently at workspace root
npm run setup        # install server + client dependencies
npm run dev          # starts Express on :3001 and Vite on :5174
```

Open [http://localhost:5174](http://localhost:5174)

Verify the API: [http://localhost:3001/api/stops](http://localhost:3001/api/stops)

## Deployment

**Frontend** deploys to [Vercel](https://vercel.com) from `routeiq/client/`. Set environment variable:

```
VITE_API_URL=https://your-railway-app.up.railway.app
```

**Server** deploys to [Railway](https://railway.app) from `routeiq/server/`. No environment variables required for the server itself; CORS is open for demo purposes.

## Architecture notes

**Coordinate system:** Stops use a normalized x/y grid in the [0, 1] range rather than real geographic coordinates. This maps to a conceptual ~5 × 5 mile district displayed on screen. At render time, coordinates are transformed to GeoJSON lon/lat via `lng = x − 0.5`, `lat = 0.5 − y`, placing all stops in a clean ocean area on the CartoCDN positron basemap. Distance estimates in the sidebar scale the normalized values by 5 (miles) to give plausible route lengths.

**Nearest-centroid algorithm:** Each new stop is scored against the centroid of every existing route. The score is Euclidean distance to the centroid plus a load penalty (`current_riders × 0.3`). Assignment is greedy — each placed stop immediately shifts the centroid for subsequent assignments, naturally balancing load without a full ILP solver. This matches the real-time responsiveness requirement of a dispatcher UI, which a full TSP solve would violate.

**Layer/source pattern:** MapLibre GL JS uses separate GeoJSON sources (`stops-source`, `routes-source`, `coverage-source`) updated via `setData()` on each re-optimization, mirroring the ArcGIS feature layer architecture where you update the underlying feature service and the layer re-renders automatically. The three map modes toggle layer visibility rather than re-adding layers, which avoids camera resets and flash artifacts — the same pattern used in ArcGIS web app builder layer visibility controls.
