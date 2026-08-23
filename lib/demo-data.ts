import {
  Activity,
  FileText,
  Pill,
  type LucideIcon,
} from "lucide-react";
import type {
  ActivityItem,
  DemoUser,
  EmergencyContactData,
  HealthSnapshotData,
} from "@/types";

/**
 * Static, fictional demo-mode data for Step 1 of Medix.
 * None of this represents a real person or real medical information.
 * Later steps will replace this with data fetched from Supabase.
 */

export const demoUser: DemoUser = {
  name: "Arman",
  email: "arman@demo.medix.app",
  bloodGroup: "O+",
  weightKg: 72,
  medications: 2,
  lastCheckup: "12 Aug 2026",
};

export const healthSnapshot: HealthSnapshotData = {
  weightKg: demoUser.weightKg,
  bloodGroup: demoUser.bloodGroup,
  activeMedications: demoUser.medications,
  lastCheckup: demoUser.lastCheckup,
};

export const emergencyContact: EmergencyContactData = {
  name: "Demo Contact",
  relation: "Primary contact",
  phone: "+91 XXXXX XXXXX",
};

export const recentActivity: ActivityItem[] = [
  {
    id: "act-1",
    title: "Symptom assessment",
    detail: "Headache & fatigue",
    timestamp: "Today, 9:40 AM",
    icon: Activity,
  },
  {
    id: "act-2",
    title: "Medical report",
    detail: "Blood test uploaded",
    timestamp: "Yesterday, 6:12 PM",
    icon: FileText,
  },
  {
    id: "act-3",
    title: "Medication",
    detail: "Morning medication taken",
    timestamp: "Yesterday, 8:05 AM",
    icon: Pill,
  },
];

export const iconIndex: Record<string, LucideIcon> = {};
