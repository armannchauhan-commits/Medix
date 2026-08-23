import { IdCard } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export default function EmergencyCardPage() {
  return (
    <ComingSoon
      icon={IdCard}
      title="Emergency Card"
      description="A shareable card with the critical facts a first responder needs, ready in seconds."
      bullets={[
        "Blood group, allergies and critical conditions at a glance",
        "Emergency contacts, one tap to call",
        "Works offline and from your lock screen",
        "Shareable link for paramedics or hospital staff",
      ]}
    />
  );
}
