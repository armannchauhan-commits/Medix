import type { AIAssessmentContent, AssessmentRequestPayload, RiskEngineResult } from "@/types/assessment";

/**
 * Server-only AI service. Never imported from client components — only from
 * the API route handler (app/api/symptom-assessment/route.ts), which is the
 * one place the API key is read. The key is never sent to the browser.
 *
 * Provider-agnostic by design: point AI_PROVIDER_API_URL /
 * AI_PROVIDER_MODEL at whichever Messages-API-compatible provider you're
 * using. Defaults assume the Anthropic Messages API shape.
 */

const AI_TIMEOUT_MS = 15_000;

export class AIServiceError extends Error {}

function buildPrompt(payload: AssessmentRequestPayload, risk: RiskEngineResult): string {
  const { symptomText, structured, profileContext } = payload;

  const profileLines: string[] = [];
  if (profileContext.age !== null) profileLines.push(`Age: ${profileContext.age}`);
  if (profileContext.allergies.length) profileLines.push(`Known allergies: ${profileContext.allergies.join(", ")}`);
  if (profileContext.conditions.length) profileLines.push(`Existing conditions: ${profileContext.conditions.join(", ")}`);
  if (profileContext.medications.length) profileLines.push(`Current medications: ${profileContext.medications.join(", ")}`);

  return `You are a cautious health-information assistant inside a consumer wellness app called Medix. You are NOT a doctor and must never state a definitive diagnosis.

A deterministic safety system has already classified this case as risk level: ${risk.riskLevel}.
${risk.matchedRedFlags.length ? `It matched these warning patterns: ${risk.matchedRedFlags.map((f) => f.label).join("; ")}.` : "It did not match any emergency warning pattern."}
You must treat this risk level as fixed — do not contradict, downplay, or imply a different level in your response.

Patient-described symptoms: "${symptomText}"
${structured.symptoms.length ? `Listed symptoms: ${structured.symptoms.join(", ")}` : ""}
${structured.duration ? `Duration: ${structured.duration}` : ""}
${structured.severity ? `Self-reported severity: ${structured.severity}` : ""}
${profileLines.length ? `\nRelevant health profile:\n${profileLines.join("\n")}` : ""}

Respond with ONLY a JSON object (no markdown fences, no commentary) matching exactly this shape:
{
  "summary": "short, plain-language explanation of what this could mean, 1-3 sentences",
  "possibleCauses": ["possible explanation", "..."],
  "immediateSteps": ["safe, conservative self-care or next step", "..."],
  "thingsToAvoid": ["unsafe or unhelpful action to avoid", "..."],
  "whenToSeekCare": ["a warning sign that means they should seek care", "..."],
  "recommendedSpecialist": "a general type of professional, e.g. General Physician",
  "riskExplanation": "why this risk level fits, in plain language"
}

Rules:
- Never state a definitive diagnosis (e.g. "you have X"). Use phrasing like "this pattern can have several causes."
- Never recommend a specific prescription medication or dosage.
- Keep each array to 2-5 short items.
- If risk level is CRITICAL, immediateSteps and whenToSeekCare must clearly say to seek emergency care now.`;
}

/** Strips markdown code fences if the model wrapped its JSON in them despite instructions. */
function extractJson(raw: string): string {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  return (fenced ? fenced[1] : raw).trim();
}

function isValidContent(value: unknown): value is AIAssessmentContent {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.summary === "string" &&
    Array.isArray(v.possibleCauses) &&
    Array.isArray(v.immediateSteps) &&
    Array.isArray(v.thingsToAvoid) &&
    Array.isArray(v.whenToSeekCare) &&
    typeof v.recommendedSpecialist === "string" &&
    typeof v.riskExplanation === "string"
  );
}

/**
 * Calls the configured AI provider and returns validated structured content.
 * Throws AIServiceError on any failure (missing key, network error, timeout,
 * invalid JSON, or a response that doesn't match the required schema) — the
 * route handler is responsible for catching this and falling back safely.
 */
export async function generateAssessmentExplanation(
  payload: AssessmentRequestPayload,
  risk: RiskEngineResult
): Promise<AIAssessmentContent> {
  const apiKey = process.env.AI_PROVIDER_API_KEY;
  if (!apiKey) {
    throw new AIServiceError("AI_PROVIDER_API_KEY is not configured");
  }

  const apiUrl = process.env.AI_PROVIDER_API_URL || "https://api.anthropic.com/v1/messages";
  const model = process.env.AI_PROVIDER_MODEL || "claude-3-5-haiku-latest";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 1000,
        messages: [{ role: "user", content: buildPrompt(payload, risk) }],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new AIServiceError(`AI provider responded with status ${response.status}`);
    }

    const data = await response.json();
    const rawText: string | undefined = data?.content?.[0]?.text;
    if (!rawText) {
      throw new AIServiceError("AI provider returned no text content");
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(extractJson(rawText));
    } catch {
      throw new AIServiceError("AI provider returned invalid JSON");
    }

    if (!isValidContent(parsed)) {
      throw new AIServiceError("AI provider response did not match the required schema");
    }

    return parsed;
  } catch (err) {
    if (err instanceof AIServiceError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new AIServiceError("AI provider request timed out");
    }
    throw new AIServiceError(err instanceof Error ? err.message : "Unknown AI provider error");
  } finally {
    clearTimeout(timeout);
  }
}
