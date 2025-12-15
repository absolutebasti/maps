"use client";

import Link from "next/link";
import { buttonVariants, Button } from "./../components/ui/button";
import { MapView } from "./../components/MapView";
import { CountryDrawer } from "./../components/CountryDrawer";
import { StatsBar } from "./../components/StatsBar";
import { Legend } from "./../components/Legend";
import { ShareExportMenu } from "./../components/ShareExportMenu";
import { CountrySearch } from "./../components/CountrySearch";
import { ThemeToggle } from "./../components/ThemeToggle";
import { useAppStore } from "./../lib/state/store";
import { cn } from "./../lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "./../components/ui/sheet";
import { CountryEditDialog } from "./../components/CountryEditDialog";
import { Onboarding } from "./../components/Onboarding";
import { KeyboardShortcuts } from "./../components/KeyboardShortcuts";
import { AuthDialog } from "./../components/AuthDialog";
import { UserMenu } from "./../components/UserMenu";
import { useAuth } from "./../components/AuthProvider";
import { recordVisit } from "./../lib/supabase/stats";
import { MobileBottomNav } from "./../components/MobileBottomNav";
import { BadgeProgress } from "./../components/BadgeProgress";
import { Recommendations } from "./../components/Recommendations";
import { ChatConcierge } from "./../components/ChatConcierge";
import { useState, useEffect, useRef } from "react";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const selectedId = useAppStore((s) => s.selectedCountryId);
  const { user, syncStatus, refreshAuth } = useAuth();

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

  // Record page visit (once per session)
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('mymap_visit_recorded');
    if (!hasVisited) {
      recordVisit('/');
      sessionStorage.setItem('mymap_visit_recorded', 'true');
    }
  }, []);

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
            "url": typeof window !== "undefined" ? window.location.origin : "https://maps-production-d32c.up.railway.app",
            "screenshot": `${typeof window !== "undefined" ? window.location.origin : "https://maps-production-d32c.up.railway.app"}/og-image.png`,
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
          <div className="mx-auto max-w-6xl px-2 sm:px-4 py-2 sm:py-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <h1 className="text-lg sm:text-2xl font-bold tracking-wide truncate" style={{ fontFamily: "var(--font-lemon-milk)" }}>
                <span className="hidden md:inline">My Visited Countries</span>
                <span className="hidden sm:inline md:hidden">Visited Countries</span>
                <span className="sm:hidden">MyMap</span>
              </h1>
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50 border">
                <img src="/esmt-logo.png" alt="ESMT Berlin" className="h-4 w-auto" />
                <span className="text-[10px] text-muted-foreground font-medium">Built for LLM Course</span>
              </div>
            </div>
            <div className="flex gap-1 sm:gap-2 items-center shrink-0">
              <KeyboardShortcuts />
              <ThemeToggle />
              <Link
                href="/countries"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "hidden lg:inline-flex"
                )}
              >
                Manage
              </Link>
              <ShareExportMenu targetContainerId="map-container" />
              {/* Auth UI */}
              {user ? (
                <UserMenu
                  user={user}
                  onSignOut={refreshAuth}
                  syncStatus={syncStatus}
                />
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAuthDialogOpen(true)}
                  className="hidden sm:inline-flex"
                >
                  Login
                </Button>
              )}
              {/* Mobile menu button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="sm:hidden h-11 w-11 touch-manipulation">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
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
                    {/* Auth section for mobile */}
                    <div className="pt-4 border-t space-y-3">
                      {user ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">
                              {syncStatus === "syncing" ? "🔄" : "☁️"}
                            </span>
                            <span className="truncate max-w-[180px]">{user.email}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              const { signOut } = await import("./../lib/supabase/auth");
                              await signOut();
                              refreshAuth();
                              setMobileMenuOpen(false);
                            }}
                          >
                            Logout
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="default"
                          className="w-full"
                          onClick={() => {
                            setAuthDialogOpen(true);
                            setMobileMenuOpen(false);
                          }}
                        >
                          Login / Sign Up
                        </Button>
                      )}
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

        <section className="flex-1 grid md:grid-cols-[1fr,360px] items-start">
          <div className="sticky top-[57px]">
            <div id="map-container" className="w-full aspect-[3/2] rounded-lg border bg-card/50 overflow-hidden touch-manipulation">
              <MapView />
            </div>
          </div>
          <aside className="border-l p-4 hidden md:flex md:flex-col gap-4 max-h-[calc(100vh-57px)] overflow-y-auto sticky top-[57px]">
            <StatsBar />
            <CountrySearch />
            <CountryDrawer />
            <BadgeProgress />
            <Recommendations />
            <Legend />
          </aside>
        </section>

        {/* Country Edit Dialog (centered modal) */}
        <CountryEditDialog />

        {/* Onboarding - disabled for LLM-Class */}
        {/* <Onboarding /> */}

        {/* Auth Dialog */}
        <AuthDialog
          open={authDialogOpen}
          onOpenChange={setAuthDialogOpen}
          onSuccess={refreshAuth}
        />

        {/* AI Chat Concierge */}
        <ChatConcierge />

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

        {/* Footer Navigation */}
        <footer className="border-t bg-muted/20 py-4 mt-auto relative z-10" id="footer-nav">
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

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav
          onMenuClick={() => setMobileMenuOpen(true)}
          onSearchClick={() => setMobileMenuOpen(true)}
          onAccountClick={() => {
            if (!user) {
              setAuthDialogOpen(true);
            } else {
              setMobileMenuOpen(true);
            }
          }}
        />

        {/* Bottom padding for mobile nav */}
        <div className="h-14 sm:hidden" />
      </main>
    </>
  );
}
