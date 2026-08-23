import { Zap } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export default function InstantReliefPage() {
  return (
    <ComingSoon
      icon={Zap}
      title="Instant Relief"
      description="Fast, practical first-aid guidance for common everyday discomforts."
      bullets={[
        "Step-by-step first-aid guidance for common issues",
        "Quick relief tips for headaches, cramps, minor burns and more",
        "Clear warnings for when a symptom needs urgent care instead",
        "Saved relief guides you can revisit any time",
      ]}
    />
  );
}
