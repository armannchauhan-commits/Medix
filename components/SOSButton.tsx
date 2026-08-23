"use client";

import Link from "next/link";
import { Siren } from "lucide-react";
import { cn } from "@/lib/utils";

interface SOSButtonProps {
  variant?: "full" | "compact";
  className?: string;
}

/**
 * The emergency entry point. Deliberately styled apart from every other
 * action in the product — critical red, its own pulse ring, its own shadow —
 * so it reads as unmistakable at a glance, on any page, on any screen size.
 *
 * Step 1 only wires this to /sos. No real emergency logic lives here yet.
 */
export function SOSButton({ variant = "full", className }: SOSButtonProps) {
  if (variant === "compact") {
    return (
      <Link
        href="/sos"
        aria-label="SOS — Emergency assistance"
        className={cn(
          "group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-critical text-critical-foreground shadow-soft transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-critical focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className
        )}
      >
        <span className="absolute inset-0 rounded-full bg-critical/60 animate-pulse-ring" aria-hidden="true" />
        <Siren className="relative h-5 w-5" aria-hidden="true" />
      </Link>
    );
  }

  return (
    <Link
      href="/sos"
      aria-label="SOS — Get emergency assistance"
      className={cn(
        "group relative flex items-center gap-4 overflow-hidden rounded-2xl bg-critical px-5 py-4 text-critical-foreground shadow-sos-glow transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-critical focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-6 sm:py-5",
        className
      )}
    >
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 sm:h-14 sm:w-14">
        <span className="absolute inset-0 rounded-full bg-white/25 animate-pulse-ring" aria-hidden="true" />
        <Siren className="relative h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
      </span>
      <span className="flex flex-col items-start">
        <span className="font-display text-lg font-bold leading-tight sm:text-xl">SOS</span>
        <span className="text-xs font-medium text-critical-foreground/90 sm:text-sm">
          Emergency Assistance
        </span>
      </span>
      <span className="ml-auto hidden text-xs font-semibold text-critical-foreground/80 sm:block">
        Tap for help →
      </span>
    </Link>
  );
}
