"use client";

import { useMemo } from "react";
import { useAppStore } from "./../lib/state/store";
import { Button } from "./ui/button";
import { getCountryNameById } from "./../lib/map";

export function CountryDrawer() {
  const selectedId = useAppStore((s) => s.selectedCountryId);
  const country = useAppStore((s) =>
    selectedId ? s.countriesById[selectedId] : undefined
  );
  const toggleVisited = useAppStore((s) => s.toggleVisited);
  const setNote = useAppStore((s) => s.setNote);
  const setVisitedAt = useAppStore((s) => s.setVisitedAt);
  const setRating = useAppStore((s) => s.setRating);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">{title}</h3>
        <Button
          variant={country?.visited ? "secondary" : "default"}
          onClick={() => toggleVisited(selectedId)}
        >
          {country?.visited ? "Visited" : "Mark visited"}
        </Button>
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
      <div className="text-xs text-muted-foreground">
        Tag management and filters will be added next.
      </div>
    </div>
  );
}


