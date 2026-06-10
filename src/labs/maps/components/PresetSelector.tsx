import { SCENARIO_PRESETS } from "../layerRegistry";
import type { ScenarioPresetId } from "../types/mapFeature";

interface PresetSelectorProps {
  value: ScenarioPresetId;
  onChange: (id: ScenarioPresetId) => void;
}

export function PresetSelector({ value, onChange }: PresetSelectorProps) {
  return (
    <div>
      <label htmlFor="scenario-preset" className="text-xs font-labsMono font-semibold uppercase tracking-wider text-labs-textMuted">
        Scenario
      </label>
      <select
        id="scenario-preset"
        value={value}
        onChange={(e) => onChange(e.target.value as ScenarioPresetId)}
        className="mt-1 w-full rounded-md border border-labs-border bg-labs-panel2 px-2 py-1.5 text-sm text-labs-text"
      >
        {SCENARIO_PRESETS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>
      <p className="mt-1 text-xs text-labs-textMuted">
        {SCENARIO_PRESETS.find((p) => p.id === value)?.description}
      </p>
    </div>
  );
}
