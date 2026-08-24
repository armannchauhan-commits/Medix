"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogOut, HeartPulse } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SOSButton } from "@/components/SOSButton";
import { primaryNav, settingsNav } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <SheetHeader className="flex h-16 flex-row items-center gap-2 border-b border-border px-6">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HeartPulse className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <SheetTitle>MEDIX</SheetTitle>
          </SheetHeader>

          <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 py-2">
            <ul className="flex flex-col gap-0.5">
              {primaryNav.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
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
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <settingsNav.icon className="h-4.5 w-4.5" aria-hidden="true" />
              {settingsNav.label}
            </Link>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-0.5 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4.5 w-4.5" aria-hidden="true" />
              Logout
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      <Link href="/dashboard" className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <HeartPulse className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="font-display text-base font-bold tracking-tight text-foreground">
          MEDIX
        </span>
      </Link>

      <div className="ml-auto">
        <SOSButton variant="compact" />
      </div>
    </header>
  );
}
