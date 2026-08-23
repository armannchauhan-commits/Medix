"use client";

import * as React from "react";
import { ShieldCheck, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useHealthProfile } from "@/lib/health-profile-context";
import { useToast } from "@/lib/toast-context";
import type { SharingPreferences } from "@/types/health";

const rows: { key: keyof SharingPreferences; label: string }[] = [
  { key: "bloodGroup", label: "Blood Group" },
  { key: "allergies", label: "Allergies" },
  { key: "medications", label: "Medications" },
  { key: "conditions", label: "Medical Conditions" },
  { key: "emergencyContacts", label: "Emergency Contacts" },
];

export function SharingPreferencesCard() {
  const { profile, updateSharingPreferences } = useHealthProfile();
  const { toast } = useToast();
  const [draft, setDraft] = React.useState<SharingPreferences>(profile.sharingPreferences);

  // Keep the local draft in sync if the underlying profile changes (e.g. after hydration).
  React.useEffect(() => {
    setDraft(profile.sharingPreferences);
  }, [profile.sharingPreferences]);

  function handleSave() {
    updateSharingPreferences(draft);
    toast("Emergency sharing preferences updated.");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary">
            <ShieldCheck className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <CardTitle>Emergency Information Sharing</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <p className="text-sm text-muted-foreground">
          Only the information you choose will be shared during an emergency.
        </p>
        <ul className="flex flex-col divide-y divide-border">
          {rows.map(({ key, label }) => (
            <li key={key} className="flex items-center justify-between py-3">
              <Label htmlFor={`share-${key}`} className="text-sm font-medium text-foreground">
                {label}
              </Label>
              <Switch
                id={`share-${key}`}
                checked={draft[key]}
                onCheckedChange={(checked) => setDraft((d) => ({ ...d, [key]: checked }))}
                aria-label={`Share ${label} during SOS`}
              />
            </li>
          ))}
        </ul>
        <Button onClick={handleSave} className="self-start">
          <Save className="h-4 w-4" aria-hidden="true" />
          Save Sharing Preferences
        </Button>
      </CardContent>
    </Card>
  );
}
