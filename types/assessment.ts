/**
 * Step 3 — AI Symptom Assessment types.
 *
 * Architecture: the deterministic risk engine (lib/risk-engine.ts) always
 * decides `riskLevel`. The AI (or, when unavailable, the template fallback
 * in lib/fallback-guidance.ts) only ever *explains* that level — it never
 * sets or downgrades it. See app/api/symptom-assessment/route.ts.
 */

export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export type Duration =
  | "Less than 1 day"
  | "1–3 days"
  | "4–7 days"
  | "More than 1 week"
  | "More than 1 month"
  | "";

export type Severity = "Mild" | "Moderate" | "Severe" | "";

export interface RedFlagMatch {
  id: string;
  label: string;
}

/** Output of the deterministic safety layer. Never produced by the AI. */
export interface RiskEngineResult {
  riskLevel: RiskLevel;
  matchedRedFlags: RedFlagMatch[];
  emergencyRecommended: boolean;
}

/** The explanatory content — from the AI when available, otherwise templated. */
export interface AIAssessmentContent {
  summary: string;
  possibleCauses: string[];
  immediateSteps: string[];
  thingsToAvoid: string[];
  whenToSeekCare: string[];
  recommendedSpecialist: string;
  riskExplanation: string;
}

export type AssessmentSource = "ai" | "demo" | "fallback-error";

export interface SymptomAssessmentResult {
  risk: RiskEngineResult;
  content: AIAssessmentContent;
  source: AssessmentSource;
}

export interface ProfileContext {
  age: number | null;
  allergies: string[];
  conditions: string[];
  medications: string[];
}

export interface StructuredSymptomInput {
  symptoms: string[];
  duration: Duration;
  severity: Severity;
}

export interface AssessmentRequestPayload {
  symptomText: string;
  structured: StructuredSymptomInput;
  profileContext: ProfileContext;
}

export interface AssessmentHistoryRecord {
  id: string;
  symptomText: string;
  structured: StructuredSymptomInput;
  riskLevel: RiskLevel;
  summary: string;
  timestamp: string; // ISO 8601
}
