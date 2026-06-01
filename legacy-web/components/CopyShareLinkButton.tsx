"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "./ui/toast";
import { useAppStore } from "./../lib/state/store";
import { createShareableState, generateShareUrl } from "./../lib/share/encode";
import { analytics } from "./../lib/analytics";

type Props = {
  countryId?: string; // Optional: for deep linking to a specific country
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
};

export function CopyShareLinkButton({ countryId, variant = "outline", size = "sm" }: Props) {
  const [isCopying, setIsCopying] = useState(false);
  const { toast } = useToast();
  const countriesById = useAppStore((s) => s.countriesById);
  const selectedCountryId = useAppStore((s) => s.selectedCountryId);
  const visitedCountryColor = useAppStore((s) => s.settings.visitedCountryColor);

  const handleCopyLink = async () => {
    setIsCopying(true);
    try {
      // Create shareable state
      const targetCountryId = countryId || selectedCountryId;
      const shareableState = createShareableState(
        countriesById,
        targetCountryId,
        visitedCountryColor
      );

      // Generate shareable URL
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://maps-production-d32c.up.railway.app";
      const shareUrl = generateShareUrl(baseUrl, shareableState, "copy_link");

      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      
      // Track analytics
      analytics.shareClicked("copy_link", "copy_link", "social", "map_share");

      toast({
        title: "Link copied!",
        description: "Share this link to show your map",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Failed to copy link",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "error",
      });
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopyLink}
      disabled={isCopying}
      className="gap-2"
    >
      {isCopying ? (
        <>
          <span className="animate-spin">⏳</span>
          Copying...
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2" />
          </svg>
          Copy Share Link
        </>
      )}
    </Button>
  );
}

