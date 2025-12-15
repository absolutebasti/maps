// MapMyStay Badge Definitions
// 14 Achievement badges for travel gamification

export type BadgeTier = "bronze" | "silver" | "gold" | "platinum" | "legendary";

export type BadgeRequirement =
  | { type: "countries"; count: number }
  | { type: "continent"; continent: string; count: number }
  | { type: "continents"; count: number }
  | { type: "islands"; count: number }
  | { type: "landlocked"; count: number };

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: BadgeRequirement;
  tier: BadgeTier;
}

export const BADGES: Badge[] = [
  // Getting Started - Country Count Badges
  {
    id: "first-stamp",
    name: "First Stamp",
    description: "Mark your first country as visited",
    icon: "🛫",
    requirement: { type: "countries", count: 1 },
    tier: "bronze",
  },
  {
    id: "explorer",
    name: "Explorer",
    description: "Visit 5 countries",
    icon: "🗺️",
    requirement: { type: "countries", count: 5 },
    tier: "bronze",
  },
  {
    id: "adventurer",
    name: "Adventurer",
    description: "Visit 10 countries",
    icon: "⛰️",
    requirement: { type: "countries", count: 10 },
    tier: "silver",
  },
  {
    id: "globetrotter",
    name: "Globetrotter",
    description: "Visit 25 countries",
    icon: "🌍",
    requirement: { type: "countries", count: 25 },
    tier: "gold",
  },
  {
    id: "world-traveler",
    name: "World Traveler",
    description: "Visit 50 countries",
    icon: "✈️",
    requirement: { type: "countries", count: 50 },
    tier: "platinum",
  },

  // Continent Mastery Badges
  {
    id: "europe-explorer",
    name: "Europe Explorer",
    description: "Visit 5 countries in Europe",
    icon: "🏰",
    requirement: { type: "continent", continent: "Europe", count: 5 },
    tier: "silver",
  },
  {
    id: "asia-adventurer",
    name: "Asia Adventurer",
    description: "Visit 5 countries in Asia",
    icon: "🏯",
    requirement: { type: "continent", continent: "Asia", count: 5 },
    tier: "silver",
  },
  {
    id: "americas-pioneer",
    name: "Americas Pioneer",
    description: "Visit 3 countries in the Americas",
    icon: "🗽",
    requirement: { type: "continent", continent: "Americas", count: 3 },
    tier: "silver",
  },
  {
    id: "africa-discoverer",
    name: "Africa Discoverer",
    description: "Visit 3 countries in Africa",
    icon: "🦁",
    requirement: { type: "continent", continent: "Africa", count: 3 },
    tier: "silver",
  },
  {
    id: "oceania-voyager",
    name: "Oceania Voyager",
    description: "Visit 2 countries in Oceania",
    icon: "🏝️",
    requirement: { type: "continent", continent: "Oceania", count: 2 },
    tier: "gold",
  },

  // Special Achievement Badges
  {
    id: "six-continents",
    name: "Six Continents",
    description: "Visit at least one country on all 6 inhabited continents",
    icon: "🌐",
    requirement: { type: "continents", count: 6 },
    tier: "platinum",
  },
  {
    id: "island-hopper",
    name: "Island Hopper",
    description: "Visit 5 island nations",
    icon: "🏖️",
    requirement: { type: "islands", count: 5 },
    tier: "gold",
  },
  {
    id: "landlocked-expert",
    name: "Landlocked Expert",
    description: "Visit 3 landlocked countries",
    icon: "🏔️",
    requirement: { type: "landlocked", count: 3 },
    tier: "silver",
  },
  {
    id: "collector",
    name: "Ultimate Collector",
    description: "Visit 100 countries - you're a true world explorer!",
    icon: "🏆",
    requirement: { type: "countries", count: 100 },
    tier: "legendary",
  },
];

// Quick lookup map
export const BADGES_BY_ID = new Map(BADGES.map((b) => [b.id, b]));

// Tier colors for styling
export const TIER_COLORS: Record<BadgeTier, { bg: string; border: string; text: string }> = {
  bronze: { bg: "bg-amber-900/20", border: "border-amber-700", text: "text-amber-600" },
  silver: { bg: "bg-slate-300/20", border: "border-slate-400", text: "text-slate-500" },
  gold: { bg: "bg-yellow-500/20", border: "border-yellow-500", text: "text-yellow-600" },
  platinum: { bg: "bg-cyan-400/20", border: "border-cyan-400", text: "text-cyan-500" },
  legendary: { bg: "bg-purple-500/20", border: "border-purple-500", text: "text-purple-500" },
};
