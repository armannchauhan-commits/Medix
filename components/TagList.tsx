"use client";

import * as React from "react";
import { Plus, X, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TagListProps {
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
  placeholder: string;
  icon?: LucideIcon;
  variant?: "default" | "warning";
  emptyLabel: string;
}

/**
 * Add / remove / view list for single-value entries — allergies, medical
 * conditions, vaccinations. Enter or the Add button both submit.
 */
export function TagList({
  items,
  onAdd,
  onRemove,
  placeholder,
  icon: Icon,
  variant = "default",
  emptyLabel,
}: TagListProps) {
  const [draft, setDraft] = React.useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    onAdd(draft.trim());
    setDraft("");
  }

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={submit} className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
        />
        <Button type="submit" variant="outline" size="default" className="shrink-0 px-3.5">
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Add</span>
        </Button>
      </form>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {items.map((item) => (
            <li key={item}>
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium",
                  variant === "warning"
                    ? "border-warning/30 bg-warning/10 text-warning"
                    : "border-border bg-muted text-foreground"
                )}
              >
                {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
                {item}
                <button
                  type="button"
                  onClick={() => onRemove(item)}
                  aria-label={`Remove ${item}`}
                  className="rounded-full p-0.5 transition-colors hover:bg-black/10"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
