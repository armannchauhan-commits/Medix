"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, HeartPulse } from "lucide-react";
import { primaryNav, settingsNav } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
      <div className="flex h-16 items-center gap-2 px-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <HeartPulse className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        <span className="font-display text-lg font-bold tracking-tight text-foreground">
          MEDIX
        </span>
      </div>

      <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="flex flex-col gap-0.5">
          {primaryNav.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border px-3 py-3">
        <Link
          href={settingsNav.href}
          aria-current={pathname === settingsNav.href ? "page" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
            pathname === settingsNav.href
              ? "bg-accent text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <settingsNav.icon className="h-4.5 w-4.5" aria-hidden="true" />
          {settingsNav.label}
        </Link>
        <Link
          href="/login"
          className="mt-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4.5 w-4.5" aria-hidden="true" />
          Logout
        </Link>
      </div>
    </aside>
  );
}
