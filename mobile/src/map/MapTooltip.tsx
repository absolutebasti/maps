// Native tooltip card. On the web this followed the mouse on hover; touch has
// no hover, so it is revealed on tap near the tap point and auto-dismisses.
// Content (name, visited status, star rating, truncated notes) matches the web
// MapTooltip.
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export type TooltipData = {
  x: number;
  y: number;
  countryName: string;
  visited: boolean;
  notes?: string;
  rating?: number;
};

type Props = { data: TooltipData; screenWidth: number };

const TOOLTIP_WIDTH = 200;

export function MapTooltip({ data, screenWidth }: Props) {
  // Keep the card on screen: flip to the left of the tap if it would overflow.
  const wouldOverflow = data.x + 15 + TOOLTIP_WIDTH > screenWidth;
  const left = wouldOverflow
    ? Math.max(8, data.x - 15 - TOOLTIP_WIDTH)
    : data.x + 15;
  const top = Math.max(8, data.y + 15);

  return (
    <View style={[styles.container, { left, top }]} pointerEvents="none">
      <Text style={styles.title}>{data.countryName}</Text>
      <Text style={styles.status}>
        {data.visited ? "✓ Visited" : "Not visited"}
      </Text>
      {data.rating !== undefined && data.rating > 0 && (
        <View style={styles.stars}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <Text
              key={idx}
              style={{
                fontSize: 12,
                color: idx < (data.rating ?? 0) ? colors.star : colors.starEmpty,
              }}
            >
              ★
            </Text>
          ))}
        </View>
      )}
      {!!data.notes && (
        <Text style={styles.notes}>
          {data.notes.length > 100
            ? `${data.notes.substring(0, 100)}...`
            : data.notes}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: TOOLTIP_WIDTH,
    backgroundColor: colors.tooltipBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  title: {
    color: colors.tooltipText,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  status: { color: colors.tooltipSubText, fontSize: 12 },
  stars: { flexDirection: "row", gap: 2, marginTop: 4 },
  notes: {
    color: colors.tooltipNoteText,
    fontSize: 12,
    marginTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.tooltipDivider,
    paddingTop: 8,
  },
});
