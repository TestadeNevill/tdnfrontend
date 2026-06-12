import type { ComponentType } from "react";

export type LabsStatusVariant = "ok" | "warn" | "crit" | "neutral";

export interface LabsServiceMeta {
  id: string;
  title: string;
  description: string;
  panel: ComponentType;
}

export interface LabsProjectMeta {
  slug: string;
  title: string;
  description: string;
  route: string;
  tags: string[];
  status: LabsStatusVariant;
  statusLabel: string;
  external?: boolean;
}

export interface ParkDetail {
  id?: string;
  name: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  type?: string;
  address?: string;
  phone?: string;
  website?: string;
  hours?: string[];
  photoRef?: string;
  photoUrl?: string;
  permittedUses?: string[];
  prohibitedUses?: string[];
  googleMapsUri?: string;
  directionsUrl?: string;
  mapsSearchUrl?: string;
  summary?: string;
}

export interface ParksNearbyResponse {
  parks: ParkDetail[];
  source: "api" | "fallback";
}

export type TransshipmentMode = "rail" | "road" | "air" | "water";

export interface TransshipmentHub {
  id: string;
  name: string;
  x: number;
  y: number;
  pressure: number;
}

export interface TransshipmentRoute {
  id: string;
  from: string;
  to: string;
  mode: TransshipmentMode;
  path: string;
}

export interface TransshipmentSimEvent {
  id: string;
  timestamp: number;
  message: string;
  level: "info" | "warn" | "ok";
}

export interface DigitalSolutionService {
  code: string;
  tier?: string;
  title: string;
  price: string;
  priceNote?: string;
  deliverables: string[];
  problem: string;
  solution: string;
  approach: string;
}

export interface DigitalSolutionCategory {
  id: string;
  label: string;
  subtitle?: string;
  services: DigitalSolutionService[];
}

export interface DigitalSolutionsData {
  intro: { headline: string; subhead: string };
  gbpBenefits: string[];
  complexityLadder?: string[];
  categories: DigitalSolutionCategory[];
  summary: { lines: string[]; depositNote?: string };
  pricingDisclaimer: string;
}
