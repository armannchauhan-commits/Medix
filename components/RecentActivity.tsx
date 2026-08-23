import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivityItem } from "@/types";

export function RecentActivity({ items }: { items: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col gap-5">
          {items.map((item, index) => (
            <li key={item.id} className="flex gap-3.5">
              <div className="flex flex-col items-center">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                </span>
                {index < items.length - 1 && (
                  <span className="mt-1 w-px flex-1 bg-border" aria-hidden="true" />
                )}
              </div>
              <div className="pb-1">
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">&ldquo;{item.detail}&rdquo;</p>
                <p className="mt-0.5 text-xs text-muted-foreground/80">{item.timestamp}</p>
              </div>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
