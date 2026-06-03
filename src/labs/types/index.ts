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
}

export interface ParkDetail {
  name: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  type?: string;
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
