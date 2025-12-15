"use client";

import { useState, useRef, useEffect } from "react";
import { getWorldCountryList, getCountryNameById } from "./../lib/map";
import { useAppStore } from "./../lib/state/store";
import { cn } from "./../lib/utils";

const countries = getWorldCountryList();

export function CountrySearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectCountry = useAppStore((s) => s.selectCountry);
  const visitedById = useAppStore((s) => s.countriesById);

  // Filter countries based on query
  const filteredCountries = query.length > 0
    ? countries.filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8)
    : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = (countryId: string) => {
    selectCountry(countryId, { centerOn: true });
    setQuery("");
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search Input */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.length > 0);
          }}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          placeholder="Search countries..."
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border bg-background shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
        />
      </div>

      {/* Dropdown Results */}
      {isOpen && filteredCountries.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg overflow-hidden z-50">
          {filteredCountries.map((country) => {
            const isVisited = Boolean(visitedById[country.id]?.visited);

            return (
              <button
                key={country.id}
                onClick={() => handleSelect(country.id)}
                className="w-full px-3 py-2.5 text-left text-sm hover:bg-muted flex items-center justify-between gap-2 transition-colors"
              >
                <span className="font-medium truncate">{country.name}</span>
                {isVisited && (
                  <span className="text-xs text-primary font-medium">✓ Visited</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* No results */}
      {isOpen && query.length > 0 && filteredCountries.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg p-3 z-50">
          <p className="text-sm text-muted-foreground text-center">No countries found</p>
        </div>
      )}
    </div>
  );
}
