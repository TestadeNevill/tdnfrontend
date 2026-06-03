import { LABS_PROJECTS } from "./catalog";
import { LABS_SERVICES } from "./services/catalog";

export interface ContactSubjectOption {
  group: "Services" | "Projects" | "General";
  value: string;
}

export const CONTACT_SUBJECTS: ContactSubjectOption[] = [
  ...LABS_SERVICES.map((s) => ({ group: "Services" as const, value: s.title })),
  ...LABS_PROJECTS.map((p) => ({ group: "Projects" as const, value: p.title })),
  { group: "General", value: "General inquiry" },
  { group: "General", value: "Book a call — quick discussion" },
  { group: "General", value: "Book a video call — product walkthrough" },
];

export const INTENT_SUBJECT_MAP: Record<string, string> = {
  call: "Book a call — quick discussion",
  video: "Book a video call — product walkthrough",
  "learn-more": "General inquiry",
};

export function resolveContactSubject(
  subjectParam: string | null,
  intentParam: string | null,
): string {
  const knownValues = new Set(CONTACT_SUBJECTS.map((s) => s.value));
  if (subjectParam?.trim()) {
    const decoded = decodeURIComponent(subjectParam.trim());
    if (knownValues.has(decoded)) return decoded;
    return decoded;
  }
  if (intentParam && INTENT_SUBJECT_MAP[intentParam]) {
    return INTENT_SUBJECT_MAP[intentParam];
  }
  return "";
}
