"use client";

import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { ProfileCompletion } from "@/components/ProfileCompletion";
import { ProfileInfoSection } from "@/components/ProfileInfoSection";
import { MedicationsManager } from "@/components/MedicationsManager";
import { OtherInfoCard } from "@/components/OtherInfoCard";
import { EmergencyContactsManager } from "@/components/EmergencyContactsManager";
import { SharingPreferencesCard } from "@/components/SharingPreferencesCard";
import { useHealthProfile } from "@/lib/health-profile-context";
import { calculateProfileCompletion } from "@/lib/health-profile";

export default function HealthHistoryPage() {
  const { profile } = useHealthProfile();
  const completion = calculateProfileCompletion(profile);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={ClipboardList}
        title="Health History"
        description="Your personal health profile — the details Medix and, eventually, emergency responders can draw on."
      />

      <ProfileCompletion percent={completion} />
      <ProfileInfoSection />
      <MedicationsManager />
      <OtherInfoCard />
      <EmergencyContactsManager />
      <SharingPreferencesCard />

      <MedicalDisclaimer />
    </div>
  );
}
