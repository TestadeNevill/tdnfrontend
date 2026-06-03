import type { TransshipmentSimEvent } from "../types";

interface TransshipmentLogProps {
  events: TransshipmentSimEvent[];
}

const LEVEL_STYLES: Record<TransshipmentSimEvent["level"], string> = {
  info: "text-labs-textMuted",
  warn: "text-labs-warning",
  ok: "text-labs-ok",
};

export function TransshipmentLog({ events }: TransshipmentLogProps) {
  return (
    <div
      className="max-h-32 overflow-y-auto rounded-lg border border-labs-border bg-labs-panel2 p-2 font-labsMono text-xs"
      aria-live="polite"
      aria-label="Simulation event log"
    >
      {events.length === 0 ? (
        <p className="text-labs-textMuted">Waiting for simulation events…</p>
      ) : (
        <ul className="space-y-1">
          {[...events].reverse().map((evt) => (
            <li key={evt.id} className={LEVEL_STYLES[evt.level]}>
              <span className="text-labs-textMuted/60">
                {new Date(evt.timestamp).toLocaleTimeString()}
              </span>{" "}
              {evt.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
