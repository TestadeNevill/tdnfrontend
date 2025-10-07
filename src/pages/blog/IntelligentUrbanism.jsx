// src/pages/blog/IntelligentUrbanism.jsx
import { Link } from "react-router-dom";
import IUPrinciplesChips from "../../components/IUPrinciplesChips.jsx";

export default function IntelligentUrbanism() {
  return (
    <section className="min-h-screen bg-white px-4 md:px-10 pt-4 pb-20 max-w-5xl mx-auto text-gray-800 text-lg leading-relaxed space-y-12">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-4xl font-bold text-green-800">
          The 10 Principles of Intelligent Urbanism
        </h1>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">By Testa DeNevill · October 2025</p>
    
        </div>
      </header>

      {/* Hero image */}
      <img
        src="/assets/PIU.jpg"
        alt="Intelligent urbanism — people-first street with integrated mobility and greenery"
        className="w-full h-auto object-contain rounded-lg shadow-md"
        onError={(e) => {
          e.currentTarget.src =
            "https://via.placeholder.com/1200x630?text=Intelligent+Urbanism";
        }}
      />

      {/* Key takeaways */}
      <aside className="rounded-xl border border-green-100 bg-green-50 p-5 text-base leading-relaxed">
        <p className="font-semibold text-green-900">Key takeaways</p>
        <ul className="mt-2 list-disc list-inside marker:text-green-700 space-y-1 text-green-900/90">
          <li>Ten practical lenses to balance ecology, culture, equity, and economy.</li>
          <li>Systems-first: connect land use, mobility, energy, water, and data.</li>
          <li>Measure impacts (time, emissions, safety, inclusion) and iterate.</li>
        </ul>
      </aside>

      {/* Intro */}
      <div className="space-y-6">
        <p>
          Cities work best when design, policy, and operations pull in the same direction. The{" "}
          <strong>Ten Principles of Intelligent Urbanism</strong> (TPIU) offer a shared vocabulary
          to align planners, engineers, communities, and investors—especially as we tackle climate
          resilience, affordability, mobility, and high-performing public space.
        </p>
      </div>

      {/* Quick-nav chips */}
      <IUPrinciplesChips />

      {/* The 10 principles */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">The Principles</h2>

        <ol className="list-decimal list-inside marker:text-green-700 space-y-4">
          <li id="iu-1">
            <strong>Balance with Nature</strong> — Protect and regenerate ecosystems. Use green/blue
            infrastructure (trees, wetlands, daylighted streams) to cool cities, manage stormwater,
            and enhance biodiversity.
          </li>
          <li id="iu-2">
            <strong>Balance with Culture & Heritage</strong> — Respect local form, materials, and memory.
            Adapt buildings and blocks so evolution doesn’t erase identity.
          </li>
          <li id="iu-3">
            <strong>Appropriate Technology</strong> — Choose tech that fits context and lifecycle.
            Reliable transit, right-sized automation, open standards, and easy maintenance beat flashy but fragile.
          </li>
          <li id="iu-4">
            <strong>Conviviality & Inclusion</strong> — Make streets and spaces invite interaction and belonging:
            benches, shade, safe crossings, lighting, programming, and universal design.
          </li>
          <li id="iu-5">
            <strong>Efficiency</strong> — Co-locate uses, shorten trips, and share infrastructure (energy, logistics,
            mobility). Spend less to achieve more across systems.
          </li>
          <li id="iu-6">
            <strong>Human Scale</strong> — Prioritize walking distance, active frontages, modest block sizes, and
            step-free access. Design for eyes-on-the-street safety and comfort.
          </li>
          <li id="iu-7">
            <strong>Opportunity Matrix (Equity)</strong> — Ensure access to housing, jobs, learning, care, and culture
            within a reasonable time budget. Direct investment where gaps are largest.
          </li>
          <li id="iu-8">
            <strong>Regional Integration</strong> — Plan hubs and corridors as a network: city ↔ region. Align land use
            with regional rail/bus, freight, ports, and airports.
          </li>
          <li id="iu-9">
            <strong>Balanced Movement</strong> — Build a hierarchy where walking, bikes, and transit lead; manage curb,
            truck, and freight intelligently; integrate future modes where they add value.
          </li>
          <li id="iu-10">
            <strong>Institutional Integrity</strong> — Transparent rules, predictable approvals, accountable delivery.
            Open data, clear performance contracts, and anti-corruption safeguards keep projects on track.
          </li>
        </ol>
      </section>

      {/* From principles to projects */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Turning Principles into Projects</h2>
        <ul className="list-disc list-inside marker:text-green-700 space-y-2">
          <li>
            <strong>Hubs & TOD:</strong> People-first stations with micromobility, bus/rail, and (where appropriate)
            vertiport links—co-located with mixed-use and affordable homes.
          </li>
          <li>
            <strong>Energy Districts:</strong> Rooftop PV, community solar, and battery storage; microgrids for
            resilience; EV and fleet charging.
          </li>
          <li>
            <strong>Logistics & Transshipment:</strong> Cross-dock microhubs, curb-slot booking, and clean last-mile
            to cut truck VMT and emissions.
          </li>
          <li>
            <strong>Public Realm Upgrades:</strong> Shade, trees, safe intersections, traffic calming, and inclusive amenities.
          </li>
        </ul>
      </section>

      {/* Process */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Process: A Practical Playbook</h2>
        <ol className="list-decimal list-inside marker:text-green-700 space-y-2">
          <li><strong>Diagnose:</strong> Map access gaps, crash hotspots, heat islands, flood risk, and energy/mobility demand.</li>
          <li><strong>Co-Design:</strong> Iterate concepts with communities, businesses, agencies, and operators.</li>
          <li><strong>Stage Investments:</strong> Quick wins first (wayfinding, curb management, shade trees), then heavy capex.</li>
          <li><strong>Deliver & Measure:</strong> Tie contracts to KPIs; publish dashboards; tune operations with data.</li>
        </ol>
      </section>

      {/* AI & Data layer */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">The AI & Data Layer</h2>
        <ul className="list-disc list-inside marker:text-green-700 space-y-2">
          <li><strong>Demand forecasting:</strong> Predict ridership, freight, and energy peaks to right-size service and capacity.</li>
          <li><strong>Optimization:</strong> Dynamic signal timing, curb allocation, and battery dispatch (solar → evening peaks).</li>
          <li><strong>Digital twins:</strong> Simulate before building; monitor and tune after deployment.</li>
          <li><strong>Equity tracking:</strong> Measure time savings by neighborhood/demographic—close the biggest gaps first.</li>
        </ul>
      </section>

      {/* KPIs */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Metrics that Matter</h2>
        <ul className="list-disc list-inside marker:text-green-700 space-y-2">
          <li>Door-to-door time to key needs (15–30-minute city targets).</li>
          <li>Mode share shifts; crash reductions; safe speeds achieved.</li>
          <li>Emissions avoided (CO₂e, NOₓ, PM) and tree canopy gained.</li>
          <li>Grid resilience: peak shaved (kW), energy shifted (kWh), outage hours mitigated.</li>
          <li>Inclusion: affordable homes near transit, small-business tenancy, local hiring.</li>
        </ul>
      </section>

      {/* Back link */}
      <Link to="/blog" className="text-green-700 hover:underline text-sm block">
        ← Back to Blog
      </Link>
    </section>
  );
}
