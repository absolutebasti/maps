// Ocean labels + per-country emoji tag badges, rendered inside the same
// transformed group as the countries so they pan/zoom with the map. Font sizes
// are divided by the current scale so the text stays a constant on-screen size
// (matching the web map's `fontSize: 14 / zoom`).
import React from "react";
import { G, Text as SvgText } from "react-native-svg";
import type { GeoProjection } from "d3-geo";
import type { ProjectedCountry } from "./projection";
import type { CountryData } from "../core/state/store";
import { PREDEFINED_TAGS } from "../core/state/store";
import { colors } from "../theme/colors";
import { fonts } from "../theme/tokens";

type Props = {
  projection: GeoProjection;
  countries: ProjectedCountry[];
  countriesById: Record<string, CountryData>;
  scale: number;
};

// Geographic anchor points for the five ocean labels (ported from MapView).
const OCEAN_LABELS: Array<{ name: string; coord: [number, number] }> = [
  { name: "PACIFIC", coord: [-140, -40] },
  { name: "PACIFIC", coord: [160, 0] },
  { name: "ATLANTIC", coord: [-30, 0] },
  { name: "INDIAN", coord: [75, -30] },
  { name: "ARCTIC", coord: [0, 75] },
];

export function MapOverlays({
  projection,
  countries,
  countriesById,
  scale,
}: Props) {
  const labelSize = 14 / scale;
  const emojiSize = 16 / scale;

  return (
    <G>
      {/* Ocean labels */}
      {OCEAN_LABELS.map((label, i) => {
        const p = projection(label.coord);
        if (!p) return null;
        return (
          <SvgText
            key={`ocean-${i}`}
            x={p[0]}
            y={p[1]}
            fontSize={labelSize}
            fill={colors.oceanLabel}
            fontFamily={fonts.bold}
            fontWeight="700"
            textAnchor="middle"
            opacity={0.4}
          >
            {label.name}
          </SvgText>
        );
      })}

      {/* Emoji tag badges at country centroids */}
      {Object.entries(countriesById).map(([id, data]) => {
        if (!data.tags || data.tags.length === 0) return null;
        const country = countries.find((c) => c.id === id);
        if (!country) return null;
        const p = projection(country.centroid);
        if (!p) return null;

        return data.tags.map((tagId, index) => {
          const tag = PREDEFINED_TAGS.find((t) => t.id === tagId);
          if (!tag) return null;
          return (
            <SvgText
              key={`${id}-${tagId}`}
              x={p[0]}
              y={p[1] + (index * 12) / scale}
              fontSize={emojiSize}
              textAnchor="middle"
            >
              {tag.emoji}
            </SvgText>
          );
        });
      })}
    </G>
  );
}
