import {
  LayoutDashboard,
  Stethoscope,
  Zap,
  ClipboardList,
  IdCard,
  FileText,
  Pill,
  Apple,
  Brain,
  Dumbbell,
  UserSearch,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { NavItem } from "@/types";

/**
 * Primary sidebar navigation, in display order.
 * Shared by the desktop sidebar and the mobile drawer so both stay in sync.
 */
export const primaryNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Symptoms", href: "/symptoms", icon: Stethoscope },
  { label: "Instant Relief", href: "/instant-relief", icon: Zap },
  { label: "Health History", href: "/health-history", icon: ClipboardList },
  { label: "Emergency Card", href: "/emergency-card", icon: IdCard },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "Medications", href: "/medications", icon: Pill },
  { label: "Diet", href: "/diet", icon: Apple },
  { label: "Mental Wellness", href: "/mental-wellness", icon: Brain },
  { label: "Fitness", href: "/fitness", icon: Dumbbell },
  { label: "Specialists", href: "/specialists", icon: UserSearch },
];

export const settingsNav: NavItem = {
  label: "Settings",
  href: "/settings",
  icon: Settings,
};

export const iconFor: Record<string, LucideIcon> = Object.fromEntries(
  [...primaryNav, settingsNav].map((item) => [item.href, item.icon])
);
