import type { LayerMeta } from "../types/mapFeature";

interface LayerMetadataStripProps {
  meta: LayerMeta | null | undefined;
}

export function LayerMetadataStrip({ meta }: LayerMetadataStripProps) {
  if (!meta) return null;

  return (
    <p className="text-xs text-labs-textMuted">
      Source: {meta.source}
      {meta.coverage ? ` · Coverage: ${meta.coverage}` : ""}
      {meta.confidence ? ` · Confidence: ${meta.confidence}` : ""}
      {meta.updated ? ` · Updated: ${new Date(meta.updated).toLocaleString()}` : ""}
      {meta.caveat ? ` · ${meta.caveat}` : ""}
    </p>
  );
}
