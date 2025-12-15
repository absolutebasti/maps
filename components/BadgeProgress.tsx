"use client";

import { useMemo } from "react";
import { useAppStore } from "@/lib/state/store";
import {
    calculateAllBadgeProgress,
    getNearlyUnlockedBadges,
    TIER_COLORS
} from "@/lib/badges";
import { cn } from "@/lib/utils";

export function BadgeProgress() {
    const countriesById = useAppStore((s) => s.countriesById);

    // Calculate visited country IDs
    const visitedCountryIds = useMemo(() => {
        return Object.entries(countriesById)
            .filter(([, data]) => data.visited)
            .map(([id]) => id);
    }, [countriesById]);

    // Get badge stats
    const badgeProgress = useMemo(() => {
        return calculateAllBadgeProgress(visitedCountryIds);
    }, [visitedCountryIds]);

    const nearlyUnlocked = useMemo(() => {
        return getNearlyUnlockedBadges(visitedCountryIds, 40);
    }, [visitedCountryIds]);

    const unlockedCount = badgeProgress.filter((p) => p.isUnlocked).length;
    const totalBadges = badgeProgress.length;

    // Find the next badge to unlock (highest progress, not yet unlocked)
    const nextBadge = useMemo(() => {
        return badgeProgress
            .filter((p) => !p.isUnlocked)
            .sort((a, b) => b.percentage - a.percentage)[0];
    }, [badgeProgress]);

    return (
        <div className="rounded-lg border bg-card p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    🏆 Badge Progress
                </h3>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {unlockedCount}/{totalBadges}
                </span>
            </div>

            {/* Overall Progress Bar */}
            <div className="space-y-1">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-amber-500 via-yellow-500 to-green-500 rounded-full transition-all duration-700"
                        style={{ width: `${(unlockedCount / totalBadges) * 100}%` }}
                    />
                </div>
                <p className="text-xs text-muted-foreground">
                    {Math.round((unlockedCount / totalBadges) * 100)}% complete
                </p>
            </div>

            {/* Next Badge */}
            {nextBadge && (
                <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Next badge:</p>
                    <div className={cn(
                        "flex items-center gap-3 p-2 rounded-md",
                        TIER_COLORS[nextBadge.badge.tier].bg
                    )}>
                        <span className="text-2xl">{nextBadge.badge.icon}</span>
                        <div className="flex-1 min-w-0">
                            <p className={cn(
                                "text-sm font-medium truncate",
                                TIER_COLORS[nextBadge.badge.tier].text
                            )}>
                                {nextBadge.badge.name}
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-500"
                                        style={{ width: `${nextBadge.percentage}%` }}
                                    />
                                </div>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                    {nextBadge.current}/{nextBadge.required}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Nearly Unlocked */}
            {nearlyUnlocked.length > 1 && (
                <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-1">Almost there:</p>
                    <div className="flex flex-wrap gap-1">
                        {nearlyUnlocked.slice(0, 3).map((p) => (
                            <div
                                key={p.badge.id}
                                className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-xs"
                                title={`${p.badge.name}: ${p.percentage}%`}
                            >
                                <span>{p.badge.icon}</span>
                                <span className="text-muted-foreground">{p.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* All Unlocked */}
            {unlockedCount === totalBadges && (
                <div className="pt-2 border-t text-center">
                    <p className="text-sm font-semibold text-yellow-500">
                        🎉 All badges unlocked!
                    </p>
                </div>
            )}
        </div>
    );
}
