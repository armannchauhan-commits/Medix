import { Flame, Bandage, Brain, Thermometer, Droplet, Utensils, Dumbbell, AlertTriangle, type LucideIcon } from "lucide-react";

export interface FirstAidTopic {
  id: string;
  title: string;
  category: string;
  emoji: string;
  icon: LucideIcon;
  shortDescription: string;
  whatToDoNow: string[];
  whatToAvoid: string[];
  warningSigns: string[];
  whenToSeeDoctor: string;
  /** Only shown when the condition can plausibly escalate to an emergency. */
  showSOSNote: boolean;
  /** Extra terms the search should match beyond the title. */
  keywords: string[];
}

/**
 * Conservative, general self-care guidance only — never dosages, never a
 * claim that these steps cure or treat an underlying condition. See
 * app/(app)/instant-relief/page.tsx for how showSOSNote is used.
 */
export const firstAidLibrary: FirstAidTopic[] = [
  {
    id: "burns",
    title: "Burns",
    category: "First Aid",
    emoji: "🔥",
    icon: Flame,
    shortDescription: "Minor burns and scalds from heat, steam, or hot surfaces.",
    whatToDoNow: [
      "Cool the burn under cool (not ice-cold) running water for 10–20 minutes.",
      "Remove tight clothing or jewellery near the area before it swells.",
      "Cover loosely with a clean, non-stick dressing.",
      "Take an over-the-counter pain reliever as directed on the label, if needed.",
    ],
    whatToAvoid: [
      "Don't apply ice directly — it can damage the skin further.",
      "Don't apply butter, oil, or toothpaste to the burn.",
      "Don't pop any blisters that form.",
    ],
    warningSigns: [
      "The burn is larger than your palm, or on the face, hands, or genitals.",
      "The skin looks white, leathery, or charred.",
      "Increasing pain, swelling, or signs of infection over the following days.",
    ],
    whenToSeeDoctor: "See a doctor promptly for any burn that blisters significantly, covers a large area, or shows signs of infection.",
    showSOSNote: true,
    keywords: ["burn", "scald", "hot water", "fire", "steam"],
  },
  {
    id: "minor-cuts",
    title: "Minor Cuts",
    category: "First Aid",
    emoji: "🩹",
    icon: Bandage,
    shortDescription: "Small cuts, scrapes, and grazes.",
    whatToDoNow: [
      "Wash your hands, then rinse the cut under clean running water.",
      "Apply gentle pressure with a clean cloth to stop any bleeding.",
      "Apply an antiseptic and cover with a clean bandage.",
      "Change the dressing daily or whenever it gets wet or dirty.",
    ],
    whatToAvoid: [
      "Don't use cotton wool directly on an open wound — fibres can stick.",
      "Don't ignore a wound that keeps reopening or oozing.",
    ],
    warningSigns: [
      "Bleeding that doesn't slow after 10 minutes of firm pressure.",
      "The wound is deep, gaping, or has debris that won't rinse out.",
      "Redness, warmth, swelling, or pus develops over the following days.",
    ],
    whenToSeeDoctor: "See a doctor for deep or gaping cuts, cuts from a dirty or rusty object, or any sign of infection.",
    showSOSNote: false,
    keywords: ["cut", "scrape", "graze", "wound", "bleeding"],
  },
  {
    id: "headache",
    title: "Headache",
    category: "Self-Care",
    emoji: "🤕",
    icon: Brain,
    shortDescription: "Everyday tension headaches.",
    whatToDoNow: [
      "Rest in a quiet, dimly lit room.",
      "Drink a glass of water — mild dehydration is a common trigger.",
      "Apply a cool or warm compress to your head or neck, whichever feels better.",
      "An over-the-counter pain reliever taken as directed on the label may help.",
    ],
    whatToAvoid: [
      "Don't stare at bright screens for long stretches while symptomatic.",
      "Don't take more than the labelled dose of any medication.",
      "Avoid skipping meals, which can make headaches worse.",
    ],
    warningSigns: [
      "The worst headache of your life, or one that comes on suddenly and severely.",
      "Headache with fever, stiff neck, confusion, or a rash.",
      "Headache after a head injury, or with vision or speech changes.",
    ],
    whenToSeeDoctor: "See a doctor if headaches are frequent, severe, or different from your usual pattern.",
    showSOSNote: false,
    keywords: ["headache", "migraine", "head pain"],
  },
  {
    id: "cold-cough",
    title: "Cold/Cough",
    category: "Self-Care",
    emoji: "🤧",
    icon: Thermometer,
    shortDescription: "Common cold symptoms — runny nose, sore throat, cough.",
    whatToDoNow: [
      "Rest and stay well-hydrated with water, tea, or broth.",
      "Gargle warm salt water for a sore throat.",
      "Use a humidifier or steam to ease congestion.",
      "Honey in warm water can help soothe a cough (not for infants under 1 year).",
    ],
    whatToAvoid: [
      "Don't push through strenuous exercise while symptomatic.",
      "Avoid smoking or smoke exposure, which worsens irritation.",
    ],
    warningSigns: [
      "Fever above 39°C (102°F) or a fever that lasts more than 3 days.",
      "Difficulty breathing, chest pain, or coughing up blood.",
      "Symptoms lasting more than 10 days without improvement.",
    ],
    whenToSeeDoctor: "See a doctor if symptoms are severe, persistent beyond 10 days, or you have a high or lasting fever.",
    showSOSNote: false,
    keywords: ["cold", "cough", "flu", "sore throat", "runny nose", "congestion"],
  },
  {
    id: "dehydration",
    title: "Dehydration",
    category: "Self-Care",
    emoji: "💧",
    icon: Droplet,
    shortDescription: "Mild dehydration from heat, exercise, or illness.",
    whatToDoNow: [
      "Sip water steadily rather than drinking a large amount at once.",
      "An oral rehydration solution can help replace lost salts and fluids.",
      "Rest in a cool environment out of direct sun or heat.",
      "Eat water-rich foods like fruit if you're able to.",
    ],
    whatToAvoid: [
      "Avoid alcohol and caffeinated drinks, which can worsen fluid loss.",
      "Don't push through intense activity until you're rehydrated.",
    ],
    warningSigns: [
      "Little or no urination, or very dark urine.",
      "Dizziness, confusion, or fainting.",
      "Rapid heartbeat or sunken eyes.",
    ],
    whenToSeeDoctor: "See a doctor if you can't keep fluids down, or symptoms don't improve with steady rehydration.",
    showSOSNote: false,
    keywords: ["dehydration", "thirsty", "heat", "fluids"],
  },
  {
    id: "acidity",
    title: "Acidity",
    category: "Self-Care",
    emoji: "🍽️",
    icon: Utensils,
    shortDescription: "Acid reflux, heartburn, and indigestion.",
    whatToDoNow: [
      "Avoid lying down for 2–3 hours after eating.",
      "Eat smaller, more frequent meals rather than large ones.",
      "An antacid may help, taken as directed on the label.",
      "Loosen tight clothing around your waist.",
    ],
    whatToAvoid: [
      "Avoid spicy, fatty, or acidic foods while symptomatic.",
      "Avoid alcohol, caffeine, and smoking, which can worsen reflux.",
      "Don't exercise vigorously right after eating.",
    ],
    warningSigns: [
      "Chest pain that could be confused with a heart problem.",
      "Difficulty or pain swallowing.",
      "Vomiting blood or dark, tarry stools.",
    ],
    whenToSeeDoctor: "See a doctor if heartburn is frequent (more than twice a week) or doesn't respond to simple measures.",
    showSOSNote: false,
    keywords: ["acidity", "heartburn", "acid reflux", "indigestion", "gerd"],
  },
  {
    id: "muscle-soreness",
    title: "Muscle Soreness",
    category: "Self-Care",
    emoji: "💪",
    icon: Dumbbell,
    shortDescription: "Soreness or stiffness after activity or exercise.",
    whatToDoNow: [
      "Rest the affected muscle and avoid re-aggravating it.",
      "Apply a cold pack for the first day, then gentle heat afterward.",
      "Light stretching and gentle movement can help once acute pain eases.",
      "An over-the-counter pain reliever may help, taken as directed on the label.",
    ],
    whatToAvoid: [
      "Avoid pushing through sharp or worsening pain.",
      "Don't apply heat to a fresh, swollen injury.",
    ],
    warningSigns: [
      "Significant swelling, bruising, or inability to bear weight/use the limb.",
      "Numbness, tingling, or pain that spreads.",
      "Pain that doesn't improve after a week of rest.",
    ],
    whenToSeeDoctor: "See a doctor if pain is severe, doesn't improve within a week, or affects your ability to move normally.",
    showSOSNote: false,
    keywords: ["muscle", "soreness", "sprain", "strain", "sore", "workout"],
  },
  {
    id: "minor-allergic-reactions",
    title: "Minor Allergic Reactions",
    category: "First Aid",
    emoji: "🌿",
    icon: AlertTriangle,
    shortDescription: "Mild skin reactions, hives, or itching without breathing difficulty.",
    whatToDoNow: [
      "Remove or avoid the suspected trigger if known.",
      "Wash the affected area with mild soap and cool water.",
      "An antihistamine may help, taken as directed on the label.",
      "A cool compress can ease itching or mild swelling.",
    ],
    whatToAvoid: [
      "Don't scratch affected skin, which can worsen irritation or cause infection.",
      "Don't ignore symptoms that are spreading or intensifying.",
    ],
    warningSigns: [
      "Swelling of the face, lips, tongue, or throat.",
      "Difficulty breathing or swallowing.",
      "Widespread hives with dizziness or a rapid heartbeat.",
    ],
    whenToSeeDoctor: "See a doctor if a mild reaction doesn't improve within a day or keeps recurring.",
    showSOSNote: true,
    keywords: ["allergy", "allergic", "hives", "itching", "rash", "reaction"],
  },
];

export function searchFirstAidLibrary(query: string): FirstAidTopic[] {
  const q = query.trim().toLowerCase();
  if (!q) return firstAidLibrary;
  return firstAidLibrary.filter(
    (topic) =>
      topic.title.toLowerCase().includes(q) ||
      topic.category.toLowerCase().includes(q) ||
      topic.shortDescription.toLowerCase().includes(q) ||
      topic.keywords.some((k) => k.includes(q) || q.includes(k))
  );
}
