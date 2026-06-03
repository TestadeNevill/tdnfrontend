import type {
  TransshipmentHub,
  TransshipmentRoute,
  TransshipmentSimEvent,
  TransshipmentMode,
} from "../types";
import hubsData from "../data/transshipment-hubs.json";
import routesData from "../data/transshipment-routes.json";

export interface Shipment {
  id: string;
  routeId: string;
  progress: number;
  mode: TransshipmentMode;
}

export const HUBS = hubsData as TransshipmentHub[];
export const ROUTES = routesData as TransshipmentRoute[];

const MODE_LABELS: Record<TransshipmentMode, string> = {
  rail: "Rail",
  road: "Road",
  air: "Air",
  water: "Water",
};

let eventCounter = 0;

function makeEvent(message: string, level: TransshipmentSimEvent["level"] = "info"): TransshipmentSimEvent {
  return {
    id: `evt-${++eventCounter}`,
    timestamp: Date.now(),
    message,
    level,
  };
}

export function createInitialShipments(): Shipment[] {
  return ROUTES.slice(0, 3).map((route, i) => ({
    id: `ship-${i}`,
    routeId: route.id,
    progress: Math.random() * 0.3,
    mode: route.mode,
  }));
}

export function tickSimulation(
  shipments: Shipment[],
  hubs: TransshipmentHub[],
): { shipments: Shipment[]; events: TransshipmentSimEvent[]; hubs: TransshipmentHub[] } {
  const events: TransshipmentSimEvent[] = [];
  const updatedHubs = hubs.map((h) => ({
    ...h,
    pressure: Math.min(0.95, Math.max(0.15, h.pressure + (Math.random() - 0.5) * 0.08)),
  }));

  const updatedShipments = shipments.map((ship) => {
    const speed = 0.02 + Math.random() * 0.03;
    let progress = ship.progress + speed;

    if (progress >= 1) {
      const route = ROUTES.find((r) => r.id === ship.routeId);
      const destHub = updatedHubs.find((h) => h.id === route?.to);
      events.push(
        makeEvent(
          `${MODE_LABELS[ship.mode]} shipment arrived at ${destHub?.name ?? "hub"}`,
          "ok",
        ),
      );
      if (destHub != null && destHub.pressure > 0.75) {
        events.push(
          makeEvent(`Elevated pressure at ${destHub.name} (${Math.round(destHub.pressure * 100)}%)`, "warn"),
        );
      }
      const nextRoute = ROUTES[Math.floor(Math.random() * ROUTES.length)];
      progress = 0;
      return { ...ship, routeId: nextRoute.id, mode: nextRoute.mode, progress };
    }

    return { ...ship, progress };
  });

  if (Math.random() < 0.15) {
    const hub = updatedHubs[Math.floor(Math.random() * updatedHubs.length)];
    events.push(makeEvent(`Telemetry sync: ${hub.name} dwell time nominal`, "info"));
  }

  return { shipments: updatedShipments, events, hubs: updatedHubs };
}

export { MODE_LABELS };
