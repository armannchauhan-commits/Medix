import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";

interface ComingSoonProps {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
}

/**
 * Shared placeholder for every module beyond the dashboard. Explains what
 * the module will do once it ships, instead of a bare "coming soon" wall.
 */
export function ComingSoon({ icon, title, description, bullets }: ComingSoonProps) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={icon} title={title} description={description} />

      <Card className="overflow-hidden">
        <CardContent className="flex flex-col items-start gap-5 p-8 sm:p-10">
          <Badge className="gap-1.5">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Coming Soon
          </Badge>

          <div>
            <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
              This module is on the way
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              We&apos;re building this out in a later step of Medix. Here&apos;s what it will
              provide once it&apos;s live:
            </p>
          </div>

          <ul className="grid w-full gap-3 sm:grid-cols-2">
            {bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-foreground"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                {bullet}
              </li>
            ))}
          </ul>

          <Button variant="outline" asChild className="mt-2">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Dashboard
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
