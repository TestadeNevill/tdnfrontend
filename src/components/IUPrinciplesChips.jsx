// src/components/IUPrinciplesChips.jsx
import React from "react";

const PRINCIPLES = [
  { id: "iu-1",  title: "Balance with Nature" },
  { id: "iu-2",  title: "Balance with Culture & Heritage" },
  { id: "iu-3",  title: "Appropriate Technology" },
  { id: "iu-4",  title: "Conviviality & Inclusion" },
  { id: "iu-5",  title: "Efficiency" },
  { id: "iu-6",  title: "Human Scale" },
  { id: "iu-7",  title: "Opportunity Matrix (Equity)" },
  { id: "iu-8",  title: "Regional Integration" },
  { id: "iu-9",  title: "Balanced Movement" },
  { id: "iu-10", title: "Institutional Integrity" },
];

export default function IUPrinciplesChips() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-xl font-semibold text-gray-900 mb-3">The Principles at a Glance</h3>
      <div className="flex flex-wrap gap-2">
        {PRINCIPLES.map((p) => (
          <a
            key={p.id}
            href={`#${p.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 hover:bg-emerald-100"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path d="M12 3v18M3 12h18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
            </svg>
            <span>{p.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
