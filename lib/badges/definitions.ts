// MapMyStay Badge Definitions - Duolingo-Style Tier System
// 13 Achievement badges based on country count progression

export type BadgeTier = "copper" | "bronze" | "silver" | "gold" | "platinum" | "diamond" | "legendary";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  countriesRequired: number;
  tier: BadgeTier;
  reward: string; // Fun reward description
}

// Duolingo-style progression based on country count
export const BADGES: Badge[] = [
  {
    id: "first-stamp",
    name: "First Stamp",
    description: "Your journey begins! Mark your first country as visited.",
    icon: "🛫",
    countriesRequired: 1,
    tier: "copper",
    reward: "Welcome to the travelers' club!",
  },
  {
    id: "curious-traveler",
    name: "Curious Traveler",
    description: "You've started exploring the world.",
    icon: "🔍",
    countriesRequired: 3,
    tier: "copper",
    reward: "Your passport is warming up!",
  },
  {
    id: "explorer",
    name: "Explorer",
    description: "Five countries down, many more to go!",
    icon: "🗺️",
    countriesRequired: 5,
    tier: "bronze",
    reward: "You're officially an explorer!",
  },
  {
    id: "adventurer",
    name: "Adventurer",
    description: "Double digits! You're a seasoned traveler.",
    icon: "⛰️",
    countriesRequired: 10,
    tier: "bronze",
    reward: "Adventure is your middle name!",
  },
  {
    id: "wanderer",
    name: "Wanderer",
    description: "15 countries explored. The world is your playground.",
    icon: "🚶",
    countriesRequired: 15,
    tier: "silver",
    reward: "Not all who wander are lost!",
  },
  {
    id: "globetrotter",
    name: "Globetrotter",
    description: "20 countries! You're truly going places.",
    icon: "🌍",
    countriesRequired: 20,
    tier: "silver",
    reward: "The globe is your oyster!",
  },
  {
    id: "world-citizen",
    name: "World Citizen",
    description: "25 countries. You belong everywhere.",
    icon: "🌏",
    countriesRequired: 25,
    tier: "gold",
    reward: "Home is wherever you are!",
  },
  {
    id: "jet-setter",
    name: "Jet Setter",
    description: "30 countries! Frequent flyer status unlocked.",
    icon: "✈️",
    countriesRequired: 30,
    tier: "gold",
    reward: "The sky is NOT the limit!",
  },
  {
    id: "passport-master",
    name: "Passport Master",
    description: "40 countries. Your passport is a work of art.",
    icon: "📘",
    countriesRequired: 40,
    tier: "platinum",
    reward: "Customs officers know you by name!",
  },
  {
    id: "world-traveler",
    name: "World Traveler",
    description: "50 countries! Quarter of the world explored.",
    icon: "🎒",
    countriesRequired: 50,
    tier: "platinum",
    reward: "You've seen more than most will ever dream!",
  },
  {
    id: "continental-master",
    name: "Continental Master",
    description: "75 countries. You're in the elite league.",
    icon: "👑",
    countriesRequired: 75,
    tier: "diamond",
    reward: "Travel royalty!",
  },
  {
    id: "world-conqueror",
    name: "World Conqueror",
    description: "100 countries! More than half the world explored.",
    icon: "🏆",
    countriesRequired: 100,
    tier: "diamond",
    reward: "You've conquered the world!",
  },
  {
    id: "ultimate-explorer",
    name: "Ultimate Explorer",
    description: "150 countries. You're a living legend.",
    icon: "🌟",
    countriesRequired: 150,
    tier: "legendary",
    reward: "You ARE the world!",
  },
];

// Quick lookup map
export const BADGES_BY_ID = new Map(BADGES.map((b) => [b.id, b]));

// Tier styling with Duolingo-inspired colors
export const TIER_STYLES: Record<BadgeTier, {
  bg: string;
  border: string;
  text: string;
  gradient: string;
  glow: string;
}> = {
  copper: {
    bg: "bg-orange-900/20",
    border: "border-orange-700",
    text: "text-orange-500",
    gradient: "from-orange-600 to-orange-800",
    glow: "shadow-orange-500/20",
  },
  bronze: {
    bg: "bg-amber-800/20",
    border: "border-amber-600",
    text: "text-amber-500",
    gradient: "from-amber-500 to-amber-700",
    glow: "shadow-amber-500/20",
  },
  silver: {
    bg: "bg-slate-300/20",
    border: "border-slate-400",
    text: "text-slate-400",
    gradient: "from-slate-300 to-slate-500",
    glow: "shadow-slate-400/20",
  },
  gold: {
    bg: "bg-yellow-500/20",
    border: "border-yellow-500",
    text: "text-yellow-500",
    gradient: "from-yellow-400 to-yellow-600",
    glow: "shadow-yellow-500/30",
  },
  platinum: {
    bg: "bg-cyan-400/20",
    border: "border-cyan-400",
    text: "text-cyan-400",
    gradient: "from-cyan-300 to-cyan-500",
    glow: "shadow-cyan-400/30",
  },
  diamond: {
    bg: "bg-blue-400/20",
    border: "border-blue-400",
    text: "text-blue-400",
    gradient: "from-blue-300 to-purple-500",
    glow: "shadow-blue-400/40",
  },
  legendary: {
    bg: "bg-purple-500/20",
    border: "border-purple-400",
    text: "text-purple-400",
    gradient: "from-purple-400 via-pink-500 to-yellow-400",
    glow: "shadow-purple-500/50",
  },
};

// Helper to get current tier based on country count
export function getCurrentTier(countriesVisited: number): BadgeTier {
  if (countriesVisited >= 150) return "legendary";
  if (countriesVisited >= 75) return "diamond";
  if (countriesVisited >= 40) return "platinum";
  if (countriesVisited >= 20) return "gold";
  if (countriesVisited >= 10) return "silver";
  if (countriesVisited >= 3) return "bronze";
  return "copper";
}

// Get tier display name
export function getTierDisplayName(tier: BadgeTier): string {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}
