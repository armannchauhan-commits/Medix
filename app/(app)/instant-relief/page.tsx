"use client";

import * as React from "react";
import Link from "next/link";
import { Zap, Search, ArrowLeft, Siren, CheckCircle2, XCircle, AlertTriangle, Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { firstAidLibrary, searchFirstAidLibrary, type FirstAidTopic } from "@/lib/first-aid-library";

function TopicDetail({ topic, onBack }: { topic: FirstAidTopic; onBack: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <Button variant="ghost" size="sm" onClick={onBack} className="self-start">
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to Instant Relief
      </Button>

      <div className="flex items-center gap-3.5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent text-2xl" aria-hidden="true">
          {topic.emoji}
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">{topic.category}</p>
          <h1 className="font-display text-2xl font-bold text-foreground">{topic.title}</h1>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-6 p-6 sm:p-7">
          <div>
            <h2 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
              What you can do now
            </h2>
            <ul className="mt-2.5 flex flex-col gap-2">
              {topic.whatToDoNow.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
              <XCircle className="h-4 w-4 text-critical" aria-hidden="true" />
              What to avoid
            </h2>
            <ul className="mt-2.5 flex flex-col gap-2">
              {topic.whatToAvoid.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-critical/60" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="flex items-center gap-2 font-display text-base font-semibold text-foreground">
              <AlertTriangle className="h-4 w-4 text-warning" aria-hidden="true" />
              Watch for these warning signs
            </h2>
            <ul className="mt-2.5 flex flex-col gap-2">
              {topic.warningSigns.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-muted/50 px-4 py-3.5">
            <h2 className="font-display text-sm font-semibold text-foreground">When to see a doctor</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{topic.whenToSeeDoctor}</p>
          </div>

          {topic.showSOSNote && (
            <div className="flex flex-col gap-3 rounded-xl border border-critical/25 bg-critical-soft px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Symptoms getting severe?</p>
                <p className="text-xs text-muted-foreground">If this is escalating quickly, don&apos;t wait — get emergency help.</p>
              </div>
              <Button variant="critical" size="sm" asChild className="shrink-0">
                <Link href="/sos">
                  <Siren className="h-3.5 w-3.5" aria-hidden="true" />
                  Activate SOS
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <MedicalDisclaimer />
    </div>
  );
}

export default function InstantReliefPage() {
  const [query, setQuery] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const selectedTopic = selectedId ? firstAidLibrary.find((t) => t.id === selectedId) ?? null : null;
  const results = searchFirstAidLibrary(query);

  if (selectedTopic) {
    return <TopicDetail topic={selectedTopic} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Zap}
        title="Instant Relief"
        description="Conservative first-aid and self-care guidance for common, everyday problems."
      />

      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What problem are you experiencing?"
          aria-label="What problem are you experiencing?"
          className="h-12 pl-10 text-base"
        />
      </div>

      {results.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              We couldn&apos;t find a matching topic. Try describing your symptoms in the AI Symptom Assessment.
            </p>
            <Button asChild>
              <Link href="/symptoms">
                <Stethoscope className="h-4 w-4" aria-hidden="true" />
                Check Symptoms
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {results.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => setSelectedId(topic.id)}
              className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-xl" aria-hidden="true">
                {topic.emoji}
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-secondary">{topic.category}</p>
                <h3 className="font-display text-base font-semibold text-foreground">{topic.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{topic.shortDescription}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      <MedicalDisclaimer />
    </div>
  );
}
