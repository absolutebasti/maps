"use client";

import { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import type { Feature } from "geojson";
import { getWorldCountries, getCountryId, getCountryName } from "./../lib/map";
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
    <div className="w-full h-full" style={{ backgroundColor: "#1e3a5f" }}>
      <ComposableMap 
        projection="geoEqualEarth" 
        width={960} 
        height={640}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup zoom={1}>
          <Geographies geography={geoUrlData as any}>
            {({ geographies }) =>
              geographies.map((geo: any, index: number) => {
                const id = getCountryId(geo as any);
                const countryName = getCountryName(geo as any);
                const isSelected = selectedId === id;
                const isHovered = hoveredId === id;
                const isVisited = Boolean(countriesById[id]?.visited);
                
                // Pastel Beige for visited, light gray for not visited
                const baseFill = isVisited
                  ? "#E8DCC4"  // Pastel Beige
                  : "#E5E7EB";  // Light gray
                const hoverFill = isVisited
                  ? "#D4C4A8"  // Darker pastel beige on hover
                  : "#D1D5DB";  // Darker gray on hover
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
                        stroke: isSelected ? "#8B7355" : "#9CA3AF",
                        strokeWidth: isSelected ? 1.2 : 0.5
                      },
                      hover: {
                        fill: hoverFill,
                        outline: "none",
                        cursor: "pointer"
                      },
                      pressed: {
                        fill: isVisited ? "#C4B49A" : "#9CA3AF",
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


