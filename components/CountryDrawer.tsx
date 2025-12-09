"use client";

import { useMemo } from "react";
import { useAppStore, PREDEFINED_TAGS } from "./../lib/state/store";
import { Button } from "./ui/button";
import { getCountryNameById } from "./../lib/map";
import { useToast } from "./ui/toast";
import { analytics } from "./../lib/analytics";
import { recordEvent } from "./../lib/supabase/stats";

export function CountryDrawer() {
  const selectedId = useAppStore((s) => s.selectedCountryId);
  const country = useAppStore((s) =>
    selectedId ? s.countriesById[selectedId] : undefined
  );
  const toggleVisited = useAppStore((s) => s.toggleVisited);
  const setNote = useAppStore((s) => s.setNote);
  const setVisitedAt = useAppStore((s) => s.setVisitedAt);
  const setRating = useAppStore((s) => s.setRating);
  const addTagToCountry = useAppStore((s) => s.addTagToCountry);
  const removeTagFromCountry = useAppStore((s) => s.removeTagFromCountry);
  const { toast } = useToast();

  const title = useMemo(() => {
    if (!selectedId) return "No selection";
    return getCountryNameById(selectedId);
  }, [selectedId]);

  if (!selectedId) {
    return null; // Don't show anything when no country is selected
  }

  const isVisited = country?.visited ?? false;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-base font-medium">{title}</h3>
        {/* Visited Status - Single Toggle Button */}
        <button
          onClick={() => {
            toggleVisited(selectedId);
            // Track analytics event
            if (isVisited) {
              analytics.countryUnmarked(title, selectedId);
            } else {
              analytics.countryMarkedVisited(title, selectedId);
              // Track in Supabase stats
              recordEvent('country_marked');
            }
            toast({
              title: isVisited ? "Country unmarked" : "Country marked as visited",
              description: isVisited
                ? `${title} removed from your visited list`
                : `${title} added to your visited list`,
              variant: isVisited ? "default" : "success",
            });
          }}
          className={`
            w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
            flex items-center justify-between gap-3 min-h-[48px] touch-manipulation
            focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
            ${isVisited
              ? 'bg-green-600 text-white shadow-md hover:bg-green-700 active:bg-green-800'
              : 'bg-muted text-foreground hover:bg-muted/80 border-2 border-dashed border-muted-foreground/30 hover:border-muted-foreground/50'
            }
          `}
          aria-label={isVisited ? `Unmark ${title} as visited` : `Mark ${title} as visited`}
          aria-pressed={isVisited}
        >
          <div className="flex items-center gap-2">
            {isVisited ? (
              <span className="text-xl" aria-hidden="true">✓</span>
            ) : (
              <span className="text-xl opacity-50" aria-hidden="true">○</span>
            )}
            <div className="text-left">
              <div className="font-medium">
                {isVisited ? "Marked as Visited" : "Mark as Visited"}
              </div>
              {isVisited && (
                <div className="text-xs opacity-90 font-normal">
                  Tap to remove from visited list
                </div>
              )}
            </div>
          </div>
          {isVisited && (
            <span className="text-xs opacity-80 hidden sm:inline" aria-hidden="true">
              Tap to unmark
            </span>
          )}
        </button>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Note</label>
        <textarea
          className="w-full min-h-24 text-base sm:text-sm rounded-md border-2 border-gray-300 bg-white text-gray-900 px-3 py-3 sm:py-2 outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-gray-400 touch-manipulation"
          placeholder="Add your memories, highlights, or places visited..."
          value={country?.note ?? ""}
          onChange={(e) => {
            setNote(selectedId, e.target.value);
            // Track note addition/editing (only if note is not empty)
            if (e.target.value.trim() && (!country?.note || country.note.trim() === "")) {
              analytics.countryNoteAdded(title, selectedId);
            }
          }}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Visited date</label>
          <input
            type="date"
            className="w-full text-base sm:text-sm rounded-md border-2 border-gray-300 bg-white text-gray-900 px-3 py-3 sm:py-2 outline-none focus:ring-2 focus:ring-primary focus:border-primary touch-manipulation min-h-[44px]"
            value={country?.visitedAt ?? ""}
            onChange={(e) => setVisitedAt(selectedId, e.target.value || undefined)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Rating</label>
          <select
            className="w-full text-base sm:text-sm rounded-md border-2 border-gray-300 bg-white text-gray-900 px-3 py-3 sm:py-2 outline-none focus:ring-2 focus:ring-primary focus:border-primary touch-manipulation min-h-[44px] cursor-pointer"
            value={country?.rating ?? ""}
            onChange={(e) => {
              const rating = e.target.value ? Number(e.target.value) : undefined;
              setRating(selectedId, rating);
              // Track rating
              if (rating) {
                analytics.countryRated(title, selectedId, rating);
              }
            }}
          >
            <option value="">Select rating</option>
            <option value="1">⭐ 1 Star</option>
            <option value="2">⭐⭐ 2 Stars</option>
            <option value="3">⭐⭐⭐ 3 Stars</option>
            <option value="4">⭐⭐⭐⭐ 4 Stars</option>
            <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
          </select>
        </div>
      </div>

      {/* Tags Section */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Tags</label>
        <div className="flex flex-wrap gap-2">
          {PREDEFINED_TAGS.map((tag) => {
            const isActive = country?.tags?.includes(tag.id);
            return (
              <button
                key={tag.id}
                onClick={() => {
                  if (isActive) {
                    removeTagFromCountry(selectedId, tag.id);
                    toast({
                      title: "Tag removed",
                      description: `${tag.name} removed from ${title}`,
                      variant: "default",
                    });
                  } else {
                    addTagToCountry(selectedId, tag.id);
                    // Track tag addition
                    analytics.tagAdded(tag.name, title, selectedId);
                    toast({
                      title: "Tag added",
                      description: `${tag.name} added to ${title}`,
                      variant: "success",
                    });
                  }
                }}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                  transition-all duration-200 border-2
                  ${isActive
                    ? 'bg-opacity-100 border-opacity-100 scale-105'
                    : 'bg-opacity-0 border-opacity-30 hover:border-opacity-60'
                  }
                `}
                style={{
                  backgroundColor: isActive ? tag.color : 'transparent',
                  borderColor: tag.color,
                  color: isActive ? 'white' : 'currentColor',
                }}
              >
                <span className="text-base">{tag.emoji}</span>
                <span>{tag.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}


