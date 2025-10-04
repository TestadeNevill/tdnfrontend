import { Link } from "react-router-dom";
import ModeInfographic from "../../components/ModeInfographic.jsx";
import NYCSubsurfaceCallout from "../../components/NYCSubsurfaceCallout.jsx";


export default function Transshipment() {
  return (
    <section className="min-h-screen bg-white px-4 md:px-10 pt-4 pb-20 max-w-5xl mx-auto text-gray-800 text-lg leading-relaxed space-y-12">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-4xl font-bold text-green-800">
          Transshipment & the City: Building the Hubs that Move People, Goods, and Data
        </h1>
        <p className="text-sm text-gray-500">By Testa DeNevill · October 2025</p>
      </header>

      {/* Hero */}
      <img
        src="/assets/transshipment6.png"
        alt="Urban transshipment hub concept"
        className="w-full h-auto object-contain rounded-lg shadow-md"
        onError={(e) => {
          e.currentTarget.src =
            "https://via.placeholder.com/1200x630?text=Transshipment+%E2%80%94+Urban+Hubs";
        }}
      />

      {/* Key takeaways */}
      <aside className="rounded-xl border border-green-100 bg-green-50 p-5 text-base leading-relaxed">
        <p className="font-semibold text-green-900">Key takeaways</p>
        <ul className="mt-2 list-disc list-inside marker:text-green-700 space-y-1 text-green-900/90">
          <li>Transshipment hubs knit together rail, road, air, and water to shrink dwell time and last-mile costs.</li>
          <li>Real value is created by the <em>system</em>: site design + energy + digital control + zoning alignment.</li>
          <li>Business models blend throughput fees, value-add logistics, grid services (via BESS), and real-estate uplift.</li>
        </ul>
      </aside>

      {/* Intro (your original paragraph set, expanded & cleaned) */}
      <div className="space-y-6">
        <p>
          In the evolving landscape of urban development, <strong>transshipment</strong>—the transfer of goods between
          modes at high-efficiency interchange points—has become a cornerstone of building cities that are efficient,
          sustainable, and resilient.
        </p>
        <p>
          As urban populations grow and demand intensifies, incorporating transshipment hubs into city planning is no
          longer optional—it’s essential. These hubs streamline logistics, reduce congestion, and cut carbon by
          consolidating flows and optimizing how goods move through dense cores.
        </p>
        <p>
          Acting as vital logistical nodes, well-designed hubs enable smooth transfer across rail, road, air, and water.
          They let cities manage supply chains intelligently while adapting to space constraints, regulation, and
          community context common in urban cores.
        </p>
        <p>
          Located strategically, transshipment hubs can unlock faster distribution, catalyze local business growth, and
          raise livability. Consider underutilized corridors and subsurface space—like legacy utility galleries or rail
          spurs—repurposed to move freight, waste, and even power. Streets can decongest, curb space can be reclaimed,
          and public realm can expand. The ability to move people and goods swiftly and cleanly is foundational to any
          modern city—and <strong>transshipment</strong> is a prime lever to get there.
        </p>
      </div>

      {/* Why it matters */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Why Transshipment Matters</h2>
        <ul className="list-disc list-inside marker:text-green-700 space-y-2">
          <li>
            <strong>Cost & time:</strong> Cross-docking and mode-matching reduce dwell times and cut redundant trips,
            lowering total logistics cost per delivered unit.
          </li>
          <li>
            <strong>Air quality & safety:</strong> Fewer large trucks in the core improve neighborhood air quality,
            noise, and collision risk—key for equitable outcomes.
          </li>
          <li>
            <strong>Resilience:</strong> Multi-modal redundancy protects against single-point failures (e.g., highway
            closures) and supports disaster response.
          </li>
          <li>
            <strong>Economic development:</strong> Hubs anchor clusters—repair, light manufacturing, parcel sortation,
            and retail—generating jobs and tax base.
          </li>
        </ul>
      </section>

      {/* Anatomy of a city-scale hub */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Anatomy of a City-Scale Transshipment Hub</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <ul className="list-disc list-inside marker:text-green-700 space-y-2">
            <li>
              <strong>Modal interface:</strong> Rail spur siding, truck courts, micromobility bays, drone pads, and
              (where relevant) waterfront/piers.
            </li>
            <li>
              <strong>Cross-dock & sortation:</strong> Fast in-and-out flow with smart conveyors, barcode/RFID, and
              temperature-controlled zones.
            </li>
            <li>
              <strong>Digital OS:</strong> TMS/WMS/RTLS integration, curb-slot booking, and a live “digital twin” for
              capacity, queues, and ETA prediction.
            </li>
          </ul>
          <ul className="list-disc list-inside marker:text-green-700 space-y-2">
            <li>
              <strong>Energy platform:</strong> Solar canopies + BESS for peak-shave, resiliency, and high-power
              truck/van charging (MCS/CCS).
            </li>
            <li>
              <strong>Urban design:</strong> Sound/air buffers, landscape edges, and safe bike/ped routing; thoughtful
              lighting and wayfinding.
            </li>
            <li>
              <strong>Compliance:</strong> Fire/life safety, hazmat handling (if any), security zones, and neighborhood
              operating hours.
            </li>
          </ul>
        </div>
      </section>

      {/* Site typologies & use cases */}
      <ModeInfographic />
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Site Typologies & Use Cases</h2>
        <ul className="list-disc list-inside marker:text-green-700 space-y-2">
          <li>
            <strong>Rail-adjacent brownfields:</strong> Reactivate spurs for bulk-to-parcel conversion and regional
            consolidation.
          </li>
          <li>
            <strong>Waterfront piers:</strong> Short-sea shipping and barge-to-truck for construction materials and
            waste flows.
          </li>
          <li>
            <strong>Highway interchanges:</strong> Regional cross-dock with high-power charging for drayage and last
            mile vans.
          </li>
          <li>
            <strong>Subsurface reuse:</strong> Legacy tunnels/utilidors repurposed for utility logistics, waste vacuum
            systems, and small-parcel movement off-street.
          </li>
          <li>
            <strong>Rooftop/upper-level microhubs:</strong> Drone pads/eVTOL interconnects at major transit or mixed-use
            nodes (integrated with vertiports).
          </li>
        </ul>
      </section>

      {/* Digital layer */}
      <NYCSubsurfaceCallout />
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">The Digital Layer: From Curb to Cloud</h2>
        <ul className="list-disc list-inside marker:text-green-700 space-y-2">
          <li>
            <strong>Slotting & curb management:</strong> Dynamic curb allocation prevents double-parking and idling.
          </li>
          <li>
            <strong>Predictive ETAs:</strong> Telemetry + historical traffic to right-size staffing and dock assignments.
          </li>
          <li>
            <strong>Digital twin:</strong> Simulate throughput, emissions, and queueing before you build; then monitor in
            real time to tune ops.
          </li>
          <li>
            <strong>Open standards:</strong> APIs for carriers, TSPs, and city data portals to keep the ecosystem
            interoperable.
          </li>
        </ul>
      </section>

      {/* Energy & electrification */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Electrification & Storage: The Hub as a Power Asset</h2>
        <ul className="list-disc list-inside marker:text-green-700 space-y-2">
          <li>
            <strong>High-power charging:</strong> Plan for megawatt-class chargers for trucks + dense Level-2/fast DC
            for vans and bikes.
          </li>
          <li>
            <strong>BESS on site:</strong> Time-of-use arbitrage, peak management, backup power, and grid services
            revenue (where market rules allow).
          </li>
          <li>
            <strong>PV canopies & microgrids:</strong> Shade + generation; islanding for resilience during outages.
          </li>
          <li>
            <strong>Thermal management:</strong> Keep batteries and refrigerated zones efficient with smart HVAC
            integration.
          </li>
        </ul>
      </section>

      {/* Financial model */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">The Financial Opportunity</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="font-semibold text-gray-900">Revenue streams</p>
            <ul className="list-disc list-inside marker:text-green-700 space-y-2">
              <li>Throughput fees ($/ton, $/parcel) and short-term storage.</li>
              <li>Value-add services (kitting, labeling, light assembly, returns).</li>
              <li>Charging & energy (retail kWh, demand response, ancillary services via BESS).</li>
              <li>Leases & concessions (retail, food, repair, data services).</li>
              <li>Potential carbon credits/CSR partnerships for verified emissions reductions.</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-900">Costs & capital</p>
            <ul className="list-disc list-inside marker:text-green-700 space-y-2">
              <li>Site control (lease/option), entitlements, environmental cleanup if needed.</li>
              <li>Core works: cross-dock, automation, safety systems, landscape buffers.</li>
              <li>Interconnection, PV/BESS, high-power chargers, and controls platform.</li>
              <li>Opex: staffing, maintenance, energy, software, security.</li>
            </ul>
          </div>
        </div>
        <p>
          Funding stacks may blend private equity, project finance, and public tools (infrastructure grants, tax credits
          for storage/solar, and district financing where available). Sensitivities: throughput volumes, dwell-time
          improvements, energy prices, and grid program participation.
        </p>
      </section>

      {/* Policy & community */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Zoning, Policy & Community Benefits</h2>
        <ul className="list-disc list-inside marker:text-green-700 space-y-2">
          <li>Align land use with logistics needs; streamline permits for charging & storage.</li>
          <li>Buffer zones, hours of operation, and designated truck routing to protect neighborhoods.</li>
          <li>Hire-local and training programs; small-business vendor space to share uplift.</li>
          <li>Public-realm upgrades: safer crossings, trees, lighting, and noise mitigation.</li>
        </ul>
      </section>

      {/* Implementation roadmap */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Implementation Roadmap (12–24 Months)</h2>
        <ol className="list-decimal list-inside marker:text-green-700 space-y-2">
          <li>
            <strong>Discovery & Mapping:</strong> Freight desire lines, curb heatmaps, rail/water assets, and grid
            capacity overlays.
          </li>
          <li>
            <strong>Feasibility & Site Control:</strong> Concept layouts, energy studies, capex/opex, and LOIs/options.
          </li>
          <li>
            <strong>Entitlements & Stakeholders:</strong> Zoning/permitting, utility interconnect, community benefits.
          </li>
          <li>
            <strong>Design-Build & Procurement:</strong> Cross-dock systems, chargers/BESS, software stack, safety.
          </li>
          <li>
            <strong>Pilot & Scale:</strong> Start with targeted flows (e.g., parcels or construction materials), measure,
            then expand to full program.
          </li>
        </ol>
      </section>

      {/* KPIs */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Metrics that Matter</h2>
        <ul className="list-disc list-inside marker:text-green-700 space-y-2">
          <li>Dwell time per mode/vehicle; cross-dock cycle time; on-time performance.</li>
          <li>Truck VMT reduced in core; emissions avoided (CO₂e, NOₓ, PM).</li>
          <li>Energy use per processed unit; charging uptime; BESS revenue participation.</li>
          <li>Community indicators: noise, complaint rates, job creation, local vendor spend.</li>
        </ul>
      </section>

      {/* Back link */}
      <Link to="/blog" className="text-green-700 hover:underline text-sm block">
        ← Back to Blog
      </Link>
    </section>
  );
}
