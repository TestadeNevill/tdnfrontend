import type { LabsProjectMeta } from "./types";

export const LABS_PROJECTS: LabsProjectMeta[] = [
  {
    slug: "routeiq",
    title: "RouteIQ — Live Transit Explorer",
    description:
      "Real-time transit explorer over live GTFS data (Transitland) — pick a city and route to see actual stops, scheduled times, the destination headsign, and estimated ridership per stop on a MapLibre map.",
    route: "/labs?service=routeiq",
    tags: ["Transit", "GIS", "GTFS", "MapLibre", "Transitland"],
    status: "ok",
    statusLabel: "Live demo",
    external: false,
  },
  {
    slug: "hydro-matrix",
    title: "Hydro Site Selection & Permitting Matrix",
    description:
      "Flagship workflow — GIS scoring, financial screening, and deterministic FERC permitting matrix over run-of-river and PSH sites. Preview via site-suitability heatmap.",
    route: "/labs/hydroiq",
    tags: ["Hydro", "GIS", "Finance", "Permitting"],
    status: "neutral",
    statusLabel: "In development",
  },
  {
    slug: "urban-intelligence",
    title: "Urban Intelligence Dashboard",
    description:
      "Command-center fusion of mock traffic, AQI, grid load, and mobility—Leaflet layers, SVG trends, stress index, and rule-based insights.",
    route: "/labs/urban-intelligence",
    tags: ["Urban", "Maps", "Mock data"],
    status: "ok",
    statusLabel: "Frontend-only",
  },
  {
    slug: "site-suitability",
    title: "AI Site Suitability Heatmap",
    description:
      "Weighted 0–100 suitability over mock parcels—Leaflet map, live sliders, presets, and explain panel.",
    route: "/labs/site-suitability",
    tags: ["GIS", "Scoring", "Maps"],
    status: "ok",
    statusLabel: "Frontend-only",
  },
  {
    slug: "gis-asset-atlas",
    title: "GIS Asset Atlas",
    description:
      "Leaflet map with mock infrastructure assets on OpenStreetMap tiles—layer toggles and popups.",
    route: "/labs/demos/gis-asset-atlas",
    tags: ["GIS", "Maps", "GeoJSON"],
    status: "ok",
    statusLabel: "Live tiles",
  },
  {
    slug: "grid-operations-board",
    title: "Grid Operations Board",
    description:
      "Hourly load vs renewables under three synthetic scenarios—slider-driven SVG stack.",
    route: "/labs/demos/grid-operations-board",
    tags: ["Energy", "Charts", "Sliders"],
    status: "ok",
    statusLabel: "Mock ISO view",
  },
  {
    slug: "corridor-demand-signals",
    title: "Corridor Demand Signals",
    description:
      "Mode share, incident feed, and delay sparkline for a synthetic regional spine.",
    route: "/labs/demos/corridor-demand-signals",
    tags: ["Transport", "Viz", "Alerts"],
    status: "warn",
    statusLabel: "Elevated delay",
  },
  {
    slug: "absorption-pipeline",
    title: "Absorption Pipeline",
    description:
      "CRE-style funnel by stage with deal roster and KPI strip—all mock transactions.",
    route: "/labs/demos/absorption-pipeline",
    tags: ["Real estate", "Pipeline"],
    status: "neutral",
    statusLabel: "Sandbox",
  },
  {
    slug: "intermodal-pressure-map",
    title: "Intermodal Pressure Map",
    description:
      "SVG schematic hub with animated pressure halos driven by mock telemetry.",
    route: "/labs/demos/intermodal-pressure-map",
    tags: ["Intermodal", "SVG"],
    status: "ok",
    statusLabel: "Simulated",
  },
  {
    slug: "insight-workbench",
    title: "Insight Workbench",
    description:
      "Structured scenario notes with optional OpenAI-backed synthesis (mock fallback offline).",
    route: "/labs/demos/insight-workbench",
    tags: ["AI workflow", "API"],
    status: "ok",
    statusLabel: "OpenAI optional",
  },
];
