import { Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DataSourceBadge } from "@/components/emergency/DataSourceBadge";
import type { AmbulanceState, AmbulanceStatus } from "@/types/emergency";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<AmbulanceStatus, string> = {
  searching: "Searching for an ambulance…",
  assigned: "Ambulance assigned",
  "en-route": "En route",
  arrived: "Arrived",
  cancelled: "Cancelled",
};

export function AmbulanceTracker({ ambulance }: { ambulance: AmbulanceState | null }) {
  if (!ambulance) {
    return (
      <Card>
        <CardContent className="flex items-center gap-3 p-5 text-sm text-muted-foreground">
          <Truck className="h-4.5 w-4.5" aria-hidden="true" />
          Ambulance tracking will start once your location is confirmed.
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
              <Truck className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <h2 className="font-display text-sm font-semibold text-foreground">🚑 Ambulance</h2>
          </div>
          <DataSourceBadge source={ambulance.source} />
        </div>

        {ambulance.source === "demo" && (
          <p className="text-xs font-medium text-warning">DEMO — SIMULATED AMBULANCE, not a real dispatch.</p>
        )}

        <div className="flex items-center gap-3">
          <span
            className={cn(
              "h-2.5 w-2.5 shrink-0 rounded-full",
              ambulance.status === "arrived" ? "bg-success" : "bg-warning animate-pulse"
            )}
            aria-hidden="true"
          />
          <p className="text-sm font-semibold text-foreground">{STATUS_LABEL[ambulance.status]}</p>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">ETA</dt>
            <dd className="font-display text-lg font-bold text-foreground">
              {ambulance.etaMinutes !== null ? `${ambulance.etaMinutes} min` : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Distance</dt>
            <dd className="font-display text-lg font-bold text-foreground">
              {ambulance.distanceKm !== null ? `${ambulance.distanceKm} km` : "—"}
            </dd>
          </div>
        </dl>
        <p className="text-xs text-muted-foreground">Last updated {new Date(ambulance.updatedAt).toLocaleTimeString()}</p>
      </CardContent>
    </Card>
  );
}
