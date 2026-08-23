import Link from "next/link";
import { ClipboardCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export function ProfileCompletion({ percent }: { percent: number }) {
  const complete = percent >= 100;
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary">
              <ClipboardCheck className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <h2 className="font-display text-base font-semibold text-foreground">
              Health Profile
            </h2>
          </div>
          <span className="font-display text-lg font-bold text-primary">{percent}% Complete</span>
        </div>
        <Progress value={percent} />
        {!complete && (
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              A few fields are still missing — fill them in so Medix can help
              faster in an emergency.
            </p>
            <Button size="sm" variant="outline" asChild className="shrink-0">
              <Link href="#personal-information">Complete your health profile</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
