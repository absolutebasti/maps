"use client";

import { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import type { Feature } from "geojson";
import { getWorldCountries, getCountryId } from "./../lib/map";
import { useAppStore } from "./../lib/state/store";

type Props = {
  onSelectCountry?: (id: string) => void;
};

export function MapView({ onSelectCountry }: Props) {
  const selectedId = useAppStore((s) => s.selectedCountryId);
  const selectCountry = useAppStore((s) => s.selectCountry);
  const toggleVisited = useAppStore((s) => s.toggleVisited);
  const countriesById = useAppStore((s) => s.countriesById);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const geoUrlData = useMemo(() => {
    // react-simple-maps can accept FeatureCollection directly
    return getWorldCountries();
  }, []);

  const handleClick = (feature: Feature) => {
    const id = getCountryId(feature as any);
    selectCountry(id);
    toggleVisited(id);
    onSelectCountry?.(id);
  };

  return (
    <div className="w-full h-full">
      <ComposableMap projection="geoEqualEarth" width={960} height={640}>
        <ZoomableGroup zoom={1}>
          <Geographies geography={geoUrlData as any}>
            {({ geographies }) =>
              geographies.map((geo: any, index: number) => {
                const id = getCountryId(geo as any);
                const isSelected = selectedId === id;
                const isHovered = hoveredId === id;
                const isVisited = Boolean(countriesById[id]?.visited);
                const baseFill = isVisited
                  ? "hsl(210 80% 55%)"
                  : "hsl(213 31% 91%)";
                const hoverFill = isVisited
                  ? "hsl(210 80% 48%)"
                  : "hsl(210 22% 84%)";
                const fill = isSelected || isHovered ? hoverFill : baseFill;
                return (
                  <Geography
                    key={`${id}-${geo.rsmKey ?? index}`}
                    geography={geo}
                    onClick={() => handleClick(geo)}
                    onMouseEnter={() => setHoveredId(id)}
                    onMouseLeave={() => setHoveredId((prev) => (prev === id ? null : prev))}
                    style={{
                      default: {
                        fill,
                        outline: "none",
                        stroke: isSelected ? "hsl(210 80% 35%)" : "hsl(215 20% 65%)",
                        strokeWidth: isSelected ? 1.1 : 0.5
                      },
                      hover: {
                        fill: hoverFill,
                        outline: "none"
                      },
                      pressed: {
                        fill: "hsl(210 80% 45%)",
                        outline: "none"
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}


