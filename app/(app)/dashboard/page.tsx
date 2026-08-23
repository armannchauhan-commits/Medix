"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  Zap,
  ClipboardList,
  IdCard,
  FileText,
  Pill,
  Apple,
  Brain,
  SendHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SOSButton } from "@/components/SOSButton";
import { QuickActionCard } from "@/components/QuickActionCard";
import { HealthSnapshot } from "@/components/HealthSnapshot";
import { RecentActivity } from "@/components/RecentActivity";
import { EmergencyContact } from "@/components/EmergencyContact";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { demoUser, healthSnapshot, recentActivity, emergencyContact } from "@/lib/demo-data";
import type { QuickAction } from "@/types";

const quickActions: QuickAction[] = [
  {
    title: "Check Symptoms",
    description: "Understand your symptoms with AI.",
    href: "/symptoms",
    icon: Stethoscope,
    accent: "primary",
  },
  {
    title: "Instant Relief",
    description: "Get basic first-aid guidance.",
    href: "/instant-relief",
    icon: Zap,
    accent: "secondary",
  },
  {
    title: "Health History",
    description: "Manage your personal health information.",
    href: "/health-history",
    icon: ClipboardList,
    accent: "primary",
  },
  {
    title: "Emergency Card",
    description: "Quickly access important emergency information.",
    href: "/emergency-card",
    icon: IdCard,
    accent: "secondary",
  },
  {
    title: "Medical Reports",
    description: "Upload and understand medical reports.",
    href: "/reports",
    icon: FileText,
    accent: "primary",
  },
  {
    title: "Medications",
    description: "Manage medication reminders.",
    href: "/medications",
    icon: Pill,
    accent: "secondary",
  },
  {
    title: "Diet & Nutrition",
    description: "Get general nutrition guidance.",
    href: "/diet",
    icon: Apple,
    accent: "primary",
  },
  {
    title: "Mental Wellness",
    description: "Stress, mood and wellness support.",
    href: "/mental-wellness",
    icon: Brain,
    accent: "secondary",
  },
];

function useGreeting() {
  const [greeting, setGreeting] = React.useState("Good day");
  React.useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);
  return greeting;
}

export default function DashboardPage() {
  const router = useRouter();
  const greeting = useGreeting();
  const [symptomText, setSymptomText] = React.useState("");

  function handleCheckSymptoms(e: React.FormEvent) {
    e.preventDefault();
    router.push("/symptoms");
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
          {greeting}, {demoUser.name} 👋
        </h1>
        <p className="mt-1.5 text-muted-foreground sm:text-lg">How are you feeling today?</p>
      </div>

      {/* SOS — prominent, near top */}
      <SOSButton />

      {/* Symptom input */}
      <Card>
        <CardContent className="p-6 sm:p-7">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
              <Stethoscope className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="font-display text-lg font-semibold text-foreground">
              How are you feeling?
            </h2>
          </div>
          <form onSubmit={handleCheckSymptoms} className="flex flex-col gap-4">
            <label htmlFor="symptom-input" className="sr-only">
              Describe your symptoms
            </label>
            <textarea
              id="symptom-input"
              rows={3}
              value={symptomText}
              onChange={(e) => setSymptomText(e.target.value)}
              placeholder="Describe your symptoms…"
              className="w-full resize-none rounded-xl border border-input bg-card px-4 py-3.5 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary sm:text-base"
            />
            <Button type="submit" size="lg" className="self-start">
              <SendHorizontal className="h-4 w-4" aria-hidden="true" />
              Check Symptoms
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((action) => (
            <QuickActionCard key={action.href} {...action} />
          ))}
        </div>
      </div>

      {/* Snapshot */}
      <HealthSnapshot data={healthSnapshot} />

      {/* Activity + Emergency contact */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity items={recentActivity} />
        </div>
        <EmergencyContact contact={emergencyContact} />
      </div>

      <MedicalDisclaimer />
    </div>
  );
}
