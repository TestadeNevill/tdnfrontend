// src/components/TransitModeInfographic.jsx
export default function TransitModeInfographic() {
  const cards = [
    {
      title: "Micromobility",
      blurb: "Safe lanes, secure parking, and charging tied to the transit app.",
      bullets: ["Protected lanes", "Ample racks/charging", "One-tap rentals"],
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path d="M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm14 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM9 11h3l2 4M9 11l2-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: "Bus / BRT",
      blurb: "Level boarding, off-board payment, and signal priority.",
      bullets: ["Off-board fares", "Level platforms", "Transit priority"],
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <rect x="4" y="4" width="16" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6"/>
          <path d="M6 18l-1 2M18 18l1 2M6 10h4M14 10h4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      title: "Rail",
      blurb: "Clockface schedules and intuitive, unchanging platform assignments.",
      bullets: ["Timed transfers", "Clear wayfinding", "Weather-protected links"],
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <rect x="6" y="4" width="12" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6"/>
          <path d="M8 18l-2 3M18 18l2 3M8 14h8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      title: "Vertiport / Ferry",
      blurb: "Rooftop eVTOL pads and waterfront docks integrated with ticketing.",
      bullets: ["Quiet approaches", "Direct concourse access", "App-integrated ferries"],
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path d="M3 18c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2M12 3v4M5 8h14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Modes at a Glance</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <article key={c.title} className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
                {c.icon}
              </div>
              <h4 className="font-semibold text-gray-900">{c.title}</h4>
            </div>
            <p className="mt-2 text-sm text-gray-700">{c.blurb}</p>
            <ul className="mt-2 list-disc list-inside marker:text-emerald-600 text-sm text-gray-700 space-y-1">
              {c.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
