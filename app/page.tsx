"use client";

import Link from "next/link";
import { buttonVariants, Button } from "./../components/ui/button";
import { MapView } from "./../components/MapView";
import { CountryDrawer } from "./../components/CountryDrawer";
import { StatsBar } from "./../components/StatsBar";
import { Legend } from "./../components/Legend";
import { ExportDialog } from "./../components/ExportDialog";
import { ShareButton } from "./../components/ShareButton";
import { CountrySearch } from "./../components/CountrySearch";
import { ThemeToggle } from "./../components/ThemeToggle";
import { ImportButton } from "./../components/ImportButton";
import { ExportJsonButton } from "./../components/ExportJsonButton";
import { useAppStore } from "./../lib/state/store";
import { cn } from "./../lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "./../components/ui/sheet";
import { MobileCountryDrawer } from "./../components/MobileCountryDrawer";
import { Onboarding } from "./../components/Onboarding";
import { KeyboardShortcuts } from "./../components/KeyboardShortcuts";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const selectedId = useAppStore((s) => s.selectedCountryId);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape closes mobile menu or deselects country
      if (e.key === "Escape") {
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
        } else if (selectedId) {
          useAppStore.getState().selectCountry(undefined);
        }
      }
      // "?" shows keyboard shortcuts
      if (e.key === "?" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // KeyboardShortcuts component handles this
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen, selectedId]);

  return (
    <>
      {/* SEO-friendly structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "MyMap - Visited Countries Tracker",
            "applicationCategory": "TravelApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "description": "Free interactive world map to track and visualize countries you've visited. Mark visited countries, add notes, rate your trips, and create a beautiful travel map.",
            "operatingSystem": "Web Browser",
            "url": "https://maps-production-d32c.up.railway.app",
            "screenshot": "https://maps-production-d32c.up.railway.app/og-image.png",
            "featureList": [
              "Track visited countries",
              "Interactive world map",
              "Add travel notes and ratings",
              "Tag countries with custom labels",
              "Export maps as PNG",
              "Local data storage",
              "Free to use"
            ],
            "browserRequirements": "Requires JavaScript. Requires HTML5.",
            "softwareVersion": "1.0",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5",
              "ratingCount": "1"
            }
          })
        }}
      />
      <main className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-wide" style={{ fontFamily: "var(--font-lemon-milk)" }}>
            My Visited Countries Map
          </h1>
          <div className="flex gap-2 items-center">
            <KeyboardShortcuts />
            <ThemeToggle />
            <div className="hidden sm:flex gap-2 items-center">
              <ImportButton />
              <ExportJsonButton />
            </div>
            <Link
              href="/countries"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "hidden sm:inline-flex"
              )}
            >
              Manage countries
            </Link>
            <ShareButton targetContainerId="map-container" />
            <ExportDialog targetContainerId="map-container" />
            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="sm:hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] sm:max-w-md overflow-y-auto">
                <div className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <StatsBar />
                    <CountrySearch />
                  </div>
                  <CountryDrawer />
                  <Legend />
                  <div className="pt-4 border-t space-y-2">
                    <div className="text-sm font-medium mb-2">Data Management</div>
                    <div className="flex flex-col gap-2">
                      <ImportButton />
                      <ExportJsonButton />
                    </div>
                    <Link
                      href="/countries"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Manage countries
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <section className="flex-1 grid md:grid-cols-[1fr,360px]">
        <div className="p-2 sm:p-4 flex items-center justify-center min-h-[400px]">
          <div id="map-container" className="w-full max-w-5xl aspect-[3/2] rounded-lg border bg-card/50 overflow-hidden">
            <MapView />
          </div>
        </div>
        <aside className="border-l p-4 hidden md:block space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <StatsBar />
            </div>
            <CountrySearch />
          </div>
          <CountryDrawer />
          <Legend />
        </aside>
      </section>

      {/* Mobile country drawer */}
      <MobileCountryDrawer />

      {/* Onboarding */}
      <Onboarding />

      {/* Hidden SEO content */}
      <div className="sr-only">
        <h1>Create Your Visited Countries Map - Track Your Travel Journey</h1>
        <p>
          MyMap is a free online tool to create and visualize your visited countries map.
          Track which countries you've been to, mark them on an interactive world map,
          add travel notes, rate your experiences, and share your travel adventures.
          Perfect for travel enthusiasts, digital nomads, and anyone who wants to
          visualize their travel bucket list and journey around the world.
        </p>
        <h2>Features</h2>
        <ul>
          <li>Interactive world map with all countries</li>
          <li>Mark countries as visited with one click</li>
          <li>Add travel notes, dates, and ratings for each country</li>
          <li>Tag countries (Want to Visit, Lived Here, Favorite)</li>
          <li>Color customization for visited countries</li>
          <li>Export your map as PNG image</li>
          <li>Local data storage in your browser</li>
          <li>Completely free to use</li>
        </ul>
        <h2>How It Works</h2>
        <ol>
          <li>Click on any country on the map to mark it as visited</li>
          <li>Add notes about your trip, visited cities, and memories</li>
          <li>Rate your experience from 1 to 5 stars</li>
          <li>Add tags like "Want to Visit" or "Lived Here"</li>
          <li>Export and share your travel map with friends</li>
        </ol>
        <h2>Why Track Your Visited Countries?</h2>
        <p>
          Tracking your visited countries helps you visualize your travel experiences,
          plan future trips, and share your adventures with friends and family.
          Whether you're a backpacker, digital nomad, or casual traveler,
          MyMap makes it easy to keep a visual record of your global journey.
        </p>
      </div>
    </main>
    </>
  );
}
