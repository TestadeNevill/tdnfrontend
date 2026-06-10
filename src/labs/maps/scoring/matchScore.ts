import type { MatchScoreFactor, MatchScoreResult, ScenarioPresetId } from "../types/mapFeature";
import type { ParkDetail } from "../../types";
import type { LayerApiResponse } from "../types/mapFeature";

interface ScoreContext {
  park: ParkDetail;
  anchorLat: number;
  anchorLng: number;
  layerResults: Record<string, LayerApiResponse | null | undefined>;
  presetId: ScenarioPresetId;
  isochroneMinutes?: number;
}

export function computeMatchScore(ctx: ScoreContext): MatchScoreResult {
  const factors: MatchScoreFactor[] = [];
  let score = 50;

  const parksMeta = ctx.layerResults.parks?.meta;
  const amenities = (parksMeta?.amenities as { category?: string; distanceKm?: number }[]) ?? [];

  const hasPlayground = amenities.some((a) => a.category === "Playground");
  const hasBathroom =
    amenities.some((a) => a.category === "Restroom") ||
    ctx.park.permittedUses?.some((u) => u.toLowerCase().includes("restroom"));
  const hasWater = amenities.some((a) => a.category === "Drinking water");
  const hasDog = ctx.park.permittedUses?.some((u) => u.toLowerCase().includes("dog"));

  if (hasPlayground) {
    factors.push({ kind: "positive", label: "Playground nearby", weight: 12 });
    score += 12;
  } else if (ctx.presetId === "parent") {
    factors.push({ kind: "negative", label: "No playground found nearby", weight: -8 });
    score -= 8;
  }

  if (hasBathroom) {
    factors.push({ kind: "positive", label: "Public bathroom nearby", weight: 10 });
    score += 10;
  } else if (ctx.presetId === "parent" || ctx.presetId === "runner") {
    factors.push({ kind: "neutral", label: "Bathroom availability unknown", weight: -3 });
    score -= 3;
  }

  if (ctx.park.distanceKm != null) {
    const walkMin = Math.round(ctx.park.distanceKm * 12);
    if (walkMin <= (ctx.isochroneMinutes ?? 15)) {
      factors.push({ kind: "positive", label: `~${walkMin}-minute walk`, weight: 10 });
      score += 10;
    } else {
      factors.push({ kind: "negative", label: `~${walkMin}-minute walk (far)`, weight: -6 });
      score -= 6;
    }
  }

  const aqi = ctx.layerResults.aqi?.meta?.aqi as { value?: number; status?: string } | undefined;
  if (aqi?.status === "good") {
    factors.push({ kind: "positive", label: "Good air quality today", weight: 8 });
    score += 8;
  } else if (aqi?.status === "poor") {
    factors.push({ kind: "negative", label: "Poor air quality today", weight: -10 });
    score -= 10;
  } else if (aqi?.value != null) {
    factors.push({ kind: "neutral", label: `AQI ${aqi.value} (${aqi.status ?? "moderate"})`, weight: 0 });
  }

  const weather = ctx.layerResults.weather?.meta?.weather as { comfort?: string } | undefined;
  if (weather?.comfort === "good") {
    factors.push({ kind: "positive", label: "Comfortable weather", weight: 6 });
    score += 6;
  } else if (weather?.comfort === "poor") {
    factors.push({ kind: "negative", label: "Poor weather for outdoors", weight: -8 });
    score -= 8;
  }

  const civicGrid = ctx.layerResults.civic311?.meta?.grid as { count?: number }[] | undefined;
  const nearby311 = civicGrid?.reduce((sum, c) => sum + (c.count ?? 0), 0) ?? 0;
  if (nearby311 > 20) {
    factors.push({ kind: "negative", label: "Recent 311 complaints nearby", weight: -6 });
    score -= 6;
  } else if (nearby311 > 0) {
    factors.push({ kind: "neutral", label: "Some 311 reports nearby", weight: -2 });
    score -= 2;
  }

  const wheelchair = ctx.park.permittedUses?.some((u) =>
    u.toLowerCase().includes("wheelchair"),
  );
  if (wheelchair) {
    factors.push({ kind: "positive", label: "Wheelchair accessible entrance", weight: 8 });
    score += 8;
  } else if (ctx.presetId === "parent") {
    factors.push({ kind: "neutral", label: "Wheelchair access unknown", weight: -2 });
    score -= 2;
  }

  if (hasWater && ctx.presetId === "runner") {
    factors.push({ kind: "positive", label: "Drinking water nearby", weight: 8 });
    score += 8;
  }

  if (hasDog && ctx.presetId === "park-finder") {
    factors.push({ kind: "positive", label: "Dogs allowed", weight: 6 });
    score += 6;
  }

  const transitStops = ctx.layerResults.transit?.meta?.stops as number | undefined;
  if (transitStops != null && transitStops > 0) {
    factors.push({ kind: "positive", label: "Transit stops in area", weight: 6 });
    score += 6;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  return { score, factors, presetId: ctx.presetId };
}
