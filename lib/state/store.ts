import { create } from "zustand";

export type CountryData = {
  id: string;
  visited: boolean;
  tags: string[];
  note?: string;
  visitedAt?: string;
  rating?: number;
};

export type TagData = {
  id: string;
  name: string;
  color: string; // hsl(...) or hex
  emoji?: string;
};

export type Settings = {
  theme: "light" | "dark" | "system";
  showLegend: boolean;
  showLabels: boolean;
  visitedCountryColor: string;
};

export type AuthUser = {
  email: string;
  name: string;
  loggedInAt: string;
};

type SelectCountryOptions = {
  autoMark?: boolean;
  centerOn?: boolean;
};

type AppState = {
  selectedCountryId?: string;
  countriesById: Record<string, CountryData>;
  tagsById: Record<string, TagData>;
  settings: Settings;
  user?: AuthUser;
  hasSeenAuthModal: boolean;
  // actions
  selectCountry: (id?: string, opts?: SelectCountryOptions) => void;
  toggleVisited: (id: string) => void;
  markVisitedMany: (ids: string[], visited: boolean) => void;
  toggleVisitedMany: (ids: string[]) => void;
  setNote: (id: string, note: string) => void;
  addTagToCountry: (id: string, tagId: string) => void;
  removeTagFromCountry: (id: string, tagId: string) => void;
  upsertTag: (tag: TagData) => void;
  deleteTag: (tagId: string) => void;
  setVisitedAt: (id: string, isoDate?: string) => void;
  setRating: (id: string, rating?: number) => void;
  setVisitedCountryColor: (color: string) => void;
  setUser: (user: AuthUser | undefined) => void;
  setHasSeenAuthModal: (seen: boolean) => void;
  logout: () => void;
};

// Predefined tags that users can add to countries
export const PREDEFINED_TAGS: TagData[] = [
  { id: "want-to-visit", name: "Want to Visit", emoji: "😍", color: "#F87171" },
  { id: "lived-here", name: "Lived Here", emoji: "🏠", color: "#60A5FA" },
  { id: "favorite", name: "Favorite", emoji: "⭐", color: "#FBBF24" },
];

export const useAppStore = create<AppState>((set) => ({
  selectedCountryId: undefined,
  countriesById: {},
  tagsById: PREDEFINED_TAGS.reduce((acc, tag) => ({ ...acc, [tag.id]: tag }), {}),
  settings: {
    theme: "system",
    showLegend: true,
    showLabels: false,
    visitedCountryColor: "#E8DCC4"
  },
  user: undefined,
  hasSeenAuthModal: false,
  selectCountry: (id, opts) =>
    set((s) => {
      const updates: Partial<AppState> = { selectedCountryId: id };
      
      // Auto-mark as visited if requested
      if (opts?.autoMark && id) {
        const existing = s.countriesById[id] || { id, visited: false, tags: [] };
        if (!existing.visited) {
          const next: CountryData = { ...existing, visited: true };
          updates.countriesById = { ...s.countriesById, [id]: next };
        }
      }
      
      // TODO: Center map on country if opts?.centerOn is true
      // This will be implemented when we add zoom-to-country functionality
      
      return updates;
    }),
  toggleVisited: (id) =>
    set((s) => {
      const existing = s.countriesById[id] || {
        id,
        visited: false,
        tags: []
      };
      const next: CountryData = { ...existing, visited: !existing.visited };
      return { countriesById: { ...s.countriesById, [id]: next } };
    }),
  markVisitedMany: (ids, visited) =>
    set((s) => {
      if (!ids.length) return s;
      let changed = false;
      const nextMap = { ...s.countriesById };
      for (const id of ids) {
        const existing = nextMap[id];
        if (existing) {
          if (existing.visited !== visited) {
            changed = true;
            nextMap[id] = { ...existing, visited };
          }
        } else if (visited) {
          changed = true;
          nextMap[id] = { id, visited: true, tags: [] };
        }
      }
      if (!changed) {
        return s;
      }
      return { countriesById: nextMap };
    }),
  toggleVisitedMany: (ids) =>
    set((s) => {
      if (!ids.length) return s;
      const nextMap = { ...s.countriesById };
      let changed = false;
      for (const id of ids) {
        const existing = nextMap[id] || { id, visited: false, tags: [] };
        const updated: CountryData = { ...existing, visited: !existing.visited };
        if (updated.visited !== existing.visited) {
          changed = true;
        }
        nextMap[id] = updated;
      }
      if (!changed) {
        return s;
      }
      return { countriesById: nextMap };
    }),
  setNote: (id, note) =>
    set((s) => {
      const existing = s.countriesById[id] || { id, visited: false, tags: [] };
      const next: CountryData = { ...existing, note };
      return { countriesById: { ...s.countriesById, [id]: next } };
    }),
  addTagToCountry: (id, tagId) =>
    set((s) => {
      const existing = s.countriesById[id] || { id, visited: false, tags: [] };
      const tags = new Set(existing.tags);
      tags.add(tagId);
      const next: CountryData = { ...existing, tags: Array.from(tags) };
      return { countriesById: { ...s.countriesById, [id]: next } };
    }),
  removeTagFromCountry: (id, tagId) =>
    set((s) => {
      const existing = s.countriesById[id] || { id, visited: false, tags: [] };
      const next: CountryData = {
        ...existing,
        tags: existing.tags.filter((t) => t !== tagId)
      };
      return { countriesById: { ...s.countriesById, [id]: next } };
    }),
  upsertTag: (tag) =>
    set((s) => ({ tagsById: { ...s.tagsById, [tag.id]: tag } })),
  deleteTag: (tagId) =>
    set((s) => {
      const { [tagId]: _, ...rest } = s.tagsById;
      // also remove from countries
      const updatedCountries: Record<string, CountryData> = {};
      for (const [cid, c] of Object.entries(s.countriesById)) {
        updatedCountries[cid] = { ...c, tags: c.tags.filter((t) => t !== tagId) };
      }
      return { tagsById: rest, countriesById: updatedCountries };
    }),
  setVisitedAt: (id, isoDate) =>
    set((s) => {
      const existing = s.countriesById[id] || { id, visited: false, tags: [] };
      const next: CountryData = { ...existing, visitedAt: isoDate };
      return { countriesById: { ...s.countriesById, [id]: next } };
    }),
  setRating: (id, rating) =>
    set((s) => {
      const existing = s.countriesById[id] || { id, visited: false, tags: [] };
      const next: CountryData = { ...existing, rating };
      return { countriesById: { ...s.countriesById, [id]: next } };
    }),
  setVisitedCountryColor: (color) =>
    set((s) => ({
      settings: { ...s.settings, visitedCountryColor: color }
    })),
  setUser: (user) => set({ user }),
  setHasSeenAuthModal: (seen) => set({ hasSeenAuthModal: seen }),
  logout: async () => {
    // Sign out from Supabase
    const { createClient } = await import("../supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    
    // Clear local state
    localStorage.removeItem("mymap_auth");
    set({ user: undefined });
  }
}));


