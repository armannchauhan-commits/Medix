import { CircleDot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function DemoModeBadge({ className }: { className?: string }) {
  return (
    <Badge variant="outline" className={cn("gap-1.5 text-muted-foreground", className)}>
      <CircleDot className="h-3 w-3 text-secondary" aria-hidden="true" />
      Demo mode — sample data only
    </Badge>
  );
}
