"use client";

import { assessRisk } from "@/lib/risk-engine";
import { buildAIUnavailableContent } from "@/lib/fallback-guidance";
import type { AssessmentRequestPayload, SymptomAssessmentResult } from "@/types/assessment";

/**
 * Client-side wrapper around POST /api/symptom-assessment.
 *
 * If the request itself fails (offline, network error, non-JSON response),
 * we still classify risk locally — lib/risk-engine.ts is a pure function
 * safe to run in the browser — so even a total network failure can't hide
 * a critical red flag from the user.
 */
export async function requestSymptomAssessment(
  payload: AssessmentRequestPayload
): Promise<SymptomAssessmentResult> {
  try {
    const response = await fetch("/api/symptom-assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = (await response.json()) as SymptomAssessmentResult;
    if (!data || !data.risk || !data.content) {
      throw new Error("Malformed response from assessment endpoint");
    }
    return data;
  } catch (err) {
    console.error("[symptom-assessment-service] Falling back to local risk classification:", err);
    const risk = assessRisk(payload.symptomText, payload.structured);
    return {
      risk,
      content: buildAIUnavailableContent(risk.riskLevel),
      source: "fallback-error",
    };
  }
}
