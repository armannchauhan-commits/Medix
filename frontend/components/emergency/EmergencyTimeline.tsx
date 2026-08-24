import { Check, Loader2, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { TimelineStep } from "@/types/emergency";
import { cn } from "@/lib/utils";

export function EmergencyTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <Card>
      <CardContent className="p-5">
        <ol className="flex flex-col gap-3">
          {steps.map((step) => (
            <li key={step.id} className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                  step.status === "done" && "bg-success text-success-foreground",
                  step.status === "active" && "bg-secondary/15 text-secondary",
                  step.status === "pending" && "bg-muted text-muted-foreground"
                )}
              >
                {step.status === "done" ? (
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                ) : step.status === "active" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <Circle className="h-2 w-2 fill-current" aria-hidden="true" />
                )}
              </span>
              <span
                className={cn(
                  "text-sm",
                  step.status === "pending" ? "text-muted-foreground" : "font-medium text-foreground"
                )}
              >
                {step.label}
              </span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
