import type { LabsServiceMeta } from "../types";
import { GoogleBusinessPanel } from "../pages/services/GoogleBusinessPanel";
import { ParksFinderPanel } from "../pages/services/ParksFinderPanel";
import { AiAssistantPanel } from "../pages/services/AiAssistantPanel";
import { TransshipmentPanel } from "../pages/services/TransshipmentPanel";

export const LABS_SERVICES: LabsServiceMeta[] = [
  {
    id: "google-business",
    title: "Google Business & Social",
    description: "GBP matrix, social cross-posting, AI reply preview",
    panel: GoogleBusinessPanel,
  },
  {
    id: "parks-finder",
    title: "Nearest Parks Finder",
    description: "Geolocation map, Overpass-backed lookup (or mock)",
    panel: ParksFinderPanel,
  },
  {
    id: "ai-assistant",
    title: "AI Chat Assistant",
    description: "Rotating use cases with live OpenAI replies (mock fallback offline)",
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
