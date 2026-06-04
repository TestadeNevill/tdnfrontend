import { useCallback, useEffect, useState } from "react";
import useCases from "../../data/ai-use-cases.json";
import { useLabsAi } from "../../hooks/useLabsAi";

interface UseCase {
  id: string;
  title: string;
  prompt: string;
  label: string;
}

const GUARDRAILS = [
  "Labs-only answers — no production data access",
  "Mock labels on all synthesized outputs",
  "Concise responses; escalate compliance items to humans",
  "Permitting output always carries deterministic engine result",
];

const AI_TOOLS = [
  "OpenAI API (GPT models)",
  "Secure server-side API routes",
  "Task-specific prompt templates",
  "React hooks & embedded chat widgets",
  "Rate limiting & usage controls",
  "Mock fallbacks for demos & offline",
  "RAG / document retrieval (when needed)",
  "Agent + rules-engine orchestration",
] as const;

const AI_CAPABILITIES = [
  "Custom chat assistants embedded in sites, portals, and ops tools",
  "Task routing — Q&A, summaries, drafts, explainers, and reviews",
  "Branded UI with scope guardrails and human escalation paths",
  "API keys kept server-side; clients never see provider secrets",
  "Demo mode with labeled mock replies when keys are unavailable",
  "Rotating or guided prompts to showcase domain use cases",
  "Ground answers in your data, engines, and citations — not guesses",
  "Composable with maps, forms, and workflow UIs you already have",
] as const;

const BUSINESS_USE_CASES = [
  "Infrastructure diligence — site Q&A, permit path explainers",
  "Google Business — review replies and listing copy drafts",
  "Transport & logistics — corridor incident summaries and mitigations",
  "Finance & grants — eligibility scans and program research",
  "Customer support — FAQs, triage, and handoff summaries",
  "Internal ops — SOP lookup, meeting notes, and action items",
  "Sales & marketing — proposal outlines and tailored outreach",
  "Compliance-heavy domains — narrate deterministic engine outputs only",
] as const;

export function AiAssistantPanel() {
  const cases = useCases as UseCase[];
  const [activeIndex, setActiveIndex] = useState(0);
  const [prompt, setPrompt] = useState("");
  const active = cases[activeIndex];
  const { status, result, error, run, reset } = useLabsAi();

  const jumpTo = useCallback(
    (index: number) => {
      const next = index % cases.length;
      setActiveIndex(next);
      setPrompt(cases[next].prompt);
      reset();
    },
    [cases, reset],
  );

  useEffect(() => {
    setPrompt(active.prompt);
  }, [active.prompt]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % cases.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [cases.length]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-labs-text">AI assistants &amp; synthesis</h3>
        <p className="mt-2 max-w-4xl text-base leading-relaxed text-labs-textMuted">
          I design and ship AI chat experiences for real business workflows — not generic chatbots.
          The interactive demo below rotates sample prompts across hydro diligence, local business,
          transport, finance, and permitting. The same stack powers embedded widgets, task-specific
          APIs, and assistants that stay inside your guardrails.
        </p>
      </div>

      <div>
        <h4 className="text-sm font-labsMono font-semibold uppercase tracking-wider text-labs-textMuted">
          Tools &amp; platforms
        </h4>
        <ul className="mt-2 flex flex-wrap gap-2">
          {AI_TOOLS.map((tool) => (
            <li
              key={tool}
              className="rounded-full border border-labs-border bg-labs-panel2 px-3 py-1 text-sm font-medium text-labs-text"
            >
              {tool}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-labs-border bg-labs-panel2 p-4">
          <h4 className="text-sm font-semibold text-labs-text">Capabilities</h4>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-labs-textMuted">
            {AI_CAPABILITIES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-labs-border bg-labs-panel2 p-4">
          <h4 className="text-sm font-semibold text-labs-text">Business use cases</h4>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-labs-textMuted">
            {BUSINESS_USE_CASES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-labs-border pt-6 space-y-5">
        <div>
          <h4 className="text-base font-semibold text-labs-text">Live demo — AI Chat Assistant</h4>
          <p className="mt-1 text-base text-labs-textMuted">
            Pick a sample use case or edit the prompt — live OpenAI replies when configured, mock
            fallback otherwise. Also available as the floating Labs chat on every Labs page.
          </p>
        </div>

      <div className="flex flex-wrap gap-2">
        {cases.map((uc, i) => (
          <button
            key={uc.id}
            type="button"
            onClick={() => jumpTo(i)}
            className={[
              "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
              i === activeIndex
                ? "border-labs-accent/40 bg-labs-accent/10 text-labs-accent"
                : "border-labs-border bg-labs-panel2 text-labs-textMuted hover:border-labs-accent/20",
            ].join(" ")}
          >
            {uc.label}
          </button>
        ))}
      </div>

      <div
        key={active.id}
        className="animate-[fadeIn_0.35s_ease-out] rounded-lg border border-labs-border bg-labs-panel2 p-4"
      >
        <p className="font-labsMono text-[10px] font-semibold uppercase tracking-wider text-labs-accent">
          {active.label}
        </p>
        <h4 className="mt-1 text-sm font-semibold text-labs-text">{active.title}</h4>
        <label className="mt-3 block text-xs font-labsMono uppercase tracking-wider text-labs-textMuted">
          Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            reset();
          }}
          rows={3}
          className="mt-1 w-full rounded-md border border-labs-border bg-white/90 px-3 py-2 text-sm text-labs-text"
        />
        <button
          type="button"
          disabled={status === "loading" || prompt.trim().length < 3}
          onClick={() => run({ task: "chat", prompt: prompt.trim() })}
          className="mt-3 rounded-md border border-labs-accent/40 bg-labs-accent/10 px-3 py-1.5 text-sm font-semibold text-labs-accent disabled:opacity-60"
        >
          {status === "loading" ? "Thinking…" : "Run prompt"}
        </button>
      </div>

      {error != null && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>
      )}

      {result != null && (
        <div className="rounded-lg border border-labs-border bg-white/90 p-4">
          {result.source === "mock" && (
            <p className="mb-2 text-[10px] font-labsMono uppercase text-labs-warning">Mock response</p>
          )}
          <p className="whitespace-pre-wrap text-base text-labs-text">{result.text}</p>
        </div>
      )}

      <div>
        <h4 className="text-sm font-labsMono font-semibold uppercase tracking-wider text-labs-textMuted">
          Scope guardrails (this Labs build)
        </h4>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-base text-labs-textMuted">
          {GUARDRAILS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      </div>
    </div>
  );
}
