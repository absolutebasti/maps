"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

const DONATION_COUNT_KEY = "mymap.donation.count";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
};

export function DonationDialog({ open, onOpenChange, onContinue }: Props) {
  const handleDonate = (amount?: number) => {
    // Increment donation count
    const count = parseInt(localStorage.getItem(DONATION_COUNT_KEY) || "0", 10);
    localStorage.setItem(DONATION_COUNT_KEY, String(count + 1));

    // Open PayPal in new tab
    const paypalLink = process.env.NEXT_PUBLIC_PAYPAL_DONATION_LINK;

    // Debug: Log environment variable status
    console.log("PayPal link check:", {
      hasLink: !!paypalLink,
      linkValue: paypalLink ? "***configured***" : "undefined",
      allEnvVars: Object.keys(process.env).filter(k => k.includes("PAYPAL"))
    });

    if (!paypalLink) {
      console.error("PayPal donation link not configured. Please set NEXT_PUBLIC_PAYPAL_DONATION_LINK in your .env.local file");
      console.error("Make sure to restart your dev server after creating/updating .env.local");
      alert("PayPal link not configured. Please restart your dev server (stop and run 'npm run dev' again).");
      onOpenChange(false);
      onContinue();
      return;
    }

    // Build the final PayPal link
    let finalLink = paypalLink;

    // Handle different PayPal link formats
    if (amount) {
      // Extract username from various PayPal link formats
      let username = "";

      // Format 1: https://paypal.me/username
      if (paypalLink.includes("paypal.me/")) {
        username = paypalLink.split("paypal.me/")[1]?.split("/")[0]?.split("?")[0] || "";
        if (username) {
          finalLink = `https://paypal.me/${username}/${amount}`;
        }
      }
      // Format 2: https://www.paypal.com/paypalme/username
      else if (paypalLink.includes("paypal.com/paypalme/")) {
        username = paypalLink.split("paypal.com/paypalme/")[1]?.split("/")[0]?.split("?")[0] || "";
        if (username) {
          // Convert to standard paypal.me format with amount
          finalLink = `https://paypal.me/${username}/${amount}`;
        }
      }
      // Format 3: https://www.paypal.com/donate (hosted button)
      else if (paypalLink.includes("paypal.com/donate")) {
        try {
          const url = new URL(paypalLink);
          url.searchParams.set("amount", amount.toString());
          url.searchParams.set("currency_code", "EUR");
          finalLink = url.toString();
        } catch {
          // If URL parsing fails, just use original link
          finalLink = paypalLink;
        }
      }
    }

    // Open PayPal in new tab
    try {
      const paypalWindow = window.open(finalLink, "_blank", "noopener,noreferrer");
      if (!paypalWindow) {
        // Popup blocked - show alert
        alert("Please allow popups to open the PayPal donation page, or copy this link: " + finalLink);
      }
    } catch (error) {
      console.error("Error opening PayPal link:", error);
      alert("Error opening PayPal. Please try: " + finalLink);
    }

    // Close dialog and continue
    onOpenChange(false);
    onContinue();
  };

  const handleSkip = () => {
    onOpenChange(false);
    onContinue();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Love MyMap? ☕</DialogTitle>
          <DialogDescription>
            We&apos;re a small team passionate about helping travelers like you. Your support keeps MyMap free for everyone!
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Every coffee helps us add new features and keep the servers running. Thank you for being awesome! 💙
          </p>

          {/* Suggested Amount */}
          <div className="border rounded-lg p-3 bg-muted/50">
            <p className="text-xs text-muted-foreground mb-2">Suggested donation:</p>
            <Button
              onClick={() => handleDonate(2)}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              ☕ Buy us a coffee (2€)
            </Button>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="w-full sm:w-auto"
          >
            Maybe later
          </Button>
          <Button
            onClick={() => handleDonate()}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
          >
            Donate via PayPal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

