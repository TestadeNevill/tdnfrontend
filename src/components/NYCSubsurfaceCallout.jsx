export default function NYCSubsurfaceCallout() {
  return (
    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
      <h3 className="text-xl font-semibold text-emerald-900">NYC Subsurface Reuse (Concept)</h3>
      <p className="text-emerald-900/90 text-sm mt-1">
        Reimagining under-street space for micro-parcel movement, utility logistics, and waste—keeping curbs clear.
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-[1fr,280px] items-start">
        {/* Diagram */}
        <svg viewBox="0 0 800 360" className="w-full h-auto rounded-lg bg-white border border-emerald-200">
          {/* Street level */}
          <rect x="20" y="40" width="760" height="60" rx="8" fill="#F0FDF4" stroke="#10B981" />
          <text x="40" y="78" fontSize="14" fill="#065F46">Street Level (bike/ped • dynamic curb • low-noise vans)</text>

          {/* Subsurface logistics */}
          <rect x="20" y="140" width="760" height="80" rx="8" fill="#FFFFFF" stroke="#10B981" />
          <text x="40" y="178" fontSize="14" fill="#065F46">Subsurface Logistics Tunnels (micro-parcel belts • AGV lanes)</text>

          {/* Utilities / vac waste */}
          <rect x="20" y="250" width="760" height="70" rx="8" fill="#ECFEF5" stroke="#10B981" />
          <text x="40" y="289" fontSize="14" fill="#065F46">Utilities & Waste (vacuum waste • utility galleries • fiber)</text>

          {/* Vertical connectors */}
          <path d="M780 100 v40" stroke="#10B981" strokeWidth="3" />
          <path d="M780 220 v30" stroke="#10B981" strokeWidth="3" />
          <circle cx="780" cy="100" r="4" fill="#10B981" />
          <circle cx="780" cy="220" r="4" fill="#10B981" />
          <circle cx="780" cy="250" r="4" fill="#10B981" />

          {/* Arrows to indicate flow */}
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#10B981" />
            </marker>
          </defs>
          <line x1="120" y1="70" x2="120" y2="140" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="220" y1="220" x2="220" y2="100" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="520" y1="180" x2="660" y2="180" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrow)" />

          {/* Legend dots */}
          <circle cx="680" cy="70" r="5" fill="#10B981" />
          <text x="690" y="74" fontSize="12" fill="#065F46">Curb slots</text>
          <circle cx="680" cy="180" r="5" fill="#10B981" />
          <text x="690" y="184" fontSize="12" fill="#065F46">Parcel belts / AGVs</text>
          <circle cx="680" cy="290" r="5" fill="#10B981" />
          <text x="690" y="294" fontSize="12" fill="#065F46">Vacuum waste / utilities</text>
        </svg>

        {/* Notes */}
        <ul className="text-emerald-900/90 text-sm space-y-2">
          <li className="flex gap-2">
            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-600" />
            <div>
              <span className="font-semibold">Street decongestion:</span> shift sorting/pickups off-curb with booked time slots and micro-hubs.
            </div>
          </li>
          <li className="flex gap-2">
            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-600" />
            <div>
              <span className="font-semibold">Subsurface belts/AGVs:</span> move small parcels between buildings and hubs without trucks.
            </div>
          </li>
          <li className="flex gap-2">
            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-600" />
            <div>
              <span className="font-semibold">Utilities & waste:</span> vacuum waste and shared utility galleries reduce surface conflicts.
            </div>
          </li>
          <li className="flex gap-2">
            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-600" />
            <div>
              <span className="font-semibold">Vertical connectors:</span> secure lifts/shafts link street microhubs with tunnels and utility galleries.
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
