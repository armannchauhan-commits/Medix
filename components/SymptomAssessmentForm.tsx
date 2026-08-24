"use client";

import * as React from "react";
import { Loader2, SendHorizontal, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { TagList } from "@/components/TagList";
import { useHealthProfile } from "@/lib/health-profile-context";
import type { Duration, Severity, StructuredSymptomInput } from "@/types/assessment";

const DURATION_OPTIONS: Duration[] = ["Less than 1 day", "1–3 days", "4–7 days", "More than 1 week", "More than 1 month"];
const SEVERITY_OPTIONS: Severity[] = ["Mild", "Moderate", "Severe"];

interface SymptomAssessmentFormProps {
  onSubmit: (symptomText: string, structured: StructuredSymptomInput) => void;
  isLoading: boolean;
}

export function SymptomAssessmentForm({ onSubmit, isLoading }: SymptomAssessmentFormProps) {
  const { profile } = useHealthProfile();
  const [symptomText, setSymptomText] = React.useState("");
  const [symptoms, setSymptoms] = React.useState<string[]>([]);
  const [duration, setDuration] = React.useState<Duration>("");
  const [severity, setSeverity] = React.useState<Severity>("");
  const [error, setError] = React.useState<string | null>(null);

  const profileSummary: string[] = [];
  if (profile.personalInfo.age !== null) profileSummary.push(`age ${profile.personalInfo.age}`);
  if (profile.medicalInfo.allergies.length) profileSummary.push(`allergies (${profile.medicalInfo.allergies.join(", ")})`);
  if (profile.medicalInfo.conditions.length) profileSummary.push(`conditions (${profile.medicalInfo.conditions.join(", ")})`);
  if (profile.medications.length) profileSummary.push(`${profile.medications.length} current medication(s)`);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!symptomText.trim()) {
      setError("Please describe your symptoms before requesting an assessment.");
      return;
    }
    setError(null);
    onSubmit(symptomText.trim(), { symptoms, duration, severity });
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-6 p-6 sm:p-7">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="symptom-text">Describe your symptoms</Label>
            <Textarea
              id="symptom-text"
              rows={4}
              placeholder="Describe your symptoms, how long you have had them, and how severe they feel…"
              value={symptomText}
              onChange={(e) => setSymptomText(e.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "symptom-text-error" : undefined}
              className="text-sm sm:text-base"
            />
            <p className="text-xs text-muted-foreground">
              Example: &ldquo;I have had a headache and mild fever since yesterday.&rdquo;
            </p>
            {error && (
              <p id="symptom-text-error" className="text-xs font-medium text-critical">
                {error}
              </p>
            )}
          </div>

          <details className="group rounded-xl border border-border">
            <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-foreground marker:content-none">
              <span className="flex items-center justify-between">
                Add more detail (optional)
              <span className="text-xs font-normal text-muted-foreground group-open:hidden hidden sm:inline">Symptoms, duration, severity</span>
              </span>
            </summary>
            <div className="flex flex-col gap-5 border-t border-border p-4">
              <div className="flex flex-col gap-2">
                <Label>Symptoms</Label>
                <TagList
                  items={symptoms}
                  onAdd={(v) => setSymptoms((prev) => (prev.includes(v) ? prev : [...prev, v]))}
                  onRemove={(v) => setSymptoms((prev) => prev.filter((s) => s !== v))}
                  placeholder="Add a symptom (e.g. Headache)"
                  emptyLabel="No individual symptoms added — that's okay, the description above is enough."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="duration">Duration</Label>
                  <Select id="duration" value={duration} onChange={(e) => setDuration(e.target.value as Duration)}>
                    <option value="">Not specified</option>
                    {DURATION_OPTIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>Severity</Label>
                  <div className="flex gap-2">
                    {SEVERITY_OPTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSeverity((prev) => (prev === s ? "" : s))}
                        aria-pressed={severity === s}
                        className={`flex-1 whitespace-nowrap rounded-lg border px-2 py-2 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                          severity === s
                            ? "border-primary bg-accent text-primary"
                            : "border-border bg-card text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </details>

          {profileSummary.length > 0 && (
            <div className="flex items-start gap-2.5 rounded-xl bg-muted/50 px-4 py-3">
              <User className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">From your health profile, we&apos;ll also consider:</span>{" "}
                {profileSummary.join(" · ")}. You won&apos;t need to re-enter this.
              </p>
            </div>
          )}

          <Button type="submit" size="lg" disabled={isLoading} className="w-full sm:w-auto sm:self-start">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Analyzing…
              </>
            ) : (
              <>
                <SendHorizontal className="h-4 w-4" aria-hidden="true" />
                Analyze Symptoms
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
