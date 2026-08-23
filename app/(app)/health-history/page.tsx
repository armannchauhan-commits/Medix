import { ClipboardList } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export default function HealthHistoryPage() {
  return (
    <ComingSoon
      icon={ClipboardList}
      title="Health History"
      description="One organized timeline of your conditions, visits, allergies and past treatments."
      bullets={[
        "A single timeline of conditions, visits and treatments",
        "Allergy and chronic condition tracking",
        "Family history fields relevant to your care",
        "Exportable summaries to share with a doctor",
      ]}
    />
  );
}
