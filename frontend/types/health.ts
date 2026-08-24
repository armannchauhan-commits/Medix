/**
 * Step 2 — Patient Health Profile data structures.
 * Shaped to move to Supabase later with minimal changes: flat, serializable,
 * ids on every list item.
 */

export type Gender = "Male" | "Female" | "Other" | "Prefer not to say" | "";
export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-"
  | "Unknown"
  | "";

export interface PersonalInfo {
  name: string;
  age: number | null;
  gender: Gender;
  dateOfBirth: string; // ISO date string, e.g. "1997-03-14"
  height: number | null; // cm
  weight: number | null; // kg
}

export interface MedicalInfo {
  bloodGroup: BloodGroup;
  allergies: string[];
  conditions: string[];
  surgeries: string;
  notes: string;
  lastCheckup: string; // free-text display date, e.g. "12 Aug 2026"
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

export interface EmergencyContactRecord {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

export interface SharingPreferences {
  bloodGroup: boolean;
  allergies: boolean;
  medications: boolean;
  conditions: boolean;
  emergencyContacts: boolean;
}

export interface HealthProfile {
  personalInfo: PersonalInfo;
  medicalInfo: MedicalInfo;
  medications: Medication[];
  vaccinations: string[];
  emergencyContacts: EmergencyContactRecord[];
  sharingPreferences: SharingPreferences;
}
