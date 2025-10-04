import { Link } from "react-router-dom";

export default function EVTOL() {
  return (
    <section className="min-h-screen bg-white px-4 md:px-10 pt-4 pb-20 max-w-5xl mx-auto text-gray-800 text-lg leading-relaxed space-y-12">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold text-green-800">
          eVTOL and the Future of Cities: Building the Infrastructure for Urban Air Mobility
        </h1>
        <p className="text-sm text-gray-500">By Testa DeNevill · October 2025</p>
      </header>

      <img
        src="/assets/EVTOL DTLA.png"
        alt="Urban air mobility vertiport concept"
        className="w-full h-auto object-contain rounded-lg shadow-md"
        onError={(e) => {
          e.currentTarget.src = "https://via.placeholder.com/1200x630?text=eVTOL+%26+Urban+Air+Mobility";
        }}
      />

      <div className="space-y-6">
        <p>
          Los Angeles, like many global megacities, is defined by its relationship with mobility. With more than
          <strong> 95 hours per year</strong> lost to traffic per driver, the region bleeds an estimated
          <strong> $19 billion</strong> annually in lost productivity. Despite public transit expansion and the rise of
          ridesharing, congestion continues to erode efficiency, quality of life, and economic opportunity.
        </p>

        <p>
          A new mode of travel, however, is poised to change the equation: electric vertical takeoff and landing aircraft
          (<strong>eVTOLs</strong>). These all-electric air taxis promise to transform how cities function—offering faster,
          quieter, and more sustainable transportation for both residents and businesses. But their success hinges on
          something far less glamorous than the aircraft themselves: <strong>infrastructure</strong>.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900">Why eVTOL Matters</h2>
        <ul className="list-disc list-inside marker:text-green-700 space-y-2">
          <li>
            A trip from <strong>LAX to Downtown LA</strong>, which can take <strong>60–90 minutes</strong> by car, could
            shrink to <strong>~10 minutes</strong> by eVTOL.
          </li>
          <li>
            Operating costs are projected at <strong>$3–6 per passenger mile</strong>, competitive with premium rideshare.
          </li>
          <li>
            Next-gen propulsion systems produce up to <strong>100× less noise</strong> than helicopters, enabling
            integration into dense neighborhoods.
          </li>
        </ul>
        <p>
          These numbers highlight why cities that embrace air mobility stand to capture significant economic and lifestyle
          benefits. But vehicles alone won’t solve congestion. The real challenge lies in designing the network that
          supports them.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900">The Case for Vertiports</h2>
        <p>
          To unlock the promise of eVTOL, cities need <strong>vertiports</strong>—takeoff and landing hubs designed for
          high-volume, safe, and efficient operations. Unlike airports, vertiports must be woven directly into the urban
          fabric: rooftops, parking garages, and underutilized parcels become critical nodes in a new transportation grid.
        </p>
        <div>
          <p className="font-semibold text-gray-900">Key elements:</p>
          <ul className="list-disc list-inside marker:text-green-700 space-y-2">
            <li>
              <strong>Vertiport Design & Construction:</strong> Elevated pads and rooftops adapted for frequent ops, with
              right-sized passenger amenities.
            </li>
            <li>
              <strong>Electrification & Grid Integration:</strong> High-capacity charging (multi-MW) per site, tightly
              coordinated with utilities.
            </li>
            <li>
              <strong>Airspace Integration:</strong> Safe navigation in busy urban skies, harmonized with commercial
              aircraft, helicopters, and drones.
            </li>
            <li>
              <strong>Zoning & Community Planning:</strong> Enhancing accessibility while safeguarding nearby communities.
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900">The Financial Opportunity</h2>
        <p>
          eVTOL infrastructure is a frontier for both technology and investment.
        </p>
        <ul className="list-disc list-inside marker:text-green-700 space-y-2">
          <li>
            <strong>Vertiport Economics:</strong> Each well-located site could generate <strong>$5–10M/year</strong> from
            passengers, partnerships, and adjacent retail.
          </li>
          <li>
            <strong>Real Estate Value:</strong> Proximity to vertiports may command premiums, similar to subway or airport
            adjacency.
          </li>
          <li>
            <strong>Electrification as a Business:</strong> High-speed aviation charging opens new utility and private-sector
            revenue streams.
          </li>
        </ul>
        <p>
          Globally, the urban air mobility market is projected to reach <strong>$1T by 2040</strong>, with infrastructure
          accounting for roughly <strong>20–30%</strong> of the value chain. Early movers on vertiport development will be
          positioned at the center of this wave.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900">Transforming Neighborhoods and Business</h2>
        <ul className="list-disc list-inside marker:text-green-700 space-y-2">
          <li>
            <strong>Neighborhoods:</strong> Parking structures and rooftops repurposed as vertiports can anchor new hubs of
            activity and commerce.
          </li>
          <li>
            <strong>Businesses:</strong> Professionals reclaim hours per day, reshaping meetings, logistics, and client work.
          </li>
          <li>
            <strong>Healthcare:</strong> Critical care and organ transport bypass congestion—saving lives.
          </li>
          <li>
            <strong>Logistics & Tourism:</strong> Same-day deliveries, airport shuttles, and city-to-city hops redefine
            travel and supply chains.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900">Cities of the Future</h2>
        <p>
          The future of cities will be defined by how seamlessly air mobility integrates with ground life. A three-dimensional
          grid emerges—cars on streets, drones in low airspace, eVTOLs above—coordinated by digital traffic management.
          This won’t happen overnight, but as vertiports rise across major metros, neighborhoods will evolve around them,
          much like subways and highways reshaped cities in the 20th century.
        </p>
        <p>
          For cities that embrace this shift early, the reward is clear: faster, cleaner, more connected, and more
          prosperous communities.
        </p>
      </div>

      <Link to="/blog" className="text-green-700 hover:underline text-sm block">
        ← Back to Blog
      </Link>
    </section>
  );
}
