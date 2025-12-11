"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getWorldCountryList } from "@/lib/map";
import { useAppStore } from "@/lib/state/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const allCountries = getWorldCountryList();

type FilterOption = "all" | "visited" | "notVisited";

export default function CountriesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterOption>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showClearDialog, setShowClearDialog] = useState(false);

  const countriesById = useAppStore((s) => s.countriesById);
  const markVisitedMany = useAppStore((s) => s.markVisitedMany);
  const toggleVisitedMany = useAppStore((s) => s.toggleVisitedMany);
  const clearAllData = useAppStore((s) => s.clearAllData);

  const filteredCountries = useMemo(() => {
    const search = query.trim().toLowerCase();
    return allCountries.filter((country) => {
      const visited = Boolean(countriesById[country.id]?.visited);
      if (filter === "visited" && !visited) return false;
      if (filter === "notVisited" && visited) return false;
      if (search && !country.name.toLowerCase().includes(search)) return false;
      return true;
    });
  }, [query, filter, countriesById]);

  // Remove selections that are no longer visible after filtering
  useEffect(() => {
    setSelectedIds((prev) => {
      const allowed = new Set(filteredCountries.map((c) => c.id));
      let changed = false;
      for (const id of prev) {
        if (!allowed.has(id)) {
          changed = true;
          break;
        }
      }
      if (!changed) return prev;
      const next = new Set<string>();
      prev.forEach((id) => {
        if (allowed.has(id)) {
          next.add(id);
        }
      });
      return next;
    });
  }, [filteredCountries]);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(filteredCountries.map((country) => country.id)));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const selectedArray = useMemo(() => Array.from(selectedIds), [selectedIds]);
  const selectedCount = selectedArray.length;

  const handleMarkVisited = (visited: boolean) => {
    if (!selectedCount) return;
    markVisitedMany(selectedArray, visited);
  };

  const handleToggleVisited = () => {
    if (!selectedCount) return;
    toggleVisitedMany(selectedArray);
  };

  const totalVisited = useMemo(
    () => allCountries.filter((country) => Boolean(countriesById[country.id]?.visited)).length,
    [countriesById]
  );

  const handleClearAll = () => {
    clearAllData();
    setSelectedIds(new Set());
    setShowClearDialog(false);
  };

  return (
    <main className="min-h-dvh bg-background pb-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Manage Countries</h1>
            <p className="text-sm text-muted-foreground">
              Search, filter, and bulk mark countries as visited or not visited.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="destructive"
              onClick={() => setShowClearDialog(true)}
              disabled={totalVisited === 0}
            >
              Clear All Data
            </Button>
            <Link href="/" className="text-sm text-primary underline-offset-4 hover:underline">
              ← Back to map
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            placeholder="Search countries…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full flex-1 min-w-[220px] rounded-md border bg-background px-3 py-3 sm:py-2 text-base sm:text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring md:max-w-sm touch-manipulation min-h-[44px]"
          />
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "visited" ? "default" : "outline"}
              onClick={() => setFilter("visited")}
            >
              Visited
            </Button>
            <Button
              variant={filter === "notVisited" ? "default" : "outline"}
              onClick={() => setFilter("notVisited")}
            >
              Not visited
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-card px-4 py-3">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">{filteredCountries.length}</span> of{" "}
            <span className="font-medium text-foreground">{allCountries.length}</span> countries
            · Visited{" "}
            <span className="font-medium text-foreground">{totalVisited}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              disabled={!filteredCountries.length}
              onClick={selectAll}
            >
              Select all filtered
            </Button>
            <Button variant="ghost" disabled={!selectedCount} onClick={clearSelection}>
              Clear selection
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-md border bg-card px-4 py-3">
          <span className="text-sm text-muted-foreground">
            Selected:{" "}
            <span className="font-medium text-foreground">{selectedCount}</span>
          </span>
          <div className="flex flex-wrap gap-2">
            <Button
              disabled={!selectedCount}
              onClick={() => handleMarkVisited(true)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Mark visited
            </Button>
            <Button
              disabled={!selectedCount}
              onClick={() => handleMarkVisited(false)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Mark not visited
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <div className="max-h-[65vh] overflow-y-auto divide-y">
            {filteredCountries.length === 0 ? (
              <div className="px-4 py-16 text-center space-y-4">
                <div className="text-5xl mb-2">🔍</div>
                <div className="space-y-2">
                  <h3 className="text-base font-semibold">No Countries Found</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    {query ? (
                      <>No countries match "{query}". Try a different search term.</>
                    ) : filter === "visited" ? (
                      <>You haven't marked any countries as visited yet. Start exploring!</>
                    ) : (
                      <>Try adjusting your search or filters.</>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              filteredCountries.map((country) => {
                const visited = Boolean(countriesById[country.id]?.visited);
                const checked = selectedIds.has(country.id);
                return (
                  <label
                    key={country.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-4 px-4 py-4 sm:py-3 text-base sm:text-sm transition-colors hover:bg-accent hover:text-accent-foreground touch-manipulation min-h-[56px] sm:min-h-[48px]",
                      checked && "bg-accent/70"
                    )}
                  >
                    <input
                      type="checkbox"
                      className="h-5 w-5 sm:h-4 sm:w-4 rounded border border-input touch-manipulation"
                      checked={checked}
                      onChange={() => handleToggle(country.id)}
                    />
                    <span className="flex-1 truncate font-medium">{country.name}</span>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        visited ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      )}
                    >
                      {visited ? "Visited" : "Not visited"}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </div>

        {/* Clear All Confirmation Dialog */}
        <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Clear All Data?</DialogTitle>
              <DialogDescription>
                This will remove all visited countries, notes, ratings, and tags. This action cannot be undone.
                {totalVisited > 0 && (
                  <span className="block mt-2 font-medium text-foreground">
                    You will lose data for {totalVisited} visited {totalVisited === 1 ? "country" : "countries"}.
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowClearDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleClearAll}>
                Clear Everything
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}

