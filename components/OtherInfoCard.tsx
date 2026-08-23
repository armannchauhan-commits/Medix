"use client";

import { Syringe, CalendarCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TagList } from "@/components/TagList";
import { useHealthProfile } from "@/lib/health-profile-context";

export function OtherInfoCard() {
  const { profile, addVaccination, removeVaccination } = useHealthProfile();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary">
            <Syringe className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <CardTitle>Other Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-4 py-3">
          <CalendarCheck className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-foreground">
            <span className="text-muted-foreground">Last Medical Checkup:</span>{" "}
            <span className="font-semibold">{profile.medicalInfo.lastCheckup || "Not added"}</span>
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Vaccination History</Label>
          <TagList
            items={profile.vaccinations}
            onAdd={addVaccination}
            onRemove={removeVaccination}
            placeholder="Add a vaccination (e.g. Tetanus)"
            emptyLabel="No vaccination records added yet."
          />
        </div>
      </CardContent>
    </Card>
  );
}
