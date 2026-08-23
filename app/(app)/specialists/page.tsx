import { UserSearch } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export default function SpecialistsPage() {
  return (
    <ComingSoon
      icon={UserSearch}
      title="Specialists"
      description="Find and connect with the right doctor for what you're dealing with."
      bullets={[
        "Specialist search matched to your symptoms",
        "Nearby doctors and clinics with real-time availability",
        "Direct appointment booking",
        "Visit notes saved back to your health history",
      ]}
    />
  );
}
