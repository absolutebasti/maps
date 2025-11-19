"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "./ui/toast";
import { DonationDialog } from "./DonationDialog";
import { analytics } from "./../lib/analytics";
import { getShareableUrl } from "./../lib/share-utils";
import { useAppStore } from "./../lib/state/store";
import { createShareableState, generateShareUrl } from "./../lib/share/encode";
import { recordEvent } from "./../lib/supabase/stats";

type Props = {
  targetContainerId: string;
};

export function ShareButton({ targetContainerId }: Props) {
  const [isSharing, setIsSharing] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);
  const { toast } = useToast();
  const countriesById = useAppStore((s) => s.countriesById);
  const selectedCountryId = useAppStore((s) => s.selectedCountryId);
  const visitedCountryColor = useAppStore((s) => s.settings.visitedCountryColor);

  const performShare = async () => {
    const container = document.getElementById(targetContainerId);
    if (!container) {
      toast({
        title: "Share failed",
        description: "Map container not found",
        variant: "error",
      });
      return;
    }

    setIsSharing(true);
    try {
      const svg = container.querySelector("svg");
      if (!svg) {
        throw new Error("No SVG found to share");
      }

      // Convert SVG to blob
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
      });

      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 630;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 1200, 630);
      ctx.drawImage(img, 0, 0, 1200, 630);

      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast({
            title: "Share failed",
            description: "Failed to create image",
            variant: "error",
          });
          setIsSharing(false);
          URL.revokeObjectURL(url);
          return;
        }

        try {
          // Create shareable state from current map
          const shareableState = createShareableState(
            countriesById,
            selectedCountryId,
            visitedCountryColor
          );
          
          // Generate shareable URL with encoded map state
          const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://maps-production-d32c.up.railway.app";
          const shareUrl = generateShareUrl(baseUrl, shareableState, "web_share");
          const shareText = `Check out my travel map! ${shareUrl}`;
          
          // Try Web Share API
          if (navigator.share) {
            const file = new File([blob], "mymap.png", { type: "image/png" });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              // Note: Some browsers don't support url parameter with files
              // We include the URL in the text instead
              await navigator.share({
                title: "My Visited Countries Map",
                text: shareText,
                files: [file],
              });
              // Track share event with method and UTM parameters
              analytics.shareClicked("web_share_api", "web_share", "social", "map_share");
              // Track in Supabase stats
              recordEvent('share_clicked');
              toast({
                title: "Shared successfully",
                description: "Your map has been shared",
                variant: "success",
              });
            } else {
              // Fallback: copy URL to clipboard (image sharing not supported)
              try {
                await navigator.clipboard.writeText(shareText);
                // Track share event
                analytics.shareClicked("clipboard_url", "clipboard", "social", "map_share");
                // Track in Supabase stats
                recordEvent('share_clicked');
                toast({
                  title: "Link copied to clipboard",
                  description: "Share link with UTM parameters copied. You can paste it anywhere!",
                  variant: "success",
                });
              } catch {
                // If clipboard fails, show URL to user
                analytics.shareClicked("clipboard_failed", "clipboard", "social", "map_share");
                // Track in Supabase stats (still counts as a share attempt)
                recordEvent('share_clicked');
                toast({
                  title: "Share link",
                  description: `Copy this link: ${shareUrl}`,
                  variant: "default",
                });
              }
            }
          } else {
            // Fallback: try to copy URL to clipboard, then offer image download
            try {
              await navigator.clipboard.writeText(shareText);
              // Track share event
              analytics.shareClicked("clipboard_url", "clipboard", "social", "map_share");
              // Track in Supabase stats
              recordEvent('share_clicked');
              toast({
                title: "Link copied to clipboard",
                description: "Share link with UTM parameters copied! Downloading image...",
                variant: "success",
              });
              // Also download the image
              const downloadUrl = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = downloadUrl;
              a.download = "mymap-share.png";
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(downloadUrl);
            } catch {
              // Final fallback: download image and show URL
              const downloadUrl = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = downloadUrl;
              a.download = "mymap-share.png";
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(downloadUrl);
              // Track share event
              analytics.shareClicked("download", "download", "social", "map_share");
              // Track in Supabase stats
              recordEvent('share_clicked');
              toast({
                title: "Downloaded",
                description: `Map image downloaded. Share this link: ${shareUrl}`,
                variant: "default",
              });
            }
          }
        } catch (error) {
          toast({
            title: "Share failed",
            description: error instanceof Error ? error.message : "An error occurred",
            variant: "error",
          });
        } finally {
          setIsSharing(false);
          URL.revokeObjectURL(url);
        }
      }, "image/png");
    } catch (error) {
      toast({
        title: "Share failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "error",
      });
      setIsSharing(false);
    }
  };

  const handleShare = () => {
    // Show donation dialog first
    setDonationOpen(true);
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleShare} disabled={isSharing} className="text-xs sm:text-sm px-2 sm:px-3">
        {isSharing ? "Sharing..." : "Share"}
      </Button>
      
      <DonationDialog
        open={donationOpen}
        onOpenChange={setDonationOpen}
        onContinue={performShare}
      />
    </>
  );
}

