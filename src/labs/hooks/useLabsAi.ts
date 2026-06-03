import { useCallback, useState } from "react";
import { labsAiComplete, type LabsAiResult, type LabsAiTask } from "../api/labsAi";

type AiPayload =
  | { task: "chat"; prompt: string }
  | { task: "synthesize"; notes: string }
  | { task: "review-reply"; review: string; rating?: number };

export function useLabsAi() {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [result, setResult] = useState<LabsAiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (payload: AiPayload) => {
    setStatus("loading");
    setError(null);
    try {
      const data = await labsAiComplete(payload);
      setResult(data);
      setStatus("idle");
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Request failed";
      setError(message);
      setStatus("error");
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setStatus("idle");
  }, []);

  return { status, result, error, run, reset };
}

export type { LabsAiTask, LabsAiResult };
