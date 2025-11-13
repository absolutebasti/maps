"use client";

import { useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Annotation } from "react-simple-maps";
import type { Feature } from "geojson";
import { getWorldCountries, getCountryId, getCountryName, getWorldCountryList } from "./../lib/map";
import { useAppStore } from "./../lib/state/store";
import { Button } from "./ui/button";
import { MapTooltip } from "./MapTooltip";

type Props = {
  onSelectCountry?: (id: string) => void;
};

// Ocean labels positioned as percentages of the container (avoids overlap with countries)
const oceanLabels = [
  { name: "PACIFIC", top: "60%", left: "12%" },      // Bottom left Pacific
  { name: "PACIFIC", top: "45%", right: "8%" },      // Right Pacific
  { name: "ATLANTIC", top: "45%", left: "42%" },     // Atlantic (center-left)
  { name: "INDIAN", top: "65%", left: "62%" },       // Indian Ocean
  { name: "ARCTIC", top: "12%", left: "48%" },       // Arctic (top center)
];

export function MapView({ onSelectCountry }: Props) {
  const selectedId = useAppStore((s) => s.selectedCountryId);
  const selectCountry = useAppStore((s) => s.selectCountry);
  const toggleVisited = useAppStore((s) => s.toggleVisited);
  const countriesById = useAppStore((s) => s.countriesById);
  const visitedCountryColor = useAppStore((s) => s.settings.visitedCountryColor);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    countryName: string;
    visited: boolean;
    notes?: string;
    rating?: number;
  } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState<[number, number]>([0, 0]);

  const geoUrlData = useMemo(() => {
    return getWorldCountries();
  }, []);

  const stats = useMemo(() => {
    const totalCountries = getWorldCountryList().length;
    const visitedCount = Object.values(countriesById).filter((c) => c.visited).length;
    const percentage = totalCountries > 0 ? Math.round((visitedCount / totalCountries) * 100) : 0;
    return { visitedCount, totalCountries, percentage };
  }, [countriesById]);

  const handleClick = (feature: Feature) => {
    const id = getCountryId(feature as any);
    selectCountry(id);
    toggleVisited(id);
    onSelectCountry?.(id);
  };

  const handleZoomIn = () => {
    if (zoom < 4) setZoom(zoom + 0.5);
  };

  const handleZoomOut = () => {
    if (zoom > 1) setZoom(zoom - 0.5);
  };

  return (
    <div className="relative w-full h-full">
      {/* Ocean background with wave lines */}
      <div 
        className="absolute inset-0 w-full h-full" 
        style={{ 
          backgroundColor: "#A8D8EA",
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 80px,
              rgba(255, 255, 255, 0.15) 80px,
              rgba(255, 255, 255, 0.15) 82px,
              transparent 82px,
              transparent 85px,
              rgba(255, 255, 255, 0.08) 85px,
              rgba(255, 255, 255, 0.08) 86px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 120px,
              rgba(255, 255, 255, 0.06) 120px,
              rgba(255, 255, 255, 0.06) 121px
            )
          `
        }}
      >
        {/* Ocean labels - positioned as HTML elements OUTSIDE the SVG */}
        {oceanLabels.map(({ name, top, left, right }, idx) => (
          <div
            key={`${name}-${idx}`}
            className="absolute pointer-events-none select-none"
            style={{
              top,
              left,
              right,
              transform: "translate(-50%, -50%)",
              fontFamily: "var(--font-lemon-milk), system-ui",
              fontSize: "clamp(8px, 1.2vw, 14px)",
              color: "#4A7C8C",
              fontWeight: 700,
              letterSpacing: "0.3em",
              opacity: 0.4,
              textTransform: "uppercase",
              textShadow: "0 0 20px rgba(168, 216, 234, 0.5)",
              whiteSpace: "nowrap",
              zIndex: 5,
            }}
          >
            {name}
          </div>
        ))}

        <ComposableMap 
          projection="geoEqualEarth" 
          width={960} 
          height={640}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup 
            zoom={zoom}
            center={center}
            onMoveEnd={(position) => setCenter(position.coordinates)}
          >
            <Geographies geography={geoUrlData as any}>
              {({ geographies }) =>
                geographies.map((geo: any, index: number) => {
                  const id = getCountryId(geo as any);
                  const countryName = getCountryName(geo as any);
                  const isSelected = selectedId === id;
                  const isHovered = hoveredId === id;
                  const isVisited = Boolean(countriesById[id]?.visited);
                  
                  // Use custom color from store for visited countries
                  const baseFill = isVisited
                    ? visitedCountryColor
                    : "#E5E7EB";  // Light gray
                  
                  // Create hover color by darkening the base color slightly
                  const hoverFill = isVisited
                    ? `color-mix(in srgb, ${visitedCountryColor} 80%, black)`
                    : "#D1D5DB";
                  const fill = isSelected || isHovered ? hoverFill : baseFill;
                  
                  return (
                    <Geography
                      key={`${id}-${geo.rsmKey ?? index}`}
                      geography={geo}
                      onClick={() => handleClick(geo)}
                      onMouseEnter={(event) => {
                        setHoveredId(id);
                        const countryData = countriesById[id];
                        setTooltipData({
                          x: event.clientX,
                          y: event.clientY,
                          countryName,
                          visited: isVisited,
                          notes: countryData?.note,
                          rating: countryData?.rating
                        });
                      }}
                      onMouseMove={(event) => {
                        if (tooltipData && hoveredId === id) {
                          setTooltipData({
                            ...tooltipData,
                            x: event.clientX,
                            y: event.clientY
                          });
                        }
                      }}
                      onMouseLeave={() => {
                        setHoveredId((prev) => (prev === id ? null : prev));
                        setTooltipData(null);
                      }}
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

      {/* Tooltip */}
      {tooltipData && (
        <MapTooltip
          x={tooltipData.x}
          y={tooltipData.y}
          countryName={tooltipData.countryName}
          visited={tooltipData.visited}
          notes={tooltipData.notes}
          rating={tooltipData.rating}
        />
      )}

      {/* Stats box - top right */}
      <div className="absolute top-4 right-4 bg-black/90 text-white px-4 py-3 rounded-lg shadow-xl backdrop-blur-sm">
        <div className="text-center space-y-1">
          <div className="text-3xl font-bold">{stats.percentage}%</div>
          <div className="text-xs text-gray-300">
            {stats.visitedCount} / {stats.totalCountries} countries
          </div>
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomIn}
          disabled={zoom >= 4}
          className="shadow-lg"
          aria-label="Zoom in"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomOut}
          disabled={zoom <= 1}
          className="shadow-lg"
          aria-label="Zoom out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </Button>
      </div>
    </div>
  );
}


