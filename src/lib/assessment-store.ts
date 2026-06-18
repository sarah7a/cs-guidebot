import type { Field } from "./i18n";
import type { Roadmap } from "./gemini";

const KEY = "techpath-assessment";

export interface AssessmentResult {
  field: Field;
  score: number;
  total: number;
  wrongTopics: string[];
  roadmap?: Roadmap;
  lang: "en" | "ar";
}

export function saveAssessment(a: AssessmentResult) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(a));
}

export function loadAssessment(): AssessmentResult | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as AssessmentResult; } catch { return null; }
}

export function clearAssessment() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}