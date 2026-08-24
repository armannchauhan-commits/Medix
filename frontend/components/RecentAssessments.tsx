"use client";

import * as React from "react";
import { History, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { RiskBadge } from "@/components/RiskBadge";
import type { AssessmentHistoryRecord } from "@/types/assessment";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

function truncate(text: string, max: number): string {
  const trimmed = text.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max).trim()}…` : trimmed;
}

export function RecentAssessments({ records }: { records: AssessmentHistoryRecord[] }) {
  if (records.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary">
            <History className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <CardTitle>Recent Assessments</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col divide-y divide-border">
          {records.map((record) => (
            <li key={record.id}>
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 py-3.5 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg px-1"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{truncate(record.symptomText, 60)}</p>
                      <p className="mt-1 flex flex-wrap items-center gap-2">
                        <RiskBadge level={record.riskLevel} />
                        <span className="text-xs text-muted-foreground">{formatDate(record.timestamp)}</span>
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <div className="flex flex-col gap-4 p-6">
                    <DialogTitle>Assessment Details</DialogTitle>
                    <RiskBadge level={record.riskLevel} size="lg" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Symptoms described</p>
                      <p className="mt-1 text-sm text-foreground">{record.symptomText}</p>
                    </div>
                    {(record.structured.duration || record.structured.severity) && (
                      <div className="flex gap-4 text-sm">
                        {record.structured.duration && (
                          <p>
                            <span className="text-muted-foreground">Duration:</span> {record.structured.duration}
                          </p>
                        )}
                        {record.structured.severity && (
                          <p>
                            <span className="text-muted-foreground">Severity:</span> {record.structured.severity}
                          </p>
                        )}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Summary</p>
                      <p className="mt-1 text-sm text-foreground">{record.summary}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{formatDate(record.timestamp)}</p>
                  </div>
                </DialogContent>
              </Dialog>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
