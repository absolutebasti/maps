"use client";

import { useEffect, useState } from "react";
import { getWorldCountryList, getCountryNameById } from "./../lib/map";
import { useAppStore } from "./../lib/state/store";
import { cn } from "./../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

const countries = getWorldCountryList();

export function CountrySearch() {
  const [open, setOpen] = useState(false);
  const selectCountry = useAppStore((s) => s.selectCountry);
  const selectedId = useAppStore((s) => s.selectedCountryId);
  const visitedById = useAppStore((s) => s.countriesById);

  const selectedName = selectedId ? getCountryNameById(selectedId) : null;

  // Close on escape
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Search countries</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            role="combobox"
            aria-expanded={open}
            aria-label="Select a country"
            className="w-full justify-between rounded-lg border bg-background px-3 py-2 text-left text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            <span className={cn(!selectedName && "text-muted-foreground")}>
              {selectedName || "Select a country..."}
            </span>
            <svg
              className="ml-2 inline-block h-4 w-4 shrink-0 opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
              />
            </svg>
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[--radix-popover-trigger-width] p-0 rounded-2xl shadow-2xl bg-background/95 backdrop-blur-sm" 
          align="start"
          withOverlay
        >
          <Command>
            <CommandInput placeholder="Type to search..." className="h-10" />
            <CommandList>
              <CommandEmpty>No countries found.</CommandEmpty>
              <CommandGroup>
                {countries.map((country) => {
                  const isVisited = Boolean(visitedById[country.id]?.visited);
                  const isSelected = selectedId === country.id;

                  return (
                    <CommandItem
                      key={country.id}
                      value={country.name}
                      onSelect={() => {
                        selectCountry(country.id, { autoMark: true });
                        setOpen(false);
                      }}
                      className={cn(
                        "flex items-center justify-between gap-2 cursor-pointer",
                        isSelected && "bg-accent"
                      )}
                    >
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-medium truncate">{country.name}</span>
                        {isVisited && (
                          <span className="text-xs text-muted-foreground">Visited</span>
                        )}
                      </div>
                      <span
                        className={cn(
                          "inline-flex h-2.5 w-2.5 flex-none rounded-full",
                          isVisited ? "bg-primary" : "bg-muted-foreground/30"
                        )}
                        aria-hidden="true"
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
