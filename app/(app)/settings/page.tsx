import { Settings } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export default function SettingsPage() {
  return (
    <ComingSoon
      icon={Settings}
      title="Settings"
      description="Manage your account, notifications, emergency contacts and privacy preferences."
      bullets={[
        "Profile, password and account management",
        "Notification and reminder preferences",
        "Emergency contact management",
        "Data privacy and export controls",
      ]}
    />
  );
}
