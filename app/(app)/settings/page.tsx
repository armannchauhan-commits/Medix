import { Settings } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export default function SettingsPage() {
  return (
    <ComingSoon
      icon={Settings}
      title="Settings"
      description="Manage your account, notifications, security and app preferences."
      bullets={[
        "Profile, password and account management",
        "Notification and reminder preferences",
        "Two-factor authentication and login security",
        "Data privacy and export controls",
      ]}
    />
  );
}
