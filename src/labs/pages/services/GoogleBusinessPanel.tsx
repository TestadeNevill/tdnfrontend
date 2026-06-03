import { useState } from "react";
import data from "../../data/google-business-features.json";
import { useLabsAi } from "../../hooks/useLabsAi";

const STATUS_STYLES: Record<string, string> = {
  supported: "border-labs-ok/30 bg-labs-ok/10 text-labs-ok",
  planned: "border-labs-warning/30 bg-labs-warning/10 text-labs-warning",
};

const SAMPLE_REVIEW =
  "Good service but parking was confusing. Would come back if signage improved.";
const SAMPLE_RATING = 3;

export function GoogleBusinessPanel() {
  const { status, result, error, run } = useLabsAi();
  const [review, setReview] = useState(SAMPLE_REVIEW);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-labs-text">Google Business Profile</h3>
        <p className="mt-1 text-base text-labs-textMuted">
          Feature matrix and AI-assisted reply preview for local presence management.
        </p>
      </div>

      <div>
        <h4 className="text-sm font-labsMono font-semibold uppercase tracking-wider text-labs-textMuted">
          GBP features
        </h4>
        <ul className="mt-2 space-y-2">
          {data.gbpFeatures.map((feature) => (
            <li
              key={feature.name}
              className="flex items-center justify-between rounded-md border border-labs-border bg-labs-panel2 px-3 py-2 text-sm"
            >
              <span className="text-labs-text">{feature.name}</span>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-labsMono font-semibold uppercase ${STATUS_STYLES[feature.status] ?? STATUS_STYLES.planned}`}
              >
                {feature.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-labsMono font-semibold uppercase tracking-wider text-labs-textMuted">
          Social integrations
        </h4>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-base text-labs-textMuted">
          {data.socialIntegrations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-labs-border bg-labs-panel2 p-3">
        <p className="text-sm font-labsMono font-semibold uppercase tracking-wider text-labs-textMuted">
          Review + suggested reply
        </p>
        <blockquote className="mt-2 border-l-2 border-labs-warning pl-3 text-sm text-labs-text">
          &ldquo;{review}&rdquo;
          <footer className="mt-1 text-sm text-labs-textMuted">— {SAMPLE_RATING}★ review</footer>
        </blockquote>
        <label className="mt-3 block text-xs font-labsMono uppercase tracking-wider text-labs-textMuted">
          Edit review text
        </label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-labs-border bg-white/90 px-3 py-2 text-sm"
        />
        <button
          type="button"
          disabled={status === "loading" || review.trim().length < 5}
          onClick={() =>
            run({ task: "review-reply", review: review.trim(), rating: SAMPLE_RATING })
          }
          className="mt-3 rounded-md border border-labs-accent/40 bg-labs-accent/10 px-3 py-1.5 text-sm font-semibold text-labs-accent disabled:opacity-60"
        >
          {status === "loading" ? "Drafting…" : "Generate reply"}
        </button>
        {error != null && (
          <p className="mt-2 text-xs text-red-600">{error}</p>
        )}
        <p className="mt-3 text-base text-labs-textMuted">
          <span className="font-semibold text-labs-accent">Suggested reply:</span>{" "}
          {result?.text ??
            "Thank you for the feedback! We're updating parking signage this month and hope to see you again soon."}
        </p>
        {result?.source === "mock" && (
          <p className="mt-1 text-[10px] font-labsMono uppercase text-labs-warning">Mock reply</p>
        )}
      </div>

      <div>
        <h4 className="text-sm font-labsMono font-semibold uppercase tracking-wider text-labs-textMuted">
          AI use cases
        </h4>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {data.aiUseCases.map((useCase) => (
            <div
              key={useCase}
              className="rounded-md border border-labs-border bg-white/80 px-3 py-2 text-sm text-labs-text"
            >
              {useCase}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
