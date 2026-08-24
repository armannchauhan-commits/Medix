"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assessRisk = assessRisk;
exports.buildFallbackExplanation = buildFallbackExplanation;
const RED_FLAGS = [
    {
        id: "cardio_chest_pain",
        category: "cardiovascular",
        keywords: ["chest pain", "crushing", "radiating to arm", "jaw pain", "pressure in chest"],
        description: "Signs suggestive of acute coronary syndrome / heart attack.",
    },
    {
        id: "neuro_stroke",
        category: "neurological",
        keywords: ["face drooping", "arm weakness", "slurred speech", "sudden numbness", "sudden confusion", "stroke"],
        description: "FAST criteria for acute stroke / cerebrovascular event.",
    },
    {
        id: "resp_severe",
        category: "respiratory",
        keywords: ["cannot breathe", "can't breathe", "struggling to breathe", "gasping", "blue lips", "asphyxia"],
        description: "Severe respiratory compromise / acute hypoxia.",
    },
    {
        id: "anaphylaxis",
        category: "anaphylaxis",
        keywords: ["throat swelling", "swollen tongue", "anaphylaxis", "cannot swallow", "hives and wheezing"],
        description: "Systemic anaphylactic reaction.",
    },
    {
        id: "severe_hemorrhage",
        category: "trauma",
        keywords: ["bleeding heavily", "spurting blood", "uncontrolled bleeding", "coughing blood"],
        description: "Severe hemorrhage requiring immediate trauma care.",
    },
];
const HIGH_RISK_KEYWORDS = [
    "high fever", "fever above 103", "severe abdominal pain", "worst headache of my life",
    "thunderclap headache", "fainting", "syncope", "vomiting blood", "black tarry stool",
    "vision loss", "loss of vision", "head injury", "concussion with vomiting"
];
const MEDIUM_RISK_KEYWORDS = [
    "persistent cough", "fever for 3 days", "moderate pain", "migraine", "dizziness",
    "ear pain", "urinary pain", "burning urination", "rash spreading", "vomiting", "diarrhea"
];
function assessRisk(symptomText, structured) {
    const lower = symptomText.toLowerCase();
    const matchedRedFlags = [];
    for (const flag of RED_FLAGS) {
        if (flag.keywords.some((k) => lower.includes(k))) {
            matchedRedFlags.push(flag);
        }
    }
    let riskLevel = "LOW";
    let reasoning = "Symptoms appear mild based on initial keywords.";
    if (matchedRedFlags.length > 0 || structured?.severity === "severe" && lower.includes("chest")) {
        riskLevel = "EMERGENCY";
        reasoning = `Critical red flags detected: ${matchedRedFlags.map((f) => f.description).join(" ")}`;
    }
    else if (HIGH_RISK_KEYWORDS.some((k) => lower.includes(k)) || structured?.severity === "severe") {
        riskLevel = "HIGH";
        reasoning = "High risk symptoms detected requiring prompt medical attention.";
    }
    else if (MEDIUM_RISK_KEYWORDS.some((k) => lower.includes(k)) || structured?.severity === "moderate") {
        riskLevel = "MEDIUM";
        reasoning = "Moderate symptoms detected that warrant medical evaluation if persistent.";
    }
    return {
        riskLevel,
        matchedRedFlags: matchedRedFlags.map((f) => f.description),
        reasoning,
    };
}
function buildFallbackExplanation(riskLevel, symptomText) {
    switch (riskLevel) {
        case "EMERGENCY":
            return {
                summary: "Your symptoms indicate a potentially life-threatening medical emergency.",
                possibleCauses: ["Acute cardiovascular, respiratory, or neurological event"],
                urgency: "Immediate Emergency Care (Call 911 / 112 / 102)",
                actionSteps: [
                    "Activate Medix SOS or call emergency services immediately.",
                    "Do not attempt to drive yourself to the hospital.",
                    "Sit in a comfortable, upright position while waiting for help.",
                    "Inform someone near you about your symptoms.",
                ],
                whenToSeekImmediateCare: "Immediate emergency attention is required now.",
            };
        case "HIGH":
            return {
                summary: "Your symptoms suggest an acute condition that requires urgent clinical evaluation.",
                possibleCauses: ["Acute infection, severe migraine, or acute systemic condition"],
                urgency: "Urgent Medical Care within hours",
                actionSteps: [
                    "Visit an urgent care clinic or emergency room promptly.",
                    "Rest in a quiet place and stay hydrated.",
                    "Monitor your temperature and vital signs.",
                ],
                whenToSeekImmediateCare: "If symptoms worsen, chest pain begins, or you experience difficulty breathing, activate SOS.",
            };
        case "MEDIUM":
            return {
                summary: "Your symptoms suggest a moderate condition that should be checked by a doctor.",
                possibleCauses: ["Viral/bacterial infection, localized inflammation, or subacute condition"],
                urgency: "Schedule an appointment with a physician within 24-48 hours",
                actionSteps: [
                    "Schedule a consultation with your primary doctor.",
                    "Get sufficient rest and fluids.",
                    "Keep a log of temperature and pain levels.",
                ],
                whenToSeekImmediateCare: "Seek urgent care if symptoms suddenly escalate or high fever develops.",
            };
        default:
            return {
                summary: "Your symptoms appear mild and commonly managed with self-care and monitoring.",
                possibleCauses: ["Common cold, mild strain, fatigue, or minor seasonal allergy"],
                urgency: "Routine Care / Home Monitoring",
                actionSteps: [
                    "Stay hydrated and get restful sleep.",
                    "Monitor for any change in symptoms over the next 48 hours.",
                ],
                whenToSeekImmediateCare: "Consult a healthcare provider if symptoms persist longer than a week or worsen.",
            };
    }
}
