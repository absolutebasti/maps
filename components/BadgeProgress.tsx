"use client";

import { useMemo, useState } from "react";
import { useAppStore } from "@/lib/state/store";
import {
    TIER_STYLES,
    calculateAllBadgeProgress,
    getNextBadge,
    getCurrentTier,
    getTierDisplayName,
    type BadgeProgress as BadgeProgressType,
    type Badge
} from "@/lib/badges";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface BadgeDetailModalProps {
    badge: Badge | null;
    progress: BadgeProgressType | null;
    open: boolean;
    onClose: () => void;
    countriesVisited: number;
}

function BadgeDetailModal({ badge, progress, open, onClose, countriesVisited }: BadgeDetailModalProps) {
    if (!badge || !progress) return null;

    const tierStyle = TIER_STYLES[badge.tier];
    const isUnlocked = progress.isUnlocked;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle className="sr-only">{badge.name}</DialogTitle>
                </DialogHeader>
                <div className="text-center space-y-4">
                    {/* Badge Icon */}
                    <div className={cn(
                        "mx-auto w-24 h-24 rounded-full flex items-center justify-center text-5xl",
                        isUnlocked
                            ? `bg-gradient-to-br ${tierStyle.gradient} shadow-lg ${tierStyle.glow}`
                            : "bg-muted grayscale"
                    )}>
                        {badge.icon}
                    </div>

                    {/* Badge Name & Tier */}
                    <div>
                        <h3 className={cn(
                            "text-xl font-bold",
                            isUnlocked ? tierStyle.text : "text-muted-foreground"
                        )}>
                            {badge.name}
                        </h3>
                        <span className={cn(
                            "text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
                            tierStyle.bg,
                            tierStyle.text
                        )}>
                            {getTierDisplayName(badge.tier)}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground">
                        {badge.description}
                    </p>

                    {/* Progress */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className={isUnlocked ? tierStyle.text : "text-foreground"}>
                                {countriesVisited} / {badge.countriesRequired} countries
                            </span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-500",
                                    isUnlocked
                                        ? `bg-gradient-to-r ${tierStyle.gradient}`
                                        : "bg-primary/60"
                                )}
                                style={{ width: `${progress.percentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Status */}
                    {isUnlocked ? (
                        <div className={cn(
                            "py-3 rounded-lg",
                            tierStyle.bg
                        )}>
                            <p className={cn("font-semibold", tierStyle.text)}>
                                🎉 Unlocked!
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {badge.reward}
                            </p>
                        </div>
                    ) : (
                        <div className="py-3 rounded-lg bg-muted">
                            <p className="text-sm text-muted-foreground">
                                Visit <strong>{badge.countriesRequired - countriesVisited}</strong> more countries to unlock
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function BadgeProgress() {
    const [selectedBadge, setSelectedBadge] = useState<{ badge: Badge; progress: BadgeProgressType } | null>(null);
    const countriesById = useAppStore((s) => s.countriesById);

    // Calculate visited country count
    const countriesVisitedCount = useMemo(() => {
        return Object.values(countriesById).filter((c) => c.visited).length;
    }, [countriesById]);

    // Get badge stats
    const badgeProgress = useMemo(() => {
        return calculateAllBadgeProgress(countriesVisitedCount);
    }, [countriesVisitedCount]);

    const nextBadge = useMemo(() => {
        return getNextBadge(countriesVisitedCount);
    }, [countriesVisitedCount]);

    const currentTier = getCurrentTier(countriesVisitedCount);
    const tierStyle = TIER_STYLES[currentTier];
    const unlockedCount = badgeProgress.filter((p) => p.isUnlocked).length;
    const totalBadges = badgeProgress.length;

    return (
        <>
            <div className="rounded-lg border bg-card p-4 space-y-3">
                {/* Header with Tier Display */}
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold flex items-center gap-2">
                        🏆 Badge Progress
                    </h3>
                    <div className={cn(
                        "text-xs font-bold uppercase px-2 py-0.5 rounded-full",
                        tierStyle.bg,
                        tierStyle.text
                    )}>
                        {getTierDisplayName(currentTier)}
                    </div>
                </div>

                {/* Overall Progress Bar */}
                <div className="space-y-1">
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full transition-all duration-700",
                                `bg-gradient-to-r ${tierStyle.gradient}`
                            )}
                            style={{ width: `${(unlockedCount / totalBadges) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{unlockedCount}/{totalBadges} badges</span>
                        <span>{countriesVisitedCount} countries</span>
                    </div>
                </div>

                {/* Next Badge */}
                {nextBadge && (
                    <button
                        onClick={() => setSelectedBadge({ badge: nextBadge.badge, progress: nextBadge })}
                        className={cn(
                            "w-full text-left p-3 rounded-lg border transition-all",
                            "hover:border-primary/50 hover:bg-muted/50",
                            TIER_STYLES[nextBadge.badge.tier].bg
                        )}
                    >
                        <p className="text-xs text-muted-foreground mb-1">Next badge:</p>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{nextBadge.badge.icon}</span>
                            <div className="flex-1 min-w-0">
                                <p className={cn(
                                    "text-sm font-medium truncate",
                                    TIER_STYLES[nextBadge.badge.tier].text
                                )}>
                                    {nextBadge.badge.name}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-500"
                                            style={{ width: `${nextBadge.percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                        {countriesVisitedCount}/{nextBadge.badge.countriesRequired}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </button>
                )}

                {/* Recent Unlocked Badges */}
                {unlockedCount > 0 && (
                    <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-2">Unlocked badges:</p>
                        <div className="flex flex-wrap gap-1">
                            {badgeProgress
                                .filter((p) => p.isUnlocked)
                                .slice(-5)
                                .reverse()
                                .map((p) => (
                                    <button
                                        key={p.badge.id}
                                        onClick={() => setSelectedBadge({ badge: p.badge, progress: p })}
                                        className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center text-lg",
                                            "hover:scale-110 transition-transform cursor-pointer",
                                            `bg-gradient-to-br ${TIER_STYLES[p.badge.tier].gradient}`,
                                            "shadow-sm"
                                        )}
                                        title={p.badge.name}
                                    >
                                        {p.badge.icon}
                                    </button>
                                ))}
                            {unlockedCount > 5 && (
                                <span className="text-xs text-muted-foreground self-center ml-1">
                                    +{unlockedCount - 5} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* All Unlocked */}
                {unlockedCount === totalBadges && (
                    <div className="pt-2 border-t text-center">
                        <p className="text-sm font-semibold bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
                            🎉 All badges unlocked! You're legendary!
                        </p>
                    </div>
                )}
            </div>

            {/* Badge Detail Modal */}
            <BadgeDetailModal
                badge={selectedBadge?.badge || null}
                progress={selectedBadge?.progress || null}
                open={!!selectedBadge}
                onClose={() => setSelectedBadge(null)}
                countriesVisited={countriesVisitedCount}
            />
        </>
    );
}
