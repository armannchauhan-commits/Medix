"use client";

import Link from "next/link";
import { Phone, Users, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useHealthProfile } from "@/lib/health-profile-context";

export function EmergencyContact() {
  const { profile } = useHealthProfile();
  const contact = profile.emergencyContacts[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emergency Contact</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {contact ? (
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 bg-accent">
              <AvatarFallback>
                <Users className="h-5 w-5 text-primary" aria-hidden="true" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-foreground">{contact.name}</p>
              <p className="text-xs text-muted-foreground">{contact.relationship}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                {contact.phone}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No emergency contact added yet.</p>
        )}
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link href="/health-history">
            {contact ? (
              "Manage Contacts"
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                Add Contact
              </>
            )}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
