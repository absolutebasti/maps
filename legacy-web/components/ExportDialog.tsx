"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { exportSvgContainerToPng } from "./../lib/export/png";
import { useToast } from "./ui/toast";
import { DonationDialog } from "./DonationDialog";
import { analytics } from "./../lib/analytics";
import { recordEvent } from "./../lib/supabase/stats";

type Props = {
  targetContainerId: string;
};

const PRESETS = [
  { name: "Print (3840×2560)", width: 3840, height: 2560 },
  { name: "Social Media (1200×630)", width: 1200, height: 630 },
  { name: "HD (1920×1080)", width: 1920, height: 1080 },
  { name: "4K (3840×2160)", width: 3840, height: 2160 },
];

export function ExportDialog({ targetContainerId }: Props) {
  const [open, setOpen] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);
  const [widthPx, setWidthPx] = useState(3840);
  const [heightPx, setHeightPx] = useState(2560);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setWidthPx(preset.width);
    setHeightPx(preset.height);
  };

  const performExport = async () => {
    const container = document.getElementById(targetContainerId);
    if (!container) {
      toast({
        title: "Export failed",
        description: "Map container not found",
        variant: "error",
      });
      return;
    }

    setIsExporting(true);
    try {
      await exportSvgContainerToPng(container, {
        widthPx,
        heightPx,
        backgroundColor: "#ffffff",
        filename: "mymap.png"
      });
      // Track export event
      analytics.mapExported("PNG", widthPx, heightPx);
      // Track in Supabase stats
      recordEvent('map_exported');
      toast({
        title: "Export successful",
        description: "Your map has been downloaded",
        variant: "success",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "error",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportButtonClick = () => {
    // Show donation dialog first, then open export dialog after
    setDonationOpen(true);
  };

  const handleDonationContinue = () => {
    // After donation dialog closes, open the export dialog
    setOpen(true);
  };

  return (
    <>
      <Button size="sm" className="text-xs sm:text-sm px-2 sm:px-3" onClick={handleExportButtonClick}>
        Export
      </Button>

      <DonationDialog
        open={donationOpen}
        onOpenChange={setDonationOpen}
        onContinue={handleDonationContinue}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Download Your Travel Map 🗺️</DialogTitle>
            <DialogDescription>
              Choose a size to download your map as a PNG image.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Quick picks</label>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset(preset)}
                    className="text-xs"
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Width (px)</label>
                <input
                  type="number"
                  className="w-full text-sm rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                  value={widthPx}
                  onChange={(e) => setWidthPx(Number(e.target.value))}
                  min={512}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Height (px)</label>
                <input
                  type="number"
                  className="w-full text-sm rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                  value={heightPx}
                  onChange={(e) => setHeightPx(Number(e.target.value))}
                  min={512}
                  step={1}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={performExport} disabled={isExporting}>
              {isExporting ? "Creating your map..." : "📥 Download"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}


