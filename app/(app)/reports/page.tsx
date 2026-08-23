import { FileText } from "lucide-react";
import { ComingSoon } from "@/components/ComingSoon";

export default function ReportsPage() {
  return (
    <ComingSoon
      icon={FileText}
      title="Medical Reports"
      description="Upload lab results and scans, and get them explained in plain language."
      bullets={[
        "Upload PDFs, images or scanned lab reports",
        "Plain-language explanations of key values",
        "Flags for results outside the normal range",
        "A searchable archive of every report you've uploaded",
      ]}
    />
  );
}
