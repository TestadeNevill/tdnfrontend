interface LabsMetricProps {
  label: string;
  value: string;
}

export function LabsMetric({ label, value }: LabsMetricProps) {
  return (
    <div className="rounded-lg border border-labs-border bg-labs-panel2 px-4 py-3 text-center">
      <p className="font-labsMono text-xs font-semibold uppercase tracking-wider text-labs-textMuted">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold text-labs-text">{value}</p>
    </div>
  );
}
