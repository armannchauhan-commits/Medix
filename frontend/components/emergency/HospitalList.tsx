"use client";

import { Hospital as HospitalIcon, Navigation, Phone, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataSourceBadge } from "@/components/emergency/DataSourceBadge";
import type { Hospital, DataSource } from "@/types/emergency";

function Field({ label, value }: { label: string; value: string | number | null }) {
  return (
    <p className="flex items-center gap-1 text-xs text-muted-foreground">
      <span className="font-medium text-foreground">{label}:</span>{" "}
      {value === null || value === "" ? <span className="italic">Information unavailable</span> : value}
    </p>
  );
}

function HospitalCard({ hospital }: { hospital: Hospital }) {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`;

  return (
    <li className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-sm font-semibold text-foreground">{hospital.name}</p>
          <p className="text-xs text-muted-foreground">{hospital.address ?? "Address unavailable"}</p>
        </div>
        {hospital.distanceKm !== null && (
          <span className="shrink-0 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-primary">
            {hospital.distanceKm} km
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        <Field label="Phone" value={hospital.phone} />
        <Field label="Rating" value={hospital.rating !== null ? `${hospital.rating} ★` : null} />
        <Field label="Hours" value={hospital.openingHours} />
        <Field label="Emergency" value={hospital.emergencyStatus} />
      </div>

      <div className="flex flex-col gap-1 rounded-lg bg-card px-3 py-2.5">
        <p className="text-xs font-semibold text-foreground">Live status</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            Bed availability <DataSourceBadge source="unavailable" />
          </span>
          <span className="flex items-center gap-1.5">
            ICU availability <DataSourceBadge source="unavailable" />
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild className="flex-1">
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
            <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
            Directions
          </a>
        </Button>
        {hospital.phone && (
          <Button variant="outline" size="sm" asChild className="flex-1">
            <a href={`tel:${hospital.phone.replace(/\s/g, "")}`}>
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              Call
            </a>
          </Button>
        )}
      </div>
    </li>
  );
}

interface HospitalListProps {
  hospitals: Hospital[];
  source: DataSource;
  loading: boolean;
}

export function HospitalList({ hospitals, source, loading }: HospitalListProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary">
              <HospitalIcon className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <h2 className="font-display text-sm font-semibold text-foreground">Nearby Hospitals</h2>
          </div>
          {!loading && <DataSourceBadge source={source} />}
        </div>

        {loading ? (
          <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Searching for real nearby hospitals…
          </div>
        ) : hospitals.length === 0 ? (
          <p className="rounded-lg bg-muted/50 px-3.5 py-3 text-sm text-muted-foreground">
            {source === "unavailable"
              ? "We couldn't reach the hospital data provider right now. Please call emergency services directly if needed."
              : "No hospitals found within range of your current location."}
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {hospitals.map((h) => (
              <HospitalCard key={h.id} hospital={h} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
