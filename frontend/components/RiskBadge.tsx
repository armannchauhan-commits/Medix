import type { RiskLevel } from "@/types/assessment";
import { cn } from "@/lib/utils";

const RISK_STYLES: Record<RiskLevel, { emoji: string; label: string; classes: string; description: string }> = {
  LOW: {
    emoji: "🟢",
    label: "LOW",
    classes: "bg-success/10 text-success border-success/25",
    description: "General guidance and monitoring may be appropriate.",
  },
  MODERATE: {
    emoji: "🟡",
    label: "MODERATE",
    classes: "bg-warning/10 text-warning border-warning/25",
    description: "Consider consulting a healthcare professional.",
  },
  HIGH: {
    emoji: "🟠",
    label: "HIGH",
    classes: "bg-highrisk/10 text-highrisk border-highrisk/25",
    description: "Professional medical evaluation is recommended promptly.",
  },
  CRITICAL: {
    emoji: "🔴",
    label: "CRITICAL",
    classes: "bg-critical/10 text-critical border-critical/25",
    description: "Immediate medical attention may be required.",
  },
};

export function RiskBadge({ level, size = "default" }: { level: RiskLevel; size?: "default" | "lg" }) {
  const style = RISK_STYLES[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border font-display font-bold",
        style.classes,
        size === "lg" ? "px-4 py-2 text-lg" : "px-3 py-1 text-sm"
      )}
    >
      <span aria-hidden="true">{style.emoji}</span>
      {style.label}
    </span>
  );
}

export function riskLevelCopy(level: RiskLevel): string {
  return RISK_STYLES[level].description;
}
