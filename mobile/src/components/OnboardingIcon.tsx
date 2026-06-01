// Vector glyphs for the onboarding steps (react-native-svg), so they always
// render — independent of platform emoji support.
import React from "react";
import Svg, { Circle, Ellipse, Line, Path } from "react-native-svg";

export type GlyphName = "globe" | "pin" | "list" | "palette";

export function OnboardingIcon({
  name,
  color,
  size = 56,
}: {
  name: GlyphName;
  color: string;
  size?: number;
}) {
  const sw = 1.8;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {name === "globe" && (
        <>
          <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={sw} />
          <Line x1={3} y1={12} x2={21} y2={12} stroke={color} strokeWidth={sw} />
          <Ellipse cx={12} cy={12} rx={3.6} ry={9} stroke={color} strokeWidth={sw} />
        </>
      )}
      {name === "pin" && (
        <>
          <Path
            d="M12 2.5C8.7 2.5 6 5.1 6 8.4c0 4.4 6 11.6 6 11.6s6-7.2 6-11.6c0-3.3-2.7-5.9-6-5.9z"
            stroke={color}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <Circle cx={12} cy={8.4} r={2.3} stroke={color} strokeWidth={sw} />
        </>
      )}
      {name === "list" && (
        <>
          <Circle cx={5} cy={6} r={1.5} fill={color} />
          <Circle cx={5} cy={12} r={1.5} fill={color} />
          <Circle cx={5} cy={18} r={1.5} fill={color} />
          <Line x1={9} y1={6} x2={20} y2={6} stroke={color} strokeWidth={sw} strokeLinecap="round" />
          <Line x1={9} y1={12} x2={20} y2={12} stroke={color} strokeWidth={sw} strokeLinecap="round" />
          <Line x1={9} y1={18} x2={20} y2={18} stroke={color} strokeWidth={sw} strokeLinecap="round" />
        </>
      )}
      {name === "palette" && (
        <>
          <Circle cx={9} cy={9} r={4} stroke={color} strokeWidth={sw} />
          <Circle cx={15} cy={9} r={4} stroke={color} strokeWidth={sw} />
          <Circle cx={12} cy={15} r={4} stroke={color} strokeWidth={sw} />
        </>
      )}
    </Svg>
  );
}
