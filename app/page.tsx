import Link from "next/link";
import { buttonVariants } from "./../components/ui/button";
import { MapView } from "./../components/MapView";
import { CountryDrawer } from "./../components/CountryDrawer";
import { TagManager } from "./../components/TagManager";
import { StatsBar } from "./../components/StatsBar";
import { Legend } from "./../components/Legend";
import { ExportDialog } from "./../components/ExportDialog";
import { ThemeToggle } from "./../components/ThemeToggle";
import { CountrySearch } from "./../components/CountrySearch";
import { cn } from "./../lib/utils";

export default function HomePage() {
  return (
    <main className="min-h-dvh grid grid-rows-[auto,1fr]">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">MyMap</h1>
          <div className="flex gap-2 items-center">
            <ThemeToggle />
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
      <section className="grid md:grid-cols-[1fr,360px]">
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
          <TagManager />
          <Legend />
        </aside>
      </section>
    </main>
  );
}
