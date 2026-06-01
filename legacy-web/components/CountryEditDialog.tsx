"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { useAppStore, PREDEFINED_TAGS } from "./../lib/state/store";
import { getCountryNameById } from "./../lib/map";
import { useToast } from "./ui/toast";
import { analytics } from "./../lib/analytics";
import { recordEvent } from "./../lib/supabase/stats";

export function CountryEditDialog() {
    const editingId = useAppStore((s) => s.editingCountryId);
    const closeEditDialog = useAppStore((s) => s.closeEditDialog);
    const country = useAppStore((s) =>
        editingId ? s.countriesById[editingId] : undefined
    );
    const toggleVisited = useAppStore((s) => s.toggleVisited);
    const setNote = useAppStore((s) => s.setNote);
    const setVisitedAt = useAppStore((s) => s.setVisitedAt);
    const setRating = useAppStore((s) => s.setRating);
    const addTagToCountry = useAppStore((s) => s.addTagToCountry);
    const removeTagFromCountry = useAppStore((s) => s.removeTagFromCountry);
    const { toast } = useToast();

    if (!editingId) return null;

    const countryName = getCountryNameById(editingId);
    const isVisited = country?.visited ?? false;

    return (
        <Dialog open={!!editingId} onOpenChange={(open) => !open && closeEditDialog()}>
            <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">{countryName}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Visited Toggle */}
                    <button
                        onClick={() => {
                            toggleVisited(editingId);
                            if (isVisited) {
                                analytics.countryUnmarked(countryName, editingId);
                            } else {
                                analytics.countryMarkedVisited(countryName, editingId);
                                recordEvent('country_marked');
                            }
                            toast({
                                title: isVisited ? "Unmarked" : "Marked as visited",
                                description: isVisited
                                    ? `${countryName} removed from visited`
                                    : `${countryName} added to visited`,
                                variant: isVisited ? "default" : "success",
                            });
                        }}
                        className={`
              w-full px-4 py-3 rounded-lg text-sm font-medium transition-all
              flex items-center justify-between gap-3
              ${isVisited
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-dashed border-gray-300'
                            }
            `}
                    >
                        <div className="flex items-center gap-2">
                            {isVisited ? (
                                <span className="text-lg">✓</span>
                            ) : (
                                <span className="text-lg opacity-50">○</span>
                            )}
                            <span>{isVisited ? "Visited" : "Mark as Visited"}</span>
                        </div>
                    </button>

                    {/* Note */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Note</label>
                        <textarea
                            className="w-full min-h-20 text-sm rounded-md border-2 border-gray-300 bg-white text-gray-900 px-3 py-2 outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-gray-400"
                            placeholder="Add notes about your trip..."
                            value={country?.note ?? ""}
                            maxLength={2000}
                            onChange={(e) => {
                                setNote(editingId, e.target.value);
                                if (e.target.value.trim() && (!country?.note || country.note.trim() === "")) {
                                    analytics.countryNoteAdded(countryName, editingId);
                                }
                            }}
                        />
                    </div>

                    {/* Date and Rating */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Visited date</label>
                            <input
                                type="date"
                                className="w-full text-sm rounded-md border-2 border-gray-300 bg-white text-gray-900 px-3 py-2 outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                value={country?.visitedAt ?? ""}
                                onChange={(e) => setVisitedAt(editingId, e.target.value || undefined)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Rating</label>
                            <select
                                className="w-full text-sm rounded-md border-2 border-gray-300 bg-white text-gray-900 px-3 py-2 outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer"
                                value={country?.rating ?? ""}
                                onChange={(e) => {
                                    const rating = e.target.value ? Number(e.target.value) : undefined;
                                    setRating(editingId, rating);
                                    if (rating) {
                                        analytics.countryRated(countryName, editingId, rating);
                                    }
                                }}
                            >
                                <option value="">Select</option>
                                <option value="1">⭐ 1</option>
                                <option value="2">⭐⭐ 2</option>
                                <option value="3">⭐⭐⭐ 3</option>
                                <option value="4">⭐⭐⭐⭐ 4</option>
                                <option value="5">⭐⭐⭐⭐⭐ 5</option>
                            </select>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tags</label>
                        <div className="flex flex-wrap gap-2">
                            {PREDEFINED_TAGS.map((tag) => {
                                const isActive = country?.tags?.includes(tag.id);
                                return (
                                    <button
                                        key={tag.id}
                                        onClick={() => {
                                            if (isActive) {
                                                removeTagFromCountry(editingId, tag.id);
                                            } else {
                                                addTagToCountry(editingId, tag.id);
                                                analytics.tagAdded(tag.name, countryName, editingId);
                                            }
                                        }}
                                        className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                      transition-all border-2
                      ${isActive
                                                ? 'scale-105'
                                                : 'opacity-60 hover:opacity-100'
                                            }
                    `}
                                        style={{
                                            backgroundColor: isActive ? tag.color : 'transparent',
                                            borderColor: tag.color,
                                            color: isActive ? 'white' : 'inherit',
                                        }}
                                    >
                                        <span>{tag.emoji}</span>
                                        <span>{tag.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
