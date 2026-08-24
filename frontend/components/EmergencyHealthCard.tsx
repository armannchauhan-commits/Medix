"use client";

import * as React from "react";
import { QRCodeSVG } from "qrcode.react";
import { HeartPulse, User, Phone, AlertTriangle, Pill, Stethoscope, QrCode, ExternalLink } from "lucide-react";
import { useHealthProfile } from "@/lib/health-profile-context";
import { cn } from "@/lib/utils";

function Field({
  label,
  shared,
  children,
}: {
  label: string;
  shared: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/60">{label}</p>
        {!shared && (
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/60">
            Not shared
          </span>
        )}
      </div>
      <div className="mt-1.5">{shared ? children : <p className="text-sm text-white/40">Hidden by sharing settings</p>}</div>
    </div>
  );
}

export function EmergencyHealthCard({ className }: { className?: string }) {
  const { profile } = useHealthProfile();
  const { personalInfo, medicalInfo, medications, emergencyContacts, sharingPreferences } = profile;
  const primaryContact = emergencyContacts[0];
  const initials = personalInfo.name.trim().slice(0, 2).toUpperCase() || "MX";

  const [baseUrl, setBaseUrl] = React.useState(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  );

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.location.origin) {
      setBaseUrl(process.env.NEXT_PUBLIC_APP_URL || window.location.origin);
    }
  }, []);

  const emergencyQrUrl = `${baseUrl}/emergency/demo-user`;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-primary/30 bg-primary text-white shadow-card-hover",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15">
            <HeartPulse className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-display text-base font-bold tracking-tight">MEDIX</span>
        </div>
        <span className="rounded-full bg-critical px-3 py-1 text-[11px] font-bold uppercase tracking-wide">
          Emergency Health Card
        </span>
      </div>

      <div className="flex flex-col gap-6 p-6 sm:p-7">
        {/* Identity */}
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-white/30 bg-white/10 font-display text-lg font-bold">
            {initials || <User className="h-6 w-6" aria-hidden="true" />}
          </span>
          <div>
            <p className="font-display text-xl font-bold">{personalInfo.name || "Not added"}</p>
            <p className="text-sm text-white/70">
              {personalInfo.age !== null ? `${personalInfo.age} years` : "Age not added"}
              {personalInfo.gender ? ` · ${personalInfo.gender}` : ""}
            </p>
          </div>
        </div>

        {/* Blood group — the single most time-critical field */}
        <Field label="Blood Group" shared={sharingPreferences.bloodGroup}>
          <span className="inline-flex items-center rounded-lg bg-critical px-4 py-2 font-display text-2xl font-extrabold">
            {medicalInfo.bloodGroup || "—"}
          </span>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Allergies" shared={sharingPreferences.allergies}>
            {medicalInfo.allergies.length ? (
              <ul className="flex flex-wrap gap-1.5">
                {medicalInfo.allergies.map((a) => (
                  <li
                    key={a}
                    className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium"
                  >
                    <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                    {a}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-white/70">None on file</p>
            )}
          </Field>

          <Field label="Medical Conditions" shared={sharingPreferences.conditions}>
            {medicalInfo.conditions.length ? (
              <ul className="flex flex-wrap gap-1.5">
                {medicalInfo.conditions.map((c) => (
                  <li
                    key={c}
                    className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium"
                  >
                    <Stethoscope className="h-3 w-3" aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-white/70">None on file</p>
            )}
          </Field>
        </div>

        <Field label="Current Medications" shared={sharingPreferences.medications}>
          {medications.length ? (
            <ul className="flex flex-col gap-1.5">
              {medications.map((m) => (
                <li key={m.id} className="flex items-center gap-2 text-sm">
                  <Pill className="h-3.5 w-3.5 shrink-0 text-white/70" aria-hidden="true" />
                  <span className="font-medium">{m.name}</span>
                  <span className="text-white/70">
                    {m.dosage} · {m.frequency}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-white/70">None on file</p>
          )}
        </Field>

        <Field label="Emergency Contact" shared={sharingPreferences.emergencyContacts}>
          {primaryContact ? (
            <div className="flex items-center justify-between gap-3 rounded-xl bg-white/10 px-3.5 py-2.5">
              <div>
                <p className="text-sm font-semibold">{primaryContact.name}</p>
                <p className="text-xs text-white/70">{primaryContact.relationship}</p>
              </div>
              <a
                href={`tel:${primaryContact.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-white/25"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                {primaryContact.phone}
              </a>
            </div>
          ) : (
            <p className="text-sm text-white/70">No emergency contact added</p>
          )}
        </Field>

        {/* Dynamic QR code with configurable destination */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl bg-white/10 p-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-white p-2 shadow-sm">
            <QRCodeSVG value={emergencyQrUrl} size={64} bgColor="#ffffff" fgColor="#0f172a" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="flex items-center gap-1.5 text-sm font-semibold">
              <QrCode className="h-4 w-4" aria-hidden="true" />
              Scan for Emergency Information
            </p>
            <p className="text-xs text-white/70 break-all">
              Points to Medix emergency portal:
            </p>
            <a
              href={emergencyQrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent underline underline-offset-2 hover:text-white"
            >
              <span>{emergencyQrUrl}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
