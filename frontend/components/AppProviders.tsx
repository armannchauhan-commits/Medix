"use client";

import { ToastProvider } from "@/lib/toast-context";
import { HealthProfileProvider } from "@/lib/health-profile-context";

/**
 * Client-side provider stack for the authenticated app shell.
 * Keeps app/(app)/layout.tsx itself a plain server component.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <HealthProfileProvider>{children}</HealthProfileProvider>
    </ToastProvider>
  );
}
