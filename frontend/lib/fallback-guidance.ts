import type { AIAssessmentContent, RiskLevel, RedFlagMatch, StructuredSymptomInput } from "@/types/assessment";

/**
 * Template-based guidance used in two situations:
 *  1. "Demo Mode" — no AI API key configured, so the app runs entirely on
 *     the deterministic risk engine + these templates. This is what makes
 *     the three required demo scenarios work with zero external dependency.
 *  2. AI failure — a key IS configured but the call failed, timed out, or
 *     returned something we couldn't safely parse. Use
 *     buildAIUnavailableContent() instead, which is deliberately minimal.
 *
 * Neither path ever states a diagnosis, and both always defer to whatever
 * riskLevel the rule engine already decided.
 */

function truncate(text: string, max: number): string {
  const trimmed = text.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max).trim()}…` : trimmed;
}

const RISK_COPY: Record<RiskLevel, { summary: string; specialist: string }> = {
  LOW: {
    summary: "What you've described doesn't match any emergency warning signs Medix checks for. General self-care and monitoring is usually appropriate.",
    specialist: "General Physician",
  },
  MODERATE: {
    summary: "What you've described is worth keeping an eye on. It doesn't match an emergency pattern, but a healthcare professional's opinion is a good idea if it continues.",
    specialist: "General Physician",
  },
  HIGH: {
    summary: "What you've described includes symptoms that are best evaluated by a healthcare professional promptly, rather than waiting it out.",
    specialist: "Urgent Care / General Physician",
  },
  CRITICAL: {
    summary: "What you've described matches one or more emergency warning signs. This may need immediate medical attention.",
    specialist: "Emergency Medicine",
  },
};

export function buildFallbackAssessment(
  riskLevel: RiskLevel,
  matchedRedFlags: RedFlagMatch[],
  structured: StructuredSymptomInput,
  symptomText: string
): AIAssessmentContent {
  const copy = RISK_COPY[riskLevel];
  const symptomEcho = symptomText.trim() ? `"${truncate(symptomText, 90)}"` : "the symptoms you entered";

  const riskExplanation =
    matchedRedFlags.length > 0
      ? `This level was selected because your description matched: ${matchedRedFlags.map((f) => f.label).join(", ")}.`
      : structured.severity === "Severe"
        ? "This level was selected because you marked the severity as severe."
        : structured.duration && ["4–7 days", "More than 1 week", "More than 1 month"].includes(structured.duration)
          ? `This level was selected because the symptoms have lasted ${structured.duration.toLowerCase()}.`
          : "This level was selected because no emergency warning signs were matched in your description.";

  const immediateSteps: Record<RiskLevel, string[]> = {
    LOW: ["Rest and stay hydrated.", "Monitor how you feel over the next day or two.", "Use general over-the-counter relief as directed on the label, if needed."],
    MODERATE: ["Rest, hydrate, and track how your symptoms change.", "Consider a telehealth or in-person visit if symptoms continue or worsen.", "Keep a note of when symptoms started and how severe they feel."],
    HIGH: ["Arrange to see a healthcare professional promptly — same day if possible.", "Avoid strenuous activity until you've been evaluated.", "Have someone with you if your symptoms are affecting your ability to function."],
    CRITICAL: ["Seek emergency medical care immediately.", "Do not drive yourself if you feel faint, confused, or severely unwell.", "If you're with someone else, ask them to stay with you and call for help."],
  };

  const thingsToAvoid: Record<RiskLevel, string[]> = {
    LOW: ["Don't ignore symptoms that are getting worse instead of better.", "Avoid exceeding labeled doses of any over-the-counter medication."],
    MODERATE: ["Avoid self-diagnosing based on internet searches alone.", "Don't delay care if new or worsening symptoms appear."],
    HIGH: ["Don't wait to \"see if it passes\" — get evaluated.", "Avoid unsupervised prescription-strength medication."],
    CRITICAL: ["Don't wait to see if it improves on its own.", "Don't drive yourself to the hospital if you feel unsafe to do so."],
  };

  const whenToSeekCare: Record<RiskLevel, string[]> = {
    LOW: ["Symptoms last more than a few days without improving.", "New symptoms appear alongside the original ones."],
    MODERATE: ["Symptoms haven't improved within a few days.", "Symptoms become more severe or new symptoms appear."],
    HIGH: ["As soon as reasonably possible — this shouldn't wait for symptoms to worsen further."],
    CRITICAL: ["Right now — this may be a medical emergency."],
  };

  return {
    summary: `Based on ${symptomEcho}, here's some general guidance. ${copy.summary}`,
    possibleCauses: [
      "Many common, non-emergency conditions can produce a symptom pattern like this.",
      "A healthcare professional can determine the underlying cause after a proper evaluation.",
    ],
    immediateSteps: immediateSteps[riskLevel],
    thingsToAvoid: thingsToAvoid[riskLevel],
    whenToSeekCare: whenToSeekCare[riskLevel],
    recommendedSpecialist: copy.specialist,
    riskExplanation,
  };
}

/**
 * Minimal content shown when a configured AI call genuinely failed — not a
 * generated explanation, just the required safety message. The risk badge
 * and, for CRITICAL, the emergency actions are still driven by the rule
 * engine and rendered regardless of this content.
 */
export function buildAIUnavailableContent(riskLevel: RiskLevel): AIAssessmentContent {
  return {
    summary:
      "We couldn't complete the AI analysis right now. Please review your symptoms with a qualified healthcare professional. If this is an emergency, seek immediate help.",
    possibleCauses: [],
    immediateSteps: [],
    thingsToAvoid: [],
    whenToSeekCare: [],
    recommendedSpecialist: "",
    riskExplanation:
      riskLevel === "CRITICAL"
        ? "Our safety engine detected an emergency warning pattern in what you described — this assessment stays at CRITICAL regardless of AI availability."
        : "Risk level was determined by our deterministic safety engine, independent of the AI explanation that failed to load.",
  };
}
