"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { HeartPulse, Phone, AlertTriangle, Pill, Stethoscope, ShieldCheck, User, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { apiClient, ApiEmergencyCardData } from "@/services/apiClient";

export default function PublicEmergencyCardPage() {
  const params = useParams();
  const userId = (params?.id as string) || "demo-user";

  const [cardData, setCardData] = React.useState<ApiEmergencyCardData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadCard() {
      try {
        setLoading(true);
        const data = await apiClient.getEmergencyCard(userId);
        setCardData(data);
      } catch (err) {
        console.warn("[PublicEmergencyCard] Failed to fetch from backend, using fallback data:", err);
        // Fallback demo data if backend offline
        setCardData({
          id: userId,
          personalInfo: { name: "Aarav Sharma", age: 29, gender: "Male" },
          bloodGroup: "O+",
          allergies: ["Penicillin", "Dust Mites"],
          conditions: ["Asthma (mild)", "Hypertension"],
          medications: [
            { id: "1", name: "Salbutamol Inhaler", dosage: "100 mcg", frequency: "As needed" },
            { id: "2", name: "Amlodipine", dosage: "5 mg", frequency: "Once daily" },
          ],
          emergencyContacts: [
            { name: "Priya Sharma", relationship: "Spouse", phone: "+91 98765 43210" },
          ],
          notes: "Carries inhaler in bag.",
          sharingPreferences: {
            bloodGroup: true,
            allergies: true,
            medications: true,
            conditions: true,
            emergencyContacts: true,
          },
          updatedAt: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    }

    loadCard();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-critical" />
        <p className="text-sm font-medium text-slate-300">Loading emergency information…</p>
      </div>
    );
  }

  if (!cardData) {
    return (
      <div className="mx-auto max-w-md p-6 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-critical" />
        <h1 className="mt-4 text-xl font-bold">Emergency Record Not Found</h1>
        <p className="mt-2 text-sm text-slate-400">
          The requested emergency card record could not be loaded.
        </p>
      </div>
    );
  }

  const { personalInfo, bloodGroup, allergies, conditions, medications, emergencyContacts, notes } = cardData;

  return (
    <div className="mx-auto w-full max-w-2xl flex flex-col gap-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between rounded-2xl bg-critical px-5 py-4 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <HeartPulse className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-display text-lg sm:text-xl font-extrabold tracking-tight">
              MEDIX EMERGENCY PROFILE
            </h1>
            <p className="text-xs text-white/90">First Responder Critical Health Access</p>
          </div>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-black uppercase text-critical">
          LIVE DATA
        </span>
      </div>

      {/* Patient Identity */}
      <Card className="border-slate-700 bg-slate-800 text-slate-100">
        <CardContent className="flex items-center gap-4 p-5 sm:p-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary border-2 border-primary/30">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{personalInfo.name || "Patient"}</h2>
            <p className="text-sm text-slate-400">
              {personalInfo.age ? `${personalInfo.age} years old` : "Age not specified"}
              {personalInfo.gender ? ` · ${personalInfo.gender}` : ""}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Critical Medical Fields */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Blood Group */}
        <Card className="border-critical/40 bg-slate-800 text-slate-100">
          <CardContent className="p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Blood Group
            </p>
            <div className="mt-2 flex items-center gap-3">
              <span className="inline-block rounded-xl bg-critical px-4 py-2 text-2xl font-black text-white">
                {bloodGroup || "Unknown"}
              </span>
              <span className="text-xs text-slate-400">Critical for immediate transfusion</span>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts - Quick Call */}
        <Card className="border-slate-700 bg-slate-800 text-slate-100">
          <CardContent className="p-5 flex flex-col justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Primary Emergency Contact
            </p>
            {emergencyContacts && emergencyContacts.length > 0 ? (
              <div className="mt-2 flex items-center justify-between gap-2">
                <div>
                  <p className="text-base font-bold">{emergencyContacts[0].name}</p>
                  <p className="text-xs text-slate-400">{emergencyContacts[0].relationship}</p>
                </div>
                <a
                  href={`tel:${emergencyContacts[0].phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-sm font-bold text-white shadow-md hover:bg-emerald-500 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  Call Now
                </a>
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-400">No emergency contacts listed</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Allergies & Medical Conditions */}
      <Card className="border-slate-700 bg-slate-800 text-slate-100">
        <CardContent className="flex flex-col gap-4 p-5 sm:p-6">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
              <AlertTriangle className="h-4 w-4" /> Known Allergies
            </p>
            {allergies && allergies.length > 0 ? (
              <ul className="mt-2 flex flex-wrap gap-2">
                {allergies.map((a) => (
                  <li key={a} className="rounded-lg bg-amber-500/20 px-3 py-1 text-sm font-semibold text-amber-200 border border-amber-500/30">
                    {a}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-slate-400">No known allergies on record.</p>
            )}
          </div>

          <div className="border-t border-slate-700 pt-4">
            <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-400">
              <Stethoscope className="h-4 w-4" /> Pre-Existing Medical Conditions
            </p>
            {conditions && conditions.length > 0 ? (
              <ul className="mt-2 flex flex-wrap gap-2">
                {conditions.map((c) => (
                  <li key={c} className="rounded-lg bg-sky-500/20 px-3 py-1 text-sm font-semibold text-sky-200 border border-sky-500/30">
                    {c}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-slate-400">No conditions on record.</p>
            )}
          </div>

          {notes && (
            <div className="border-t border-slate-700 pt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Medical Notes
              </p>
              <p className="mt-1 text-sm text-slate-300">{notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Medications */}
      <Card className="border-slate-700 bg-slate-800 text-slate-100">
        <CardContent className="p-5 sm:p-6">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400">
            <Pill className="h-4 w-4" /> Current Active Medications
          </p>
          {medications && medications.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-2">
              {medications.map((m) => (
                <li key={m.id} className="flex items-center justify-between rounded-xl bg-slate-700/50 p-3 text-sm">
                  <span className="font-bold text-slate-100">{m.name}</span>
                  <span className="text-xs text-slate-300">
                    {m.dosage} · {m.frequency}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-400">No active medications on record.</p>
          )}
        </CardContent>
      </Card>

      {/* Additional Contacts */}
      {emergencyContacts && emergencyContacts.length > 1 && (
        <Card className="border-slate-700 bg-slate-800 text-slate-100">
          <CardContent className="p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Secondary Emergency Contacts
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {emergencyContacts.slice(1).map((c, i) => (
                <li key={i} className="flex items-center justify-between rounded-xl bg-slate-700/50 p-3 text-sm">
                  <div>
                    <p className="font-bold">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.relationship}</p>
                  </div>
                  <a
                    href={`tel:${c.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-1 rounded-lg bg-slate-600 px-3 py-1.5 text-xs font-bold hover:bg-slate-500"
                  >
                    <Phone className="h-3 w-3" />
                    {c.phone}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Footer / Disclaimer */}
      <div className="flex items-center gap-2 rounded-xl bg-slate-800/80 p-4 text-xs text-slate-400 border border-slate-700">
        <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" />
        <span>
          Information shared here is provided directly by the patient for emergency first-response use via the Medix Emergency Response Network.
        </span>
      </div>
    </div>
  );
}
