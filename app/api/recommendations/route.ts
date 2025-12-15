// AI Recommendations API Route
// Generates personalized travel destination suggestions

import { NextRequest, NextResponse } from "next/server";
import { anthropic, AI_MODEL, MAX_TOKENS, isAIAvailable } from "@/lib/anthropic/client";
import { RECOMMENDATIONS_PROMPT } from "@/lib/anthropic/prompts";
import {
    COUNTRY_CONTINENTS,
    ISLAND_NATIONS,
    LANDLOCKED_COUNTRIES,
    getNearlyUnlockedBadges
} from "@/lib/badges";
import { ALL_195_COUNTRIES } from "@/lib/map/all-countries";

interface RecommendationsRequest {
    visitedCountries: string[];
    interests?: string[];
}

export interface Recommendation {
    country: string;
    countryId: string;
    reason: string;
    matchScore: number;
    potentialBadges: string[];
    continent: string;
}

// Generate algorithmic recommendations (for demo mode or as fallback)
function generateAlgorithmicRecommendations(
    visitedCountryIds: string[]
): Recommendation[] {
    const visitedSet = new Set(visitedCountryIds);
    const recommendations: Recommendation[] = [];

    // Analyze travel patterns
    const continentCounts: Record<string, number> = {};
    visitedCountryIds.forEach((id) => {
        const continent = COUNTRY_CONTINENTS[id];
        if (continent) {
            continentCounts[continent] = (continentCounts[continent] || 0) + 1;
        }
    });

    // Find favorite continent
    const favoriteContinent = Object.entries(continentCounts)
        .sort(([, a], [, b]) => b - a)[0]?.[0];

    // Find unvisited countries
    const unvisitedCountries = ALL_195_COUNTRIES.filter(
        (c) => !visitedSet.has(c.id)
    );

    // Get nearly unlocked badges for context
    const nearlyUnlocked = getNearlyUnlockedBadges(visitedCountryIds, 50);

    // Strategy 1: Regional completion (same continent as favorite)
    if (favoriteContinent) {
        const sameContinent = unvisitedCountries.find(
            (c) => COUNTRY_CONTINENTS[c.id] === favoriteContinent
        );
        if (sameContinent) {
            recommendations.push({
                country: sameContinent.name,
                countryId: sameContinent.id,
                reason: `Continue exploring ${favoriteContinent}! You've loved it so far.`,
                matchScore: 92,
                potentialBadges: nearlyUnlocked
                    .filter((b) => b.badge.requirement.type === "continent")
                    .map((b) => b.badge.name)
                    .slice(0, 2),
                continent: favoriteContinent,
            });
        }
    }

    // Strategy 2: New continent exploration
    const allContinents = ["Europe", "Asia", "Africa", "Americas", "Oceania"];
    const unexploredContinents = allContinents.filter(
        (c) => !continentCounts[c]
    );
    if (unexploredContinents.length > 0) {
        const newContinent = unexploredContinents[0];
        const countryInNew = unvisitedCountries.find(
            (c) => COUNTRY_CONTINENTS[c.id] === newContinent
        );
        if (countryInNew) {
            recommendations.push({
                country: countryInNew.name,
                countryId: countryInNew.id,
                reason: `Explore a new continent! ${newContinent} awaits your first stamp.`,
                matchScore: 88,
                potentialBadges: ["Six Continents"],
                continent: newContinent,
            });
        }
    }

    // Strategy 3: Island or landlocked suggestion
    const hasIslands = visitedCountryIds.some((id) => ISLAND_NATIONS.has(id));
    const hasLandlocked = visitedCountryIds.some((id) => LANDLOCKED_COUNTRIES.has(id));

    if (!hasIslands || visitedCountryIds.filter((id) => ISLAND_NATIONS.has(id)).length < 3) {
        const island = unvisitedCountries.find((c) => ISLAND_NATIONS.has(c.id));
        if (island) {
            recommendations.push({
                country: island.name,
                countryId: island.id,
                reason: "Island paradise! Perfect for the Island Hopper badge.",
                matchScore: 85,
                potentialBadges: ["Island Hopper"],
                continent: COUNTRY_CONTINENTS[island.id] || "Unknown",
            });
        }
    } else if (!hasLandlocked || visitedCountryIds.filter((id) => LANDLOCKED_COUNTRIES.has(id)).length < 2) {
        const landlocked = unvisitedCountries.find((c) => LANDLOCKED_COUNTRIES.has(c.id));
        if (landlocked) {
            recommendations.push({
                country: landlocked.name,
                countryId: landlocked.id,
                reason: "Discover the charm of a landlocked nation!",
                matchScore: 82,
                potentialBadges: ["Landlocked Expert"],
                continent: COUNTRY_CONTINENTS[landlocked.id] || "Unknown",
            });
        }
    }

    // Ensure we have at least 3 recommendations
    while (recommendations.length < 3 && unvisitedCountries.length > recommendations.length) {
        const random = unvisitedCountries[Math.floor(Math.random() * unvisitedCountries.length)];
        if (!recommendations.find((r) => r.countryId === random.id)) {
            recommendations.push({
                country: random.name,
                countryId: random.id,
                reason: "A new adventure awaits!",
                matchScore: 75,
                potentialBadges: [],
                continent: COUNTRY_CONTINENTS[random.id] || "Unknown",
            });
        }
    }

    return recommendations.slice(0, 3);
}

export async function POST(request: NextRequest) {
    try {
        const body: RecommendationsRequest = await request.json();
        const { visitedCountries = [] } = body;

        // Always generate algorithmic recommendations as base/fallback
        const algorithmicRecs = generateAlgorithmicRecommendations(visitedCountries);

        // If no AI available, return algorithmic recommendations
        if (!isAIAvailable()) {
            return NextResponse.json({
                recommendations: algorithmicRecs,
                isDemo: true,
            });
        }

        // Try to enhance with AI reasoning
        try {
            const prompt = `${RECOMMENDATIONS_PROMPT}

User has visited: ${visitedCountries.join(", ") || "No countries yet"}

Based on the algorithmic suggestions below, enhance each with a more personalized and engaging reason:
${JSON.stringify(algorithmicRecs, null, 2)}

Return only valid JSON array with enhanced recommendations.`;

            const response = await anthropic!.messages.create({
                model: AI_MODEL,
                max_tokens: MAX_TOKENS,
                messages: [{ role: "user", content: prompt }],
            });

            const textContent = response.content.find((c) => c.type === "text");
            if (textContent?.type === "text") {
                try {
                    // Try to parse AI-enhanced recommendations
                    const enhanced = JSON.parse(textContent.text);
                    if (Array.isArray(enhanced) && enhanced.length > 0) {
                        return NextResponse.json({
                            recommendations: enhanced,
                            isDemo: false,
                        });
                    }
                } catch {
                    // JSON parsing failed, use algorithmic
                }
            }
        } catch {
            // AI enhancement failed, use algorithmic
        }

        return NextResponse.json({
            recommendations: algorithmicRecs,
            isDemo: true,
        });
    } catch (error) {
        console.error("Recommendations API error:", error);
        return NextResponse.json(
            { error: "Failed to generate recommendations" },
            { status: 500 }
        );
    }
}
