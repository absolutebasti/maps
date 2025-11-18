"use client";

import { useMemo } from "react";
import { useAppStore, PREDEFINED_TAGS } from "./../lib/state/store";
import { Button } from "./ui/button";
import { getCountryNameById } from "./../lib/map";
import { useToast } from "./ui/toast";

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
    return (
      <div className="text-sm text-muted-foreground">
        Click a country on the map to select it.
      </div>
    );
  }

  const isVisited = country?.visited ?? false;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-base font-medium">{title}</h3>
        {/* Visited Status - Segmented Control */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (!isVisited) {
                toggleVisited(selectedId);
                toast({
                  title: "Country marked as visited",
                  description: `${title} added to your visited list`,
                  variant: "success",
                });
              }
            }}
            className={`
              flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
              ${isVisited
                ? 'bg-green-600 text-white shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }
            `}
          >
            ✓ Visited
          </button>
          <button
            onClick={() => {
              if (isVisited) {
                toggleVisited(selectedId);
                toast({
                  title: "Country unmarked",
                  description: `${title} removed from your visited list`,
                  variant: "default",
                });
              }
            }}
            className={`
              flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
              ${!isVisited
                ? 'bg-gray-200 dark:bg-gray-700 text-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }
            `}
          >
            Not Visited
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Note</label>
        <textarea
          className="w-full min-h-24 text-sm rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
          placeholder="Add your memories, highlights, or places visited..."
          value={country?.note ?? ""}
          onChange={(e) => setNote(selectedId, e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Visited date</label>
          <input
            type="date"
            className="w-full text-sm rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
            value={country?.visitedAt ?? ""}
            onChange={(e) => setVisitedAt(selectedId, e.target.value || undefined)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Rating</label>
          <select
            className="w-full text-sm rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
            value={country?.rating ?? ""}
            onChange={(e) =>
              setRating(
                selectedId,
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          >
            <option value="">—</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
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


