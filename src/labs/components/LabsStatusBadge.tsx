import type { LabsStatusVariant } from "../types";

interface LabsStatusBadgeProps {
  variant: LabsStatusVariant;
  label: string;
}

const VARIANT_STYLES: Record<LabsStatusVariant, string> = {
  ok: "border-labs-ok/30 bg-labs-ok/10 text-labs-ok",
  warn: "border-labs-warning/30 bg-labs-warning/10 text-labs-warning",
  crit: "border-labs-danger/30 bg-labs-danger/10 text-labs-danger",
  neutral: "border-labs-border bg-slate-100 text-labs-textMuted",
};

export function LabsStatusBadge({ variant, label }: LabsStatusBadgeProps) {
  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-labsMono font-semibold uppercase tracking-wider ${VARIANT_STYLES[variant]}`}
    >
      {label}
    </span>
  );
}
