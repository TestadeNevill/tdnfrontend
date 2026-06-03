import { useState } from "react";
import { Link } from "react-router-dom";
import { LabsShell } from "../components/LabsShell";
import { LabsPanel } from "../components/LabsPanel";
import { useLabsAi } from "../hooks/useLabsAi";

const SAMPLE_NOTES = `Scenario: Northeast corridor — elevated rail dwell at Hub B
Signals: synthetic incident feed, p95 road delay +14 min, air leg clear
Stakeholders: intermodal ops, CRE absorption team
Question: Where should we pre-position buffer capacity this week?`;

export default function InsightWorkbench() {
  const [notes, setNotes] = useState(SAMPLE_NOTES);
  const { status, result, error, run } = useLabsAi();

  return (
    <LabsShell
      title="Insight Workbench"
      subtitle="Structured scenario notes with OpenAI-backed synthesis (mock fallback when no API key)."
      breadcrumb={[
        { label: "Labs", to: "/labs" },
        { label: "Insight Workbench" },
      ]}
    >
      <LabsPanel title="Scenario notes">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={8}
          className="w-full rounded-md border border-labs-border bg-white/90 px-3 py-2 text-sm text-labs-text focus:border-labs-accent/40 focus:outline-none focus:ring-1 focus:ring-labs-accent/30"
          placeholder="Paste bullet notes, signals, and the decision question…"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={status === "loading"}
            onClick={() => run({ task: "synthesize", notes })}
            className="rounded-md border border-labs-accent/40 bg-labs-accent/10 px-4 py-2 text-sm font-semibold text-labs-accent disabled:opacity-60"
          >
            {status === "loading" ? "Synthesizing…" : "Synthesize insights"}
          </button>
          <Link
            to="/labs#services"
            className="text-sm font-semibold text-labs-textMuted hover:text-labs-accent"
          >
            ← Back to Labs services
          </Link>
        </div>
      </LabsPanel>

      {error != null && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {result != null && (
        <LabsPanel title="Synthesis output" className="mt-4">
          {result.source === "mock" && (
            <p className="mb-2 text-xs font-labsMono uppercase tracking-wider text-labs-warning">
              Mock mode — add OPENAI_API_KEY in Vercel to enable live synthesis
            </p>
          )}
          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-labs-text">{result.text}</pre>
        </LabsPanel>
      )}
    </LabsShell>
  );
}
