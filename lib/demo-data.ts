import { Activity, FileText, Pill } from "lucide-react";
import type { ActivityItem, DemoUser } from "@/types";

/**
 * Static, fictional demo-mode data that isn't part of the health profile.
 * Health data itself (blood group, weight, medications, emergency
 * contacts…) now lives in the persisted HealthProfile — see
 * lib/health-profile.ts and lib/health-profile-context.tsx.
 */

export const demoUser: DemoUser = {
  name: "Arman",
  email: "arman@demo.medix.app",
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
