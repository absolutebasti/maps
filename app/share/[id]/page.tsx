"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { decodeMapState, type ShareableMapState } from "@/lib/share/encode";
import { useAppStore } from "@/lib/state/store";
import { MapView } from "@/components/MapView";
import { StatsBar } from "@/components/StatsBar";
import { CountryDrawer } from "@/components/CountryDrawer";
import { MobileCountryDrawer } from "@/components/MobileCountryDrawer";
import { Legend } from "@/components/Legend";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ExportDialog } from "@/components/ExportDialog";
import { ShareButton } from "@/components/ShareButton";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { Onboarding } from "@/components/Onboarding";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { analytics } from "@/lib/analytics";

export default function ShareMapPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(true);

  const {
    countriesById,
    selectedCountryId,
    settings,
    markVisitedMany,
    selectCountry,
    setVisitedCountryColor,
  } = useAppStore();

  useEffect(() => {
    const shareId = params.id as string;
    if (!shareId) {
      setError("Invalid share link");
      setIsLoading(false);
      return;
    }

    try {
      // Decode the share state
      const state = decodeMapState(shareId);
      if (!state) {
        setError("Invalid share link format");
        setIsLoading(false);
        return;
      }

      // Apply the shared state
      if (state.v && state.v.length > 0) {
        // Mark countries as visited
        markVisitedMany(state.v, true);
      }

      // Set visited country color if provided
      if (state.c) {
        setVisitedCountryColor(state.c);
      }

      // Select country if provided (after a short delay to ensure map is rendered)
      if (state.s) {
        setTimeout(() => {
          selectCountry(state.s);
          // The MapView component will automatically zoom to the selected country
        }, 800);
      }

      // Track share view
      analytics.shareClicked("share_view", "share_link", "social", "map_share");

      setIsLoading(false);
    } catch (err) {
      console.error("Error loading shared map:", err);
      setError("Failed to load shared map");
      setIsLoading(false);
    }
  }, [params.id, markVisitedMany, selectCountry, setVisitedCountryColor]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading shared map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold">Unable to Load Map</h1>
          <p className="text-muted-foreground">{error}</p>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "default" }), "gap-2")}
          >
            Go to MyMap Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* View-only banner */}
      <div className="bg-primary/10 border-b border-primary/20 py-2 px-4 text-center text-sm">
        <p className="text-foreground">
          📍 <strong>Viewing a shared map</strong> -{" "}
          <Link href="/" className="underline hover:text-primary">
            Create your own map
          </Link>
        </p>
      </div>

      <main className="min-h-dvh flex flex-col">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-xl font-bold"
                style={{ fontFamily: "var(--font-lemon-milk)" }}
              >
                MyMap
              </Link>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                Shared Map
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link
                href="/"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "text-xs sm:text-sm px-2 sm:px-3"
                )}
              >
                Create Your Map
              </Link>
            </div>
          </div>
        </header>

        {/* Map Container */}
        <div className="flex-1 relative overflow-hidden">
          <MapView />
          <StatsBar />
          <Legend />
          <KeyboardShortcuts />
        </div>

        {/* Country Drawers */}
        <CountryDrawer />
        <MobileCountryDrawer />

        {/* Footer */}
        <footer className="border-t bg-muted/20 py-4 mt-auto relative z-10">
          <nav className="mx-auto max-w-6xl px-4 flex flex-wrap gap-2 sm:gap-4 justify-center">
            <Link
              href="/about"
              className="px-4 py-2 text-sm sm:text-xs text-muted-foreground hover:text-foreground transition-colors touch-manipulation rounded-md hover:bg-muted/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              About
            </Link>
            <Link
              href="/features"
              className="px-4 py-2 text-sm sm:text-xs text-muted-foreground hover:text-foreground transition-colors touch-manipulation rounded-md hover:bg-muted/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              Features
            </Link>
            <Link
              href="/faq"
              className="px-4 py-2 text-sm sm:text-xs text-muted-foreground hover:text-foreground transition-colors touch-manipulation rounded-md hover:bg-muted/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              FAQ
            </Link>
            <Link
              href="/blog"
              className="px-4 py-2 text-sm sm:text-xs text-muted-foreground hover:text-foreground transition-colors touch-manipulation rounded-md hover:bg-muted/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              Blog
            </Link>
          </nav>
        </footer>
      </main>
    </>
  );
}

