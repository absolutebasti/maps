"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "./../lib/state/store";
import { getWorldCountryList } from "./../lib/map";
import { cn } from "./../lib/utils";
import { Button } from "./ui/button";

const COLOR_PALETTE = [
  { name: "Pastel Beige", value: "#E8DCC4" },
  { name: "Soft Pink", value: "#FFD1DC" },
  { name: "Light Blue", value: "#ADD8E6" },
  { name: "Mint Green", value: "#98FF98" },
  { name: "Lavender", value: "#E6E6FA" },
  { name: "Peach", value: "#FFDAB9" },
  { name: "Light Coral", value: "#F08080" },
  { name: "Powder Blue", value: "#B0E0E6" },
  { name: "Thistle", value: "#D8BFD8" },
  { name: "Khaki", value: "#F0E68C" },
];

export function Legend() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVisited, setFilterVisited] = useState<boolean | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const countriesById = useAppStore((s) => s.countriesById);
  const toggleVisited = useAppStore((s) => s.toggleVisited);
  const selectCountry = useAppStore((s) => s.selectCountry);
  const visitedCountryColor = useAppStore((s) => s.settings.visitedCountryColor);
  const setVisitedCountryColor = useAppStore((s) => s.setVisitedCountryColor);

  const allCountries = useMemo(() => getWorldCountryList(), []);

  const filteredCountries = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();
    return allCountries.filter((country) => {
      const visited = Boolean(countriesById[country.id]?.visited);
      
      // Filter by visited status
      if (filterVisited !== null && visited !== filterVisited) return false;
      
      // Filter by search query
      if (search && !country.name.toLowerCase().includes(search)) return false;
      
      return true;
    });
  }, [searchQuery, filterVisited, countriesById, allCountries]);

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">Legend</h4>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: visitedCountryColor }} />
            <span>Visited</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="h-7 text-xs"
          >
            Change color
          </Button>
        </div>
        {showColorPicker && (
          <div className="p-3 rounded-md border bg-card space-y-2">
            <div className="text-xs font-medium">Select color</div>
            <div className="grid grid-cols-5 gap-2">
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color.value}
                  onClick={() => {
                    setVisitedCountryColor(color.value);
                    setShowColorPicker(false);
                  }}
                  className={cn(
                    "w-full aspect-square rounded border-2 transition-all hover:scale-110",
                    visitedCountryColor === color.value
                      ? "border-primary ring-2 ring-primary ring-offset-2"
                      : "border-transparent"
                  )}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: "#E5E7EB" }} />
          <span>Not visited</span>
        </div>
      </div>

      {/* Country List Section */}
      <div className="space-y-3 pt-3 border-t">
        <h4 className="text-sm font-medium">All Countries</h4>
        
        {/* Search bar */}
        <input
          type="search"
          placeholder="Search countries…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        {/* Filter buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterVisited(null)}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors",
              filterVisited === null
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilterVisited(true)}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors",
              filterVisited === true
                ? "bg-green-600 text-white"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            Visited
          </button>
          <button
            onClick={() => setFilterVisited(false)}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors",
              filterVisited === false
                ? "bg-red-600 text-white"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            Not visited
          </button>
        </div>

        {/* Country list */}
        <div className="max-h-[300px] overflow-y-auto space-y-1 pr-2">
          {filteredCountries.length === 0 ? (
            <div className="text-xs text-muted-foreground text-center py-4">
              No countries found
            </div>
          ) : (
            filteredCountries.map((country) => {
              const visited = Boolean(countriesById[country.id]?.visited);
              return (
                <button
                  key={country.id}
                  onClick={() => {
                    selectCountry(country.id);
                    toggleVisited(country.id);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded text-xs hover:bg-accent transition-colors text-left",
                    visited && "bg-green-50 dark:bg-green-950/40"
                  )}
                >
                  <span className="truncate">{country.name}</span>
                  {visited && (
                    <span className="text-green-600 dark:text-green-300 font-bold shrink-0 text-base">✓</span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}


