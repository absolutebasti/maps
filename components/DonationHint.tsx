"use client";

import { useState } from "react";
import { DonationDialog } from "./DonationDialog";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "default" | "compact";
  className?: string;
};

export function DonationHint({ variant = "default", className }: Props) {
  const [donationOpen, setDonationOpen] = useState(false);

  if (variant === "compact") {
    return (
      <>
        <div className={cn("text-center space-y-3 p-4 rounded-lg border bg-muted/30", className)}>
          <p className="text-sm text-muted-foreground">
            MyMap is completely free to use. If you find it helpful, consider supporting its development.
            <span className="font-medium text-foreground"> Even 1€ shows us that you love our tool! ☕</span>
          </p>
          <Button
            onClick={() => setDonationOpen(true)}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            ☕ Buy us a coffee
          </Button>
        </div>
        <DonationDialog
          open={donationOpen}
          onOpenChange={setDonationOpen}
          onContinue={() => setDonationOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className={cn("text-center space-y-4 p-6 rounded-lg border bg-muted/30", className)}>
        <p className="text-base text-muted-foreground">
          MyMap is completely <strong className="text-foreground">free to use</strong>. If you find it helpful,
          consider supporting its development with a small donation.
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Even 1€ shows us that you love our tool! ☕</span>
        </p>
        <Button
          onClick={() => setDonationOpen(true)}
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          ☕ Buy us a coffee
        </Button>
      </div>
      <DonationDialog
        open={donationOpen}
        onOpenChange={setDonationOpen}
        onContinue={() => setDonationOpen(false)}
      />
    </>
  );
}

