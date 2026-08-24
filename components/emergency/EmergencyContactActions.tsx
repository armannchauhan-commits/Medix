"use client";

import Link from "next/link";
import { Users, Phone, Share2, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHealthProfile } from "@/lib/health-profile-context";
import { useToast } from "@/lib/toast-context";
import type { UserLocation } from "@/types/emergency";

/**
 * Reads emergency contacts straight from the Step 2 health profile — no
 * re-entry. Call/Share never fire automatically; both require the person to
 * tap the button, per the Step 4 safety rules.
 */
export function EmergencyContactActions({ location }: { location: UserLocation | null }) {
  const { profile } = useHealthProfile();
  const { toast } = useToast();
  const contact = profile.emergencyContacts[0];

  async function handleShareLocation() {
    if (!location) {
      toast("Location isn't available yet.", "error");
      return;
    }
    const mapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    const shareData = {
      title: "My current location — Medix Emergency",
      text: `I'm sharing my location during a Medix emergency session.`,
      url: mapsUrl,
    };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Cancelled — fall through to clipboard.
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(mapsUrl);
        toast("Location link copied.");
        return;
      } catch {
        // Nothing more we can do.
      }
    }
    toast("Sharing isn't available in this browser.", "error");
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary">
            <Users className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <h2 className="font-display text-sm font-semibold text-foreground">👤 Emergency Contact</h2>
        </div>

        {contact ? (
          <>
            <div>
              <p className="text-sm font-semibold text-foreground">{contact.name}</p>
              <p className="text-xs text-muted-foreground">{contact.relationship}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild className="flex-1">
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  Call
                </a>
              </Button>
              <Button variant="outline" size="sm" onClick={handleShareLocation} className="flex-1">
                <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                Share Location
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">No emergency contact added yet.</p>
            <Button variant="outline" size="sm" asChild className="self-start">
              <Link href="/health-history">
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                Add Contact
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
