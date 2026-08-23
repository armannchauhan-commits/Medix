import { Droplet, Pill, Scale, CalendarCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DemoModeBadge } from "@/components/DemoModeBadge";
import type { HealthSnapshotData } from "@/types";

export function HealthSnapshot({ data }: { data: HealthSnapshotData }) {
  const stats = [
    { label: "Weight", value: `${data.weightKg} kg`, icon: Scale },
    { label: "Blood Group", value: data.bloodGroup, icon: Droplet },
    { label: "Medications", value: `${data.activeMedications} active`, icon: Pill },
    { label: "Last Checkup", value: data.lastCheckup, icon: CalendarCheck },
  ];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Health Snapshot</CardTitle>
        <DemoModeBadge className="hidden sm:flex" />
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col gap-2">
              <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {label}
              </dt>
              <dd className="font-display text-lg font-semibold text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
