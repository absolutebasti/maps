Awesome project—this is the kind of tool people actually print and hang up. Here’s a tight set of upgrades you can ship without ballooning scope.

Quick wins (TL;DR)
	•	Swap your country picker to an accessible Combobox with a solid backdrop (popover with an overlay), typeahead, and virtualized list (no jank with 250+ items). Use shadcn’s Combobox pattern (Command + Popover) or Radix/React Aria for stricter a11y.  ￼
	•	Upgrade your base map to Natural Earth 1:50m (or 1:10m for export) via world-atlas. It’s clean, maintained, and public domain.  ￼
	•	Improve cartography: switch to Equal Earth or Robinson projection, fix antimeridian cutting, and add crisp hover/active states.  ￼
	•	Wire picker → map so selecting a country auto-paints it (and focuses it).
	•	For rock-solid popover positioning (no clipping), lean on Floating UI.  ￼

⸻

1) Country Combobox with solid background + a11y

Why this stack
	•	shadcn/ui Combobox gives you a polished pattern (Command palette + Popover) that’s easy to style with Tailwind.  ￼
	•	Radix Primitives provide bulletproof keyboard/focus behaviors if you want lower-level control.  ￼
	•	React Aria ComboBox is the most rigorous a11y baseline (WAI-ARIA roles/announcements baked in).  ￼
	•	Floating UI anchors the dropdown and overlay correctly, even near viewport edges.  ￼

UX details to implement
	•	Solid background: Popover has a white/neutral surface, shadow-xl, rounded-2xl; add Overlay (semi-transparent backdrop) to visually separate and trap scroll.
	•	Typeahead with highlighted match segments.
	•	Empty state (“No countries found”).
	•	Keyboard: Up/Down to navigate listbox, Enter to select, Esc to close; aria-activedescendant, aria-expanded, aria-controls wired. (React Aria/Radix handle most of this correctly; avoid DIY unless you copy their patterns.)  ￼
	•	Virtualize the country list with @tanstack/react-virtual if you notice perf drops.
	•	Avoid older react-select a11y pitfalls unless you must use it.  ￼

Minimal wiring (Zustand-friendly)

// components/CountrySearch.tsx (sketch)
import { useTravelStore } from "@/lib/state/store";

export function CountrySearch() {
  const { countries, selectCountry } = useTravelStore();
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => countries.filter(c => c.name.toLowerCase().includes(query.toLowerCase())),
    [countries, query]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="w-full rounded-2xl border px-3 py-2 bg-white dark:bg-neutral-900 shadow">
          Search country…
        </button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-[28rem] rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl">
        <div className="border-b p-2">
          <input
            className="w-full bg-transparent outline-none"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a country"
            autoFocus
          />
        </div>

        <ul role="listbox" className="max-h-80 overflow-auto">
          {filtered.length === 0 && (
            <li className="p-3 text-sm opacity-70">No countries found</li>
          )}
          {filtered.map(c => (
            <li
              key={c.id}
              role="option"
              tabIndex={-1}
              className="px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              onClick={() => selectCountry(c.id, { autoMark: true })}
            >
              {c.emoji} {c.name}
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

Note: If you go with React Aria, use its <ComboBox> + <ListBox> primitives instead of rolling your own roles/props.  ￼

⸻

2) “Choose = Paint” behavior (picker auto-marks the map)

Store shape (Zustand)

// lib/state/store.ts
type State = {
  visited: Record<string, boolean>;
  selectedId: string | null;
  selectCountry: (id: string, opts?: { autoMark?: boolean; centerOn?: boolean }) => void;
  toggleVisited: (id: string) => void;
};

export const useTravelStore = create<State>((set, get) => ({
  visited: {},
  selectedId: null,
  selectCountry: (id, opts) => {
    const { visited } = get();
    const nextVisited = opts?.autoMark ? { ...visited, [id]: true } : visited;
    set({ selectedId: id, visited: nextVisited });
    // Optional: center map on the selected country
    if (opts?.centerOn) centerMapOnCountry(id);
  },
  toggleVisited: id => set(s => ({ visited: { ...s.visited, [id]: !s.visited[id] } })),
}));

Map reacts instantly

// components/MapView.tsx
<Geographies geography={topology}>
  {({ geographies }) =>
    geographies.map(geo => {
      const id = geo.id as string; // match to store ids (ISO_A3 recommended)
      const isVisited = visited[id];
      const isSelected = selectedId === id;

      return (
        <Geography
          key={id}
          geography={geo}
          onClick={() => selectCountry(id, { autoMark: true, centerOn: true })}
          style={{
            default: { fill: isVisited ? "#3b82f6" : "#e5e7eb", outline: "none" },
            hover:   { fill: isSelected ? "#2563eb" : "#cbd5e1" },
            pressed: { fill: "#1d4ed8" }
          }}
        />
      );
    })
  }
</Geographies>


⸻

3) Better base map & cartography

Data
	•	Use world-atlas (TopoJSON) and pick countries-50m for the interactive view (good perf) and countries-10m for export. Both come from Natural Earth (public domain).  ￼
	•	If you want slightly tweaked boundaries/simplification for nicer SVGs, visionscarto-world-atlas offers curated variants.  ￼

// lib/map/topology.ts
import { feature } from "topojson-client";
import * as world50m from "world-atlas/countries-50m.json";
export const countries50 = feature(world50m as any, (world50m as any).objects.countries);

Projection & polish
	•	Switch to EqualEarth or Robinson for a balanced, poster-worthy look; handle antimeridian so polygons don’t tear. React Simple Maps (d3-geo) supports both.  ￼
	•	Add focus/fit-to-country on selection (compute centroid or bounds with d3-geo; animate zoom/pan).
	•	Provide Region filters (e.g., UN region) by reading Natural Earth attributes—handy for tagging.  ￼

⸻

4) Dropdown visuals that “pop”
	•	Popover surface: rounded-2xl shadow-2xl border bg-white/100 dark:bg-neutral-900
	•	Overlay: fixed inset-0 bg-black/10 backdrop-blur-sm behind the popover to guarantee a solid feel.
	•	Positioning: use Floating UI (with flip, shift, size) so long names don’t clip off-screen.  ￼
	•	Respect a11y patterns (combobox roles), or rely on Radix/React Aria to do it for you.  ￼

⸻

5) High-resolution export that stays crisp
	•	For print, render an SVG map at export time using 1:10m geometry, then rasterize to PNG at the requested size (e.g., with dom-to-image-more or canvg on a hidden canvas). This avoids stair-stepping on country edges. Natural Earth 10m + SVG → PNG yields poster-quality output.  ￼
	•	Embed current theme colors and visited states directly as SVG attributes (don’t rely on external CSS).
	•	If you want perfect label text, keep labels as vector (export raw SVG alongside PNG).

⸻

6) Small accessibility checklist
	•	Ensure the picker is usable entirely via keyboard and announces results & count to screen readers (React Aria/ Radix nail this).  ￼
	•	Don’t trap users inside menus unintentionally; verify modal behavior matches WAI-ARIA guidance.  ￼
	•	Use visible focus rings (Tailwind focus:outline-none focus:ring-2 focus:ring-blue-500).

⸻

7) Optional niceties
	•	Command-K quick-open for the country picker (use cmdk or shadcn’s Command).  ￼
	•	Recently selected & bookmarked countries at the top of the list.
	•	Tag chips inside list options (emoji + color), so filtering feedback is immediate.

If you want, I can draft a drop-in CountryCombobox and a MapDataProvider that switches 50m↔10m automatically on export.