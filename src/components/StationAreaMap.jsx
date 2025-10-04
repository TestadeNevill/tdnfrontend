// src/components/StationAreaMap.jsx
export default function StationAreaMap() {
  return (
    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
      <h3 className="text-xl font-semibold text-emerald-900">Station Area Concept (Not to Scale)</h3>
      <p className="text-emerald-900/90 text-sm mt-1">
        A people-first hub with clear links between modes, retail edges, and a great public realm.
      </p>

      <svg viewBox="0 0 860 480" className="mt-4 w-full h-auto rounded-md bg-white border border-emerald-200">
        {/* Public plaza */}
        <rect x="20" y="20" width="820" height="120" rx="10" fill="#F0FDF4" stroke="#10B981" />
        <text x="30" y="50" fontSize="14" fill="#065F46">Public Realm (plaza • shade • seating • secure bike)</text>

        {/* Concourse */}
        <rect x="60" y="160" width="360" height="120" rx="10" fill="#FFFFFF" stroke="#10B981" />
        <text x="70" y="188" fontSize="14" fill="#065F46">Concourse (tickets • wayfinding • retail/services)</text>

        {/* Bus plaza */}
        <rect x="450" y="160" width="180" height="120" rx="10" fill="#ECFEF5" stroke="#10B981" />
        <text x="460" y="188" fontSize="14" fill="#065F46">Bus / BRT Plaza</text>

        {/* Micromobility hub */}
        <rect x="650" y="160" width="190" height="120" rx="10" fill="#FFFFFF" stroke="#10B981" />
        <text x="660" y="188" fontSize="14" fill="#065F46">Micromobility Hub</text>

        {/* Rail platforms */}
        <rect x="60" y="300" width="520" height="60" rx="8" fill="#F0FDF4" stroke="#10B981" />
        <text x="70" y="335" fontSize="14" fill="#065F46">Rail Platforms (clockface scheduling • level boarding)</text>

        {/* Vertiport access (roof/adjacent) */}
        <rect x="600" y="300" width="240" height="60" rx="8" fill="#ECFEF5" stroke="#10B981" />
        <text x="610" y="335" fontSize="14" fill="#065F46">Vertiport Access (vertical circulation)</text>

        {/* Arrows / connectors */}
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#10B981" />
          </marker>
        </defs>

        <line x1="280" y1="140" x2="280" y2="160" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrow)" />
        <line x1="420" y1="220" x2="450" y2="220" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrow)" />
        <line x1="630" y1="220" x2="650" y2="220" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrow)" />
        <line x1="260" y1="280" x2="260" y2="300" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrow)" />
        <line x1="780" y1="280" x2="780" y2="300" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrow)" />

        {/* Legend */}
        <circle cx="700" cy="60" r="5" fill="#10B981" />
        <text x="712" y="64" fontSize="12" fill="#065F46">Primary flows</text>
        <rect x="690" y="80" width="12" height="12" fill="#FFFFFF" stroke="#10B981" />
        <text x="712" y="90" fontSize="12" fill="#065F46">Interior / services</text>
        <rect x="690" y="100" width="12" height="12" fill="#ECFEF5" stroke="#10B981" />
        <text x="712" y="110" fontSize="12" fill="#065F46">Transit interfaces</text>
        <rect x="690" y="120" width="12" height="12" fill="#F0FDF4" stroke="#10B981" />
        <text x="712" y="130" fontSize="12" fill="#065F46">Public realm</text>
      </svg>

      <ul className="mt-4 text-emerald-900/90 text-sm space-y-2">
        <li><span className="font-semibold">Quick wins:</span> wayfinding + curb management before big capex.</li>
        <li><span className="font-semibold">Universal access:</span> redundant elevators, tactile paths, hearing loops.</li>
        <li><span className="font-semibold">Energy:</span> PV canopies + BESS for resilience and operations.</li>
      </ul>
    </div>
  );
}
