import { ArrowRight } from "lucide-react";
import { RiskBadge, riskLevelCopy } from "@/components/RiskBadge";
import type { RiskLevel } from "@/types/assessment";

const LEVELS_LOW_TO_HIGH: RiskLevel[] = ["LOW", "MODERATE", "HIGH", "CRITICAL"];

/**
 * Reference legend showing every risk level in ascending order of urgency.
 * Shown up front on the symptoms page so the colors/labels mean something
 * before a result ever appears.
 */
export function RiskLevelLegend() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3.5 sm:gap-2">
      <p className="text-xs font-medium text-muted-foreground">Risk levels, from least to most urgent:</p>
      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
        {LEVELS_LOW_TO_HIGH.map((level, i) => (
          <div key={level} className="flex items-center gap-2.5">
            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-2">
              <RiskBadge level={level} />
              <p className="text-xs text-muted-foreground sm:hidden">{riskLevelCopy(level)}</p>
            </div>
            {i < LEVELS_LOW_TO_HIGH.length - 1 && (
              <ArrowRight className="hidden h-3.5 w-3.5 shrink-0 text-muted-foreground/50 sm:block" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
