import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { TransshipmentHub, TransshipmentRoute, TransshipmentSimEvent, TransshipmentMode } from "../../types";
import {
  HUBS,
  ROUTES,
  MODE_LABELS,
  createInitialShipments,
  tickSimulation,
} from "../../logic/transshipmentSim";
import { TransshipmentLog } from "../../components/TransshipmentLog";

const MODE_COLORS: Record<TransshipmentMode, string> = {
  rail: "#059669",
  road: "#d97706",
  air: "#2563eb",
  water: "#0891b2",
};

function getPointOnPath(path: string, progress: number): { x: number; y: number } {
  const nums = path.match(/-?\d+\.?\d*/g)?.map(Number) ?? [0, 0];
  if (nums.length >= 4) {
    const [x0, y0, x1, y1] = nums;
    const cx = nums[2] ?? (x0 + x1) / 2;
    const cy = nums[3] ?? (y0 + y1) / 2;
    const t = progress;
    const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1;
    const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1;
    return { x, y };
  }
  return { x: nums[0] ?? 0, y: nums[1] ?? 0 };
}

export function TransshipmentPanel() {
  const [sim, setSim] = useState(() => ({
    hubs: HUBS as TransshipmentHub[],
    shipments: createInitialShipments(),
    events: [] as TransshipmentSimEvent[],
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setSim((prev) => {
        const result = tickSimulation(prev.shipments, prev.hubs);
        return {
          hubs: result.hubs,
          shipments: result.shipments,
          events: [...prev.events, ...result.events].slice(-50),
        };
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  const { hubs, shipments, events } = sim;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold text-labs-text">Transshipment Logistics</h3>
        <p className="mt-1 text-base text-labs-textMuted">
          Animated hub schematic with multi-modal routes and live simulation event log.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 text-xs">
        {(Object.keys(MODE_LABELS) as TransshipmentMode[]).map((mode) => (
          <span key={mode} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: MODE_COLORS[mode] }}
            />
            {MODE_LABELS[mode]}
          </span>
        ))}
      </div>

      <TransshipmentLog events={events} />

      <svg
        viewBox="0 0 500 320"
        className="w-full rounded-lg border border-labs-border bg-slate-900/95"
        aria-label="Transshipment hub schematic"
      >
        {ROUTES.map((route: TransshipmentRoute) => (
          <path
            key={route.id}
            d={route.path}
            fill="none"
            stroke={MODE_COLORS[route.mode]}
            strokeWidth={2}
            strokeOpacity={0.5}
            strokeDasharray="6 4"
          >
            <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1s" repeatCount="indefinite" />
          </path>
        ))}

        {hubs.map((hub) => (
          <g key={hub.id}>
            <circle
              cx={hub.x}
              cy={hub.y}
              r={20 + hub.pressure * 25}
              fill={MODE_COLORS.rail}
              fillOpacity={0.08 + hub.pressure * 0.12}
            />
            <circle cx={hub.x} cy={hub.y} r={8} fill="#f8fafc" stroke="#059669" strokeWidth={2} />
            <text x={hub.x} y={hub.y + 22} textAnchor="middle" fill="#94a3b8" fontSize={9}>
              {hub.name}
            </text>
          </g>
        ))}

        {shipments.map((ship) => {
          const route = ROUTES.find((r) => r.id === ship.routeId);
          if (route == null) return null;
          const pt = getPointOnPath(route.path, ship.progress);
          return (
            <circle
              key={ship.id}
              cx={pt.x}
              cy={pt.y}
              r={5}
              fill={MODE_COLORS[ship.mode]}
              stroke="#fff"
              strokeWidth={1}
            />
          );
        })}
      </svg>

      <p className="text-base text-labs-textMuted">
        Read more about urban transshipment hubs in{" "}
        <Link to="/blog/transshipment" className="font-semibold text-labs-accent hover:text-labs-glow">
          this blog post
        </Link>
        .
      </p>
    </div>
  );
}
