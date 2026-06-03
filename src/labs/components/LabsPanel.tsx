import type { ReactNode } from "react";

interface LabsPanelProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export function LabsPanel({ children, className = "", title }: LabsPanelProps) {
  return (
    <div
      className={`rounded-xl border border-labs-border bg-white/90 p-4 shadow-sm ring-1 ring-slate-900/5 md:p-5 ${className}`}
    >
      {title != null && (
        <h2 className="mb-3 text-sm font-labsMono font-semibold uppercase tracking-wider text-labs-textMuted">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
