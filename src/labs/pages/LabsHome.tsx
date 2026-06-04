import { useState } from "react";
import { Link } from "react-router-dom";
import { LABS_PROJECTS } from "../catalog";
import { LABS_SERVICES } from "../services/catalog";
import { LabsSection } from "../components/LabsSection";
import { LabsServiceCarousel } from "../components/LabsServiceCarousel";
import { LabsServiceNav } from "../components/LabsServiceNav";
import { LabsHydroProjectPanel } from "../components/LabsHydroProjectPanel";
import { LabsShell } from "../components/LabsShell";

function contactHref(subject: string, intent?: "call" | "video" | "learn-more") {
  const params = new URLSearchParams();
  if (intent != null) params.set("intent", intent);
  params.set("subject", subject);
  return `/contact?${params.toString()}`;
}

interface ContactCtasProps {
  subject: string;
}

function ContactCtas({ subject }: ContactCtasProps) {
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-3">
      <Link
        to={contactHref(subject, "learn-more")}
        className="inline-flex items-center rounded-md border border-labs-border bg-white/80 px-4 py-2 text-sm font-semibold text-labs-text transition-colors hover:border-labs-accent/30 hover:bg-labs-panel2"
      >
        Learn more
      </Link>
      <Link
        to={contactHref(subject, "call")}
        className="inline-flex items-center rounded-md border border-labs-accent/40 bg-labs-accent/10 px-4 py-2 text-sm font-semibold text-labs-accent transition-colors hover:bg-labs-accent/20"
      >
        Book a call
      </Link>
      <Link
        to={contactHref(subject, "video")}
        className="inline-flex items-center rounded-md border border-labs-accent/40 bg-labs-accent/10 px-4 py-2 text-sm font-semibold text-labs-accent transition-colors hover:bg-labs-accent/20"
      >
        Book a video call
      </Link>
    </div>
  );
}

export default function LabsHome() {
  const [activeServiceId, setActiveServiceId] = useState(LABS_SERVICES[0].id);
  const activeService = LABS_SERVICES.find((s) => s.id === activeServiceId) ?? LABS_SERVICES[0];
  const hydroSubject = LABS_PROJECTS[0].title;

  return (
    <LabsShell
      fillViewport
      title="Infrastructure Intelligence Labs"
      subtitle="Services for operators and investors—plus self-contained project demos with maps, synthetic telemetry, and optional AI synthesis."
      breadcrumb={[{ label: "Labs" }]}
    >
      <LabsSection
        id="services"
        title="Services"
        subtitle="Digital solutions, geospatial lookup, AI assistance, and logistics simulation — select a capability to preview."
      >
        <div className="space-y-6">
          <LabsServiceNav
            services={LABS_SERVICES}
            activeId={activeServiceId}
            onSelect={setActiveServiceId}
          />
          <LabsServiceCarousel activeId={activeServiceId} />
        </div>
        <ContactCtas subject={activeService.title} />
      </LabsSection>

      <hr className="my-10 border-labs-border" aria-hidden="true" />

      <LabsSection
        id="projects"
        title="Projects"
        subtitle="Flagship Hydro IQ workflow — GIS scoring, financial screening, and deterministic permitting matrix."
      >
        <LabsHydroProjectPanel />
        <ContactCtas subject={hydroSubject} />
      </LabsSection>
    </LabsShell>
  );
}
