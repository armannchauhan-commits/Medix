import { Phone, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { EmergencyContactData } from "@/types";

export function EmergencyContact({ contact }: { contact: EmergencyContactData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Emergency Contact</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 bg-accent">
            <AvatarFallback>
              <Users className="h-5 w-5 text-primary" aria-hidden="true" />
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-foreground">{contact.name}</p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {contact.phone}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <a href="/settings">Manage Contacts</a>
        </Button>
      </CardContent>
    </Card>
  );
}
