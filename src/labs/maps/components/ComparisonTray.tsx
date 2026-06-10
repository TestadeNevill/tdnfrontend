import type { ComparisonPin } from "../types/mapFeature";
import { MatchScoreBadge } from "./MatchScoreBadge";

interface ComparisonTrayProps {
  pins: ComparisonPin[];
  onClear: () => void;
}

export function ComparisonTray({ pins, onClear }: ComparisonTrayProps) {
  if (pins.length === 0) return null;

  return (
    <div className="rounded-lg border border-labs-border bg-labs-panel2 p-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-labs-text">Compare areas</h4>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-labs-textMuted hover:text-labs-text"
        >
          Clear
        </button>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {pins.map((pin) => (
          <div key={pin.id} className="rounded-md border border-labs-border bg-labs-panel p-2">
            <p className="text-sm font-semibold text-labs-text">
              Area {pin.id}: {pin.label}
            </p>
            <p className="text-xs text-labs-textMuted">
              {pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}
            </p>
            {pin.score && <MatchScoreBadge result={pin.score} />}
          </div>
        ))}
      </div>
    </div>
  );
}
