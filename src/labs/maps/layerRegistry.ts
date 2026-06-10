// Map rendering: Leaflet (Phase 1–3). MapLibre GL JS recommended for Phase 4+
// if choropleth/hexbin performance becomes a bottleneck at scale.

import type { ScenarioPreset } from "./types/mapFeature";

export type LayerCategory =
  | "parks"
  | "mobility"
  | "weather"
  | "civic"
  | "accessibility"
  | "demographics"
  | "business"
  | "environment"
  | "housing";

export interface LayerFilterDef {
  id: string;
  label: string;
  type: "boolean" | "select" | "range";
  options?: { value: string; label: string }[];
  defaultValue?: string | boolean | number;
}

export interface MapLayerDefinition {
  id: string;
  label: string;
  category: LayerCategory;
  sourceType: "geojson" | "marker" | "hexbin" | "choropleth" | "badge";
  endpoint: string;
  minZoom?: number;
  maxZoom?: number;
  defaultVisible: boolean;
  cacheTtlSeconds: number;
  requiresBbox: boolean;
  isLive: boolean;
  filters: LayerFilterDef[];
  attribution: string;
  caveat?: string;
  presets: string[];
}

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: "park-finder",
    label: "Park Finder",
    description: "Nearest parks with amenities and walk-time reach",
    layers: ["parks", "isochrone", "weather", "aqi"],
    isochroneMinutes: 15,
  },
  {
    id: "parent",
    label: "Parent Mode",
    description: "Playgrounds, bathrooms, weather, and civic context",
    layers: ["parks", "isochrone", "weather", "aqi", "civic311", "accessibility"],
    amenityFilters: ["playground", "bathroom"],
    isochroneMinutes: 15,
  },
  {
    id: "runner",
    label: "Runner Mode",
    description: "Trails, water, air quality, and weather comfort",
    layers: ["parks", "isochrone", "weather", "aqi"],
    amenityFilters: ["waterFountain", "bathroom"],
    isochroneMinutes: 10,
  },
  {
    id: "transit",
    label: "Transit Mode",
    description: "Transit stops, routes, and walk reach",
    layers: ["transit", "isochrone", "parks"],
    isochroneMinutes: 10,
  },
  {
    id: "apartment-search",
    label: "Apartment Search",
    description: "Neighborhood context — transit, flood, demographics, civic",
    layers: ["parks", "transit", "isochrone", "weather", "aqi", "civic311", "incidents", "census", "flood", "housing"],
    isochroneMinutes: 15,
  },
  {
    id: "business-scout",
    label: "Business Scout",
    description: "Business density, demographics, weak-presence leads",
    layers: ["business-scout", "transit", "census", "civic311"],
    isochroneMinutes: 10,
  },
  {
    id: "planner",
    label: "Planner Mode",
    description: "Park access, demographics, civic quality, accessibility",
    layers: ["parks", "isochrone", "civic311", "accessibility", "census", "flood"],
    isochroneMinutes: 15,
  },
];

export const LAYER_REGISTRY: MapLayerDefinition[] = [
  {
    id: "parks",
    label: "Park Intelligence",
    category: "parks",
    sourceType: "marker",
    endpoint: "/api/labs/maps/parks",
    defaultVisible: true,
    cacheTtlSeconds: 300,
    requiresBbox: false,
    isLive: true,
    filters: [
      { id: "bathroom", label: "Bathroom", type: "boolean", defaultValue: false },
      { id: "playground", label: "Playground", type: "boolean", defaultValue: false },
      { id: "dogRun", label: "Dog run", type: "boolean", defaultValue: false },
      { id: "waterFountain", label: "Water fountain", type: "boolean", defaultValue: false },
      { id: "wheelchair", label: "Wheelchair access", type: "boolean", defaultValue: false },
    ],
    attribution: "© Google Places / © OpenStreetMap",
    caveat: "Amenity tags from OSM vary by mapper coverage.",
    presets: ["park-finder", "parent", "runner", "transit", "apartment-search", "planner"],
  },
  {
    id: "isochrone",
    label: "Walk reach",
    category: "mobility",
    sourceType: "geojson",
    endpoint: "/api/labs/maps/isochrone",
    defaultVisible: true,
    cacheTtlSeconds: 900,
    requiresBbox: false,
    isLive: true,
    filters: [
      {
        id: "minutes",
        label: "Walk time",
        type: "select",
        options: [
          { value: "5", label: "5 min" },
          { value: "10", label: "10 min" },
          { value: "15", label: "15 min" },
          { value: "20", label: "20 min" },
        ],
        defaultValue: "10",
      },
    ],
    attribution: "© OpenRouteService",
    presets: ["park-finder", "parent", "runner", "transit", "apartment-search", "planner"],
  },
  {
    id: "weather",
    label: "Weather comfort",
    category: "weather",
    sourceType: "badge",
    endpoint: "/api/labs/maps/weather",
    defaultVisible: true,
    cacheTtlSeconds: 600,
    requiresBbox: false,
    isLive: true,
    filters: [],
    attribution: "© NOAA/NWS",
    presets: ["park-finder", "parent", "runner", "apartment-search"],
  },
  {
    id: "aqi",
    label: "Air quality",
    category: "weather",
    sourceType: "badge",
    endpoint: "/api/labs/maps/aqi",
    defaultVisible: true,
    cacheTtlSeconds: 900,
    requiresBbox: false,
    isLive: true,
    filters: [],
    attribution: "© EPA AirNow",
    caveat: "Configure AIRNOW_API_KEY for production EPA data.",
    presets: ["park-finder", "parent", "runner", "apartment-search"],
  },
  {
    id: "transit",
    label: "Transit access",
    category: "mobility",
    sourceType: "marker",
    endpoint: "/api/labs/maps/transit",
    minZoom: 12,
    defaultVisible: false,
    cacheTtlSeconds: 600,
    requiresBbox: true,
    isLive: true,
    filters: [],
    attribution: "© Transitland / GTFS",
    caveat: "Configure TRANSITLAND_API_KEY for transit data.",
    presets: ["transit", "apartment-search", "business-scout"],
  },
  {
    id: "civic311",
    label: "Civic quality (311)",
    category: "civic",
    sourceType: "hexbin",
    endpoint: "/api/labs/maps/civic311",
    defaultVisible: false,
    cacheTtlSeconds: 900,
    requiresBbox: true,
    isLive: true,
    filters: [
      {
        id: "days",
        label: "Date range",
        type: "select",
        options: [
          { value: "30", label: "30 days" },
          { value: "90", label: "90 days" },
          { value: "365", label: "1 year" },
        ],
        defaultValue: "90",
      },
    ],
    attribution: "© NYC Open Data",
    caveat: "Reports filed, not verified outcomes. NYC only.",
    presets: ["parent", "apartment-search", "business-scout", "planner"],
  },
  {
    id: "accessibility",
    label: "Accessibility",
    category: "accessibility",
    sourceType: "marker",
    endpoint: "/api/labs/maps/accessibility",
    defaultVisible: false,
    cacheTtlSeconds: 600,
    requiresBbox: false,
    isLive: true,
    filters: [],
    attribution: "© OpenStreetMap wheelchair tags",
    caveat: "Coverage varies — verify on site.",
    presets: ["parent", "planner"],
  },
  {
    id: "incidents",
    label: "Reported incidents",
    category: "civic",
    sourceType: "hexbin",
    endpoint: "/api/labs/maps/incidents",
    defaultVisible: false,
    cacheTtlSeconds: 1800,
    requiresBbox: true,
    isLive: true,
    filters: [
      {
        id: "days",
        label: "Date range",
        type: "select",
        options: [
          { value: "30", label: "30 days" },
          { value: "90", label: "90 days" },
          { value: "365", label: "1 year" },
        ],
        defaultValue: "90",
      },
    ],
    attribution: "© NYPD / NYC Open Data",
    caveat: "Reported incidents — not a safety score.",
    presets: ["apartment-search"],
  },
  {
    id: "census",
    label: "Demographics",
    category: "demographics",
    sourceType: "choropleth",
    endpoint: "/api/labs/maps/census",
    minZoom: 11,
    defaultVisible: false,
    cacheTtlSeconds: 86400,
    requiresBbox: true,
    isLive: false,
    filters: [
      {
        id: "metric",
        label: "Metric",
        type: "select",
        options: [
          { value: "medianIncome", label: "Median income" },
          { value: "population", label: "Population" },
          { value: "renterOccupied", label: "Renters" },
        ],
        defaultValue: "medianIncome",
      },
    ],
    attribution: "© U.S. Census Bureau",
    presets: ["apartment-search", "business-scout", "planner"],
  },
  {
    id: "flood",
    label: "Flood zones",
    category: "environment",
    sourceType: "geojson",
    endpoint: "/api/labs/maps/flood",
    defaultVisible: false,
    cacheTtlSeconds: 86400,
    requiresBbox: true,
    isLive: false,
    filters: [],
    attribution: "© FEMA NFHL",
    caveat: "For planning — consult official maps for decisions.",
    presets: ["apartment-search", "planner"],
  },
  {
    id: "business-scout",
    label: "Business scout",
    category: "business",
    sourceType: "marker",
    endpoint: "/api/labs/maps/business-scout",
    minZoom: 13,
    defaultVisible: false,
    cacheTtlSeconds: 600,
    requiresBbox: false,
    isLive: true,
    filters: [
      {
        id: "category",
        label: "Category",
        type: "select",
        options: [
          { value: "restaurant", label: "Restaurants" },
          { value: "cafe", label: "Cafés" },
          { value: "retail", label: "Retail" },
          { value: "service", label: "Services" },
        ],
        defaultValue: "restaurant",
      },
    ],
    attribution: "© Google Places",
    caveat: "Weak presence inferred — verify manually.",
    presets: ["business-scout"],
  },
  {
    id: "housing",
    label: "Housing context",
    category: "housing",
    sourceType: "badge",
    endpoint: "/api/labs/maps/housing",
    defaultVisible: false,
    cacheTtlSeconds: 86400,
    requiresBbox: false,
    isLive: false,
    filters: [],
    attribution: "© HUD / FHFA",
    presets: ["apartment-search"],
  },
  {
    id: "ev",
    label: "EV charging",
    category: "mobility",
    sourceType: "marker",
    endpoint: "/api/labs/maps/ev",
    defaultVisible: false,
    cacheTtlSeconds: 3600,
    requiresBbox: false,
    isLive: true,
    filters: [],
    attribution: "© NREL",
    caveat: "Configure NREL_API_KEY for station data.",
    presets: [],
  },
];

export function getLayerById(id: string): MapLayerDefinition | undefined {
  return LAYER_REGISTRY.find((l) => l.id === id);
}

export function getPresetById(id: string): ScenarioPreset | undefined {
  return SCENARIO_PRESETS.find((p) => p.id === id);
}

export function layersForPreset(presetId: string): MapLayerDefinition[] {
  const preset = getPresetById(presetId);
  if (!preset) return LAYER_REGISTRY.filter((l) => l.defaultVisible);
  return LAYER_REGISTRY.filter((l) => preset.layers.includes(l.id));
}
