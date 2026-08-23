import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  accent: "primary" | "secondary";
}

export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  icon: LucideIcon;
}

export interface HealthSnapshotData {
  weightKg: number;
  bloodGroup: string;
  activeMedications: number;
  lastCheckup: string;
}

export interface EmergencyContactData {
  name: string;
  relation: string;
  phone: string;
}

export interface DemoUser {
  name: string;
  email: string;
  bloodGroup: string;
  weightKg: number;
  medications: number;
  lastCheckup: string;
}

export interface ComingSoonModule {
  title: string;
  description: string;
  icon: LucideIcon;
  bullets: string[];
}
