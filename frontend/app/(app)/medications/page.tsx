import { Pill } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export default function MedicationsPage() {
  return (
    <ComingSoon
      icon={Pill}
      title="Medications"
      description="Keep every medication, dose and reminder in one place."
      bullets={[
        "Dosage tracking with morning, afternoon and evening reminders",
        "Refill alerts before you run out",
        "Interaction warnings across your active medications",
        "A history of what you've taken and when",
      ]}
    />
  );
}
