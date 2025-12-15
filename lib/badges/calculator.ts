// Badge Progress Calculator
// Calculates which badges are unlocked based on visited countries

import { Badge, BADGES, BadgeRequirement } from "./definitions";

// Continent mapping for all countries (by country ID)
export const COUNTRY_CONTINENTS: Record<string, string> = {
    // Europe
    "ALBANIA": "Europe", "ANDORRA": "Europe", "AUSTRIA": "Europe", "BELARUS": "Europe",
    "BELGIUM": "Europe", "BOSNIA-AND-HERZEGOVINA": "Europe", "BULGARIA": "Europe",
    "CROATIA": "Europe", "CYPRUS": "Europe", "CZECH-REPUBLIC": "Europe", "DENMARK": "Europe",
    "ESTONIA": "Europe", "FINLAND": "Europe", "FRANCE": "Europe", "GERMANY": "Europe",
    "GREECE": "Europe", "HUNGARY": "Europe", "ICELAND": "Europe", "IRELAND": "Europe",
    "ITALY": "Europe", "KOSOVO": "Europe", "LATVIA": "Europe", "LIECHTENSTEIN": "Europe",
    "LITHUANIA": "Europe", "LUXEMBOURG": "Europe", "MALTA": "Europe", "MOLDOVA": "Europe",
    "MONACO": "Europe", "MONTENEGRO": "Europe", "NETHERLANDS": "Europe", "NORTH-MACEDONIA": "Europe",
    "NORWAY": "Europe", "POLAND": "Europe", "PORTUGAL": "Europe", "ROMANIA": "Europe",
    "RUSSIA": "Europe", "SAN-MARINO": "Europe", "SERBIA": "Europe", "SLOVAKIA": "Europe",
    "SLOVENIA": "Europe", "SPAIN": "Europe", "SWEDEN": "Europe", "SWITZERLAND": "Europe",
    "UKRAINE": "Europe", "UNITED-KINGDOM": "Europe", "VATICAN-CITY": "Europe",

    // Asia
    "AFGHANISTAN": "Asia", "ARMENIA": "Asia", "AZERBAIJAN": "Asia", "BAHRAIN": "Asia",
    "BANGLADESH": "Asia", "BHUTAN": "Asia", "BRUNEI": "Asia", "CAMBODIA": "Asia",
    "CHINA": "Asia", "GEORGIA": "Asia", "INDIA": "Asia", "INDONESIA": "Asia",
    "IRAN": "Asia", "IRAQ": "Asia", "ISRAEL": "Asia", "JAPAN": "Asia",
    "JORDAN": "Asia", "KAZAKHSTAN": "Asia", "KUWAIT": "Asia", "KYRGYZSTAN": "Asia",
    "LAOS": "Asia", "LEBANON": "Asia", "MALAYSIA": "Asia", "MALDIVES": "Asia",
    "MONGOLIA": "Asia", "MYANMAR": "Asia", "NEPAL": "Asia", "NORTH-KOREA": "Asia",
    "OMAN": "Asia", "PAKISTAN": "Asia", "PALESTINE": "Asia", "PHILIPPINES": "Asia",
    "QATAR": "Asia", "SAUDI-ARABIA": "Asia", "SINGAPORE": "Asia", "SOUTH-KOREA": "Asia",
    "SRI-LANKA": "Asia", "SYRIA": "Asia", "TAIWAN": "Asia", "TAJIKISTAN": "Asia",
    "THAILAND": "Asia", "TIMOR-LESTE": "Asia", "TURKEY": "Asia", "TURKMENISTAN": "Asia",
    "UNITED-ARAB-EMIRATES": "Asia", "UZBEKISTAN": "Asia", "VIETNAM": "Asia", "YEMEN": "Asia",

    // Africa
    "ALGERIA": "Africa", "ANGOLA": "Africa", "BENIN": "Africa", "BOTSWANA": "Africa",
    "BURKINA-FASO": "Africa", "BURUNDI": "Africa", "CABO-VERDE": "Africa", "CAMEROON": "Africa",
    "CENTRAL-AFRICAN-REPUBLIC": "Africa", "CHAD": "Africa", "COMOROS": "Africa", "CONGO": "Africa",
    "DEMOCRATIC-REPUBLIC-OF-THE-CONGO": "Africa", "DJIBOUTI": "Africa", "EGYPT": "Africa",
    "EQUATORIAL-GUINEA": "Africa", "ERITREA": "Africa", "ESWATINI": "Africa", "ETHIOPIA": "Africa",
    "GABON": "Africa", "GAMBIA": "Africa", "GHANA": "Africa", "GUINEA": "Africa",
    "GUINEA-BISSAU": "Africa", "IVORY-COAST": "Africa", "KENYA": "Africa", "LESOTHO": "Africa",
    "LIBERIA": "Africa", "LIBYA": "Africa", "MADAGASCAR": "Africa", "MALAWI": "Africa",
    "MALI": "Africa", "MAURITANIA": "Africa", "MAURITIUS": "Africa", "MOROCCO": "Africa",
    "MOZAMBIQUE": "Africa", "NAMIBIA": "Africa", "NIGER": "Africa", "NIGERIA": "Africa",
    "RWANDA": "Africa", "SAO-TOME-AND-PRINCIPE": "Africa", "SENEGAL": "Africa",
    "SEYCHELLES": "Africa", "SIERRA-LEONE": "Africa", "SOMALIA": "Africa", "SOUTH-AFRICA": "Africa",
    "SOUTH-SUDAN": "Africa", "SUDAN": "Africa", "TANZANIA": "Africa", "TOGO": "Africa",
    "TUNISIA": "Africa", "UGANDA": "Africa", "ZAMBIA": "Africa", "ZIMBABWE": "Africa",

    // Americas (North, Central, South, Caribbean)
    "ANTIGUA-AND-BARBUDA": "Americas", "ARGENTINA": "Americas", "BAHAMAS": "Americas",
    "BARBADOS": "Americas", "BELIZE": "Americas", "BOLIVIA": "Americas", "BRAZIL": "Americas",
    "CANADA": "Americas", "CHILE": "Americas", "COLOMBIA": "Americas", "COSTA-RICA": "Americas",
    "CUBA": "Americas", "DOMINICA": "Americas", "DOMINICAN-REPUBLIC": "Americas",
    "ECUADOR": "Americas", "EL-SALVADOR": "Americas", "GRENADA": "Americas",
    "GUATEMALA": "Americas", "GUYANA": "Americas", "HAITI": "Americas", "HONDURAS": "Americas",
    "JAMAICA": "Americas", "MEXICO": "Americas", "NICARAGUA": "Americas", "PANAMA": "Americas",
    "PARAGUAY": "Americas", "PERU": "Americas", "SAINT-KITTS-AND-NEVIS": "Americas",
    "SAINT-LUCIA": "Americas", "SAINT-VINCENT-AND-THE-GRENADINES": "Americas",
    "SURINAME": "Americas", "TRINIDAD-AND-TOBAGO": "Americas", "UNITED-STATES": "Americas",
    "URUGUAY": "Americas", "VENEZUELA": "Americas",

    // Oceania
    "AUSTRALIA": "Oceania", "FIJI": "Oceania", "KIRIBATI": "Oceania",
    "MARSHALL-ISLANDS": "Oceania", "MICRONESIA": "Oceania", "NAURU": "Oceania",
    "NEW-ZEALAND": "Oceania", "PALAU": "Oceania", "PAPUA-NEW-GUINEA": "Oceania",
    "SAMOA": "Oceania", "SOLOMON-ISLANDS": "Oceania", "TONGA": "Oceania",
    "TUVALU": "Oceania", "VANUATU": "Oceania",
};

// Island nations
export const ISLAND_NATIONS = new Set([
    "ANTIGUA-AND-BARBUDA", "BAHAMAS", "BAHRAIN", "BARBADOS", "CABO-VERDE",
    "COMOROS", "CUBA", "CYPRUS", "DOMINICA", "FIJI", "GRENADA", "HAITI",
    "ICELAND", "INDONESIA", "IRELAND", "JAMAICA", "JAPAN", "KIRIBATI",
    "MADAGASCAR", "MALDIVES", "MALTA", "MARSHALL-ISLANDS", "MAURITIUS",
    "MICRONESIA", "NAURU", "NEW-ZEALAND", "PALAU", "PAPUA-NEW-GUINEA",
    "PHILIPPINES", "SAINT-KITTS-AND-NEVIS", "SAINT-LUCIA",
    "SAINT-VINCENT-AND-THE-GRENADINES", "SAMOA", "SAO-TOME-AND-PRINCIPE",
    "SEYCHELLES", "SINGAPORE", "SOLOMON-ISLANDS", "SRI-LANKA", "TAIWAN",
    "TIMOR-LESTE", "TONGA", "TRINIDAD-AND-TOBAGO", "TUVALU", "UNITED-KINGDOM",
    "VANUATU",
]);

// Landlocked countries
export const LANDLOCKED_COUNTRIES = new Set([
    "AFGHANISTAN", "ANDORRA", "ARMENIA", "AUSTRIA", "AZERBAIJAN", "BELARUS",
    "BHUTAN", "BOLIVIA", "BOTSWANA", "BURKINA-FASO", "BURUNDI",
    "CENTRAL-AFRICAN-REPUBLIC", "CHAD", "CZECH-REPUBLIC", "ETHIOPIA",
    "HUNGARY", "KAZAKHSTAN", "KYRGYZSTAN", "LAOS", "LESOTHO", "LIECHTENSTEIN",
    "LUXEMBOURG", "MALAWI", "MALI", "MOLDOVA", "MONGOLIA", "NEPAL", "NIGER",
    "NORTH-MACEDONIA", "PARAGUAY", "RWANDA", "SAN-MARINO", "SERBIA",
    "SLOVAKIA", "SOUTH-SUDAN", "SWITZERLAND", "TAJIKISTAN", "TURKMENISTAN",
    "UGANDA", "UZBEKISTAN", "VATICAN-CITY", "ZAMBIA", "ZIMBABWE",
]);

export interface BadgeProgress {
    badge: Badge;
    isUnlocked: boolean;
    current: number;
    required: number;
    percentage: number;
}

// Calculate progress for a single badge requirement
function calculateRequirementProgress(
    requirement: BadgeRequirement,
    visitedCountryIds: string[]
): { current: number; required: number } {
    switch (requirement.type) {
        case "countries":
            return { current: visitedCountryIds.length, required: requirement.count };

        case "continent": {
            const count = visitedCountryIds.filter(
                (id) => COUNTRY_CONTINENTS[id] === requirement.continent
            ).length;
            return { current: count, required: requirement.count };
        }

        case "continents": {
            const continents = new Set(
                visitedCountryIds
                    .map((id) => COUNTRY_CONTINENTS[id])
                    .filter(Boolean)
            );
            return { current: continents.size, required: requirement.count };
        }

        case "islands": {
            const count = visitedCountryIds.filter((id) => ISLAND_NATIONS.has(id)).length;
            return { current: count, required: requirement.count };
        }

        case "landlocked": {
            const count = visitedCountryIds.filter((id) => LANDLOCKED_COUNTRIES.has(id)).length;
            return { current: count, required: requirement.count };
        }

        default:
            return { current: 0, required: 1 };
    }
}

// Calculate progress for all badges
export function calculateAllBadgeProgress(visitedCountryIds: string[]): BadgeProgress[] {
    return BADGES.map((badge) => {
        const { current, required } = calculateRequirementProgress(
            badge.requirement,
            visitedCountryIds
        );
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
export function getUnlockedBadges(visitedCountryIds: string[]): Badge[] {
    return calculateAllBadgeProgress(visitedCountryIds)
        .filter((p) => p.isUnlocked)
        .map((p) => p.badge);
}

// Get badges close to unlocking (for recommendations)
export function getNearlyUnlockedBadges(
    visitedCountryIds: string[],
    threshold = 75
): BadgeProgress[] {
    return calculateAllBadgeProgress(visitedCountryIds)
        .filter((p) => !p.isUnlocked && p.percentage >= threshold)
        .sort((a, b) => b.percentage - a.percentage);
}

// Get continents visited
export function getContinentsVisited(visitedCountryIds: string[]): string[] {
    const continents = new Set(
        visitedCountryIds
            .map((id) => COUNTRY_CONTINENTS[id])
            .filter(Boolean)
    );
    return Array.from(continents);
}

// Get travel stats summary
export interface TravelStats {
    countriesVisited: number;
    continentsVisited: number;
    badgesUnlocked: number;
    totalBadges: number;
    islandNationsVisited: number;
    landlockedVisited: number;
}

export function getTravelStats(visitedCountryIds: string[]): TravelStats {
    const unlockedBadges = getUnlockedBadges(visitedCountryIds);
    const continents = getContinentsVisited(visitedCountryIds);

    return {
        countriesVisited: visitedCountryIds.length,
        continentsVisited: continents.length,
        badgesUnlocked: unlockedBadges.length,
        totalBadges: BADGES.length,
        islandNationsVisited: visitedCountryIds.filter((id) => ISLAND_NATIONS.has(id)).length,
        landlockedVisited: visitedCountryIds.filter((id) => LANDLOCKED_COUNTRIES.has(id)).length,
    };
}
