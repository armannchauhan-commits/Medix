import { NextRequest, NextResponse } from "next/server";
import { assessRisk, applySafetyOverride } from "@/lib/risk-engine";
import { buildFallbackAssessment, buildAIUnavailableContent } from "@/lib/fallback-guidance";
import { generateAssessmentExplanation } from "@/services/aiService";
import type { AssessmentRequestPayload, SymptomAssessmentResult, StructuredSymptomInput, ProfileContext } from "@/types/assessment";

/**
 * POST /api/symptom-assessment
 *
 * Pipeline: user input -> validation -> red-flag engine -> risk
 * classification -> AI explanation -> safety override -> safe result.
 * The risk engine's output is authoritative and computed BEFORE any AI
 * call. applySafetyOverride() is the explicit last gate: today the AI's
 * response schema has no risk field to override, so it's a no-op in
 * practice, but it's still called on every path below so the "AI can never
 * downgrade risk" guarantee is a real, testable step in the pipeline —
 * see lib/risk-engine.ts.
 */
export async function POST(request: NextRequest) {
  let body: Partial<AssessmentRequestPayload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const symptomText = typeof body.symptomText === "string" ? body.symptomText.trim() : "";
  if (!symptomText) {
    return NextResponse.json({ error: "Please describe your symptoms before requesting an assessment." }, { status: 400 });
  }

  const structured: StructuredSymptomInput = {
    symptoms: Array.isArray(body.structured?.symptoms) ? body.structured!.symptoms : [],
    duration: body.structured?.duration ?? "",
    severity: body.structured?.severity ?? "",
  };
  const profileContext: ProfileContext = {
    age: body.profileContext?.age ?? null,
    allergies: Array.isArray(body.profileContext?.allergies) ? body.profileContext!.allergies : [],
    conditions: Array.isArray(body.profileContext?.conditions) ? body.profileContext!.conditions : [],
    medications: Array.isArray(body.profileContext?.medications) ? body.profileContext!.medications : [],
  };

  // Step 1 — deterministic safety layer. This decides riskLevel; nothing below can change it.
  const risk = assessRisk(symptomText, structured);

  const hasApiKey = Boolean(process.env.AI_PROVIDER_API_KEY);

  // Step 2 — no key configured at all: run in Demo Mode using rich templated guidance.
  if (!hasApiKey) {
    const content = buildFallbackAssessment(risk.riskLevel, risk.matchedRedFlags, structured, symptomText);
    // Safety override — see lib/risk-engine.ts. No AI-suggested level exists here, so this is a no-op,
    // but it keeps the gate present on every code path rather than only the ones that call the AI.
    const finalRiskLevel = applySafetyOverride(risk.riskLevel);
    const result: SymptomAssessmentResult = { risk: { ...risk, riskLevel: finalRiskLevel }, content, source: "demo" };
    return NextResponse.json(result);
  }

  // Step 3 — a key IS configured: try the AI, but never let its failure hide the risk classification.
  try {
    const content = await generateAssessmentExplanation({ symptomText, structured, profileContext }, risk);
    // Safety override — the AI's schema has no riskLevel field (see services/aiService.ts), so there is
    // nothing for it to downgrade; this call makes that guarantee an explicit, testable step regardless.
    const finalRiskLevel = applySafetyOverride(risk.riskLevel);
    const result: SymptomAssessmentResult = { risk: { ...risk, riskLevel: finalRiskLevel }, content, source: "ai" };
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[symptom-assessment] AI call failed, falling back:", message);
    const content = buildAIUnavailableContent(risk.riskLevel);
    const finalRiskLevel = applySafetyOverride(risk.riskLevel);
    const result: SymptomAssessmentResult = { risk: { ...risk, riskLevel: finalRiskLevel }, content, source: "fallback-error" };
    // Still 200 — this is a handled, safe fallback, not a broken request.
    return NextResponse.json(result);
  }
}
