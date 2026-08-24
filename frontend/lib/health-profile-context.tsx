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
import { apiClient } from "@/services/apiClient";

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
  addContact: (contact: Omit<EmergencyContactRecord, "id">) => Promise<void>;
  updateContact: (id: string, contact: Omit<EmergencyContactRecord, "id">) => Promise<void>;
  removeContact: (id: string) => Promise<void>;
  refreshContactsFromBackend: () => Promise<void>;
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

  // Load any saved profile once, on mount
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(HEALTH_PROFILE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as HealthProfile;
        setProfile(parsed);
      }
    } catch {
      // Corrupt or missing localStorage data
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync contacts from backend on mount
  const refreshContactsFromBackend = React.useCallback(async () => {
    try {
      const backendContacts = await apiClient.getContacts();
      if (backendContacts && backendContacts.length > 0) {
        setProfile((prev) => ({
          ...prev,
          emergencyContacts: backendContacts.map((c) => ({
            id: c.id,
            name: c.name,
            relationship: c.relationship,
            phone: c.phone,
          })),
        }));
      }
    } catch {
      // Backend not running or unreachable — local state / storage remains active
    }
  }, []);

  React.useEffect(() => {
    if (isHydrated) {
      refreshContactsFromBackend();
    }
  }, [isHydrated, refreshContactsFromBackend]);

  // Persist on every change
  React.useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(HEALTH_PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Storage unavailable
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
      addContact: async (contact) => {
        let createdId = generateId("contact");
        try {
          const created = await apiClient.createContact(contact);
          if (created && created.id) createdId = created.id;
        } catch (err) {
          console.warn("[HealthProfile] Backend create failed, saving locally:", err);
        }
        setProfile((prev) => ({
          ...prev,
          emergencyContacts: [...prev.emergencyContacts, { ...contact, id: createdId }],
        }));
      },
      updateContact: async (id, contact) => {
        try {
          await apiClient.updateContact(id, contact);
        } catch (err) {
          console.warn("[HealthProfile] Backend update failed, saving locally:", err);
        }
        setProfile((prev) => ({
          ...prev,
          emergencyContacts: prev.emergencyContacts.map((c) =>
            c.id === id ? { ...contact, id } : c
          ),
        }));
      },
      removeContact: async (id) => {
        try {
          await apiClient.deleteContact(id);
        } catch (err) {
          console.warn("[HealthProfile] Backend delete failed, removing locally:", err);
        }
        setProfile((prev) => ({
          ...prev,
          emergencyContacts: prev.emergencyContacts.filter((c) => c.id !== id),
        }));
      },
      refreshContactsFromBackend,
      updateSharingPreferences: (prefs) =>
        setProfile((prev) => ({ ...prev, sharingPreferences: prefs })),
    }),
    [profile, isHydrated, refreshContactsFromBackend]
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
