const DEFAULT_MODEL = "gpt-4o-mini";

const SYSTEM_PROMPTS = {
  chat: `You are the Infrastructure Intelligence Labs assistant on testadenevill.com.
Answer concisely for demo purposes only. Use mock/synthetic framing when citing data.
Do not claim access to private systems, live telemetry, or production databases.
Escalate compliance, legal, or safety items to a human expert.`,

  synthesize: `You are an insight synthesis engine for Infrastructure Intelligence Labs.
Turn structured scenario notes into: (1) a one-line headline, (2) three bullet insights,
(3) one recommended next action. Keep it under 180 words. Label output as "Labs synthesis (mock context)".`,

  "review-reply": `You draft professional Google Business Profile review replies.
Be warm, specific, and under 80 words. Never argue with the reviewer. Offer a constructive next step when appropriate.`,
};

const MOCK_RESPONSES = {
  chat: "Labs mock mode — OpenAI key not configured. Example: For a 5 MW run-of-river site, prioritize interconnection queue position and FERC licensing pathway before capex refinement.",
  synthesize:
    "Labs synthesis (mock context)\n\nHeadline: Corridor delay spike warrants mode-shift playbook.\n\n• Synthetic incident feed shows elevated rail dwell at Hub B.\n• Road spillback adds 12–18 min p95 on the I-95 spine.\n• Air leg remains uncongested but cost-prohibitive for bulk freight.\n\nNext action: Run a tabletop with ops leads on pre-positioning at Hub C.",
  "review-reply":
    "Thank you for the thoughtful feedback! We're updating parking signage this month and training front-of-house staff on clearer directions. We'd love to welcome you back soon — please ask for the manager if anything is unclear on your next visit.",
};

function getApiKey() {
  return process.env.OPENAI_API_KEY?.trim() || null;
}

function getModel() {
  return process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;
}

export function isOpenAiConfigured() {
  return Boolean(getApiKey());
}

export async function completeAiTask(task, userContent) {
  const system = SYSTEM_PROMPTS[task];
  if (!system) {
    const error = new Error(`Unknown task: ${task}`);
    error.status = 400;
    throw error;
  }

  if (!getApiKey()) {
    return {
      text: MOCK_RESPONSES[task] ?? MOCK_RESPONSES.chat,
      source: "mock",
      model: null,
    };
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: getModel(),
      messages: [
        { role: "system", content: system },
        { role: "user", content: userContent },
      ],
      max_tokens: 500,
      temperature: 0.6,
    }),
    signal: AbortSignal.timeout(25_000),
  });

  if (response.status === 429) {
    const error = new Error("OpenAI rate limit");
    error.status = 429;
    throw error;
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    const error = new Error(`OpenAI ${response.status}: ${detail.slice(0, 200)}`);
    error.status = 502;
    throw error;
  }

  const payload = await response.json();
  const text = payload.choices?.[0]?.message?.content?.trim();
  if (!text) {
    const error = new Error("Empty OpenAI response");
    error.status = 502;
    throw error;
  }

  return {
    text,
    source: "api",
    model: payload.model ?? getModel(),
  };
}

export function normalizeAiRequest(body) {
  const task = body?.task?.trim();
  if (!task || !SYSTEM_PROMPTS[task]) {
    return { error: "Invalid task. Use chat, synthesize, or review-reply." };
  }

  if (task === "chat") {
    const prompt = body?.prompt?.trim();
    if (!prompt || prompt.length < 3) {
      return { error: "Prompt must be at least 3 characters." };
    }
    if (prompt.length > 2000) {
      return { error: "Prompt too long (max 2000 characters)." };
    }
    return { task, userContent: prompt };
  }

  if (task === "synthesize") {
    const notes = body?.notes?.trim();
    if (!notes || notes.length < 10) {
      return { error: "Notes must be at least 10 characters." };
    }
    if (notes.length > 4000) {
      return { error: "Notes too long (max 4000 characters)." };
    }
    return { task, userContent: notes };
  }

  if (task === "review-reply") {
    const review = body?.review?.trim();
    if (!review || review.length < 5) {
      return { error: "Review text must be at least 5 characters." };
    }
    const rating = Number(body?.rating);
    const ratingLine =
      Number.isFinite(rating) && rating >= 1 && rating <= 5
        ? `Star rating: ${rating}/5\n`
        : "";
    return {
      task,
      userContent: `${ratingLine}Review:\n${review.slice(0, 1500)}`,
    };
  }

  return { error: "Invalid request" };
}
