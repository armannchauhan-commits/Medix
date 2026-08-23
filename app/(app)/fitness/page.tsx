import { Dumbbell } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export default function FitnessPage() {
  return (
    <ComingSoon
      icon={Dumbbell}
      title="Fitness"
      description="Activity tracking and movement guidance suited to your health profile."
      bullets={[
        "Step, workout and activity tracking",
        "Routines suited to your health profile and goals",
        "Progress trends over weeks and months",
        "Gentle reminders to stay active",
      ]}
    />
  );
}
