"use client";

import Link from "next/link";
import { Siren, Hospital, RotateCcw, Sparkles, AlertTriangle, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RiskBadge, riskLevelCopy } from "@/components/RiskBadge";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import type { SymptomAssessmentResult } from "@/types/assessment";
import { cn } from "@/lib/utils";

function BulletSection({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="font-display text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-2 flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AssessmentResultCard({
  result,
  profileConsidered,
  onReassess,
}: {
  result: SymptomAssessmentResult;
  profileConsidered: string[];
  onReassess: () => void;
}) {
  const { risk, content, source } = result;
  const isUrgent = risk.riskLevel === "HIGH" || risk.riskLevel === "CRITICAL";

  return (
    <div className="flex flex-col gap-4">
      {source === "demo" && (
        <div className="flex items-center gap-2 rounded-xl border border-secondary/25 bg-secondary/10 px-4 py-2.5 text-xs font-medium text-secondary">
          <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Demo Mode — this explanation was generated locally, without calling an external AI.
        </div>
      )}

      <Card
        className={cn(
          risk.riskLevel === "CRITICAL" && "border-critical/30 bg-critical-soft",
          risk.riskLevel === "HIGH" && "border-highrisk/30"
        )}
      >
        <CardContent className="flex flex-col gap-6 p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-foreground">Health Assessment</h2>
            <div className="flex flex-col items-end gap-1">
              <RiskBadge level={risk.riskLevel} size="lg" />
              <p className="text-xs text-muted-foreground">{riskLevelCopy(risk.riskLevel)}</p>
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-foreground">What we found</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground">{content.summary}</p>
          </div>

          {(risk.matchedRedFlags.length > 0 || content.riskExplanation) && (
            <div>
              <h3 className="flex items-center gap-1.5 font-display text-sm font-semibold text-foreground">
                <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                Why this matters
              </h3>
              {risk.matchedRedFlags.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {risk.matchedRedFlags.map((flag) => (
                    <li key={flag.id}>
                      <Badge variant={risk.riskLevel === "CRITICAL" ? "critical" : "warning"}>{flag.label}</Badge>
                    </li>
                  ))}
                </ul>
              )}
              {content.riskExplanation && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{content.riskExplanation}</p>
              )}
            </div>
          )}

          {isUrgent ? (
            <>
              <BulletSection title="What to do now" items={content.immediateSteps} />
              {content.whenToSeekCare.length > 0 && <BulletSection title="Seek emergency medical care" items={content.whenToSeekCare} />}

              <div className="flex flex-col gap-2.5 border-t border-border pt-5 sm:flex-row">
                <Button variant="critical" size="lg" asChild className="flex-1">
                  <Link href="/sos">
                    <Siren className="h-4 w-4" aria-hidden="true" />
                    Activate SOS
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="flex-1">
                  <Link href="/specialists">
                    <Hospital className="h-4 w-4" aria-hidden="true" />
                    Find Hospital
                  </Link>
                </Button>
                <Button variant="ghost" size="lg" onClick={onReassess}>
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Reassess
                </Button>
              </div>
            </>
          ) : (
            <>
              <BulletSection title="Immediate Steps" items={content.immediateSteps} />
              <BulletSection title="Things to Avoid" items={content.thingsToAvoid} />
              <BulletSection title="When to Seek Medical Care" items={content.whenToSeekCare} />
              {content.recommendedSpecialist && (
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground">Suggested Professional</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{content.recommendedSpecialist}</p>
                </div>
              )}
              <div className="border-t border-border pt-4">
                <Button variant="outline" size="sm" onClick={onReassess}>
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Reassess
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {profileConsidered.length > 0 && (
        <div className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/50 px-4 py-3">
          <User className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Profile information considered:</span> your assessment
            factored in {profileConsidered.join(", ")} from your Medix health profile.
          </p>
        </div>
      )}

      <MedicalDisclaimer />
    </div>
  );
}
