import { Stethoscope } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export default function SymptomsPage() {
  return (
    <ComingSoon
      icon={Stethoscope}
      title="Symptom Checker"
      description="Describe how you're feeling and get a clear, AI-guided read on what it might mean."
      bullets={[
        "Free-text symptom input with AI-powered assessment",
        "Follow-up questions that narrow down possible causes",
        "Plain-language explanations, not medical jargon",
        "Clear guidance on when to see a doctor versus self-care",
      ]}
    />
  );
}
