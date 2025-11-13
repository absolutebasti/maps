"use client";

import Link from "next/link";
import { buttonVariants, Button } from "./../components/ui/button";
import { MapView } from "./../components/MapView";
import { CountryDrawer } from "./../components/CountryDrawer";
import { StatsBar } from "./../components/StatsBar";
import { Legend } from "./../components/Legend";
import { ExportDialog } from "./../components/ExportDialog";
import { CountrySearch } from "./../components/CountrySearch";
import { useAppStore } from "./../lib/state/store";
import { cn } from "./../lib/utils";

export default function HomePage() {
  const user = useAppStore((s) => s.user);
  const logout = useAppStore((s) => s.logout);

  const handleLogout = async () => {
    await logout();
    // Force a page reload to clear all state
    window.location.reload();
  };

  return (
    <main className="min-h-dvh flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-wide" style={{ fontFamily: "var(--font-lemon-milk)" }}>
            My Visited Countries Map
          </h1>
          <div className="flex gap-2 items-center">
            {user && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <span>👋 {user.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="h-8"
                >
                  Logout
                </Button>
              </div>
            )}
            <Link
              href="/countries"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "hidden sm:inline-flex"
              )}
            >
              Manage countries
            </Link>
            <ExportDialog targetContainerId="map-container" />
          </div>
        </div>
      </header>
      <section className="flex-1 grid md:grid-cols-[1fr,360px]">
        <div className="p-4 flex items-center justify-center min-h-[400px]">
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
    </main>
  );
}
