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

type Props = {
  targetContainerId: string;
};

const PRESETS = [
  { name: "Print Quality", width: 3840, height: 2560 },
  { name: "Social Media", width: 1200, height: 630 },
  { name: "HD", width: 1920, height: 1080 },
  { name: "4K", width: 3840, height: 2160 },
];

export function ExportDialog({ targetContainerId }: Props) {
  const [open, setOpen] = useState(false);
  const [widthPx, setWidthPx] = useState(3840);
  const [heightPx, setHeightPx] = useState(2560);
  const [bg, setBg] = useState("#ffffff");
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setWidthPx(preset.width);
    setHeightPx(preset.height);
  };

  const exportPng = async () => {
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
        backgroundColor: bg,
        filename: "mymap.png"
      });
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="text-xs sm:text-sm px-2 sm:px-3">Export</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Map as PNG</DialogTitle>
          <DialogDescription>
            Choose dimensions and background color for your exported map.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Presets</label>
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Background Color</label>
            <input
              type="color"
              className="h-10 w-full rounded-md border cursor-pointer"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={exportPng} disabled={isExporting}>
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


