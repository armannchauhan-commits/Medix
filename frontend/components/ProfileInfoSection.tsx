"use client";

import * as React from "react";
import { Pencil, Save, X, User, HeartPulse } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TagList } from "@/components/TagList";
import { AlertTriangle, Stethoscope } from "lucide-react";
import { useHealthProfile } from "@/lib/health-profile-context";
import { useToast } from "@/lib/toast-context";
import type { PersonalInfo, MedicalInfo, Gender, BloodGroup } from "@/types/health";

type MedicalCoreDraft = Pick<MedicalInfo, "bloodGroup" | "surgeries" | "notes" | "lastCheckup">;

interface FormErrors {
  name?: string;
  age?: string;
  height?: string;
  weight?: string;
}

const genderOptions: Gender[] = ["Male", "Female", "Other", "Prefer not to say"];
const bloodGroupOptions: BloodGroup[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"];

function DisplayField({ label, value }: { label: string; value: React.ReactNode }) {
  const empty = value === "" || value === null || value === undefined;
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className={empty ? "text-sm italic text-muted-foreground" : "text-sm font-semibold text-foreground"}>
        {empty ? "Not added" : value}
      </dd>
    </div>
  );
}

export function ProfileInfoSection() {
  const { profile, updatePersonalInfo, updateMedicalCore, addAllergy, removeAllergy, addCondition, removeCondition } =
    useHealthProfile();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = React.useState(false);
  const [personalDraft, setPersonalDraft] = React.useState<PersonalInfo>(profile.personalInfo);
  const [medicalDraft, setMedicalDraft] = React.useState<MedicalCoreDraft>({
    bloodGroup: profile.medicalInfo.bloodGroup,
    surgeries: profile.medicalInfo.surgeries,
    notes: profile.medicalInfo.notes,
    lastCheckup: profile.medicalInfo.lastCheckup,
  });
  const [errors, setErrors] = React.useState<FormErrors>({});

  function startEditing() {
    setPersonalDraft(profile.personalInfo);
    setMedicalDraft({
      bloodGroup: profile.medicalInfo.bloodGroup,
      surgeries: profile.medicalInfo.surgeries,
      notes: profile.medicalInfo.notes,
      lastCheckup: profile.medicalInfo.lastCheckup,
    });
    setErrors({});
    setIsEditing(true);
  }

  function cancelEditing() {
    setErrors({});
    setIsEditing(false);
  }

  function validate(): boolean {
    const next: FormErrors = {};
    if (!personalDraft.name.trim()) next.name = "Full name is required.";
    if (personalDraft.age !== null && personalDraft.age < 0) next.age = "Age can't be negative.";
    if (personalDraft.age !== null && personalDraft.age > 120) next.age = "Enter a realistic age.";
    if (personalDraft.height !== null && personalDraft.height < 0) next.height = "Height can't be negative.";
    if (personalDraft.weight !== null && personalDraft.weight < 0) next.weight = "Weight can't be negative.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    updatePersonalInfo(personalDraft);
    updateMedicalCore(medicalDraft);
    setIsEditing(false);
    toast("Health profile updated successfully.");
  }

  function numberOrNull(raw: string): number | null {
    if (raw.trim() === "") return null;
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? null : parsed;
  }

  return (
    <>
      <Card id="personal-information">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary">
              <User className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <CardTitle>Personal Information</CardTitle>
          </div>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={startEditing}>
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              Edit Profile
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="pi-name">Full Name</Label>
                <Input
                  id="pi-name"
                  value={personalDraft.name}
                  onChange={(e) => setPersonalDraft((p) => ({ ...p, name: e.target.value }))}
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && <p className="text-xs font-medium text-critical">{errors.name}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pi-age">Age</Label>
                <Input
                  id="pi-age"
                  type="number"
                  min={0}
                  value={personalDraft.age ?? ""}
                  onChange={(e) => setPersonalDraft((p) => ({ ...p, age: numberOrNull(e.target.value) }))}
                  aria-invalid={Boolean(errors.age)}
                />
                {errors.age && <p className="text-xs font-medium text-critical">{errors.age}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pi-gender">Gender</Label>
                <Select
                  id="pi-gender"
                  value={personalDraft.gender}
                  onChange={(e) => setPersonalDraft((p) => ({ ...p, gender: e.target.value as Gender }))}
                >
                  <option value="">Select gender</option>
                  {genderOptions.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pi-dob">Date of Birth</Label>
                <Input
                  id="pi-dob"
                  type="date"
                  value={personalDraft.dateOfBirth}
                  onChange={(e) => setPersonalDraft((p) => ({ ...p, dateOfBirth: e.target.value }))}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pi-height">Height (cm)</Label>
                <Input
                  id="pi-height"
                  type="number"
                  min={0}
                  value={personalDraft.height ?? ""}
                  onChange={(e) => setPersonalDraft((p) => ({ ...p, height: numberOrNull(e.target.value) }))}
                  aria-invalid={Boolean(errors.height)}
                />
                {errors.height && <p className="text-xs font-medium text-critical">{errors.height}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pi-weight">Weight (kg)</Label>
                <Input
                  id="pi-weight"
                  type="number"
                  min={0}
                  value={personalDraft.weight ?? ""}
                  onChange={(e) => setPersonalDraft((p) => ({ ...p, weight: numberOrNull(e.target.value) }))}
                  aria-invalid={Boolean(errors.weight)}
                />
                {errors.weight && <p className="text-xs font-medium text-critical">{errors.weight}</p>}
              </div>
            </div>
          ) : (
            <dl className="grid gap-5 sm:grid-cols-3">
              <DisplayField label="Full Name" value={profile.personalInfo.name} />
              <DisplayField label="Age" value={profile.personalInfo.age} />
              <DisplayField label="Gender" value={profile.personalInfo.gender} />
              <DisplayField label="Date of Birth" value={profile.personalInfo.dateOfBirth} />
              <DisplayField
                label="Height"
                value={profile.personalInfo.height !== null ? `${profile.personalInfo.height} cm` : null}
              />
              <DisplayField
                label="Weight"
                value={profile.personalInfo.weight !== null ? `${profile.personalInfo.weight} kg` : null}
              />
            </dl>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary">
              <HeartPulse className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <CardTitle>Medical Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {isEditing ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="mi-blood">Blood Group</Label>
                  <Select
                    id="mi-blood"
                    value={medicalDraft.bloodGroup}
                    onChange={(e) =>
                      setMedicalDraft((m) => ({ ...m, bloodGroup: e.target.value as BloodGroup }))
                    }
                  >
                    <option value="">Select blood group</option>
                    {bloodGroupOptions.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="mi-checkup">Last Medical Checkup</Label>
                  <Input
                    id="mi-checkup"
                    placeholder="e.g. 12 Aug 2026"
                    value={medicalDraft.lastCheckup}
                    onChange={(e) => setMedicalDraft((m) => ({ ...m, lastCheckup: e.target.value }))}
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label htmlFor="mi-surgeries">Previous Surgeries</Label>
                  <Textarea
                    id="mi-surgeries"
                    rows={2}
                    placeholder="List any previous surgeries, or leave blank"
                    value={medicalDraft.surgeries}
                    onChange={(e) => setMedicalDraft((m) => ({ ...m, surgeries: e.target.value }))}
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <Label htmlFor="mi-notes">Important Medical Notes</Label>
                  <Textarea
                    id="mi-notes"
                    rows={3}
                    placeholder="Anything else a doctor or first responder should know"
                    value={medicalDraft.notes}
                    onChange={(e) => setMedicalDraft((m) => ({ ...m, notes: e.target.value }))}
                  />
                </div>
              </>
            ) : (
              <>
                <DisplayField label="Blood Group" value={profile.medicalInfo.bloodGroup} />
                <DisplayField label="Last Medical Checkup" value={profile.medicalInfo.lastCheckup} />
                <DisplayField label="Previous Surgeries" value={profile.medicalInfo.surgeries || null} />
                <DisplayField label="Important Medical Notes" value={profile.medicalInfo.notes || null} />
              </>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-warning" aria-hidden="true" />
              Allergies
            </Label>
            <TagList
              items={profile.medicalInfo.allergies}
              onAdd={addAllergy}
              onRemove={removeAllergy}
              placeholder="Add an allergy (e.g. Penicillin)"
              variant="warning"
              icon={AlertTriangle}
              emptyLabel="No known allergies added yet."
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="flex items-center gap-1.5">
              <Stethoscope className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              Current Medical Conditions
            </Label>
            <TagList
              items={profile.medicalInfo.conditions}
              onAdd={addCondition}
              onRemove={removeCondition}
              placeholder="Add a condition (e.g. Asthma)"
              emptyLabel="No medical conditions added yet."
            />
          </div>
        </CardContent>
      </Card>

      {isEditing && (
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={cancelEditing}>
            <X className="h-4 w-4" aria-hidden="true" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4" aria-hidden="true" />
            Save Changes
          </Button>
        </div>
      )}
    </>
  );
}
