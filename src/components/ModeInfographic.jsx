export default function ModeInfographic() {
  const cards = [
    {
      title: "Rail Interface",
      blurb: "Spurs + sidings for bulk-to-parcel transfer and regional consolidation.",
      bullets: ["Cross-dock to vans", "Container swap & kitting", "Quiet hours alignment"],
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path d="M4 16h16M6 16l-2 4m14-4l2 4M6 12h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: "Road / Curb",
      blurb: "Smart truck courts, curb slots, and micromobility bays to cut dwell time.",
      bullets: ["Dynamic curb booking", "Fast DC fleet charging", "Safe bike/ped edges"],
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path d="M3 16h18M6 16V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8M7 16l-2 4m12-4l2 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: "Air / Drone",
      blurb: "Roof microhubs + pads for drones and future eVTOL interconnects.",
      bullets: ["Secure flight corridor", "RFID/vision scan points", "Noise buffers"],
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path d="M7 7l10 10M17 7L7 17M12 3v4M12 17v4M3 12h4M17 12h4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: "Water / Pier",
      blurb: "Barge-to-truck for materials, waste, and short-sea shipping.",
      bullets: ["Roll-on/roll-off lanes", "Tide-safe edges", "Covered staging"],
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path d="M3 17c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2M4 13h16l-2-5h-6l-2-3H6l-2 8z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
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
