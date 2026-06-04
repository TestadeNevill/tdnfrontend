import { useState } from "react";
import { Link } from "react-router-dom";
import { LabsMetric } from "./LabsMetric";
import { LabsPanel } from "./LabsPanel";
import { LabsStatusBadge } from "./LabsStatusBadge";

const FEATURES = [
  {
    title: "Site Selection",
    summary: "Five-dimension transparent scoring over geospatial baseline and live enrichment.",
    bullets: [
      "Technical, grid, revenue, constraint, and data-quality sub-scores",
      "User-adjustable weights with full source and timestamp traceability",
      "Live API enrichment (USGS, HIFLD, PAD-US, IPaC) over atlas baseline",
    ],
  },
  {
    title: "Financial Analysis",
    summary: "Screening pro-forma from live prices — ranges, not point estimates.",
    bullets: [
      "LMP-spread arbitrage revenue from ISO/RTO and EIA price feeds",
      "Interconnection capex from transmission distance and voltage class",
      "Construction bands by cost class with IRA/ITC as configurable overlay",
    ],
  },
  {
    title: "Permitting Matrix",
    summary: "Deterministic FERC routing — the engine decides, the agent narrates.",
    bullets: [
      "All primary tracks tested (QCF, conduit exemption, AWIA §3004, full license)",
      "Cross-cutting stack: NEPA, §401, §404, ESA §7, NHPA §106",
      "Blocked paths shown with reasons; statute stored as versioned data",
    ],
  },
] as const;

const WORKFLOW_STEPS = [
  {
    step: 1,
    title: "Import parcels",
    color: "border-emerald-500 bg-emerald-50",
    badge: "bg-emerald-600 text-white",
    connector: "bg-emerald-400",
    summary: "Load site geometry and baseline attributes with clean provenance.",
    details: [
      "Ingest atlas pairs or custom parcel uploads",
      "Stamp source attribution and geometry columns",
      "Resolve state/county via TIGER for permit routing",
    ],
  },
  {
    step: 2,
    title: "Attach enrichment layers",
    color: "border-sky-500 bg-sky-50",
    badge: "bg-sky-600 text-white",
    connector: "bg-sky-400",
    summary: "Refresh live signals — atlas skeleton, API muscle.",
    details: [
      "USGS streamflow, HIFLD transmission, PAD-US protected areas",
      "IPaC species screen, FEMA flood, NLCD land cover",
      "Every value tagged with source, timestamp, and confidence",
    ],
  },
  {
    step: 3,
    title: "Run score + finance",
    color: "border-violet-500 bg-violet-50",
    badge: "bg-violet-600 text-white",
    connector: "bg-violet-400",
    summary: "Transparent weighted scoring and screening pro-forma.",
    details: [
      "Five dimensions: technical, grid, revenue, constraint, data quality",
      "User-adjustable weights with full score decomposition",
      "Capex/revenue/payback ranges from live LMP and interconnection distance",
    ],
  },
  {
    step: 4,
    title: "Review permits & export",
    color: "border-amber-500 bg-amber-50",
    badge: "bg-amber-600 text-white",
    connector: "bg-amber-400",
    summary: "Deterministic FERC routing — engine decides, agent narrates.",
    details: [
      "All primary tracks tested; blocked paths shown with reasons",
      "Cross-cutting authorizations sequenced (NEPA, §401, §404, ESA)",
      "Export diligence packet: roadmap + pro-forma with screening disclaimer",
    ],
  },
] as const;

function HydroWorkflowDiagram() {
  return (
    <div className="mt-3">
      <p className="font-semibold text-labs-text">Workflow</p>
      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-4">
        {WORKFLOW_STEPS.map((item, index) => (
          <div key={item.step} className="relative flex flex-col">
            {index < WORKFLOW_STEPS.length - 1 && (
              <span
                className={`pointer-events-none absolute left-[calc(50%+1.25rem)] top-6 hidden h-0.5 w-[calc(100%-2.5rem)] lg:block ${item.connector}`}
                aria-hidden="true"
              />
            )}
            <div
              className={`relative flex h-full flex-col rounded-xl border-l-4 p-3 ${item.color}`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${item.badge}`}
                >
                  {item.step}
                </span>
                <h5 className="text-sm font-semibold text-labs-text">{item.title}</h5>
              </div>
              <p className="mt-2 text-base leading-relaxed text-slate-700">{item.summary}</p>
              <ul className="mt-2 space-y-1.5 border-t border-black/5 pt-2">
                {item.details.map((detail) => (
                  <li key={detail} className="flex gap-1.5 text-base leading-relaxed text-slate-700">
                    <span className="shrink-0 font-semibold text-labs-text">›</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
            {index < WORKFLOW_STEPS.length - 1 && (
              <span
                className={`mx-auto my-1 block h-4 w-0.5 lg:hidden ${item.connector}`}
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

type TabId = "developers" | "investors";

export function LabsHydroProjectPanel() {
  const [activeTab, setActiveTab] = useState<TabId>("developers");

  return (
    <LabsPanel className="space-y-6">
      <header className="space-y-3">
        <p className="font-labsMono text-[11px] font-semibold uppercase tracking-wider text-labs-accent">
          Flagship project
        </p>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2 flex-1 min-w-[200px]">
            <h3 className="text-lg font-bold text-labs-text md:text-xl">
              Hydro Site Selection, Financial Analysis &amp; Permitting Matrix
            </h3>
            <p className="text-base text-labs-textMuted">
              <span className="font-semibold text-labs-text">Hydro IQ</span> — rank and
              diligence run-of-river and PSH sites with transparent scores and a permitting
              roadmap.
            </p>
            <p className="text-base text-labs-textMuted">
              Screening-grade infrastructure intelligence — GIS, finance, and FERC routing in
              one deterministic workflow.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <LabsStatusBadge variant="neutral" label="In development" />
            <Link
              to="/labs/hydroiq"
              className="inline-flex items-center rounded-md border border-labs-accent/40 bg-labs-accent/10 px-4 py-2 text-sm font-semibold text-labs-accent transition-colors hover:bg-labs-accent/20"
            >
              Read the full story →
            </Link>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="rounded-lg border border-labs-border bg-labs-panel2 p-3"
          >
            <h4 className="text-sm font-semibold text-labs-text">{feature.title}</h4>
            <p className="mt-1 text-base text-labs-textMuted leading-relaxed">{feature.summary}</p>
            <ul className="mt-2 space-y-1.5 text-base text-labs-textMuted">
              {feature.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-1.5">
                  <span className="text-labs-accent">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <LabsMetric label="Sites screened" value="12" />
        <LabsMetric label="Fastest permit path" value="~2 yr" />
        <LabsMetric label="Revenue sensitivity" value="NPV ±12%" />
      </div>

      <div>
        <div role="tablist" aria-label="Audience" className="flex gap-2 border-b border-labs-border pb-2">
          {(
            [
              { id: "developers" as const, label: "For Developers" },
              { id: "investors" as const, label: "For Investors" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                "rounded-md px-3 py-1.5 text-sm font-semibold transition-colors",
                activeTab === tab.id
                  ? "bg-labs-accent/10 text-labs-accent"
                  : "text-labs-textMuted hover:bg-labs-panel2",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "developers" ? (
          <div role="tabpanel" className="mt-4 space-y-4 text-base text-labs-textMuted">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="font-semibold text-labs-text">Problem</p>
                <p className="mt-1 leading-relaxed">
                  Fragmented GIS, finance, and permitting data slows run-of-river and small hydro
                  site decisions. Enterprise tools underserve this segment.
                </p>
              </div>
              <div>
                <p className="font-semibold text-labs-text">Solution</p>
                <p className="mt-1 leading-relaxed">
                  One matrix scores parcels on hydrology, interconnection, LCOE, and permit
                  pathway — with an agent that operates deterministic machinery, not improvises
                  legal routes.
                </p>
              </div>
              <div>
                <p className="font-semibold text-labs-text">Outcome</p>
                <p className="mt-1 leading-relaxed">
                  Ranked shortlist with explainable scores, timeline risk, and exportable
                  diligence packets.
                </p>
              </div>
            </div>
            <HydroWorkflowDiagram />
          </div>
        ) : (
          <div role="tabpanel" className="mt-4 space-y-3 text-base text-labs-textMuted">
            <p>
              <span className="font-semibold text-labs-text">Wedge:</span> Permitting + finance +
              geospatial in one workflow — not another generic GIS viewer.
            </p>
            <p>
              <span className="font-semibold text-labs-text">Market:</span> Small hydro &amp;
              run-of-river developers underserved by enterprise tools; 71k+ ANU greenfield pairs
              as addressable screening universe.
            </p>
            <p>
              <span className="font-semibold text-labs-text">Traction:</span> Labs prototype, 12
              mock screened sites, Northeast &amp; Pacific NW wedge.
            </p>
            <p>
              <span className="font-semibold text-labs-text">Stage:</span> Prototype /
              pre-revenue; ask: design partners &amp; permit-data integrations.
            </p>
          </div>
        )}
      </div>

      <footer className="space-y-3 border-t border-labs-border pt-4">
        <p className="text-base font-medium text-labs-warning">
          Screening-grade only — not bankable feasibility, legal, or financial advice.
        </p>
        <p className="text-xs text-labs-textMuted">
          Site data concept derived from ANU Global PHES Atlas (RE100 Group, Australian National
          University).
        </p>
      </footer>
    </LabsPanel>
  );
}
