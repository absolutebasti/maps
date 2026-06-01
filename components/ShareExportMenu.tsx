"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { exportSvgContainerToPng } from "./../lib/export/png";
import { useToast } from "./ui/toast";
import { DonationDialog } from "./DonationDialog";
import { analytics } from "./../lib/analytics";
import { recordEvent } from "./../lib/supabase/stats";
import { useAppStore } from "./../lib/state/store";

type Props = {
    targetContainerId: string;
};

const PRESETS = [
    { name: "Print (3840×2560)", width: 3840, height: 2560 },
    { name: "Social Media (1200×630)", width: 1200, height: 630 },
    { name: "HD (1920×1080)", width: 1920, height: 1080 },
    { name: "4K (3840×2160)", width: 3840, height: 2160 },
];

export function ShareExportMenu({ targetContainerId }: Props) {
    const [exportOpen, setExportOpen] = useState(false);
    const [donationOpen, setDonationOpen] = useState(false);
    const [widthPx, setWidthPx] = useState(3840);
    const [heightPx, setHeightPx] = useState(2560);
    const [isExporting, setIsExporting] = useState(false);
    const { toast } = useToast();
    const countriesById = useAppStore((s) => s.countriesById);

    const applyPreset = (preset: (typeof PRESETS)[0]) => {
        setWidthPx(preset.width);
        setHeightPx(preset.height);
    };

    const handleCopyLink = async () => {
        try {
            // Create a shareable state object
            const visitedCountries = Object.entries(countriesById)
                .filter(([, c]) => c.visited)
                .map(([id]) => id);

            if (visitedCountries.length === 0) {
                toast({
                    title: "Nothing to share yet",
                    description: "Mark some countries as visited first!",
                    variant: "default",
                });
                return;
            }

            // For now, just copy the current URL
            await navigator.clipboard.writeText(window.location.href);
            toast({
                title: "Link copied! 🔗",
                description: "Share your travel map with friends",
                variant: "success",
            });
        } catch {
            toast({
                title: "Couldn't copy",
                description: "Please try again",
                variant: "error",
            });
        }
    };

    const handleNativeShare = async () => {
        if (!navigator.share) {
            handleCopyLink();
            return;
        }

        const visitedCount = Object.values(countriesById).filter(c => c.visited).length;

        try {
            await navigator.share({
                title: "My Visited Countries Map",
                text: `I've visited ${visitedCount} countries! Check out my travel map 🗺️`,
                url: window.location.href,
            });
        } catch {
            // User cancelled or error - silent fail
        }
    };

    const handleExportClick = () => {
        setDonationOpen(true);
    };

    const handleDonationContinue = () => {
        setExportOpen(true);
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
                filename: "mymap.png",
            });
            analytics.mapExported("PNG", widthPx, heightPx);
            recordEvent("map_exported");
            toast({
                title: "Downloaded! 🎉",
                description: "Your travel map is ready",
                variant: "success",
            });
            setExportOpen(false);
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
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" className="gap-1.5">
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
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                            <polyline points="16 6 12 2 8 6" />
                            <line x1="12" y1="2" x2="12" y2="15" />
                        </svg>
                        <span className="hidden sm:inline">Share</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
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
                            className="mr-2"
                        >
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                        Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleNativeShare} className="cursor-pointer">
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
                            className="mr-2"
                        >
                            <circle cx="18" cy="5" r="3" />
                            <circle cx="6" cy="12" r="3" />
                            <circle cx="18" cy="19" r="3" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                        </svg>
                        Share...
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleExportClick} className="cursor-pointer">
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
                            className="mr-2"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        Download PNG
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DonationDialog
                open={donationOpen}
                onOpenChange={setDonationOpen}
                onContinue={handleDonationContinue}
            />

            <Dialog open={exportOpen} onOpenChange={setExportOpen}>
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
                        <Button variant="outline" onClick={() => setExportOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={performExport} disabled={isExporting}>
                            {isExporting ? "Creating..." : "📥 Download"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
