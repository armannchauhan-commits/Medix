import Link from "next/link";
import { HeartPulse, Siren, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataSourceBadge } from "@/components/emergency/DataSourceBadge";
import type { VitalsReading, MonitoringAlert } from "@/types/emergency";
import { cn } from "@/lib/utils";

export function PatientMonitor({ vitals, alert }: { vitals: VitalsReading | null; alert: MonitoringAlert | null }) {
  if (!vitals) {
    return (
      <Card>
        <CardContent className="flex items-center gap-3 p-5 text-sm text-muted-foreground">
          <HeartPulse className="h-4.5 w-4.5" aria-hidden="true" />
          Patient monitoring will start once your location is confirmed.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary">
              <HeartPulse className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <h2 className="font-display text-sm font-semibold text-foreground">❤️ Medix Live Monitor</h2>
          </div>
          <DataSourceBadge source={vitals.source} />
        </div>

        <p className="text-xs font-medium text-warning">
          DEMO MONITORING — the browser cannot measure real vital signs. These values are simulated.
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-muted/50 p-3.5 text-center">
            <p className="text-xs text-muted-foreground">❤️ Heart Rate</p>
            <p className="mt-1 font-display text-lg font-bold text-foreground">{vitals.heartRate} BPM</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-3.5 text-center">
            <p className="text-xs text-muted-foreground">🫁 SpO₂</p>
            <p className="mt-1 font-display text-lg font-bold text-foreground">{vitals.spo2}%</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-3.5 text-center">
            <p className="text-xs text-muted-foreground">🌡 Temperature</p>
            <p className="mt-1 font-display text-lg font-bold text-foreground">{vitals.temperatureC}°C</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-3.5 text-center">
            <p className="text-xs text-muted-foreground">🩸 Blood Pressure</p>
            <p className="mt-1 font-display text-lg font-bold text-foreground">
              {vitals.bloodPressureSystolic}/{vitals.bloodPressureDiastolic}
            </p>
          </div>
        </div>

        {alert && (
          <div
            className={cn(
              "flex flex-col gap-2.5 rounded-xl border px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between",
              alert.urgent ? "border-critical/30 bg-critical-soft" : "border-warning/30 bg-warning/10"
            )}
          >
            <div className="flex items-start gap-2.5">
              <AlertTriangle
                className={cn("mt-0.5 h-4 w-4 shrink-0", alert.urgent ? "text-critical" : "text-warning")}
                aria-hidden="true"
              />
              <div>
                <p className={cn("text-sm font-semibold", alert.urgent ? "text-critical" : "text-warning")}>
                  {alert.urgent ? "🚨 Urgent Monitoring Alert" : "⚠️ Monitoring Alert"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {alert.message} This requires professional evaluation — it is not a diagnosis.
                </p>
              </div>
            </div>
            {alert.urgent && (
              <Button variant="critical" size="sm" asChild className="shrink-0">
                <Link href="/sos">
                  <Siren className="h-3.5 w-3.5" aria-hidden="true" />
                  Activate SOS
                </Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
