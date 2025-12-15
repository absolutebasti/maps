"use client";

import { useMemo } from "react";
import { useAppStore } from "@/lib/state/store";
import {
    BADGES,
    TIER_COLORS,
    calculateAllBadgeProgress,
    BadgeProgress
} from "@/lib/badges";
import { cn } from "@/lib/utils";

interface BadgeCardProps {
    progress: BadgeProgress;
}

function BadgeCard({ progress }: BadgeCardProps) {
    const { badge, isUnlocked, current, required, percentage } = progress;
    const tierStyle = TIER_COLORS[badge.tier];

    return (
        <div
            className={cn(
                "relative p-3 rounded-xl border-2 transition-all duration-300",
                isUnlocked
                    ? `${tierStyle.bg} ${tierStyle.border} shadow-lg`
                    : "bg-muted/30 border-muted-foreground/20 opacity-60"
            )}
        >
            {/* Badge Icon */}
            <div className="text-center mb-2">
                <span
                    className={cn(
                        "text-3xl block",
                        isUnlocked ? "" : "grayscale"
                    )}
                >
                    {badge.icon}
                </span>
            </div>

            {/* Badge Name */}
            <h3
                className={cn(
                    "text-xs font-semibold text-center truncate",
                    isUnlocked ? tierStyle.text : "text-muted-foreground"
                )}
            >
                {badge.name}
            </h3>

            {/* Progress Bar */}
            {!isUnlocked && (
                <div className="mt-2">
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary/60 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center mt-1">
                        {current}/{required}
                    </p>
                </div>
            )}

            {/* Unlocked Indicator */}
            {isUnlocked && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-xs">✓</span>
                </div>
            )}

            {/* Tier Badge */}
            <div className={cn(
                "absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase",
                tierStyle.bg,
                tierStyle.text,
                "border",
                tierStyle.border
            )}>
                {badge.tier}
            </div>
        </div>
    );
}

export function BadgeGallery() {
    const countriesById = useAppStore((s) => s.countriesById);

    // Calculate visited country IDs
    const visitedCountryIds = useMemo(() => {
        return Object.entries(countriesById)
            .filter(([, data]) => data.visited)
            .map(([id]) => id);
    }, [countriesById]);

    // Calculate badge progress
    const badgeProgress = useMemo(() => {
        return calculateAllBadgeProgress(visitedCountryIds);
    }, [visitedCountryIds]);

    const unlockedCount = badgeProgress.filter((p) => p.isUnlocked).length;

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    🏆 Badges
                </h2>
                <span className="text-sm text-muted-foreground">
                    {unlockedCount}/{BADGES.length} unlocked
                </span>
            </div>

            {/* Badge Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-3">
                {badgeProgress.map((progress) => (
                    <BadgeCard key={progress.badge.id} progress={progress} />
                ))}
            </div>

            {/* Encouragement */}
            {unlockedCount === 0 && (
                <p className="text-sm text-muted-foreground text-center italic">
                    Mark your first country to earn the "First Stamp" badge! 🛫
                </p>
            )}
            {unlockedCount > 0 && unlockedCount < BADGES.length && (
                <p className="text-sm text-muted-foreground text-center italic">
                    Keep exploring to unlock more badges!
                </p>
            )}
            {unlockedCount === BADGES.length && (
                <p className="text-sm text-center font-semibold text-yellow-500">
                    🎉 Congratulations! You've unlocked all badges!
                </p>
            )}
        </div>
    );
}
