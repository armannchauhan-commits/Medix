"use client";

import { IdCard, Eye, Share2, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { EmergencyHealthCard } from "@/components/EmergencyHealthCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/lib/toast-context";

export default function EmergencyCardPage() {
  const { toast } = useToast();

  async function handleShare() {
    const shareData = {
      title: "Medix Emergency Health Card",
      text: "View my Medix emergency health card (demo).",
      url: "https://medix.app/emergency-card/demo",
    };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled the native share sheet — fall through to the clipboard fallback.
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareData.url);
        toast("Emergency card link copied (demo).");
        return;
      } catch {
        // Clipboard write blocked — nothing more we can do in this demo interaction.
      }
    }
    toast("Sharing isn't available in this browser.", "error");
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={IdCard}
        title="Emergency Card"
        description="A quick, shareable snapshot of the information a first responder needs most."
      >
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Eye className="h-4 w-4" aria-hidden="true" />
                View Emergency Card
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm p-0">
              <DialogTitle className="sr-only">Emergency Health Card</DialogTitle>
              <EmergencyHealthCard />
            </DialogContent>
          </Dialog>
          <Button onClick={handleShare}>
            <Share2 className="h-4 w-4" aria-hidden="true" />
            Share Emergency Card
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <EmergencyHealthCard />

        <Card className="h-fit">
          <CardContent className="flex flex-col gap-4 p-6 sm:p-7">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary">
                <ShieldCheck className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <h2 className="font-display text-base font-semibold text-foreground">
                What&apos;s shown on this card
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This card pulls directly from your Health History profile and
              only shows the categories you&apos;ve allowed under Emergency
              Information Sharing. Fields you&apos;ve turned off appear as
              &ldquo;Not shared.&rdquo;
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Update what&apos;s included any time from{" "}
              <a href="/health-history" className="font-semibold text-primary hover:underline">
                Health History
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>

      <MedicalDisclaimer />
    </div>
  );
}
