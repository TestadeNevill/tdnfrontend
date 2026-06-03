import { LabsShell } from "../components/LabsShell";
import { LabsSection } from "../components/LabsSection";

const PLACEHOLDER_PROJECTS = [
  {
    title: "GIS Asset Atlas",
    description: "Map-based infrastructure asset explorer with layer toggles.",
    tag: "Coming soon",
  },
  {
    title: "Grid Operations Board",
    description: "Synthetic load and renewable curves with scenario sliders.",
    tag: "Coming soon",
  },
  {
    title: "Urban Intelligence",
    description: "Command-center fusion of mobility, air quality, and grid signals.",
    tag: "Coming soon",
  },
];

export default function LabsHome() {
  return (
    <LabsShell
      fillViewport
      title="Infrastructure Intelligence Labs"
      subtitle="Self-contained demos for operators and investors—maps, synthetic telemetry, and optional AI synthesis. Expand with project routes when ready."
      breadcrumb={[{ label: "Labs" }]}
    >
      <LabsSection
        id="overview"
        title="Overview"
        subtitle="This page ships the labs shell, navbar variant, and cursor-reactive background only."
      >
        <p className="max-w-3xl text-sm text-labs-textMuted leading-relaxed">
          Project cards below are placeholders. Wire each card to a future{" "}
          <code className="rounded bg-labs-panel2 px-1 py-0.5 font-labsMono text-xs">
            /labs/…
          </code>{" "}
          route when demos are implemented.
        </p>
      </LabsSection>
      <LabsSection
        id="projects"
        title="Projects"
        subtitle="Preview cards—routes not required for this task."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLACEHOLDER_PROJECTS.map((p) => (
            <article
              key={p.title}
              className="flex h-full flex-col rounded-xl border border-labs-border bg-white/90 p-4 shadow-sm ring-1 ring-slate-900/5"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold text-labs-text">{p.title}</h3>
                <span className="rounded-full border border-labs-border bg-slate-100 px-2.5 py-0.5 text-[11px] font-labsMono font-semibold uppercase tracking-wider text-labs-textMuted">
                  {p.tag}
                </span>
              </div>
              <p className="mt-2 flex-1 text-sm text-labs-textMuted leading-relaxed">
                {p.description}
              </p>
            </article>
          ))}
        </div>
      </LabsSection>
    </LabsShell>
  );
}
