import type { HealthProfile } from "@/types/health";

/** localStorage key for the persisted profile. Bump the suffix if the shape changes. */
export const HEALTH_PROFILE_STORAGE_KEY = "medix:health-profile:v1";

/**
 * Fictional demo-mode seed data — matches the numbers shown in the Step 1
 * dashboard (blood group O+, 72kg, 2 active medications, checkup 12 Aug 2026)
 * so the dashboard and the new profile agree from first load.
 */
export const defaultHealthProfile: HealthProfile = {
  personalInfo: {
    name: "Arman",
    age: 29,
    gender: "Male",
    dateOfBirth: "1997-03-14",
    height: 175,
    weight: 72,
  },
  medicalInfo: {
    bloodGroup: "O+",
    allergies: ["Penicillin", "Peanuts"],
    conditions: ["Asthma", "Diabetes"],
    surgeries: "",
    notes: "",
    lastCheckup: "12 Aug 2026",
  },
  medications: [
    { id: "med-1", name: "Paracetamol", dosage: "500 mg", frequency: "As needed" },
    { id: "med-2", name: "Vitamin D3", dosage: "1000 IU", frequency: "Once daily" },
  ],
  vaccinations: ["COVID-19 (Booster)", "Tetanus"],
  emergencyContacts: [
    { id: "contact-1", name: "Demo Contact", relationship: "Parent", phone: "+91 XXXXX XXXXX" },
  ],
  sharingPreferences: {
    bloodGroup: true,
    allergies: true,
    medications: true,
    conditions: true,
    emergencyContacts: true,
  },
};

/** Small unique-enough id for client-only demo records (medications, contacts). */
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Profile completion percentage, based on the fields that matter most in an
 * emergency: identity, vitals, blood group, at least one medication on file,
 * and at least one emergency contact.
 */
export function calculateProfileCompletion(profile: HealthProfile): number {
  const checks = [
    Boolean(profile.personalInfo.name.trim()),
    profile.personalInfo.age !== null,
    Boolean(profile.personalInfo.gender),
    Boolean(profile.personalInfo.dateOfBirth),
    profile.personalInfo.height !== null,
    profile.personalInfo.weight !== null,
    Boolean(profile.medicalInfo.bloodGroup),
    profile.medications.length > 0,
    profile.emergencyContacts.length > 0,
  ];
  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}

/** Basic phone validation — permissive about formatting, catches obvious junk. */
export function isValidPhone(phone: string): boolean {
  const digitsOnly = phone.replace(/[^\d]/g, "");
  return /^[\d+\-\s()]+$/.test(phone.trim()) && digitsOnly.length >= 7;
}
