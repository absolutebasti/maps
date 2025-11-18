"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

const DONATION_DISMISSED_KEY = "mymap.donation.dismissed";
const DONATION_COUNT_KEY = "mymap.donation.count";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
};

export function DonationDialog({ open, onOpenChange, onContinue }: Props) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const dismissedValue = localStorage.getItem(DONATION_DISMISSED_KEY);
    setDismissed(dismissedValue === "true");
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(DONATION_DISMISSED_KEY, "true");
    setDismissed(true);
    onOpenChange(false);
    onContinue();
  };

  const handleDonate = () => {
    // Increment donation count
    const count = parseInt(localStorage.getItem(DONATION_COUNT_KEY) || "0", 10);
    localStorage.setItem(DONATION_COUNT_KEY, String(count + 1));
    
    // Open PayPal in new tab
    const paypalLink = process.env.NEXT_PUBLIC_PAYPAL_DONATION_LINK;
    if (paypalLink) {
      window.open(paypalLink, "_blank");
    } else {
      console.warn("PayPal donation link not configured. Please set NEXT_PUBLIC_PAYPAL_DONATION_LINK in your .env.local file");
    }
    
    // Close dialog and continue
    onOpenChange(false);
    onContinue();
  };

  const handleSkip = () => {
    onOpenChange(false);
    onContinue();
  };

  // If user has dismissed it, skip the donation dialog and continue directly
  useEffect(() => {
    if (open && dismissed) {
      onOpenChange(false);
      onContinue();
    }
  }, [open, dismissed, onOpenChange, onContinue]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Support MyMap</DialogTitle>
          <DialogDescription>
            MyMap is free to use. If you find it helpful, consider supporting its development with a small donation.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            Your support helps keep MyMap free and allows us to add new features and improvements.
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span>💝</span>
            <span>Any amount is appreciated!</span>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="w-full sm:w-auto"
          >
            Skip
          </Button>
          <Button
            variant="outline"
            onClick={handleDismiss}
            className="w-full sm:w-auto"
          >
            Don't show again
          </Button>
          <Button
            onClick={handleDonate}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
          >
            Donate via PayPal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

