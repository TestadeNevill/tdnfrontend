import { useEffect, useState } from "react";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

export function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 2000,
}: AnimatedCounterProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return (
    <span>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

/** Animated LMP spread area chart — arbitrage revenue visual */
export function LMPSpreadChart() {
  const points = "20,120 60,95 100,110 140,70 180,85 220,55 260,65 300,40 340,50 380,30";
  return (
    <svg viewBox="0 0 400 160" className="w-full" aria-label="LMP price spread over 24 hours">
      <defs>
        <linearGradient id="lmpFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#059669" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[40, 80, 120].map((y) => (
        <line key={y} x1="20" y1={y} x2="380" y2={y} stroke="#e2e8f0" strokeWidth="1" />
      ))}
      <polyline
        points={`20,120 ${points.split(" ").slice(1).join(" ")} 380,120`}
        fill="url(#lmpFill)"
        className="animate-[fadeIn_1s_ease-out]"
      />
      <polyline
        points={points}
        fill="none"
        stroke="#059669"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="400"
        className="animate-[hydroDraw_2.5s_ease-out_forwards]"
      />
      <text x="20" y="18" className="fill-slate-600 text-[10px] font-labsMono">
        Day-ahead LMP spread ($/MWh)
      </text>
      <text x="20" y="145" className="fill-slate-500 text-[9px]">00:00</text>
      <text x="360" y="145" className="fill-slate-500 text-[9px]">24:00</text>
    </svg>
  );
}

/** Five-dimension scoring radar */
const SCORE_DIMS = [
  { label: "Technical", value: 0.82, angle: -90 },
  { label: "Grid", value: 0.71, angle: -18 },
  { label: "Revenue", value: 0.88, angle: 54 },
  { label: "Constraint", value: 0.65, angle: 126 },
  { label: "Data Q.", value: 0.79, angle: 198 },
];

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function ScoreRadarChart() {
  const cx = 100;
  const cy = 100;
  const maxR = 72;
  const gridLevels = [0.25, 0.5, 0.75, 1];

  const dataPoints = SCORE_DIMS.map((d) => {
    const p = polar(cx, cy, maxR * d.value, d.angle);
    return `${p.x},${p.y}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 200 200" className="mx-auto w-full max-w-[220px]" aria-label="Five-dimension site score">
      {gridLevels.map((level) => {
        const pts = SCORE_DIMS.map((d) => {
          const p = polar(cx, cy, maxR * level, d.angle);
          return `${p.x},${p.y}`;
        }).join(" ");
        return (
          <polygon key={level} points={pts} fill="none" stroke="#e2e8f0" strokeWidth="1" />
        );
      })}
      {SCORE_DIMS.map((d) => {
        const p = polar(cx, cy, maxR, d.angle);
        const lp = polar(cx, cy, maxR + 14, d.angle);
        return (
          <g key={d.label}>
            <line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e2e8f0" strokeWidth="1" />
            <text
              x={lp.x}
              y={lp.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-600 text-[8px] font-labsMono"
            >
              {d.label}
            </text>
          </g>
        );
      })}
      <polygon
        points={dataPoints}
        fill="#059669"
        fillOpacity="0.2"
        stroke="#059669"
        strokeWidth="2"
        className="animate-[fadeIn_1.2s_ease-out]"
      />
    </svg>
  );
}

/** Permit path timeline comparison */
const PERMIT_PATHS = [
  { label: "AWIA §3004 PSH", years: 2, color: "#059669" },
  { label: "Conduit exemption", years: 1, color: "#10b981" },
  { label: "10-MW exemption", years: 1.5, color: "#34d399" },
  { label: "Full FERC license", years: 6, color: "#d97706" },
];

export function PermitTimelineChart() {
  const maxYears = 7;
  return (
    <div className="space-y-3" aria-label="Permitting timeline comparison">
      {PERMIT_PATHS.map((path, i) => (
        <div key={path.label} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-labs-text">{path.label}</span>
            <span className="font-labsMono text-labs-textMuted">~{path.years} yr</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-labs-panel2">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${(path.years / maxYears) * 100}%`,
                backgroundColor: path.color,
                animationDelay: `${i * 200}ms`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Water → generation → grid flow animation */
export function EnergyFlowDiagram() {
  return (
    <svg viewBox="0 0 480 120" className="w-full" aria-label="Water to clean energy flow">
      <defs>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0891b2" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      {/* Water source */}
      <rect x="10" y="30" width="90" height="60" rx="8" fill="#ecfeff" stroke="#0891b2" strokeWidth="2" />
      <text x="55" y="55" textAnchor="middle" className="fill-cyan-800 text-[11px] font-semibold">Water</text>
      <text x="55" y="72" textAnchor="middle" className="fill-cyan-700 text-[9px]">Asset</text>
      {/* Arrow 1 */}
      <line x1="100" y1="60" x2="140" y2="60" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#arrow)" />
      <circle r="4" fill="#059669" className="animate-[hydroFlow_2s_ease-in-out_infinite]">
        <animateMotion dur="2s" repeatCount="indefinite" path="M105,60 L135,60" />
      </circle>
      {/* Turbine */}
      <rect x="150" y="25" width="100" height="70" rx="8" fill="#ecfdf5" stroke="#059669" strokeWidth="2" />
      <text x="200" y="52" textAnchor="middle" className="fill-emerald-800 text-[11px] font-semibold">Hydro</text>
      <text x="200" y="68" textAnchor="middle" className="fill-emerald-700 text-[9px]">Generation</text>
      <circle cx="200" cy="82" r="8" fill="none" stroke="#059669" strokeWidth="2" className="origin-center animate-spin" style={{ animationDuration: "4s" }} />
      {/* Arrow 2 */}
      <circle r="4" fill="#059669" className="animate-[hydroFlow_2s_ease-in-out_infinite]">
        <animateMotion dur="2s" repeatCount="indefinite" begin="0.5s" path="M255,60 L295,60" />
      </circle>
      <line x1="250" y1="60" x2="300" y2="60" stroke="#94a3b8" strokeWidth="2" />
      {/* Grid */}
      <rect x="310" y="30" width="90" height="60" rx="8" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
      <text x="355" y="55" textAnchor="middle" className="fill-amber-900 text-[11px] font-semibold">Grid</text>
      <text x="355" y="72" textAnchor="middle" className="fill-amber-800 text-[9px]">Markets</text>
      {/* Arrow 3 */}
      <circle r="4" fill="#d97706" className="animate-[hydroFlow_2s_ease-in-out_infinite]">
        <animateMotion dur="2s" repeatCount="indefinite" begin="1s" path="M405,60 L445,60" />
      </circle>
      <line x1="400" y1="60" x2="450" y2="60" stroke="#94a3b8" strokeWidth="2" />
      {/* Value */}
      <rect x="460" y="35" width="10" height="50" rx="2" fill="#059669" opacity="0.3" className="animate-pulse" />
    </svg>
  );
}

/** Market segments bar chart */
const MARKET_SEGMENTS = [
  { label: "Small hydro developers", share: 85, note: "Underserved by enterprise GIS" },
  { label: "Run-of-river IPPs", share: 72, note: "Revenue-heavy screening" },
  { label: "PSH / closed-loop", share: 90, note: "71k+ ANU screening universe" },
  { label: "Permit-data partners", share: 45, note: "Integration wedge" },
];

export function MarketFitChart() {
  return (
    <div className="space-y-4">
      {MARKET_SEGMENTS.map((seg, i) => (
        <div key={seg.label}>
          <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-sm font-semibold text-labs-text">{seg.label}</span>
            <span className="text-xs text-labs-textMuted">{seg.note}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-labs-panel2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-labs-accent to-labs-accentMuted animate-[fadeIn_1s_ease-out]"
              style={{ width: `${seg.share}%`, animationDelay: `${i * 150}ms` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Architecture stack layers */
export function ArchitectureStack() {
  const layers = [
    { label: "Agent runtime", sub: "Gather · disambiguate · narrate · monitor", color: "bg-violet-100 border-violet-300 text-violet-900" },
    { label: "Permitting rules engine", sub: "Deterministic FERC routing over reg_params", color: "bg-amber-100 border-amber-300 text-amber-900" },
    { label: "Scoring + financial engine", sub: "Five dimensions · transparent decomposition", color: "bg-sky-100 border-sky-300 text-sky-900" },
    { label: "Enrichment adapters", sub: "USGS · HIFLD · EIA · IPaC · FERC · …", color: "bg-emerald-100 border-emerald-300 text-emerald-900" },
    { label: "PostGIS site skeleton", sub: "ANU atlas baseline + provenance", color: "bg-slate-100 border-slate-300 text-slate-800" },
  ];
  return (
    <div className="flex flex-col-reverse gap-2">
      {layers.map((layer, i) => (
        <div
          key={layer.label}
          className={`rounded-lg border px-4 py-3 animate-[fadeIn_0.6s_ease-out] ${layer.color}`}
          style={{ animationDelay: `${i * 120}ms` }}
        >
          <p className="text-sm font-semibold">{layer.label}</p>
          <p className="text-xs opacity-80">{layer.sub}</p>
        </div>
      ))}
    </div>
  );
}

/** Fragmented vs unified process comparison */
export function ProcessComparison() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="rounded-xl border-2 border-dashed border-red-200 bg-red-50/50 p-4">
        <p className="font-labsMono text-xs font-semibold uppercase tracking-wider text-red-700">Before</p>
        <p className="mt-2 text-sm font-semibold text-labs-text">Fragmented diligence</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <li className="flex gap-2"><span className="text-red-500">✕</span> GIS in one tool, finance in spreadsheets</li>
          <li className="flex gap-2"><span className="text-red-500">✕</span> Permitting guessed or outsourced late</li>
          <li className="flex gap-2"><span className="text-red-500">✕</span> Black-box scores, no audit trail</li>
          <li className="flex gap-2"><span className="text-red-500">✕</span> Months lost before go/no-go</li>
        </ul>
      </div>
      <div className="rounded-xl border-2 border-labs-accent/40 bg-emerald-50/50 p-4">
        <p className="font-labsMono text-xs font-semibold uppercase tracking-wider text-labs-accent">With Hydro IQ</p>
        <p className="mt-2 text-sm font-semibold text-labs-text">One deterministic workflow</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          <li className="flex gap-2"><span className="text-labs-ok">✓</span> Atlas skeleton + live API enrichment</li>
          <li className="flex gap-2"><span className="text-labs-ok">✓</span> Rules engine routes — LLM never decides law</li>
          <li className="flex gap-2"><span className="text-labs-ok">✓</span> Full score decomposition + pro-forma ranges</li>
          <li className="flex gap-2"><span className="text-labs-ok">✓</span> Ranked shortlist + exportable roadmap</li>
        </ul>
      </div>
    </div>
  );
}
