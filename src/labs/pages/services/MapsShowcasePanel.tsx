import { useState } from "react";
import { EnergySiteMap } from "./maps/EnergySiteMap";
import { CREZoningMap } from "./maps/CREZoningMap";
import { TelecomSiteMap } from "./maps/TelecomSiteMap";
import { TransitAQIMap } from "./maps/TransitAQIMap";
import { FieldOpsMap } from "./maps/FieldOpsMap";

const TABS = [
  {
    id: "energy",
    label: "Energy Sites",
    badge: "Live OSM",
    sub: "Renewable site screener — substation proximity, solar resource, land use",
  },
  {
    id: "cre",
    label: "CRE & Zoning",
    badge: "Live OSM",
    sub: "Commercial land use zones, amenity counts, any city",
  },
  {
    id: "telecom",
    label: "Telecom",
    badge: "Live OSM",
    sub: "Communication tower coverage map — site acquisition workflow",
  },
  {
    id: "transit",
    label: "Transit & AQI",
    badge: "Live API",
    sub: "OpenAQ air quality sensors fused with real transit stops",
  },
  {
    id: "field",
    label: "Field Assets",
    badge: "Configurable",
    sub: "Asset fleet map — status filters, detail panel, nearest-asset locator",
  },
] as const;

type TabId = typeof TABS[number]["id"];

export function MapsShowcasePanel() {
  const [activeTab, setActiveTab] = useState<TabId>("energy");
  const active = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="space-y-5">
      <div>
        <p className="max-w-3xl text-base leading-relaxed text-labs-textMuted">
          Maps for any business or industry — from a simple "find us near you" widget to
          multi-layer infrastructure intelligence dashboards. Five live demos below, each using a
          different data source and component configuration. Every pattern is production-ready and
          fully customizable.
        </p>
      </div>

      {/* Tab nav */}
      <div
        role="tablist"
        aria-label="Map demos"
        className="flex flex-wrap gap-1.5 border-b border-labs-border pb-3"
      >
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={[
                "flex flex-col rounded-lg border px-3 py-2 text-left transition-colors",
                isActive
                  ? "border-labs-accent/40 bg-labs-accent/10 text-labs-text"
                  : "border-labs-border bg-white/80 text-labs-textMuted hover:border-labs-accent/20 hover:bg-labs-panel2",
              ].join(" ")}
            >
              <span className="flex items-center gap-1.5 text-sm font-semibold text-labs-text">
                {tab.label}
                <span className="rounded-full border border-labs-border bg-labs-panel2 px-1.5 py-0 text-[9px] font-labsMono uppercase tracking-wider text-labs-textMuted">
                  {tab.badge}
                </span>
              </span>
              <span className="mt-0.5 text-xs leading-snug text-labs-textMuted">{tab.sub}</span>
            </button>
          );
        })}
      </div>

      {/* Active demo */}
      <div role="tabpanel" className="animate-[fadeIn_0.3s_ease-out]" key={activeTab}>
        {activeTab === "energy"  && <EnergySiteMap />}
        {activeTab === "cre"     && <CREZoningMap />}
        {activeTab === "telecom" && <TelecomSiteMap />}
        {activeTab === "transit" && <TransitAQIMap />}
        {activeTab === "field"   && <FieldOpsMap />}
      </div>
    </div>
  );
}
