"use client";

import { MapPin, RotateCw, Locate, StopCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { LocationPermissionState, UserLocation } from "@/types/emergency";

interface LocationCardProps {
  location: UserLocation | null;
  permission: LocationPermissionState;
  error: string | null;
  onRefresh: () => void;
  onRecenter: () => void;
  onStop: () => void;
}

export function LocationCard({ location, permission, error, onRefresh, onRecenter, onStop }: LocationCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary">
            <MapPin className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <h2 className="font-display text-sm font-semibold text-foreground">Your Current Location</h2>
        </div>

        {permission === "granted" && location ? (
          <>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Latitude</dt>
                <dd className="font-medium text-foreground">{location.latitude.toFixed(5)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Longitude</dt>
                <dd className="font-medium text-foreground">{location.longitude.toFixed(5)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Accuracy</dt>
                <dd className="font-medium text-foreground">±{Math.round(location.accuracy)} m</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Updated</dt>
                <dd className="font-medium text-foreground">{new Date(location.timestamp).toLocaleTimeString()}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
                Refresh Location
              </Button>
              <Button variant="outline" size="sm" onClick={onRecenter}>
                <Locate className="h-3.5 w-3.5" aria-hidden="true" />
                Recenter Map
              </Button>
              <Button variant="ghost" size="sm" onClick={onStop} className="text-muted-foreground">
                <StopCircle className="h-3.5 w-3.5" aria-hidden="true" />
                Stop Tracking
              </Button>
            </div>
          </>
        ) : permission === "denied" || permission === "unsupported" || permission === "error" ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-2 rounded-lg bg-critical-soft px-3.5 py-3 text-sm text-critical">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {error || "Location access is unavailable."}
            </div>
            <Button variant="outline" size="sm" onClick={onRefresh} className="self-start">
              <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
              Retry Location
            </Button>
          </div>
        ) : (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" aria-hidden="true" />
            Requesting your location — Medix needs this to find nearby emergency services.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
