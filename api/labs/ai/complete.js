import { completeAiTask, normalizeAiRequest } from "../../_lib/openai.js";
import { createRateLimiter, getClientIp } from "../../_lib/rateLimit.js";

const isRateLimited = createRateLimiter({ windowMs: 60_000, max: 20 });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Rate limit exceeded" });
  }

  const normalized = normalizeAiRequest(req.body);
  if (normalized.error) {
    return res.status(400).json({ error: normalized.error });
  }

  try {
    const result = await completeAiTask(normalized.task, normalized.userContent);
    return res.status(200).json(result);
  } catch (error) {
    if (error?.status === 429) {
      return res.status(429).json({ error: "OpenAI rate limit exceeded" });
    }
    console.error("ai/complete error:", error);
    return res.status(error?.status ?? 502).json({ error: "AI completion unavailable" });
  }
}
