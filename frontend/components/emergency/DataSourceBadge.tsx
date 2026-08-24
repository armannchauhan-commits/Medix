import type { DataSource } from "@/types/emergency";
import { cn } from "@/lib/utils";

const STYLES: Record<DataSource, { emoji: string; label: string; classes: string }> = {
  live: { emoji: "🟢", label: "LIVE", classes: "bg-success/10 text-success border-success/25" },
  demo: { emoji: "🟡", label: "DEMO", classes: "bg-warning/10 text-warning border-warning/25" },
  unavailable: { emoji: "⚪", label: "UNAVAILABLE", classes: "bg-muted text-muted-foreground border-border" },
};

/**
 * The one place that renders LIVE/DEMO/UNAVAILABLE. Every panel showing
 * external or simulated data (hospitals, ambulance, vitals) must use this so
 * the distinction stays visually consistent and impossible to miss.
 */
export function DataSourceBadge({ source, className }: { source: DataSource; className?: string }) {
  const style = STYLES[source];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold",
        style.classes,
        className
      )}
    >
      <span aria-hidden="true">{style.emoji}</span>
      {style.label}
    </span>
  );
}
