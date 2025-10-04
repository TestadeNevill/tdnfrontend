// src/pages/blog/TransitHubs.jsx
import { Link } from "react-router-dom";
import TransitModeInfographic from "../../components/TransitModeInfographic.jsx";
import StationAreaMap from "../../components/StationAreaMap.jsx";


export default function TransitHubs() {
  return (
    <section className="min-h-screen bg-white px-4 md:px-10 pt-4 pb-20 max-w-5xl mx-auto text-gray-800 text-lg leading-relaxed space-y-12">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-4xl font-bold text-green-800">
          Reimagining Transit Hubs: The Future of Connected Cities
        </h1>
        <p className="text-sm text-gray-500">By Testa DeNevill · October 2025</p>
      </header>

      {/* Hero image */}
      <img
        src="/assets/transithub4.png"
        alt="Next-generation transit hub concept"
        className="w-full h-auto object-contain rounded-lg shadow-md"
        onError={(e) => {
          e.currentTarget.src =
            "https://via.placeholder.com/1200x630?text=Transit+Hubs";
        }}
      />

      {/* Key takeaways */}
      <aside className="rounded-xl border border-green-100 bg-green-50 p-5 text-base leading-relaxed">
        <p className="font-semibold text-green-900">Key takeaways</p>
        <ul className="mt-2 list-disc list-inside marker:text-green-700 space-y-1 text-green-900/90">
          <li>Transit hubs are evolving from transfer points into mixed-use, people-first ecosystems.</li>
          <li>Multimodal integration (micromobility ↔ rail ↔ eVTOL ↔ maritime) reduces friction, time, and emissions.</li>
          <li>The digital backbone—real-time data, payments, and wayfinding—unlocks capacity without pouring concrete.</li>
        </ul>
      </aside>

      {/* Intro (expanded from your text) */}
      <div className="space-y-6">
        <p>
          Transportation touches nearly every aspect of our daily lives. Whether walking from your front door to your
          car, catching a train to the office, or biking to meet friends, we rely on an intricate web of mobility options.
          It’s imperative that our cities reflect this reality through intentional design, integrated systems, and efficient
          infrastructure. In a future where urban areas are more interconnected than ever, <strong>transit hubs </strong>
           will serve as the vital nerve centers—improving accessibility, reducing congestion, and enabling equitable
          movement for all.
        </p>
        <p>
          Historically, major hubs revolved around buses and trains. The future demands more. These nodes must evolve
          to include every mode—from micromobility like scooters and bikes to regional rail, high-speed services, and
          even Electric Vertical Take-Off and Landing (<strong>eVTOL</strong>) aircraft. Meanwhile, integrating maritime
          links transforms hubs into logistics gateways for people <em>and</em> goods. The result: not just transfer
          points, but dynamic zones of social exchange, economic activity, and digital infrastructure.
        </p>
        <p>
          Rethinking hub design with sustainability, adaptability, and community integration allows cities to support dense,
          mixed-use development while strengthening regional connectivity. By pushing the boundaries of architecture and
          systems engineering, we can reshape these spaces into high-performance ecosystems that streamline the flow of
          people, goods, and data—blueprints for future-forward cities worldwide.
        </p>
        <p>
          Tomorrow’s transit hub is more than infrastructure—it’s a living ecosystem, essential to the functionality,
          equity, and vibrancy of the smart, green city.
        </p>
      </div>

      {/* What a modern hub looks like */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">What a 21st-Century Hub Looks Like</h2>
        <ul className="list-disc list-inside marker:text-green-700 space-y-2">
          <li>
            <strong>Seamless modal interface:</strong> frictionless transfers among walking, bikes/scooters, local buses,
            rapid/commuter rail, and future eVTOL—with weather-protected links.
          </li>
          <li>
            <strong>People-first concourse:</strong> daylight, air, intuitive wayfinding, universal design, and safe
            circulation for all ages and abilities.
          </li>
          <li>
            <strong>Mixed-use edge:</strong> retail, services, co-working, and community rooms to make dwell time useful.
          </li>
          <li>
            <strong>Public realm:</strong> shade trees, plazas, secure bike parking, and traffic-calmed streets.
          </li>
        </ul>
      </section>
      <TransitModeInfographic />

      {/* Multimodal integration */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Multimodal Integration, For Real</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <ul className="list-disc list-inside marker:text-green-700 space-y-2">
            <li>
              <strong>Micromobility:</strong> safe bike/scooter lanes, ample racks/charging, and quick rentals tied to
              the transit card/app.
            </li>
            <li>
              <strong>Bus & BRT:</strong> off-board fare collection, level boarding, and bus-priority intersections.
            </li>
            <li>
              <strong>Rail:</strong> timed transfers with clockface schedules and platform assignments that don’t change daily.
            </li>
          </ul>
          <ul className="list-disc list-inside marker:text-green-700 space-y-2">
            <li>
              <strong>eVTOL / Vertiport:</strong> rooftop/adjacent pads with quiet approaches and direct vertical
              circulation to the concourse.
            </li>
            <li>
              <strong>Maritime links:</strong> ferry docks integrated with the ticketing app, useful for coastal cities.
            </li>
            <li>
              <strong>Universal access:</strong> redundant elevators/ramps, tactile guidance, hearing loops, and clear signage.
            </li>
          </ul>
        </div>
      </section>
      <StationAreaMap />

      {/* Digital backbone */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">The Digital Backbone</h2>
        <ul className="list-disc list-inside marker:text-green-700 space-y-2">
          <li>
            <strong>Real-time ops:</strong> live arrival boards, crowding indicators, and dynamic platform management.
          </li>
          <li>
            <strong>Integrated payments:</strong> one account for micromobility, bus/rail, ferry, and eVTOL—open loop and mobile-first.
          </li>
          <li>
            <strong>Wayfinding & safety:</strong> step-free routing, ADA options, lighting & CCTV with privacy-respecting design.
          </li>
          <li>
            <strong>Demand-responsive service:</strong> microtransit feeders that adjust with events, weather, and peak loads.
          </li>
        </ul>
      </section>

      {/* Sustainability & energy */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Sustainability at the Core</h2>
        <ul className="list-disc list-inside marker:text-green-700 space-y-2">
          <li>
            <strong>Electrification:</strong> EV bus bays, micromobility charging, and (where applicable) eVTOL ground power.
          </li>
          <li>
            <strong>On-site generation & storage:</strong> PV canopies + BESS for peak shaving and resilience.
          </li>
          <li>
            <strong>Water & materials:</strong> rain/greywater reuse, low-carbon structure, and durable, repairable finishes.
          </li>
          <li>
            <strong>Thermal comfort:</strong> shaded, naturally ventilated concourses to reduce cooling loads.
          </li>
        </ul>
      </section>

      {/* Economics & value capture */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Economics & Value Capture</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="font-semibold text-gray-900">Revenue levers</p>
            <ul className="list-disc list-inside marker:text-green-700 space-y-2">
              <li>Farebox + integrated mobility subscriptions.</li>
              <li>Retail & concessions, events, and advertising.</li>
              <li>Leases (co-working, clinics, civic counters) and sponsorships.</li>
              <li>Potential energy revenues (BESS/DR) where rules allow.</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Value capture around the hub</p>
            <ul className="list-disc list-inside marker:text-green-700 space-y-2">
              <li>TOD (transit-oriented development) with inclusionary housing.</li>
              <li>Air-rights, joint development, and ground leases.</li>
              <li>Public realm improvements tied to project phasing.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Implementation roadmap */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Implementation Roadmap (12–24 Months)</h2>
        <ol className="list-decimal list-inside marker:text-green-700 space-y-2">
          <li>
            <strong>Discovery:</strong> rider flows, heatmaps, access audits, and land control around the station area.
          </li>
          <li>
            <strong>Concept & Engagement:</strong> options for concourse, bus plaza, micromobility, and vertiport; community co-design.
          </li>
          <li>
            <strong>Entitlements & Utilities:</strong> permits, power studies, and interconnect for charging/storage.
          </li>
          <li>
            <strong>Detailed Design & Procurement:</strong> wayfinding, payments, lighting, safety, and landscape.
          </li>
          <li>
            <strong>Phased Delivery:</strong> quick-wins first (curb/wayfinding), then concourse upgrades, then rooftop/air links.
          </li>
        </ol>
      </section>

      {/* KPIs */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Metrics that Matter</h2>
        <ul className="list-disc list-inside marker:text-green-700 space-y-2">
          <li>Door-to-door travel time; reliable transfers under 4 minutes.</li>
          <li>Mode share shifts to transit/micromobility; reduced SOV trips.</li>
          <li>Accessibility scores (step-free paths, crowding, dwell time).</li>
          <li>Retail sales/footfall; safety incidents; emissions avoided.</li>
        </ul>
      </section>

      {/* Back link */}
      <Link to="/blog" className="text-green-700 hover:underline text-sm block">
        ← Back to Blog
      </Link>
    </section>
  );
}
