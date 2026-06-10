import type { MapLayerDefinition } from "../layerRegistry";

interface LayerPanelProps {
  layers: MapLayerDefinition[];
  visibility: Record<string, boolean>;
  filtersByLayer: Record<string, Record<string, unknown>>;
  onToggle: (layerId: string) => void;
  onFilterChange: (layerId: string, filterId: string, value: unknown) => void;
}

export function LayerPanel({
  layers,
  visibility,
  filtersByLayer,
  onToggle,
  onFilterChange,
}: LayerPanelProps) {
  const grouped = layers.reduce<Record<string, MapLayerDefinition[]>>((acc, layer) => {
    const cat = layer.category;
    acc[cat] = acc[cat] ?? [];
    acc[cat].push(layer);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-labsMono font-semibold uppercase tracking-wider text-labs-textMuted">
        Layers
      </h4>
      {Object.entries(grouped).map(([category, catLayers]) => (
        <div key={category}>
          <p className="mb-1 text-xs font-semibold capitalize text-labs-textMuted">{category}</p>
          <ul className="space-y-2">
            {catLayers.map((layer) => (
              <li key={layer.id} className="rounded-md border border-labs-border bg-labs-panel2 p-2">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={visibility[layer.id] ?? false}
                    onChange={() => onToggle(layer.id)}
                    className="rounded border-labs-border"
                  />
                  <span className="text-sm font-medium text-labs-text">{layer.label}</span>
                </label>
                {layer.filters.length > 0 && visibility[layer.id] && (
                  <div className="mt-2 space-y-1 pl-6">
                    {layer.filters.map((f) => (
                      <div key={f.id} className="flex items-center justify-between gap-2">
                        <span className="text-xs text-labs-textMuted">{f.label}</span>
                        {f.type === "boolean" ? (
                          <input
                            type="checkbox"
                            checked={Boolean(filtersByLayer[layer.id]?.[f.id])}
                            onChange={(e) => onFilterChange(layer.id, f.id, e.target.checked)}
                          />
                        ) : f.type === "select" && f.options ? (
                          <select
                            value={String(filtersByLayer[layer.id]?.[f.id] ?? f.defaultValue ?? "")}
                            onChange={(e) => onFilterChange(layer.id, f.id, e.target.value)}
                            className="rounded border border-labs-border bg-labs-panel px-1 py-0.5 text-xs"
                          >
                            {f.options.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
                {layer.caveat && visibility[layer.id] && (
                  <p className="mt-1 pl-6 text-xs text-labs-textMuted">{layer.caveat}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
