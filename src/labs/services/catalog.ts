import type { LabsServiceMeta } from "../types";
import { MapWorkbench } from "../maps/MapWorkbench";
import { ParksFinderPanel } from "../pages/services/ParksFinderPanel";
import { GoogleBusinessPanel } from "../pages/services/GoogleBusinessPanel";
import { AiAssistantPanel } from "../pages/services/AiAssistantPanel";
import { TransshipmentPanel } from "../pages/services/TransshipmentPanel";

export const LABS_SERVICES: LabsServiceMeta[] = [
  {
    id: "google-business",
    title: "Digital Solutions",
    description: "Websites $200+, Google Business, social, stores, AI & maps — tiered pricing",
    panel: GoogleBusinessPanel,
  },
  {
    id: "parks-finder",
    title: "Decision Map",
    description: "Park & neighborhood intelligence — presets, layers, match scores & civic context",
    panel: MapWorkbench,
  },
  {
    id: "parks-finder-classic",
    title: "Nearest Parks (Classic)",
    description: "Original nearest parks demo with photos, hours, and directions",
    panel: ParksFinderPanel,
  },
  {
    id: "ai-assistant",
    title: "AI Chat Assistant",
    description: "Custom AI assistants — live demo, capabilities & business use cases",
    panel: AiAssistantPanel,
  },
  {
    id: "transshipment",
    title: "Transshipment Logistics",
    description: "Animated hub schematic, multi-modal routes, event log",
    panel: TransshipmentPanel,
  },
];

export function getServiceById(id: string): LabsServiceMeta | undefined {
  return LABS_SERVICES.find((s) => s.id === id);
}
