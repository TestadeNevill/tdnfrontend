import { getServiceById } from "../services/catalog";
import { LabsPanel } from "./LabsPanel";

interface LabsServiceCarouselProps {
  activeId: string;
}

export function LabsServiceCarousel({ activeId }: LabsServiceCarouselProps) {
  const service = getServiceById(activeId);
  if (service == null) return null;

  const Panel = service.panel;

  return (
    <LabsPanel key={activeId} className="animate-[fadeIn_0.35s_ease-out]">
      <Panel />
    </LabsPanel>
  );
}
