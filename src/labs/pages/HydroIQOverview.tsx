import { Link } from "react-router-dom";
import { LabsShell } from "../components/LabsShell";
import { LabsSection } from "../components/LabsSection";
import { LabsPanel } from "../components/LabsPanel";
import { LabsMetric } from "../components/LabsMetric";
import { LabsStatusBadge } from "../components/LabsStatusBadge";
import {
  AnimatedCounter,
  ArchitectureStack,
  EnergyFlowDiagram,
  LMPSpreadChart,
  MarketFitChart,
  PermitTimelineChart,
  ProcessComparison,
  ScoreRadarChart,
} from "../components/hydroiq/HydroIQVisuals";
import { LABS_PROJECTS } from "../catalog";

function contactHref(intent?: "call" | "video" | "learn-more") {
  const params = new URLSearchParams();
  if (intent != null) params.set("intent", intent);
  params.set("subject", LABS_PROJECTS[0].title);
  return `/contact?${params.toString()}`;
}

const STORY_CHAPTERS = [
  { id: "prologue", label: "Prologue" },
  { id: "water", label: "Water assets" },
  { id: "problem", label: "The gap" },
  { id: "solution", label: "Hydro IQ" },
  { id: "market", label: "Market" },
  { id: "principles", label: "Design" },
] as const;

export default function HydroIQOverview() {
  return (
    <LabsShell
      fillViewport
      title="Hydro IQ"
      subtitle="A story about water, clean energy, and the infrastructure intelligence needed to bring hydro sites from screening to due diligence."
      breadcrumb={[
        { label: "Labs", to: "/labs" },
        { label: "Hydro IQ" },
      ]}
    >
      {/* Chapter nav */}
      <nav
        aria-label="Story chapters"
        className="mb-8 flex flex-wrap gap-2 rounded-xl border border-labs-border bg-white/80 p-3"
      >
        {STORY_CHAPTERS.map((ch) => (
          <a
            key={ch.id}
            href={`#${ch.id}`}
            className="rounded-full border border-labs-border bg-labs-panel2 px-3 py-1 text-sm font-semibold text-labs-textMuted transition-colors hover:border-labs-accent/30 hover:text-labs-accent"
          >
            {ch.label}
          </a>
        ))}
      </nav>

      {/* Prologue */}
      <LabsSection
        id="prologue"
        title="Prologue — Why this story matters"
        subtitle="Hydropower is not legacy infrastructure. It is grid flexibility, stored water energy, and one of the fastest paths to firm clean power — if we can evaluate sites without drowning in fragmented data."
      >
        <LabsPanel>
          <div className="relative overflow-hidden rounded-xl">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-emerald-500/10 to-transparent" />
            <div className="relative space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <LabsStatusBadge variant="neutral" label="Flagship project" />
                <span className="font-labsMono text-xs uppercase tracking-wider text-labs-accent">
                  Hydro Site Selection, Financial Analysis &amp; Permitting Matrix
                </span>
              </div>
              <p className="max-w-4xl text-lg leading-relaxed text-labs-textMuted md:text-xl">
                Every run-of-river intake, every closed-loop pumped-storage pair, every conduit
                retrofit sits at the intersection of{" "}
                <strong className="text-labs-text">water rights</strong>,{" "}
                <strong className="text-labs-text">grid economics</strong>, and{" "}
                <strong className="text-labs-text">federal permitting law</strong>. Developers
                today stitch those worlds together by hand. Hydro IQ is the deterministic core —
                GIS scoring, financial screening, and a FERC routing engine — that an agent
                orchestrates but never improvises.
              </p>
              <div className="-mx-4 overflow-x-auto px-4 pb-1 snap-x snap-mandatory md:-mx-8 md:px-8">
                <div className="mx-auto w-[min(100vw-2rem,56rem)] snap-center">
                  <EnergyFlowDiagram />
                </div>
              </div>
            </div>
          </div>
        </LabsPanel>
      </LabsSection>

      {/* Chapter 1: Water assets */}
      <LabsSection
        id="water"
        title="Chapter I — Water as a strategic asset"
        subtitle="Water is not just a resource. It is stored energy, ecological infrastructure, and the anchor for dispatchable clean power when the sun sets and the wind drops."
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <LabsPanel className="space-y-4">
            <p className="leading-relaxed text-labs-textMuted">
              Run-of-river and small hydro projects convert flowing water into decades of low-carbon
              generation. Pumped storage — closed-loop pairs with upper and lower reservoirs —
              provides the grid&apos;s largest-scale battery: arbitrage revenue from charging when
              prices are low and discharging when they spike.
            </p>
            <p className="leading-relaxed text-labs-textMuted">
              The US alone holds tens of thousands of greenfield PSH site pairs in research atlases.
              Each represents a potential node in a cleaner, more resilient grid — but only if
              developers can screen hydrology, interconnection, economics, and permit pathways
              before committing millions to field study.
            </p>
            <blockquote className="border-l-4 border-cyan-500 pl-4 text-base italic text-slate-700">
              &ldquo;The atlas tells you where the pairs are; live APIs tell you whether the site
              is good today.&rdquo;
            </blockquote>
          </LabsPanel>
          <LabsPanel>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-labs-border bg-labs-panel2 px-4 py-3 text-center">
                <p className="font-labsMono text-xs font-semibold uppercase tracking-wider text-labs-textMuted">
                  ANU US site pairs
                </p>
                <p className="mt-1 text-xl font-bold text-labs-text">
                  <AnimatedCounter target={71669} />
                </p>
              </div>
              <div className="rounded-lg border border-labs-border bg-labs-panel2 px-4 py-3 text-center">
                <p className="font-labsMono text-xs font-semibold uppercase tracking-wider text-labs-textMuted">
                  ISO / RTO markets
                </p>
                <p className="mt-1 text-xl font-bold text-labs-text">
                  <AnimatedCounter target={10} />
                </p>
              </div>
              <div className="rounded-lg border border-labs-border bg-labs-panel2 px-4 py-3 text-center">
                <p className="font-labsMono text-xs font-semibold uppercase tracking-wider text-labs-textMuted">
                  FERC primary tracks
                </p>
                <p className="mt-1 text-xl font-bold text-labs-text">
                  <AnimatedCounter target={11} suffix="+" />
                </p>
              </div>
              <div className="rounded-lg border border-labs-border bg-labs-panel2 px-4 py-3 text-center">
                <p className="font-labsMono text-xs font-semibold uppercase tracking-wider text-labs-textMuted">
                  Scoring dimensions
                </p>
                <p className="mt-1 text-xl font-bold text-labs-text">
                  <AnimatedCounter target={5} />
                </p>
              </div>
            </div>
          </LabsPanel>
        </div>
      </LabsSection>

      {/* Chapter 2: Problem */}
      <LabsSection
        id="problem"
        title="Chapter II — The diligence gap"
        subtitle="Enterprise GIS tools were built for utilities with legal teams. Small hydro and run-of-river developers inherit the same permitting complexity with a fraction of the tooling."
      >
        <ProcessComparison />
        <LabsPanel className="mt-6">
          <p className="leading-relaxed text-labs-textMuted">
            A development analyst cannot trust a black-box score in a regulated diligence context.
            They need every sub-score traced to a source and timestamp, every permit path tested
            against statute — not guessed by a language model — and every dollar figure labeled
            as a <strong className="text-labs-text">range</strong>, not a false-precision point
            estimate. Months slip away while GIS, finance, and permitting live in separate silos.
          </p>
        </LabsPanel>
      </LabsSection>

      {/* Chapter 3: Solution */}
      <LabsSection
        id="solution"
        title="Chapter III — Hydro IQ: three layers, one workflow"
        subtitle="Ranked site shortlist + transparent screening pro-forma + deterministic permitting roadmap — narrated and monitored by an agent."
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <LabsPanel className="border-t-4 border-t-emerald-500 space-y-3">
            <h3 className="text-base font-bold text-labs-text">GIS &amp; Site Selection</h3>
            <p className="text-base leading-relaxed text-labs-textMuted">
              ANU atlas skeleton plus live enrichment from USGS, HIFLD, PAD-US, IPaC, FEMA, and
              more. Five transparent dimensions with user-adjustable weights.
            </p>
            <ScoreRadarChart />
          </LabsPanel>
          <LabsPanel className="border-t-4 border-t-sky-500 space-y-3">
            <h3 className="text-base font-bold text-labs-text">Financial Screening</h3>
            <p className="text-base leading-relaxed text-labs-textMuted">
              LMP-spread arbitrage, interconnection capex from transmission distance, construction
              bands by cost class. IRA/ITC overlays as configurable reg params — not hardcoded.
            </p>
            <LMPSpreadChart />
          </LabsPanel>
          <LabsPanel className="border-t-4 border-t-amber-500 space-y-3">
            <h3 className="text-base font-bold text-labs-text">Permitting Matrix</h3>
            <p className="text-base leading-relaxed text-labs-textMuted">
              Deterministic rules engine tests every FERC primary track. Blocked paths shown with
              reasons. Cross-cutting authorizations sequenced: NEPA, §401, §404, ESA, §106.
            </p>
            <PermitTimelineChart />
          </LabsPanel>
        </div>

        <LabsPanel className="mt-6">
          <h3 className="mb-4 text-base font-bold text-labs-text">System architecture</h3>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ArchitectureStack />
            <div className="space-y-4 text-base leading-relaxed text-labs-textMuted">
              <p>
                <strong className="text-labs-text">The agent&apos;s four jobs:</strong> gather facts
                that feed the rules engine, disambiguate genuine ambiguity with cited reasoning,
                explain outputs in plain English, and watch FERC/agency sources for changes.
              </p>
              <p>
                <strong className="text-labs-text">The engine&apos;s job:</strong> apply statute to
                typed site attributes — capacity, conduit-or-not, federal land, navigable water —
                and return every feasible path ranked by time and cost.
              </p>
              <p>
                <strong className="text-labs-text">The LLM never decides the legal route.</strong>{" "}
                If it did, a 60 MW dam could be routed into a conduit exemption and you would
                never catch it.
              </p>
            </div>
          </div>
        </LabsPanel>
      </LabsSection>

      {/* Chapter 4: Market */}
      <LabsSection
        id="market"
        title="Chapter IV — Industry value &amp; market wedge"
        subtitle="Small hydro and PSH developers are underserved. Hydro IQ targets the screening layer they cannot get from generic GIS or spreadsheet finance."
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <LabsPanel className="space-y-4">
            <h3 className="text-base font-bold text-labs-text">Who buys screening intelligence?</h3>
            <MarketFitChart />
          </LabsPanel>
          <LabsPanel className="space-y-4">
            <h3 className="text-base font-bold text-labs-text">Commercial narrative</h3>
            <ul className="space-y-3 text-labs-textMuted">
              <li>
                <strong className="text-labs-text">Wedge:</strong> Permitting + finance +
                geospatial in one workflow — not another Mapbox demo.
              </li>
              <li>
                <strong className="text-labs-text">Market:</strong> Development shops and IPPs
                underserved by enterprise tools; 71k+ greenfield pairs as addressable screening
                universe.
              </li>
              <li>
                <strong className="text-labs-text">Moat:</strong> Versioned regulatory params +
                deterministic engine + Permit Watchdog for FERC changes — defensible vs pure LLM
                demos.
              </li>
              <li>
                <strong className="text-labs-text">Stage:</strong> Prototype / pre-revenue — seeking
                design partners and permit-data integrations.
              </li>
            </ul>
            <div className="grid grid-cols-3 gap-2 pt-2">
              <LabsMetric label="Mock sites screened" value="12" />
              <LabsMetric label="Fastest path" value="~2 yr" />
              <LabsMetric label="NPV band" value="±12%" />
            </div>
          </LabsPanel>
        </div>
      </LabsSection>

      {/* Chapter 5: Principles */}
      <LabsSection
        id="principles"
        title="Epilogue — Design choices that matter"
        subtitle="Six hills worth dying on — from the Hydro IQ build guide."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Permitting is deterministic",
              body: "Legal routes are if/then tests over typed facts — not LLM opinions.",
              color: "border-amber-400 bg-amber-50",
            },
            {
              title: "Statute lives in data",
              body: "40 MW caps, AWIA cutoffs, permit terms — versioned reg_params with citations.",
              color: "border-violet-400 bg-violet-50",
            },
            {
              title: "Atlas skeleton, API muscle",
              body: "2019 geometry is stable; prices, transmission, and species data refresh live.",
              color: "border-sky-400 bg-sky-50",
            },
            {
              title: "Transparent scoring",
              body: "Weighted sum of named sub-scores — every input sourced and timestamped.",
              color: "border-emerald-400 bg-emerald-50",
            },
            {
              title: "Screening-grade, stated loudly",
              body: "Ranked shortlist and roadmap — not bankable feasibility or legal advice.",
              color: "border-orange-400 bg-orange-50",
            },
            {
              title: "Agent as operator",
              body: "Gather, disambiguate, narrate, monitor — never improvise the machinery.",
              color: "border-cyan-400 bg-cyan-50",
            },
          ].map((item) => (
            <div
              key={item.title}
              className={`rounded-xl border-l-4 p-4 ${item.color} animate-[fadeIn_0.5s_ease-out]`}
            >
              <h4 className="text-sm font-bold text-labs-text">{item.title}</h4>
              <p className="mt-2 text-base leading-relaxed text-slate-700">{item.body}</p>
            </div>
          ))}
        </div>

        <LabsPanel className="mt-6 space-y-4">
          <p className="text-base font-medium text-labs-warning">
            Screening-grade only — not bankable feasibility, legal, engineering, or financial
            advice. No site in the atlas has had geological, hydrological, or environmental study.
          </p>
          <p className="text-xs text-labs-textMuted">
            Site data concept derived from ANU Global PHES Atlas (RE100 Group, Australian National
            University).
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/labs"
              className="inline-flex items-center rounded-md border border-labs-border bg-white/80 px-4 py-2 text-sm font-semibold text-labs-text transition-colors hover:bg-labs-panel2"
            >
              ← Back to Labs
            </Link>
            <Link
              to={contactHref("learn-more")}
              className="inline-flex items-center rounded-md border border-labs-accent/40 bg-labs-accent/10 px-4 py-2 text-sm font-semibold text-labs-accent"
            >
              Learn more
            </Link>
            <Link
              to={contactHref("call")}
              className="inline-flex items-center rounded-md border border-labs-accent/40 bg-labs-accent/10 px-4 py-2 text-sm font-semibold text-labs-accent"
            >
              Book a call
            </Link>
          </div>
        </LabsPanel>
      </LabsSection>
    </LabsShell>
  );
}
