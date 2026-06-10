import type { ParkDetail } from "../../types";

export type MapFeatureSource =
  | "google"
  | "osm"
  | "nws"
  | "airnow"
  | "transitland"
  | "nyc-open-data"
  | "nypd-open-data"
  | "census-acs"
  | "fema-nfhl"
  | "openrouteservice"
  | "nrel"
  | "estimate";

export interface MapFeature {
  id: string;
  layerId: string;
  name: string;
  lat: number;
  lng: number;
  geometry?: GeoJSON.Geometry;
  properties: Record<string, unknown>;
  source?: MapFeatureSource;
}

export interface LayerMeta {
  source: string;
  updated: string;
  coverage?: string;
  confidence?: string;
  caveat?: string;
  attribution?: string;
  [key: string]: unknown;
}

export interface LayerApiResponse {
  type: "FeatureCollection";
  features: GeoJSON.Feature[];
  meta: LayerMeta;
}

export interface MapAnchor {
  lat: number;
  lng: number;
  radiusM: number;
}

export type ScenarioPresetId =
  | "park-finder"
  | "parent"
  | "runner"
  | "transit"
  | "apartment-search"
  | "business-scout"
  | "planner";

export interface ScenarioPreset {
  id: ScenarioPresetId;
  label: string;
  description: string;
  layers: string[];
  amenityFilters?: string[];
  isochroneMinutes?: number;
}

export interface MatchScoreFactor {
  kind: "positive" | "negative" | "neutral";
  label: string;
  weight: number;
}

export interface MatchScoreResult {
  score: number;
  factors: MatchScoreFactor[];
  presetId: ScenarioPresetId;
}

export interface ComfortData {
  weather?: LayerMeta["weather"];
  aqi?: LayerMeta["aqi"];
}

export interface PlaceInsight extends ParkDetail {
  layerId?: string;
  weakPresence?: boolean;
  amenities?: MapFeature[];
  matchScore?: MatchScoreResult;
  comfort?: ComfortData;
  layerMeta?: Record<string, LayerMeta>;
}

export interface ComparisonPin {
  id: "A" | "B";
  lat: number;
  lng: number;
  label: string;
  score?: MatchScoreResult;
}
