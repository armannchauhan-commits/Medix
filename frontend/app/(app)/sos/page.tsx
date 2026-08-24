"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Siren, PlayCircle, Loader2, XCircle, RotateCcw, ShieldAlert, CheckCircle2, AlertTriangle, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { EmergencyHealthCard } from "@/components/EmergencyHealthCard";
import { SOSConfirmation } from "@/components/emergency/SOSConfirmation";
import { EmergencyTimeline } from "@/components/emergency/EmergencyTimeline";
import { LocationCard } from "@/components/emergency/LocationCard";
import { HospitalList } from "@/components/emergency/HospitalList";
import { AmbulanceTracker } from "@/components/emergency/AmbulanceTracker";
import { PatientMonitor } from "@/components/emergency/PatientMonitor";
import { EmergencyContactActions } from "@/components/emergency/EmergencyContactActions";
import { useEmergencySession } from "@/lib/use-emergency-session";

const EmergencyMap = dynamic(() => import("@/components/emergency/EmergencyMap").then((m) => m.EmergencyMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[280px] w-full items-center justify-center rounded-2xl bg-muted/50">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-hidden="true" />
    </div>
  ),
});

export default function SOSPage() {
  const session = useEmergencySession();

  if (session.status === "idle" || session.status === "ended") {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-3.5">
          <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-critical/10 text-critical">
            <Siren className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              🚨 Medix Emergency Response
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-muted-foreground sm:text-base">
              Activating SOS notifies your saved emergency contacts via the backend, shares your real location,
              finds real nearby hospitals, and launches emergency assistance.
            </p>
          </div>
        </div>

        {session.status === "ended" && (
          <div className="flex items-center gap-2.5 rounded-xl border border-success/25 bg-success/10 px-4 py-3 text-sm text-success">
            <XCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            Emergency session ended. Location tracking has stopped.
          </div>
        )}

        <Card className="border-critical/25">
          <CardContent className="flex flex-col items-center gap-5 p-8 text-center sm:p-10">
            <button
              type="button"
              onClick={session.activate}
              className="group relative flex h-40 w-40 flex-col items-center justify-center gap-1 rounded-full bg-critical text-critical-foreground shadow-sos-glow transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-critical/40 sm:h-48 sm:w-48"
            >
              <span className="absolute inset-0 rounded-full bg-critical/50 animate-pulse-ring" aria-hidden="true" />
              <Siren className="relative h-9 w-9" aria-hidden="true" />
              <span className="relative font-display text-lg font-extrabold sm:text-xl">ACTIVATE SOS</span>
            </button>
            <p className="max-w-sm text-xs text-muted-foreground">
              You&apos;ll get a 5-second countdown to cancel before the emergency alert is sent.
            </p>

            <div className="flex items-center gap-3">
              <div className="h-px w-10 bg-border" aria-hidden="true" />
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">or</span>
              <div className="h-px w-10 bg-border" aria-hidden="true" />
            </div>

            <Button variant="outline" size="lg" onClick={session.activateDemo}>
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
              Start Emergency Demo
            </Button>
            <p className="max-w-sm text-xs text-muted-foreground">
              Triggers the emergency alert immediately, tests backend emergency dispatch, and uses your live location.
            </p>
          </CardContent>
        </Card>

        <MedicalDisclaimer />
      </div>
    );
  }

  if (session.status === "confirming") {
    return (
      <div className="flex flex-col gap-6">
        <SOSConfirmation countdown={session.countdown} onCancel={session.cancelConfirmation} />
        <MedicalDisclaimer />
      </div>
    );
  }

  // status === "active"
  const {
    geolocation,
    hospitals,
    hospitalsSource,
    hospitalsLoading,
    ambulance,
    vitals,
    alert,
    timeline,
    backendSOSResult,
    backendSOSLoading,
    isDemoRun,
  } = session;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="absolute inset-0 animate-ping rounded-full bg-critical/60" aria-hidden="true" />
            <span className="relative h-3 w-3 rounded-full bg-critical" aria-hidden="true" />
          </span>
          <h1 className="font-display text-xl font-bold text-critical sm:text-2xl">🚨 Emergency Active</h1>
          {isDemoRun && (
            <span className="rounded-full bg-warning/10 px-2.5 py-1 text-xs font-bold text-warning">DEMO RUN</span>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={session.endEmergency}>
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          End Emergency
        </Button>
      </div>

      {/* Backend SOS Dispatch Status Banner */}
      <Card className="border-critical/30 bg-critical/5">
        <CardContent className="flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-critical" />
              <span className="font-display text-sm font-bold text-foreground">
                Emergency Dispatch & Contact Notification
              </span>
            </div>
            {backendSOSLoading ? (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Connecting to backend…
              </span>
            ) : backendSOSResult?.smsProviderConfigured ? (
              <span className="flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Live Cellular SMS
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-full bg-warning/15 px-2.5 py-0.5 text-xs font-semibold text-warning">
                <AlertTriangle className="h-3.5 w-3.5" />
                Demo / Unconfigured SMS Mode
              </span>
            )}
          </div>

          {backendSOSResult && (
            <div className="flex flex-col gap-2 rounded-xl bg-background/80 p-3.5 text-xs">
              <p className="text-foreground font-medium">{backendSOSResult.message}</p>
              {backendSOSResult.contactsNotified && backendSOSResult.contactsNotified.length > 0 ? (
                <div className="mt-1 flex flex-col gap-1 border-t border-border pt-2">
                  <span className="font-semibold text-muted-foreground">Targeted Emergency Contacts:</span>
                  {backendSOSResult.contactsNotified.map((c) => (
                    <div key={c.contactId} className="flex items-center justify-between text-muted-foreground">
                      <span>{c.name} ({c.relationship}) - {c.phone}</span>
                      <span className={c.status === "delivered" ? "text-success font-medium" : "text-amber-600 font-medium"}>
                        {c.status === "delivered" ? "Delivered" : "Logged in demo mode (SMS unconfigured)"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No emergency contacts found. Add contacts in Health History to enable automatic alerts.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <EmergencyTimeline steps={timeline} />

      <div className="h-72 sm:h-80 lg:h-96">
        {geolocation.location ? (
          <EmergencyMap userLocation={geolocation.location} hospitals={hospitals} ambulance={ambulance} />
        ) : (
          <div className="flex h-full items-center justify-center rounded-2xl bg-muted/50 px-6 text-center text-sm text-muted-foreground">
            {geolocation.permission === "denied" || geolocation.permission === "unsupported"
              ? "The map needs location access to show your area."
              : "Locating you…"}
          </div>
        )}
      </div>

      <LocationCard
        location={geolocation.location}
        permission={geolocation.permission}
        error={geolocation.error}
        onRefresh={geolocation.refresh}
        onRecenter={geolocation.refresh}
        onStop={session.endEmergency}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <AmbulanceTracker ambulance={ambulance} />
        <PatientMonitor vitals={vitals} alert={alert} />
      </div>

      <HospitalList hospitals={hospitals} source={hospitalsSource} loading={hospitalsLoading} />

      <div className="grid gap-6 lg:grid-cols-2">
        <EmergencyContactActions location={geolocation.location} />
        <EmergencyHealthCard />
      </div>

      <MedicalDisclaimer />
    </div>
  );
}
