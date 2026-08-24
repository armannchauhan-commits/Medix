import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function MedicalDisclaimer({ className }: { className?: string }) {
  return (
    <div
      role="note"
      className={cn(
        "flex items-start gap-3 rounded-xl border border-border bg-muted/60 px-4 py-3.5 text-left",
        className
      )}
    >
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <p className="text-xs leading-relaxed text-muted-foreground">
        Medix provides health information and decision support and is not a
        replacement for qualified medical professionals.
      </p>
    </div>
  );
}
