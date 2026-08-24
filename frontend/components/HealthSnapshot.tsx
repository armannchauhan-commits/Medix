"use client";

import Link from "next/link";
import { Droplet, Pill, Scale, CalendarCheck, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DemoModeBadge } from "@/components/DemoModeBadge";
import { Button } from "@/components/ui/button";
import { useHealthProfile } from "@/lib/health-profile-context";

export function HealthSnapshot() {
  const { profile } = useHealthProfile();
  const { personalInfo, medicalInfo, medications } = profile;

  const stats = [
    {
      label: "Weight",
      value: personalInfo.weight !== null ? `${personalInfo.weight} kg` : null,
      icon: Scale,
    },
    { label: "Blood Group", value: medicalInfo.bloodGroup || null, icon: Droplet },
    {
      label: "Medications",
      value: medications.length > 0 ? `${medications.length} active` : null,
      icon: Pill,
    },
    { label: "Last Checkup", value: medicalInfo.lastCheckup || null, icon: CalendarCheck },
  ];

  const missingCount = stats.filter((s) => !s.value).length;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Health Snapshot</CardTitle>
        <DemoModeBadge className="hidden sm:flex" />
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col gap-2">
              <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {label}
              </dt>
              <dd
                className={
                  value
                    ? "font-display text-lg font-semibold text-foreground"
                    : "text-sm italic text-muted-foreground"
                }
              >
                {value ?? "Not added"}
              </dd>
            </div>
          ))}
        </dl>
        {missingCount > 0 && (
          <Button variant="outline" size="sm" asChild className="self-start">
            <Link href="/health-history">
              Complete Profile
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
