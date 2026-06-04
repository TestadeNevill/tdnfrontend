import { Link } from "react-router-dom";
import type { LabsProjectMeta } from "../types";
import { LabsStatusBadge } from "./LabsStatusBadge";

interface LabsProjectCardProps {
  project: LabsProjectMeta;
}

export function LabsProjectCard({ project }: LabsProjectCardProps) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-labs-border bg-white/90 p-4 shadow-sm ring-1 ring-slate-900/5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-labs-text">{project.title}</h3>
        <LabsStatusBadge variant={project.status} label={project.statusLabel} />
      </div>
      <p className="mt-2 flex-1 text-base text-labs-textMuted leading-relaxed">
        {project.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-labs-border bg-labs-panel2 px-2 py-0.5 text-[11px] font-labsMono text-labs-textMuted"
          >
            {tag}
          </span>
        ))}
      </div>
      <Link
        to={project.route}
        className="mt-4 inline-flex w-fit items-center rounded-md border border-labs-accent/40 bg-labs-accent/10 px-3 py-1.5 text-sm font-semibold text-labs-accent transition-colors hover:bg-labs-accent/20"
      >
        Open demo →
      </Link>
    </article>
  );
}
