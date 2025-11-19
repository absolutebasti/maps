"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "./ui/toast";
import { DonationDialog } from "./DonationDialog";
import { analytics } from "./../lib/analytics";

type Props = {
  targetContainerId: string;
};

export function ShareButton({ targetContainerId }: Props) {
  const [isSharing, setIsSharing] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);
  const { toast } = useToast();

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
          // Track share event
          analytics.shareClicked();
          // Try Web Share API
          if (navigator.share) {
            const file = new File([blob], "mymap.png", { type: "image/png" });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: "My Visited Countries Map",
                text: "Check out my travel map!",
                files: [file],
              });
              toast({
                title: "Shared successfully",
                description: "Your map has been shared",
                variant: "success",
              });
            } else {
              // Fallback: copy to clipboard
              await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob })
              ]);
              toast({
                title: "Copied to clipboard",
                description: "Map image copied to clipboard",
                variant: "success",
              });
            }
          } else {
            // Fallback: copy to clipboard
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ "image/png": blob })
              ]);
              toast({
                title: "Copied to clipboard",
                description: "Map image copied to clipboard",
                variant: "success",
              });
            } catch {
              // Final fallback: download
              const downloadUrl = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = downloadUrl;
              a.download = "mymap-share.png";
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(downloadUrl);
              toast({
                title: "Downloaded",
                description: "Map image downloaded. You can share it manually.",
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

