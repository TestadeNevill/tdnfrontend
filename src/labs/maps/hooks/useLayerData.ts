import { useCallback, useEffect, useRef, useState } from "react";
import type { LayerApiResponse, MapAnchor } from "../types/mapFeature";
import type { MapLayerDefinition } from "../layerRegistry";

export interface LayerDataState {
  loading: boolean;
  error: string | null;
  data: LayerApiResponse | null;
}

const clientCache = new Map<string, { data: LayerApiResponse; expiresAt: number }>();

function buildCacheKey(
  layerId: string,
  anchor: MapAnchor,
  filters: Record<string, unknown>,
  bbox?: [number, number, number, number],
): string {
  const filterStr = JSON.stringify(filters);
  const bboxStr = bbox ? bbox.map((n) => n.toFixed(3)).join(",") : "";
  return `${layerId}:${anchor.lat.toFixed(3)},${anchor.lng.toFixed(3)}:${anchor.radiusM}:${filterStr}:${bboxStr}`;
}

export async function fetchLayerData(
  layer: MapLayerDefinition,
  anchor: MapAnchor,
  filters: Record<string, unknown>,
  bbox?: [number, number, number, number],
  signal?: AbortSignal,
): Promise<LayerApiResponse> {
  const cacheKey = buildCacheKey(layer.id, anchor, filters, bbox);
  const cached = clientCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  const body: Record<string, unknown> = {
    lat: anchor.lat,
    lng: anchor.lng,
    radiusMeters: anchor.radiusM,
    filters,
  };
  if (layer.requiresBbox && bbox) {
    body.bbox = bbox;
  }

  const res = await fetch(layer.endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });

  const payload = (await res.json()) as LayerApiResponse & { error?: string };

  if (!res.ok) {
    throw new Error(payload.error ?? `Layer ${layer.id} unavailable`);
  }

  clientCache.set(cacheKey, {
    data: payload,
    expiresAt: Date.now() + layer.cacheTtlSeconds * 1000,
  });

  return payload;
}

export function useLayerData(
  layer: MapLayerDefinition | undefined,
  visible: boolean,
  anchor: MapAnchor,
  filters: Record<string, unknown>,
  bbox?: [number, number, number, number],
) {
  const [state, setState] = useState<LayerDataState>({
    loading: false,
    error: null,
    data: null,
  });
  const abortRef = useRef<AbortController | null>(null);

  const refetch = useCallback(async () => {
    if (!layer || !visible) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const data = await fetchLayerData(layer, anchor, filters, bbox, controller.signal);
      if (!controller.signal.aborted) {
        setState({ loading: false, error: null, data });
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      setState({
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load layer",
        data: null,
      });
    }
  }, [layer, visible, anchor, filters, bbox]);

  useEffect(() => {
    if (!visible || !layer) {
      abortRef.current?.abort();
      return;
    }

    const timer = setTimeout(refetch, 300);
    return () => {
      clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [visible, layer, refetch]);

  return { ...state, refetch };
}

export function useMultipleLayers(
  layers: MapLayerDefinition[],
  visibility: Record<string, boolean>,
  anchor: MapAnchor,
  filtersByLayer: Record<string, Record<string, unknown>>,
  bbox?: [number, number, number, number],
) {
  const [results, setResults] = useState<Record<string, LayerDataState>>({});

  useEffect(() => {
    const controllers: AbortController[] = [];

    layers.forEach((layer) => {
      if (!visibility[layer.id]) return;

      const controller = new AbortController();
      controllers.push(controller);

      setResults((prev) => ({
        ...prev,
        [layer.id]: { loading: true, error: null, data: prev[layer.id]?.data ?? null },
      }));

      fetchLayerData(layer, anchor, filtersByLayer[layer.id] ?? {}, bbox, controller.signal)
        .then((data) => {
          if (!controller.signal.aborted) {
            setResults((prev) => ({
              ...prev,
              [layer.id]: { loading: false, error: null, data },
            }));
          }
        })
        .catch((err) => {
          if (controller.signal.aborted) return;
          setResults((prev) => ({
            ...prev,
            [layer.id]: {
              loading: false,
              error: err instanceof Error ? err.message : "Failed",
              data: null,
            },
          }));
        });
    });

    return () => controllers.forEach((c) => c.abort());
  }, [layers, visibility, anchor, filtersByLayer, bbox]);

  return results;
}
