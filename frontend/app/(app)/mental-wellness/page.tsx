import { Brain } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export default function MentalWellnessPage() {
  return (
    <ComingSoon
      icon={Brain}
      title="Mental Wellness"
      description="Support for stress, mood and everyday mental wellbeing."
      bullets={[
        "Daily mood check-ins and gentle trend tracking",
        "Guided breathing and stress-relief exercises",
        "Journaling prompts tailored to how you're feeling",
        "Signposting to professional support when it helps",
      ]}
    />
  );
}
