// Badge Progress Calculator - Simplified for country-count based system

import { Badge, BADGES, TIER_STYLES, BadgeTier, getCurrentTier } from "./definitions";

export interface BadgeProgress {
    badge: Badge;
    isUnlocked: boolean;
    current: number;
    required: number;
    percentage: number;
}

// Calculate progress for all badges based on country count
export function calculateAllBadgeProgress(countriesVisitedCount: number): BadgeProgress[] {
    return BADGES.map((badge) => {
        const current = countriesVisitedCount;
        const required = badge.countriesRequired;
        const isUnlocked = current >= required;
        const percentage = Math.min(100, Math.round((current / required) * 100));

        return {
            badge,
            isUnlocked,
            current,
            required,
            percentage,
        };
    });
}

// Get only unlocked badges
export function getUnlockedBadges(countriesVisitedCount: number): Badge[] {
    return calculateAllBadgeProgress(countriesVisitedCount)
        .filter((p) => p.isUnlocked)
        .map((p) => p.badge);
}

// Get the next badge to unlock
export function getNextBadge(countriesVisitedCount: number): BadgeProgress | null {
    const progress = calculateAllBadgeProgress(countriesVisitedCount);
    return progress.find((p) => !p.isUnlocked) || null;
}

// Get badges close to unlocking (for motivation)
export function getNearlyUnlockedBadges(
    countriesVisitedCount: number,
    threshold = 70
): BadgeProgress[] {
    return calculateAllBadgeProgress(countriesVisitedCount)
        .filter((p) => !p.isUnlocked && p.percentage >= threshold)
        .sort((a, b) => b.percentage - a.percentage);
}

// Get travel stats summary
export interface TravelStats {
    countriesVisited: number;
    badgesUnlocked: number;
    totalBadges: number;
    currentTier: BadgeTier;
    nextMilestone: number | null;
    percentToNextBadge: number;
}

export function getTravelStats(countriesVisitedCount: number): TravelStats {
    const unlockedBadges = getUnlockedBadges(countriesVisitedCount);
    const nextBadge = getNextBadge(countriesVisitedCount);

    return {
        countriesVisited: countriesVisitedCount,
        badgesUnlocked: unlockedBadges.length,
        totalBadges: BADGES.length,
        currentTier: getCurrentTier(countriesVisitedCount),
        nextMilestone: nextBadge?.badge.countriesRequired || null,
        percentToNextBadge: nextBadge?.percentage || 100,
    };
}

// Re-export for convenience
export { BADGES, TIER_STYLES, getCurrentTier } from "./definitions";
export type { Badge, BadgeTier } from "./definitions";
