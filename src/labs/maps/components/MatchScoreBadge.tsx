import type { MatchScoreResult } from "../types/mapFeature";

interface MatchScoreBadgeProps {
  result: MatchScoreResult | null | undefined;
}

export function MatchScoreBadge({ result }: MatchScoreBadgeProps) {
  if (!result) return null;

  const color =
    result.score >= 75
      ? "text-labs-ok border-labs-ok/30 bg-labs-ok/10"
      : result.score >= 50
        ? "text-labs-accent border-labs-accent/30 bg-labs-accent/10"
        : "text-labs-warning border-labs-warning/30 bg-labs-warning/10";

  return (
    <div className={`rounded-lg border px-3 py-2 ${color}`}>
      <p className="text-xs font-labsMono uppercase tracking-wider opacity-80">Match score</p>
      <p className="text-2xl font-bold">{result.score} / 100</p>
    </div>
  );
}
