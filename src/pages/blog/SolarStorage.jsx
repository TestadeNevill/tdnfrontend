// src/pages/blog/SolarStorage.jsx
import { Link } from "react-router-dom";
import SolarStorageCompare from "../../components/SolarStorageCompare.jsx";


export default function SolarStorage() {
  return (
    <section className="min-h-screen bg-white px-4 md:px-10 pt-4 pb-20 max-w-5xl mx-auto text-gray-800 text-lg leading-relaxed space-y-12">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-4xl font-bold text-green-800">
          Solar + Storage at Scale: From Rooftops to Community & Utility Projects
        </h1>
        <p className="text-sm text-gray-500">By Testa DeNevill · October 2025</p>
      </header>

      {/* Hero image */}
      <img
        src="/assets/solarbatteryproject.png"
        alt="Solar arrays and battery energy storage"
        className="w-full h-auto object-contain rounded-lg shadow-md"
        onError={(e) => {
          e.currentTarget.src =
            "https://via.placeholder.com/1200x630?text=Solar+%2B+Battery+Storage";
        }}
      />

      {/* Key takeaways */}
      <aside className="rounded-xl border border-green-100 bg-green-50 p-5 text-base leading-relaxed">
        <p className="font-semibold text-green-900">Key takeaways</p>
        <ul className="mt-2 list-disc list-inside marker:text-green-700 space-y-1 text-green-900/90">
          <li>
            Solar + batteries reduce bills, cut emissions, and boost <em>resilience</em>—from single rooftops to city-scale projects.
          </li>
          <li>
            Value stacks differ by segment: behind-the-meter savings (commercial), bill credits (community), and market revenues (utility).
          </li>
          <li>
            AI + modern energy management systems (EMS) optimize when to charge/discharge, forecast demand/solar, and stabilize the grid.
          </li>
        </ul>
      </aside>

      {/* Scales & use cases */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Where Solar + Storage Fits</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <article className="rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900">Commercial Rooftop</h3>
            <p className="text-sm text-gray-700 mt-1">
              Behind-the-meter (BTM) systems on warehouses, schools, and offices.
              Batteries shave demand peaks, avoid time-of-use surcharges, and keep critical loads on during outages.
            </p>
            <ul className="list-disc list-inside marker:text-emerald-600 text-sm text-gray-700 mt-2 space-y-1">
              <li>Demand charge management</li>
              <li>Backup power for critical circuits</li>
              <li>EV fleet charging synergy</li>
            </ul>
          </article>

          <article className="rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900">Community Solar + Storage</h3>
            <p className="text-sm text-gray-700 mt-1">
              Shared off-site arrays with bill credits for subscribers (renters, small businesses).
              Co-located batteries firm output and support local feeders.
            </p>
            <ul className="list-disc list-inside marker:text-emerald-600 text-sm text-gray-700 mt-2 space-y-1">
              <li>Subscriber bill credits</li>
              <li>Local reliability and voltage support</li>
              <li>Equitable access to clean energy</li>
            </ul>
          </article>

          <article className="rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900">Utility-Scale Solar + BESS</h3>
            <p className="text-sm text-gray-700 mt-1">
              Front-of-the-meter plants delivering energy and grid services—shifting noon solar to evening peaks and
              providing reserves/ancillary services.
            </p>
            <ul className="list-disc list-inside marker:text-emerald-600 text-sm text-gray-700 mt-2 space-y-1">
              <li>Energy shifting & capacity</li>
              <li>Frequency/voltage support</li>
              <li>Congestion relief on transmission</li>
            </ul>
          </article>
        </div>
      </section>

      {/* Benefits: grid & community */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Benefits to Grid Stability & Communities</h2>
        <ul className="list-disc list-inside marker:text-green-700 space-y-2">
          <li>
            <strong>Peak reduction:</strong> Batteries discharge at the hottest, most expensive hours—lowering strain and
            reducing blackout risk.
          </li>
          <li>
            <strong>Resilience:</strong> Sites maintain critical operations during outages; community hubs can host
            cooling/charging centers.
          </li>
          <li>
            <strong>Clean energy integration:</strong> Storage aligns solar supply with evening demand, enabling higher
            renewable penetration.
          </li>
          <li>
            <strong>Local air quality:</strong> Cuts peaker plant run-time and truck generator use.
          </li>
          <li>
            <strong>Equity:</strong> Community subscriptions open access to those without suitable rooftops.
          </li>
        </ul>
      </section>

      {/* Process: how projects come together */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Project Process: From Site to Operation</h2>
        <ol className="list-decimal list-inside marker:text-green-700 space-y-2">
          <li>
            <strong>Discovery & Feasibility:</strong> Load/solar analysis, roof/land suitability, shading, structural review,
            interconnection screens, and initial financial model.
          </li>
          <li>
            <strong>Interconnection & Permitting:</strong> Utility studies, environmental checks, fire code compliance,
            zoning/entitlements (community/utility sites).
          </li>
          <li>
            <strong>Design & Procurement:</strong> PV layout (modules/inverters), BESS sizing (duration, C-rate), EMS,
            cybersecurity, and EPC selection.
          </li>
          <li>
            <strong>Financing & Contracts:</strong> Host agreements/leases, PPAs or subscription agreements, tax incentives
            where applicable, and insurance.
          </li>
          <li>
            <strong>Construction & Commissioning:</strong> Balance-of-system works, utility witness tests, EMS integration,
            safety drills.
          </li>
          <li>
            <strong>Operations & Optimization:</strong> Monitoring, warranty service, performance guarantees, firmware updates,
            and market participation (if FTM).
          </li>
        </ol>
      </section>

      {/* Financials */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Financial Model Overview</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="font-semibold text-gray-900">Commercial Rooftop (BTM)</p>
            <ul className="list-disc list-inside marker:text-emerald-600 text-sm text-gray-700 mt-2 space-y-1">
              <li>Bill savings: demand charges + time-of-use arbitrage</li>
              <li>Resiliency value (avoided downtime)</li>
              <li>Optional demand response incentives</li>
              <li>CAPEX vs. PPA/lease/ESCO models</li>
            </ul>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="font-semibold text-gray-900">Community Solar + Storage</p>
            <ul className="list-disc list-inside marker:text-emerald-600 text-sm text-gray-700 mt-2 space-y-1">
              <li>Subscriber bill credits (shared savings)</li>
              <li>Grid services where allowed (capacity/ancillary)</li>
              <li>Long-term offtake via subscriptions</li>
              <li>Site lease + local incentives (jurisdiction-dependent)</li>
            </ul>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <p className="font-semibold text-gray-900">Utility-Scale (FTM)</p>
            <ul className="list-disc list-inside marker:text-emerald-600 text-sm text-gray-700 mt-2 space-y-1">
              <li>Energy & capacity payments (PPA/market)</li>
              <li>Ancillary services (frequency/voltage)</li>
              <li>Congestion management / curtailment mitigation</li>
              <li>Tax incentives / grants where applicable</li>
            </ul>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Notes: Incentives, tariffs, and interconnection rules vary by region; always model with local utility programs,
          policy, and market rules. Include battery degradation, round-trip efficiency, and O&M in cashflows.
        </p>
      </section>

      <SolarStorageCompare />

      {/* AI & EMS */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">How AI Supercharges Operations</h2>
        <ul className="list-disc list-inside marker:text-green-700 space-y-2">
          <li>
            <strong>Forecasting:</strong> ML models predict solar production and site load, informing day-ahead charge/discharge plans.
          </li>
          <li>
            <strong>Optimization:</strong> EMS selects dispatch to minimize bills or maximize revenue across tariffs/markets.
          </li>
          <li>
            <strong>Demand Response:</strong> Automated event participation with customer constraints (comfort, process uptime).
          </li>
          <li>
            <strong>Fleet Coordination / VPP:</strong> Aggregates many small systems to act like one large resource.
          </li>
          <li>
            <strong>Predictive Maintenance:</strong> Detects anomalies in inverters/battery racks to reduce downtime.
          </li>
        </ul>
      </section>

      {/* Implementation timeline */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Implementation Timeline (Typical)</h2>
        <ol className="list-decimal list-inside marker:text-green-700 space-y-2">
          <li><strong>0–3 months:</strong> Feasibility, interconnection pre-screens, early design & pro formas.</li>
          <li><strong>3–9 months:</strong> Full studies, permits, procurement, finalize offtake/financing.</li>
          <li><strong>9–18 months:</strong> Construction, commissioning, market registration (if FTM).</li>
          <li><strong>18+ months:</strong> Operations, optimization, and capacity expansion where feasible.</li>
        </ol>
      </section>

      {/* KPIs */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Metrics that Matter</h2>
        <ul className="list-disc list-inside marker:text-green-700 space-y-2">
          <li>Peak demand reduction (kW) and energy shifted (kWh)</li>
          <li>Round-trip efficiency & battery health (SOH, throughput)</li>
          <li>Bill savings / market revenues vs. forecast</li>
          <li>Emissions avoided (CO₂e) and local outage hours mitigated</li>
        </ul>
      </section>

      {/* Back link */}
      <Link to="/blog" className="text-green-700 hover:underline text-sm block">
        ← Back to Blog
      </Link>
    </section>
  );
}
