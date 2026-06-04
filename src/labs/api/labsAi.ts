export type LabsAiTask = "chat" | "synthesize" | "review-reply";

export interface LabsAiResult {
  text: string;
  source: "api" | "mock";
  model?: string | null;
}

export async function labsAiComplete(
  body:
    | { task: "chat"; prompt: string }
    | { task: "synthesize"; notes: string }
    | { task: "review-reply"; review: string; rating?: number },
): Promise<LabsAiResult> {
  const res = await fetch("/api/labs/ai/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (res.status === 429) {
    throw new Error("Rate limit reached — try again in a minute.");
  }

  const data = (await res.json()) as LabsAiResult & { error?: string; code?: string };
  if (!res.ok) {
    throw new Error(data.error ?? "AI request failed");
  }

  return data;
}
