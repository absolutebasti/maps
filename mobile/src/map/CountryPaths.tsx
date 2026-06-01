// The country polygons. Ported from the web MapView's <Geographies>/<Geography>
// fill + stroke logic. Memoized so that pan/zoom (which only changes the parent
// <G> transform) never re-renders these ~195 paths — they only re-render when a
// country's visited state, the selection, the color, or the pattern changes.
import React from "react";
import type { GestureResponderEvent } from "react-native";
import { Path } from "react-native-svg";
import type { ProjectedCountry } from "./projection";
import type { CountryData, FillPattern } from "../core/state/store";
import { colors } from "../theme/colors";

type Props = {
  countries: ProjectedCountry[];
  countriesById: Record<string, CountryData>;
  visitedColor: string;
  fillPattern: FillPattern;
  selectedId?: string;
  onPressCountry: (id: string, e: GestureResponderEvent) => void;
};

function fillFor(
  isVisited: boolean,
  visitedColor: string,
  fillPattern: FillPattern
): string {
  if (!isVisited) return colors.unvisited;
  if (fillPattern === "filled") return visitedColor;
  return `url(#pattern-${fillPattern})`;
}

function CountryPathsComponent({
  countries,
  countriesById,
  visitedColor,
  fillPattern,
  selectedId,
  onPressCountry,
}: Props) {
  return (
    <>
      {countries.map((c) => {
        const isVisited = Boolean(countriesById[c.id]?.visited);
        const isSelected = selectedId === c.id;
        return (
          <Path
            key={c.id}
            d={c.d}
            fill={fillFor(isVisited, visitedColor, fillPattern)}
            stroke={isSelected ? colors.selectedStroke : colors.countryStroke}
            strokeWidth={isSelected ? 1.5 : 0.5}
            onPress={(e) => onPressCountry(c.id, e)}
          />
        );
      })}
    </>
  );
}

export const CountryPaths = React.memo(CountryPathsComponent);
