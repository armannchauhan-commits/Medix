"use client";

import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DemoModeBadge } from "@/components/DemoModeBadge";
import { demoUser } from "@/lib/demo-data";
import { useHealthProfile } from "@/lib/health-profile-context";

/**
 * Desktop top bar shown beside the Sidebar inside the authenticated shell.
 * Mobile uses MobileNav instead, which folds this and navigation together.
 */
export function Navbar() {
  const { profile } = useHealthProfile();
  const displayName = profile.personalInfo.name.trim() || demoUser.name;
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 hidden h-16 items-center gap-4 border-b border-border bg-card/95 px-6 backdrop-blur lg:flex">
      <DemoModeBadge />
      <div className="ml-auto flex items-center gap-3">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        </Button>
        <div className="flex items-center gap-2.5">
          <Avatar className="h-9 w-9 bg-accent">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-foreground">{displayName}</p>
            <p className="text-xs text-muted-foreground">Demo account</p>
          </div>
        </div>
      </div>
    </header>
  );
}
