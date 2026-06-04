import type { LabsServiceMeta } from "../types";

interface LabsServiceNavProps {
  services: LabsServiceMeta[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function LabsServiceNav({ services, activeId, onSelect }: LabsServiceNavProps) {
  return (
    <nav
      aria-label="Service capabilities"
      className="flex flex-wrap gap-2"
    >
      {services.map((service) => {
        const isActive = service.id === activeId;
        return (
          <button
            key={service.id}
            type="button"
            aria-current={isActive ? "true" : undefined}
            onClick={() => onSelect(service.id)}
            className={[
              "min-w-[min(100%,14rem)] flex-[1_1_14rem] rounded-lg border px-3 py-2.5 text-left transition-colors",
              isActive
                ? "border-labs-accent/40 bg-labs-accent/10 text-labs-text"
                : "border-labs-border bg-white/80 text-labs-textMuted hover:border-labs-accent/20 hover:bg-labs-panel2",
            ].join(" ")}
          >
            <span className="block text-base font-semibold text-labs-text">{service.title}</span>
            <span className="mt-0.5 block text-base leading-relaxed text-labs-textMuted">{service.description}</span>
          </button>
        );
      })}
    </nav>
  );
}
