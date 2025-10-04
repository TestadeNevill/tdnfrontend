// src/components/SolarStorageCompare.jsx
import React from "react";

export default function SolarStorageCompare() {
  const rows = [
    {
      label: "Owner / Operator",
      btm: "Site owner or ESCO/third-party under PPA/lease",
      community: "ProjectCo; utility or developer with subscriber admin",
      utility: "IPP/developer or utility; market-registered asset",
    },
    {
      label: "Revenue levers",
      btm: "Bill savings (demand charges, TOU arbitrage), DR programs, resilience value",
      community: "Subscriber bill credits, potential grid services (where allowed)",
      utility: "Energy & capacity (PPA/market), ancillary services, congestion relief",
    },
    {
      label: "Interconnection",
      btm: "Behind-the-meter at customer panel (may export under NEM where applicable)",
      community: "Distribution feeder (front-of-the-meter) near load",
      utility: "Distribution or transmission; queued through utility/ISO studies",
    },
    {
      label: "Typical contracts",
      btm: "PPA/lease/CapEx; DR enrollment; service agreements",
      community: "Subscriber agreements + utility credit tariff; site lease",
      utility: "PPA with utility/CCA or fully merchant/hedged in market",
    },
    {
      label: "Best-fit sites",
      btm: "Warehouses, schools, hospitals, campuses, fleets",
      community: "Underused land, brownfields, capped landfills, large roofs/parking",
      utility: "Utility-scale land with strong interconnection and minimal constraints",
    },
    {
      label: "Key risks",
      btm: "Tariff changes, demand pattern shifts, roof/structural limits",
      community: "Interconnection delays, subscriber churn, policy/tariff updates",
      utility: "Queue risk, basis/curtailment, price volatility, permitting/environmental",
    },
  ];

  const td = "px-3 py-2 align-top text-sm text-gray-700";
  const th = "px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-emerald-900";

  return (
    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
      <h3 className="text-xl font-semibold text-emerald-900">BTM vs. Community vs. Utility — Quick Compare</h3>
      <p className="text-emerald-900/90 text-sm mt-1">
        High-level differences across ownership, revenues, interconnection, and risks. (Programs vary by region.)
      </p>

      {/* Desktop table */}
      <div className="hidden md:block mt-4 overflow-x-auto">
        <table className="min-w-full border border-emerald-200 bg-white rounded-lg overflow-hidden">
          <thead className="bg-emerald-50">
            <tr>
              <th className={th}>Dimension</th>
              <th className={th}>Commercial Rooftop (BTM)</th>
              <th className={th}>Community Solar + Storage</th>
              <th className={th}>Utility-Scale (FTM)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              return (
                <tr key={r.label} className="border-t border-emerald-100">
                  <td className={`${td} font-medium text-gray-900`}>{r.label}</td>
                  <td className={td}>{r.btm}</td>
                  <td className={td}>{r.community}</td>
                  <td className={td}>{r.utility}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden mt-4 space-y-3">
        {rows.map((r) => {
          return (
            <div key={r.label} className="rounded-lg border border-emerald-200 bg-white p-3">
              <p className="text-xs font-semibold text-emerald-900 uppercase tracking-wide">{r.label}</p>
              <div className="mt-2 grid grid-cols-1 gap-2">
                <div>
                  <p className="text-xs font-semibold text-gray-900">BTM</p>
                  <p className="text-sm text-gray-700">{r.btm}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Community</p>
                  <p className="text-sm text-gray-700">{r.community}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Utility</p>
                  <p className="text-sm text-gray-700">{r.utility}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ul className="mt-4 text-emerald-900/90 text-sm list-disc list-inside">
        <li>Model with local tariffs, incentives, and interconnection rules.</li>
        <li>Include battery efficiency and degradation in cashflows.</li>
      </ul>
    </div>
  );
}
