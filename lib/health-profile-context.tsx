"use client";

import * as React from "react";
import type {
  HealthProfile,
  PersonalInfo,
  MedicalInfo,
  Medication,
  EmergencyContactRecord,
  SharingPreferences,
} from "@/types/health";
import {
  HEALTH_PROFILE_STORAGE_KEY,
  defaultHealthProfile,
  generateId,
} from "@/lib/health-profile";

interface HealthProfileContextValue {
  profile: HealthProfile;
  isHydrated: boolean;
  updatePersonalInfo: (info: PersonalInfo) => void;
  updateMedicalCore: (info: Pick<MedicalInfo, "bloodGroup" | "surgeries" | "notes" | "lastCheckup">) => void;
  addAllergy: (value: string) => void;
  removeAllergy: (value: string) => void;
  addCondition: (value: string) => void;
  removeCondition: (value: string) => void;
  addVaccination: (value: string) => void;
  removeVaccination: (value: string) => void;
  addMedication: (medication: Omit<Medication, "id">) => void;
  removeMedication: (id: string) => void;
  addContact: (contact: Omit<EmergencyContactRecord, "id">) => void;
  updateContact: (id: string, contact: Omit<EmergencyContactRecord, "id">) => void;
  removeContact: (id: string) => void;
  updateSharingPreferences: (prefs: SharingPreferences) => void;
}

const HealthProfileContext = React.createContext<HealthProfileContextValue | null>(null);

function addUnique(list: string[], value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed) return list;
  if (list.some((item) => item.toLowerCase() === trimmed.toLowerCase())) return list;
  return [...list, trimmed];
}

export function HealthProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = React.useState<HealthProfile>(defaultHealthProfile);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Load any saved profile once, on mount (client-only — localStorage doesn't exist on the server).
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(HEALTH_PROFILE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as HealthProfile;
        setProfile(parsed);
      }
    } catch {
      // Corrupt or missing localStorage data — fall back to the demo defaults already in state.
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist on every change, after the initial hydration read completes.
  React.useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(HEALTH_PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Storage full or unavailable (e.g. private browsing) — changes just won't persist across reloads.
    }
  }, [profile, isHydrated]);

  const value = React.useMemo<HealthProfileContextValue>(
    () => ({
      profile,
      isHydrated,
      updatePersonalInfo: (info) =>
        setProfile((prev) => ({ ...prev, personalInfo: info })),
      updateMedicalCore: (info) =>
        setProfile((prev) => ({
          ...prev,
          medicalInfo: { ...prev.medicalInfo, ...info },
        })),
      addAllergy: (value) =>
        setProfile((prev) => ({
          ...prev,
          medicalInfo: { ...prev.medicalInfo, allergies: addUnique(prev.medicalInfo.allergies, value) },
        })),
      removeAllergy: (value) =>
        setProfile((prev) => ({
          ...prev,
          medicalInfo: {
            ...prev.medicalInfo,
            allergies: prev.medicalInfo.allergies.filter((a) => a !== value),
          },
        })),
      addCondition: (value) =>
        setProfile((prev) => ({
          ...prev,
          medicalInfo: { ...prev.medicalInfo, conditions: addUnique(prev.medicalInfo.conditions, value) },
        })),
      removeCondition: (value) =>
        setProfile((prev) => ({
          ...prev,
          medicalInfo: {
            ...prev.medicalInfo,
            conditions: prev.medicalInfo.conditions.filter((c) => c !== value),
          },
        })),
      addVaccination: (value) =>
        setProfile((prev) => ({
          ...prev,
          vaccinations: addUnique(prev.vaccinations, value),
        })),
      removeVaccination: (value) =>
        setProfile((prev) => ({
          ...prev,
          vaccinations: prev.vaccinations.filter((v) => v !== value),
        })),
      addMedication: (medication) =>
        setProfile((prev) => ({
          ...prev,
          medications: [...prev.medications, { ...medication, id: generateId("med") }],
        })),
      removeMedication: (id) =>
        setProfile((prev) => ({
          ...prev,
          medications: prev.medications.filter((m) => m.id !== id),
        })),
      addContact: (contact) =>
        setProfile((prev) => ({
          ...prev,
          emergencyContacts: [...prev.emergencyContacts, { ...contact, id: generateId("contact") }],
        })),
      updateContact: (id, contact) =>
        setProfile((prev) => ({
          ...prev,
          emergencyContacts: prev.emergencyContacts.map((c) =>
            c.id === id ? { ...contact, id } : c
          ),
        })),
      removeContact: (id) =>
        setProfile((prev) => ({
          ...prev,
          emergencyContacts: prev.emergencyContacts.filter((c) => c.id !== id),
        })),
      updateSharingPreferences: (prefs) =>
        setProfile((prev) => ({ ...prev, sharingPreferences: prefs })),
    }),
    [profile, isHydrated]
  );

  return (
    <HealthProfileContext.Provider value={value}>{children}</HealthProfileContext.Provider>
  );
}

export function useHealthProfile(): HealthProfileContextValue {
  const ctx = React.useContext(HealthProfileContext);
  if (!ctx) {
    throw new Error("useHealthProfile must be used within a HealthProfileProvider");
  }
  return ctx;
}
