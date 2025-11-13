"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { exportSvgContainerToPng } from "./../lib/export/png";

type Props = {
  targetContainerId: string;
};

export function ExportDialog({ targetContainerId }: Props) {
  const [open, setOpen] = useState(false);
  const [widthPx, setWidthPx] = useState(3840);
  const [heightPx, setHeightPx] = useState(2560);
  const [bg, setBg] = useState("#ffffff");

  const exportPng = async () => {
    const container = document.getElementById(targetContainerId);
    if (!container) return;
    await exportSvgContainerToPng(container, {
      widthPx,
      heightPx,
      backgroundColor: bg,
      filename: "mymap.png"
    });
    setOpen(false);
  };

  return (
    <div className="relative">
      <Button onClick={() => setOpen((v) => !v)}>Export PNG</Button>
      {open && (
        <div className="absolute right-0 mt-2 w-[340px] rounded-lg border bg-background p-3 shadow-lg z-50">
          <div className="space-y-3">
            <div className="text-sm font-medium">Export PNG</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Width (px)</label>
                <input
                  type="number"
                  className="w-full text-sm rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                  value={widthPx}
                  onChange={(e) => setWidthPx(Number(e.target.value))}
                  min={512}
                  step={1}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Height (px)</label>
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
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Background</label>
              <input
                type="color"
                className="h-9 w-full rounded-md border"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={exportPng}>Export</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


