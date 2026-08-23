"use client";

import Link from "next/link";
import { Siren, Phone, MapPin, Sparkles, Users, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { useHealthProfile } from "@/lib/health-profile-context";

const upcoming = [
  {
    icon: Phone,
    title: "One-tap emergency dispatch",
    description: "Alert local emergency services the moment you tap SOS.",
  },
  {
    icon: MapPin,
    title: "Live location sharing",
    description: "Share your exact location with responders and your contacts.",
  },
  {
    icon: Users,
    title: "Automatic contact alerts",
    description: "Notify your emergency contacts the instant SOS is triggered.",
  },
];

export default function SOSPage() {
  const { profile } = useHealthProfile();
  const contact = profile.emergencyContacts[0];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3.5">
        <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-critical/10 text-critical">
          <Siren className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Emergency SOS
          </h1>
          <p className="mt-1.5 max-w-xl text-sm text-muted-foreground sm:text-base">
            This is the foundation for Medix&apos;s emergency response. Live
            dispatch and location sharing are being built in a later step.
          </p>
        </div>
      </div>

      <Card className="border-critical/25 bg-critical-soft">
        <CardContent className="flex flex-col items-start gap-5 p-8 sm:p-10">
          <Badge variant="critical" className="gap-1.5">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Coming Soon
          </Badge>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
              Emergency dispatch isn&apos;t connected yet
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              In this step, SOS is UI-only. Once hospital, ambulance and
              location APIs are wired up, this page will actually reach help.
            </p>
          </div>

          <ul className="grid w-full gap-3 sm:grid-cols-3">
            {upcoming.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="flex flex-col gap-2.5 rounded-xl border border-critical/20 bg-card px-4 py-4"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-critical/10 text-critical">
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{description}</p>
              </li>
            ))}
          </ul>

          <Button variant="critical" size="lg" disabled className="mt-2 cursor-not-allowed">
            <Siren className="h-4 w-4" aria-hidden="true" />
            Trigger Emergency Dispatch
          </Button>
          <p className="-mt-3 text-xs text-muted-foreground">
            Disabled in Step 1 — no real emergency request is sent.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Your emergency contact
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
              {contact ? `${contact.name} · ${contact.phone}` : "No emergency contact added yet."}
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/health-history">
              {contact ? (
                "Manage Contacts"
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  Add Contact
                </>
              )}
            </Link>
          </Button>
        </CardContent>
      </Card>

      <MedicalDisclaimer />
    </div>
  );
}
