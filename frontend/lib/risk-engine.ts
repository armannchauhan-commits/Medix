import type { RedFlagMatch, RiskEngineResult, RiskLevel, StructuredSymptomInput } from "@/types/assessment";

/**
 * DETERMINISTIC SAFETY LAYER — the single source of truth for risk level.
 *
 * This module is intentionally simple regex/keyword matching, not AI. It is
 * conservative and transparent by design: it does not try to cover every
 * medical condition, only a short, well-known list of emergency warning
 * signs. Nothing downstream (the AI explanation, the UI) is allowed to
 * downgrade what this function returns — see app/api/symptom-assessment/route.ts.
 *
 * Pure function, no I/O, no server-only APIs — safe to import from both
 * client and server code, so risk can still be classified even if the
 * network / AI call fails entirely.
 */

interface Pattern {
  id: string;
  label: string;
  test: (text: string) => boolean;
}

function includesAll(text: string, words: string[]): boolean {
  return words.every((w) => text.includes(w));
}
function includesAny(text: string, words: string[]): boolean {
  return words.some((w) => text.includes(w));
}

/**
 * CRITICAL red flags — predefined emergency warning patterns.
 * Matching ANY of these forces riskLevel = "CRITICAL", regardless of what
 * the AI (or anything else) says.
 */
const CRITICAL_PATTERNS: Pattern[] = [
  {
    id: "chest-pain",
    label: "Severe chest pain or pressure",
    test: (t) =>
      includesAny(t, ["severe chest pain", "chest pressure", "crushing chest", "tightness in my chest", "tightness in chest"]) ||
      (t.includes("chest pain") && includesAny(t, ["breath", "sweat", "arm", "jaw"])),
  },
  {
    id: "breathing-difficulty",
    label: "Severe difficulty breathing",
    test: (t) =>
      includesAny(t, [
        "difficulty breathing",
        "can't breathe",
        "cannot breathe",
        "struggling to breathe",
        "shortness of breath",
        "gasping for air",
      ]),
  },
  {
    id: "loss-of-consciousness",
    label: "Loss of consciousness",
    test: (t) =>
      includesAny(t, ["unconscious", "passed out", "unresponsive", "fainted and not waking", "not waking up", "blacked out", "collapsed"]) ||
      (t.includes("consci") && includesAny(t, ["lost", "loss of", "losing", "lose"])),
  },
  {
    id: "severe-bleeding",
    label: "Severe, uncontrolled bleeding",
    test: (t) => includesAny(t, ["uncontrolled bleeding", "won't stop bleeding", "wont stop bleeding", "bleeding heavily", "severe bleeding"]),
  },
  {
    id: "stroke-signs",
    label: "Possible signs of stroke",
    test: (t) =>
      includesAny(t, [
        "face drooping",
        "facial drooping",
        "facial weakness",
        "slurred speech",
        "sudden weakness on one side",
        "one side of my body",
        "one-sided weakness",
        "can't move one side",
        "worst headache of my life",
      ]),
  },
  {
    id: "severe-allergic-reaction",
    label: "Severe allergic reaction with breathing difficulty or swelling",
    test: (t) =>
      includesAny(t, ["anaphylaxis", "throat closing", "throat is closing", "swelling of my face", "swelling of my throat", "tongue swelling"]) ||
      (includesAny(t, ["allergic reaction"]) && includesAny(t, ["breath", "swelling", "throat"])),
  },
  {
    id: "seizure",
    label: "Seizure",
    test: (t) => includesAny(t, ["seizure", "convulsion", "convulsing", "fitting"]),
  },
  {
    id: "severe-confusion",
    label: "Severe confusion or disorientation",
    test: (t) =>
      includesAny(t, ["severe confusion", "suddenly confused", "sudden confusion"]) ||
      (t.includes("confused") && includesAny(t, ["disoriented", "not making sense", "can't recognize"])),
  },
  {
    id: "sudden-neurological",
    label: "Sudden severe neurological symptoms",
    test: (t) =>
      includesAny(t, ["sudden numbness", "sudden vision loss", "sudden severe dizziness", "sudden loss of balance", "can't speak"]),
  },
];

/**
 * HIGH-tier patterns — concerning, but not an immediate emergency red flag.
 * Kept intentionally short; this is not trying to be exhaustive.
 */
const HIGH_PATTERNS: Pattern[] = [
  { id: "severe-pain-generic", label: "Severe pain", test: (t) => t.includes("severe pain") || t.includes("excruciating") },
  {
    id: "persistent-vomiting",
    label: "Persistent or severe vomiting",
    test: (t) => includesAny(t, ["vomiting blood", "can't keep anything down", "cant keep anything down", "vomiting repeatedly"]),
  },
  { id: "high-fever-generic", label: "High fever", test: (t) => includesAny(t, ["very high fever", "104", "40.5"]) },
  { id: "worsening-rapidly", label: "Rapidly worsening symptoms", test: (t) => includesAny(t, ["getting worse fast", "rapidly worsening"]) },
  {
    id: "fracture-dislocation",
    label: "Possible fracture or dislocation",
    test: (t) => includesAny(t, ["fracture", "broken bone", "broke my", "dislocated", "dislocation"]),
  },
  {
    id: "ligament-tendon-injury",
    label: "Possible ligament or tendon tear",
    test: (t) => includesAny(t, ["ligament tear", "torn ligament", "torn tendon", "torn acl", "ruptured tendon", "torn muscle"]),
  },
  {
    id: "deep-wound",
    label: "Deep wound that may need stitches",
    test: (t) => includesAny(t, ["deep cut", "laceration", "needs stitches", "need stitches"]),
  },
];

/** MODERATE-tier signal — a symptom pattern worth a professional opinion soon, not urgently. */
const MODERATE_PATTERNS: Pattern[] = [
  {
    id: "fever-with-fatigue",
    label: "Fever with fatigue lasting several days",
    test: (t) => t.includes("fever") && includesAny(t, ["fatigue", "tired", "days", "several days", "week"]),
  },
  {
    id: "fever-generic",
    label: "Fever reported",
    test: (t) => includesAny(t, ["fever", "viral fever", "high temperature"]),
  },
  {
    id: "persistent-symptom",
    label: "Symptoms persisting for an extended period",
    test: (t) => includesAny(t, ["for days", "for a week", "for weeks", "won't go away", "wont go away", "not improving"]),
  },
  {
    id: "sprain-strain",
    label: "Sprain or strain",
    test: (t) => includesAny(t, ["sprain", "strain", "twisted my", "pulled a muscle"]),
  },
  {
    id: "vomiting-generic",
    label: "Vomiting",
    test: (t) => t.includes("vomit"),
  },
  {
    id: "dizziness-generic",
    label: "Dizziness",
    test: (t) => includesAny(t, ["dizzy", "dizziness", "lightheaded", "light-headed"]),
  },
];

const LONG_DURATIONS = ["4–7 days", "More than 1 week", "More than 1 month"];

/**
 * Classify risk from free-text symptom description plus optional structured
 * input (duration/severity). Deterministic — same input always gives the
 * same output.
 */
export function assessRisk(symptomText: string, structured?: Partial<StructuredSymptomInput>): RiskEngineResult {
  const text = symptomText.toLowerCase();

  const criticalMatches = CRITICAL_PATTERNS.filter((p) => p.test(text));
  if (criticalMatches.length > 0) {
    return {
      riskLevel: "CRITICAL",
      matchedRedFlags: toMatches(criticalMatches),
      emergencyRecommended: true,
    };
  }

  const highMatches = HIGH_PATTERNS.filter((p) => p.test(text));
  if (highMatches.length > 0 || structured?.severity === "Severe") {
    return {
      riskLevel: "HIGH",
      matchedRedFlags: toMatches(highMatches),
      emergencyRecommended: false,
    };
  }

  const moderateMatches = MODERATE_PATTERNS.filter((p) => p.test(text));
  const longDuration = Boolean(structured?.duration && LONG_DURATIONS.includes(structured.duration));
  if (moderateMatches.length > 0 || longDuration || structured?.severity === "Moderate") {
    return {
      riskLevel: "MODERATE",
      matchedRedFlags: toMatches(moderateMatches),
      emergencyRecommended: false,
    };
  }

  return {
    riskLevel: "LOW",
    matchedRedFlags: [],
    emergencyRecommended: false,
  };
}

function toMatches(patterns: Pattern[]): RedFlagMatch[] {
  return patterns.map((p) => ({ id: p.id, label: p.label }));
}

/**
 * Given an already-computed risk level (e.g. from stored history) and a new
 * one, returns whichever is more severe. Used to guarantee the AI can never
 * downgrade what the rule engine already decided.
 */
const SEVERITY_ORDER: RiskLevel[] = ["LOW", "MODERATE", "HIGH", "CRITICAL"];
export function moreSevere(a: RiskLevel, b: RiskLevel): RiskLevel {
  return SEVERITY_ORDER.indexOf(a) >= SEVERITY_ORDER.indexOf(b) ? a : b;
}

/**
 * SAFETY OVERRIDE — the explicit last step of the pipeline:
 *
 *   symptom input -> red-flag engine -> risk classification
 *     -> AI explanation -> SAFETY OVERRIDE -> final result
 *
 * Takes the engine's risk level (authoritative) and an optional
 * AI-suggested level, and returns whichever is more severe. Today
 * services/aiService.ts's response schema has no riskLevel field at all —
 * the AI is never even asked to classify risk, so there's nothing for it to
 * downgrade. This function exists anyway, as its own named and tested step,
 * so the "AI can never downgrade risk" guarantee is an explicit, auditable
 * gate in the pipeline rather than an implicit consequence of a schema
 * choice. If a future change ever has the AI suggest a level, this is the
 * one place that decides what actually reaches the user.
 */
export function applySafetyOverride(engineRisk: RiskLevel, aiSuggestedRisk?: RiskLevel | null): RiskLevel {
  if (!aiSuggestedRisk) return engineRisk;
  return moreSevere(engineRisk, aiSuggestedRisk);
}
