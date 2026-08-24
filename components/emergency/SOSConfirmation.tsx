import { Siren, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SOSConfirmation({ countdown, onCancel }: { countdown: number; onCancel: () => void }) {
  return (
    <Card className="border-critical/30 bg-critical-soft">
      <CardContent className="flex flex-col items-center gap-5 p-8 text-center sm:p-10">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-critical text-critical-foreground">
          <Siren className="h-7 w-7" aria-hidden="true" />
        </span>
        <div>
          <p className="font-display text-lg font-bold text-foreground">Activating emergency SOS…</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your location will be shared and nearby help located. Cancel now if this was accidental.
          </p>
        </div>
        <p className="font-display text-5xl font-extrabold text-critical" aria-live="assertive">
          {countdown}
        </p>
        <Button variant="outline" size="lg" onClick={onCancel}>
          <X className="h-4 w-4" aria-hidden="true" />
          Cancel
        </Button>
      </CardContent>
    </Card>
  );
}
