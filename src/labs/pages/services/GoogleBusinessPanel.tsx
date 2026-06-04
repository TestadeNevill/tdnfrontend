import rawData from "../../data/digital-solutions.json";
import type { DigitalSolutionService, DigitalSolutionsData } from "../../types";

const data = rawData as DigitalSolutionsData;

const TIER_STYLES: Record<string, string> = {
  Basic: "border-slate-400/40 bg-slate-100 text-slate-700",
  Additions: "border-labs-accent/30 bg-labs-accent/10 text-labs-accent",
  Advanced: "border-labs-warning/30 bg-labs-warning/10 text-labs-warning",
};

const NAV_CATEGORIES = [
  ...data.categories.map((c) => ({ id: c.id, label: c.label })),
  { id: "summary", label: "Getting started" },
];

function ServiceOfferingCard({ service }: { service: DigitalSolutionService }) {
  const tierStyle = service.tier != null ? TIER_STYLES[service.tier] : null;

  return (
    <article className="rounded-lg border border-labs-border bg-labs-panel2 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-labs-border bg-white/90 px-2 py-0.5 font-labsMono text-xs font-bold text-labs-text">
            {service.code}
          </span>
          {service.tier != null && tierStyle != null && (
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-labsMono font-semibold uppercase ${tierStyle}`}
            >
              {service.tier}
            </span>
          )}
          <h4 className="text-sm font-semibold text-labs-text">{service.title}</h4>
        </div>
        <div className="text-right">
          <p className="font-labsMono text-sm font-semibold text-labs-accent">{service.price}</p>
          {service.priceNote != null && (
            <p className="text-[10px] uppercase tracking-wider text-labs-textMuted">
              {service.priceNote}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <p className="text-xs font-labsMono font-semibold uppercase tracking-wider text-labs-textMuted">
            Problem
          </p>
          <p className="mt-1 text-base leading-relaxed text-labs-textMuted">{service.problem}</p>
        </div>
        <div>
          <p className="text-xs font-labsMono font-semibold uppercase tracking-wider text-labs-textMuted">
            Solution
          </p>
          <p className="mt-1 text-base leading-relaxed text-labs-textMuted">{service.solution}</p>
        </div>
        <div>
          <p className="text-xs font-labsMono font-semibold uppercase tracking-wider text-labs-textMuted">
            Approach
          </p>
          <p className="mt-1 text-base leading-relaxed text-labs-textMuted">{service.approach}</p>
        </div>
      </div>

      <ul className="mt-4 list-disc space-y-1 pl-5 text-base text-labs-text">
        {service.deliverables.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

export function GoogleBusinessPanel() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-labs-text">{data.intro.headline}</h3>
        <p className="mt-1 text-base text-labs-textMuted">{data.intro.subhead}</p>
      </div>

      {data.complexityLadder != null && data.complexityLadder.length > 0 && (
        <div
          className="flex flex-col gap-2 rounded-lg border border-labs-border bg-white/80 p-3 sm:flex-row sm:items-center sm:justify-between"
          aria-label="Complexity tiers"
        >
          {data.complexityLadder.map((step, i) => (
            <div key={step} className="flex items-center gap-2 text-base text-labs-textMuted">
              {i > 0 && (
                <span className="hidden text-labs-textMuted sm:inline" aria-hidden="true">
                  →
                </span>
              )}
              <span>{step}</span>
            </div>
          ))}
        </div>
      )}

      <div>
        <h4 className="text-sm font-labsMono font-semibold uppercase tracking-wider text-labs-textMuted">
          Why Google Business Profile
        </h4>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-base text-labs-textMuted">
          {data.gbpBenefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </div>

      <nav
        aria-label="Service categories"
        className="flex flex-wrap gap-2 rounded-lg border border-labs-border bg-white/80 p-2"
      >
        {NAV_CATEGORIES.map((cat) => (
          <a
            key={cat.id}
            href={`#category-${cat.id}`}
            className="rounded-full border border-labs-border bg-labs-panel2 px-3 py-1 text-sm font-semibold text-labs-textMuted transition-colors hover:border-labs-accent/30 hover:text-labs-accent"
          >
            {cat.label}
          </a>
        ))}
      </nav>

      {data.categories.map((category) => (
        <section
          key={category.id}
          id={`category-${category.id}`}
          className="scroll-mt-4 space-y-3"
        >
          <div>
            <h4 className="text-sm font-semibold text-labs-text">{category.label}</h4>
            {category.subtitle != null && (
              <p className="mt-0.5 text-base text-labs-textMuted">{category.subtitle}</p>
            )}
          </div>
          <div className="space-y-3">
            {category.services.map((service) => (
              <ServiceOfferingCard key={service.code} service={service} />
            ))}
          </div>
        </section>
      ))}

      <section id="category-summary" className="scroll-mt-4 space-y-2 rounded-lg border border-labs-accent/20 bg-labs-accent/5 p-4">
        <h4 className="text-sm font-semibold text-labs-text">Getting started</h4>
        <ul className="list-disc space-y-1 pl-5 text-base text-labs-textMuted">
          {data.summary.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        {data.summary.depositNote != null && (
          <p className="text-base font-medium text-labs-text">{data.summary.depositNote}</p>
        )}
        <p className="text-xs text-labs-textMuted">{data.pricingDisclaimer}</p>
      </section>
    </div>
  );
}
