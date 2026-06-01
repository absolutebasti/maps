"use client";

import { useMemo } from "react";
import { useAppStore } from "./../lib/state/store";
import { getWorldCountryList } from "./../lib/map";

export function StatsBar() {
  const countries = useAppStore((s) => s.countriesById);
  const totals = useMemo(() => {
    const all = getWorldCountryList().length;
    const visited = Object.values(countries).filter((c) => c.visited).length;
    const pct = all > 0 ? Math.round((visited / all) * 100) : 0;
    return { all, visited, pct };
  }, [countries]);

  return (
    <div className="text-sm text-muted-foreground">
      Visited: <span className="font-medium text-foreground">{totals.visited}</span>
      {totals.all > 0 && (
        <>
          {" "}
          / {totals.all} ({totals.pct}%)
        </>
      )}
    </div>
  );
}


