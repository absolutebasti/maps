"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Annotation } from "react-simple-maps";
import type { Feature } from "geojson";
import { getWorldCountries, getCountryId, getCountryName, getWorldCountryList } from "./../lib/map";
import { useAppStore, PREDEFINED_TAGS } from "./../lib/state/store";
import { Button } from "./ui/button";
import { MapTooltip } from "./MapTooltip";
import { geoCentroid } from "d3-geo";

type Props = {
  onSelectCountry?: (id: string) => void;
};

// Ocean labels positioned as percentages of the container (avoids overlap with countries)
const oceanLabels = [
  { name: "PACIFIC", top: "60%", left: "12%" },      // Bottom left Pacific
  { name: "PACIFIC", top: "45%", right: "3%" },      // Right Pacific - moved more right
  { name: "ATLANTIC", top: "45%", left: "38%" },     // Atlantic - moved more left
  { name: "INDIAN", top: "65%", left: "65%" },       // Indian Ocean - moved more right
  { name: "ARCTIC", top: "12%", left: "48%" },       // Arctic (top center)
];

export function MapView({ onSelectCountry }: Props) {
  const selectedId = useAppStore((s) => s.selectedCountryId);
  const selectCountry = useAppStore((s) => s.selectCountry);
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
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const geoUrlData = useMemo(() => {
    return getWorldCountries();
  }, []);

  // Constrain center coordinates - HARD LIMITS to prevent panning outside map
  const constrainCenter = (coordinates: [number, number], zoomLevel: number): [number, number] => {
    // At zoom 1, lock to center (no panning allowed)
    if (zoomLevel <= 1) {
      return [0, 0];
    }

    const [lon, lat] = coordinates;
    // Only allow minimal panning at higher zoom levels
    // The higher the zoom, the more you can pan to explore details
    const maxLon = Math.min(40, 80 / zoomLevel);
    const maxLat = Math.min(20, 40 / zoomLevel);

    return [
      Math.max(-maxLon, Math.min(maxLon, lon)),
      Math.max(-maxLat, Math.min(maxLat, lat))
    ];
  };

  const stats = useMemo(() => {
    const totalCountries = getWorldCountryList().length;
    const visitedCount = Object.values(countriesById).filter((c) => c.visited).length;
    const percentage = totalCountries > 0 ? Math.round((visitedCount / totalCountries) * 100) : 0;
    return { visitedCount, totalCountries, percentage };
  }, [countriesById]);

  const handleClick = (feature: Feature) => {
    const id = getCountryId(feature as any);

    // If clicking the same country, deselect it
    if (selectedId === id) {
      selectCountry(undefined);
      return;
    }

    // Otherwise, just select the new country (don't auto-mark as visited)
    selectCountry(id);
    onSelectCountry?.(id);
  };

  const handleZoomIn = () => {
    if (zoom < 4) {
      const newZoom = zoom + 0.5;
      setZoom(newZoom);
      // Re-constrain center when zooming
      setCenter(constrainCenter(center, newZoom));
    }
  };

  const handleZoomOut = () => {
    if (zoom > 1) {
      const newZoom = zoom - 0.5;
      setZoom(newZoom);
      // Re-constrain center when zooming out
      setCenter(constrainCenter(center, newZoom));
    }
  };

  // Handle wheel/trackpad zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Only zoom if cursor is over the map
    if (!mapContainerRef.current) return;

    // Prevent default scrolling
    e.preventDefault();

    // Determine zoom direction based on wheel delta
    // Negative deltaY = scroll up = zoom in
    // Positive deltaY = scroll down = zoom out
    const zoomSensitivity = 0.1; // Adjust this to control zoom speed
    const zoomDelta = -e.deltaY * zoomSensitivity;

    if (zoomDelta > 0) {
      // Zoom in
      if (zoom < 4) {
        const newZoom = Math.min(4, zoom + zoomDelta);
        setZoom(newZoom);
        setCenter(constrainCenter(center, newZoom));
      }
    } else {
      // Zoom out
      if (zoom > 1) {
        const newZoom = Math.max(1, zoom + zoomDelta);
        setZoom(newZoom);
        setCenter(constrainCenter(center, newZoom));
      }
    }
  };

  const handleMoveEnd = (position: { coordinates: [number, number] }) => {
    // Constrain the new position
    const constrained = constrainCenter(position.coordinates, zoom);
    setCenter(constrained);
  };

  // Get country centroid for zooming
  const getCountryCentroid = (countryId: string): [number, number] | null => {
    const feature = geoUrlData.features.find((f: any) => getCountryId(f) === countryId);
    if (!feature) return null;

    try {
      let centroid = geoCentroid(feature as any);

      // Manual adjustments for better placement
      const adjustments: Record<string, [number, number]> = {
        'FRA': [2, 46.5],
        'FRANCE': [2, 46.5],
        'USA': [-98, 38],
        'RUS': [95, 60],
        'CAN': [-95, 60],
        'AUS': [133, -27],
        'NZL': [174, -41],
        'GBR': [-2, 54],
        'NOR': [9, 61],
        'DNK': [10, 56],
        'NLD': [5.5, 52.2],
        'PRT': [-8, 39.5],
        'ESP': [-3.5, 40],
        'ITA': [12.5, 42.5],
        'CHL': [-71, -35],
        'ECU': [-78.5, -1.5],
        'CHN': [105, 35],
        'CHINA': [105, 35],
      };

      return adjustments[countryId] || centroid;
    } catch {
      return null;
    }
  };

  // Zoom to selected country when it changes
  useEffect(() => {
    if (selectedId) {
      const centroid = getCountryCentroid(selectedId);
      if (centroid) {
        // Smooth zoom to country
        setZoom(2.5);
        setCenter(constrainCenter(centroid, 2.5));
      }
    }
  }, [selectedId, geoUrlData]);

  return (
    <div
      ref={mapContainerRef}
      className="relative w-full h-full overflow-hidden border-4 border-gray-800 rounded-lg"
      onWheel={handleWheel}
      style={{ cursor: zoom > 1 ? 'grab' : 'default' }}
    >
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
        <ComposableMap
          projection="geoEqualEarth"
          width={960}
          height={640}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup
            zoom={zoom}
            center={center}
            onMoveEnd={handleMoveEnd}
          >
            {/* Ocean labels - now INSIDE the SVG so they move with the map */}
            {oceanLabels.map(({ name, top, left, right }, idx) => {
              // Convert percentage positions to approximate geo coordinates
              const getGeoPosition = (): [number, number] => {
                if (name === "PACIFIC" && left === "12%") return [-140, -40]; // Bottom left
                if (name === "PACIFIC" && right === "3%") return [160, 0]; // Right
                if (name === "ATLANTIC") return [-30, 0];
                if (name === "INDIAN") return [75, -30];
                if (name === "ARCTIC") return [0, 75];
                return [0, 0];
              };

              return (
                <Annotation
                  key={`${name}-${idx}`}
                  subject={getGeoPosition()}
                  dx={0}
                  dy={0}
                >
                  <text
                    textAnchor="middle"
                    style={{
                      fontFamily: "var(--font-lemon-milk), system-ui",
                      fontSize: `${14 / zoom}px`,
                      fill: "#4A7C8C",
                      fontWeight: 700,
                      letterSpacing: "0.3em",
                      opacity: 0.4,
                      textTransform: "uppercase",
                      pointerEvents: "none",
                      filter: "drop-shadow(0 0 20px rgba(168, 216, 234, 0.5))",
                    }}
                  >
                    {name}
                  </text>
                </Annotation>
              );
            })}

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

                  // Only darken on hover, not on selection
                  const hoverFill = isVisited
                    ? `color-mix(in srgb, ${visitedCountryColor} 85%, black)`
                    : "#D1D5DB";

                  // Use base fill even when selected, only change on hover
                  const fill = isHovered ? hoverFill : baseFill;

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
                          strokeWidth: isSelected ? 1.5 : 0.5
                        },
                        hover: {
                          fill: hoverFill,
                          outline: "none",
                          cursor: "pointer",
                          stroke: "#8B7355",
                          strokeWidth: 1
                        },
                        pressed: {
                          fill: baseFill,
                          outline: "none"
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* Emoji badges for countries with tags */}
            {Object.entries(countriesById).map(([countryId, countryData]) => {
              if (!countryData.tags || countryData.tags.length === 0) return null;

              // Find the geography for this country to get its centroid
              const geo = geoUrlData.features.find((f: any) => getCountryId(f) === countryId);
              if (!geo) return null;

              // Use visual center (polylabel) for better placement
              // For now, use geoCentroid but we'll improve this
              let centroid: [number, number];
              try {
                centroid = geoCentroid(geo);

                // If centroid seems invalid (NaN or out of bounds), skip
                if (!centroid || isNaN(centroid[0]) || isNaN(centroid[1])) {
                  return null;
                }

                // For multi-polygon geometries, centroid might not be inside the main landmass
                // We'll use the centroid but add manual adjustments for common cases
                const adjustments: Record<string, [number, number]> = {
                  'FRA': [2, 46.5],      // France - center of mainland (adjusted)
                  'FRANCE': [2, 46.5],   // Alternative name
                  'USA': [-98, 38],      // USA - center of mainland
                  'RUS': [95, 60],       // Russia - center
                  'CAN': [-95, 60],      // Canada - center
                  'AUS': [133, -27],     // Australia - center
                  'NZL': [174, -41],     // New Zealand - North Island
                  'GBR': [-2, 54],       // UK - center
                  'NOR': [9, 61],        // Norway - center mainland
                  'DNK': [10, 56],       // Denmark - mainland
                  'NLD': [5.5, 52.2],    // Netherlands - center
                  'PRT': [-8, 39.5],     // Portugal - mainland
                  'ESP': [-3.5, 40],     // Spain - center
                  'ITA': [12.5, 42.5],   // Italy - center
                  'CHL': [-71, -35],     // Chile - center
                  'ECU': [-78.5, -1.5],  // Ecuador - mainland
                  'CHN': [105, 35],      // China - center
                  'CHINA': [105, 35],    // China - alternative
                };

                centroid = adjustments[countryId] || centroid;
              } catch (error) {
                return null;
              }

              return countryData.tags.map((tagId, index) => {
                const tag = PREDEFINED_TAGS.find(t => t.id === tagId);
                if (!tag) return null;

                return (
                  <Annotation
                    key={`${countryId}-${tagId}`}
                    subject={centroid}
                    dx={0}
                    dy={index * 12 / zoom} // Stack multiple emojis vertically
                  >
                    <text
                      x={0}
                      y={0}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        fontSize: `${16 / zoom}px`,
                        pointerEvents: "none",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                        fontWeight: "bold",
                      }}
                    >
                      {tag.emoji}
                    </text>
                  </Annotation>
                );
              });
            })}
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

      {/* Stats box - top right, responsive sizing */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/90 text-white px-2 py-1.5 sm:px-4 sm:py-3 rounded-lg shadow-xl backdrop-blur-sm">
        <div className="text-center space-y-0.5 sm:space-y-1">
          <div className="text-xl sm:text-3xl font-bold">{stats.percentage}%</div>
          <div className="text-[10px] sm:text-xs text-gray-300 leading-tight">
            {stats.visitedCount} / {stats.totalCountries}
          </div>
        </div>
      </div>

      {/* Zoom controls - larger on mobile for touch, better positioning */}
      <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 flex flex-col gap-2 sm:gap-2 z-10">
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomIn}
          disabled={zoom >= 4}
          className="shadow-lg h-11 w-11 sm:h-9 sm:w-9 touch-manipulation"
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
          className="shadow-lg h-11 w-11 sm:h-9 sm:w-9 touch-manipulation"
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


