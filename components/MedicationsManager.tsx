"use client";

import * as React from "react";
import { Pill, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHealthProfile } from "@/lib/health-profile-context";

export function MedicationsManager() {
  const { profile, addMedication, removeMedication } = useHealthProfile();
  const [name, setName] = React.useState("");
  const [dosage, setDosage] = React.useState("");
  const [frequency, setFrequency] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !dosage.trim() || !frequency.trim()) {
      setError("Fill in the medicine name, dosage and frequency.");
      return;
    }
    addMedication({ name: name.trim(), dosage: dosage.trim(), frequency: frequency.trim() });
    setName("");
    setDosage("");
    setFrequency("");
    setError(null);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary">
            <Pill className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <CardTitle>Current Medications</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {profile.medications.length === 0 ? (
          <p className="text-sm text-muted-foreground">No medications added yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {profile.medications.map((med) => (
              <li
                key={med.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{med.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {med.dosage} · {med.frequency}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeMedication(med.id)}
                  aria-label={`Remove ${med.name}`}
                  className="shrink-0 text-muted-foreground hover:text-critical"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleAdd} className="grid gap-3 rounded-xl border border-dashed border-border p-4 sm:grid-cols-[1.2fr_1fr_1fr_auto]">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="med-name" className="text-xs">
              Medicine name
            </Label>
            <Input id="med-name" placeholder="Paracetamol" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="med-dosage" className="text-xs">
              Dosage
            </Label>
            <Input id="med-dosage" placeholder="500 mg" value={dosage} onChange={(e) => setDosage(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="med-frequency" className="text-xs">
              Frequency
            </Label>
            <Input
              id="med-frequency"
              placeholder="As needed"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" variant="outline" className="w-full sm:w-auto">
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span className="sm:hidden">Add Medication</span>
            </Button>
          </div>
        </form>
        {error && <p className="-mt-2 text-xs font-medium text-critical">{error}</p>}
        <p className="text-xs text-muted-foreground">
          This list is for your own tracking — it isn&apos;t a prescription.
        </p>
      </CardContent>
    </Card>
  );
}
