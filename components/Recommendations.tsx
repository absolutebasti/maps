"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useAppStore } from "@/lib/state/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Recommendation {
    country: string;
    countryId: string;
    reason: string;
    matchScore: number;
    potentialBadges: string[];
    continent: string;
}

export function Recommendations() {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const countriesById = useAppStore((s) => s.countriesById);
    const selectCountry = useAppStore((s) => s.selectCountry);

    // Calculate visited country IDs
    const visitedCountryIds = useMemo(() => {
        return Object.entries(countriesById)
            .filter(([, data]) => data.visited)
            .map(([id]) => id);
    }, [countriesById]);

    const fetchRecommendations = useCallback(async () => {
        if (visitedCountryIds.length === 0) {
            setRecommendations([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/recommendations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    visitedCountries: visitedCountryIds,
                }),
            });

            if (!response.ok) throw new Error("Failed to fetch");

            const data = await response.json();
            setRecommendations(data.recommendations || []);
        } catch (err) {
            console.error("Recommendations error:", err);
            setError("Couldn't load recommendations");
        } finally {
            setIsLoading(false);
        }
    }, [visitedCountryIds]);

    // Fetch recommendations when visited countries change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchRecommendations();
        }, 500); // Debounce

        return () => clearTimeout(timeoutId);
    }, [fetchRecommendations]);

    // Don't show if no countries visited
    if (visitedCountryIds.length === 0) {
        return (
            <div className="rounded-lg border bg-card p-4">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                    ✨ AI Recommendations
                </h3>
                <p className="text-xs text-muted-foreground text-center py-4">
                    Mark some countries as visited to get personalized destination suggestions!
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-lg border bg-card p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    ✨ Your Next Adventure
                </h3>
                <button
                    onClick={fetchRecommendations}
                    disabled={isLoading}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    title="Refresh recommendations"
                >
                    {isLoading ? "⏳" : "🔄"}
                </button>
            </div>

            {/* Loading State */}
            {isLoading && recommendations.length === 0 && (
                <div className="py-4 text-center">
                    <span className="text-2xl animate-pulse">🌍</span>
                    <p className="text-xs text-muted-foreground mt-2">Finding perfect destinations...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="py-4 text-center">
                    <p className="text-xs text-destructive">{error}</p>
                    <Button variant="ghost" size="sm" onClick={fetchRecommendations} className="mt-2">
                        Try again
                    </Button>
                </div>
            )}

            {/* Recommendations List */}
            {!isLoading && recommendations.length > 0 && (
                <div className="space-y-2">
                    {recommendations.slice(0, 3).map((rec, index) => (
                        <button
                            key={rec.countryId}
                            onClick={() => selectCountry(rec.countryId, { centerOn: true })}
                            className={cn(
                                "w-full text-left p-3 rounded-lg border transition-all",
                                "hover:bg-muted/50 hover:border-primary/50",
                                "focus:outline-none focus:ring-2 focus:ring-primary",
                                index === 0 && "bg-gradient-to-r from-purple-500/5 to-indigo-500/5 border-purple-500/20"
                            )}
                        >
                            <div className="flex items-start gap-3">
                                {/* Rank Badge */}
                                <div className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                                    index === 0 ? "bg-yellow-500 text-white" : "bg-muted text-muted-foreground"
                                )}>
                                    {index + 1}
                                </div>

                                <div className="flex-1 min-w-0">
                                    {/* Country Name */}
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm truncate">{rec.country}</span>
                                        <span className="text-xs text-muted-foreground">{rec.continent}</span>
                                    </div>

                                    {/* Reason */}
                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                        {rec.reason}
                                    </p>

                                    {/* Badges */}
                                    {rec.potentialBadges.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                            {rec.potentialBadges.map((badge) => (
                                                <span
                                                    key={badge}
                                                    className="px-1.5 py-0.5 text-[10px] rounded-full bg-primary/10 text-primary"
                                                >
                                                    🏆 {badge}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Match Score */}
                                <div className="text-right">
                                    <div className={cn(
                                        "text-sm font-bold",
                                        rec.matchScore >= 90 ? "text-green-500" :
                                            rec.matchScore >= 80 ? "text-yellow-500" : "text-muted-foreground"
                                    )}>
                                        {rec.matchScore}%
                                    </div>
                                    <div className="text-[10px] text-muted-foreground">match</div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && recommendations.length === 0 && visitedCountryIds.length > 0 && (
                <div className="py-4 text-center">
                    <p className="text-xs text-muted-foreground">No recommendations available</p>
                </div>
            )}
        </div>
    );
}
