import { Apple } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export default function DietPage() {
  return (
    <ComingSoon
      icon={Apple}
      title="Diet & Nutrition"
      description="General nutrition guidance shaped around your health profile."
      bullets={[
        "Meal suggestions based on your health profile",
        "General nutrition guidance for common conditions",
        "Hydration and habit tracking",
        "Grocery lists built from your suggested meals",
      ]}
    />
  );
}
