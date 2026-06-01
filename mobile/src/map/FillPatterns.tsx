// SVG fill patterns for visited countries, ported from the web MapView <defs>.
// react-native-svg supports <Defs>/<Pattern>, so the lines / dots / crosshatch
// fills translate almost verbatim. Referenced from a Path via
// fill="url(#pattern-lines)" etc.
import React from "react";
import { Defs, Pattern, Rect, Line, Circle, Path } from "react-native-svg";

type Props = { color: string };

function FillPatternsComponent({ color }: Props) {
  return (
    <Defs>
      {/* Diagonal lines */}
      <Pattern
        id="pattern-lines"
        patternUnits="userSpaceOnUse"
        width={6}
        height={6}
        patternTransform="rotate(45)"
      >
        <Rect width={6} height={6} fill={color} />
        <Line x1={0} y1={0} x2={0} y2={6} stroke="white" strokeWidth={2} />
      </Pattern>

      {/* Dots */}
      <Pattern
        id="pattern-dots"
        patternUnits="userSpaceOnUse"
        width={8}
        height={8}
      >
        <Rect width={8} height={8} fill={color} />
        <Circle cx={4} cy={4} r={2} fill="white" />
      </Pattern>

      {/* Crosshatch */}
      <Pattern
        id="pattern-crosshatch"
        patternUnits="userSpaceOnUse"
        width={8}
        height={8}
      >
        <Rect width={8} height={8} fill={color} />
        <Path d="M0,0 L8,8 M8,0 L0,8" stroke="white" strokeWidth={1.5} />
      </Pattern>
    </Defs>
  );
}

export const FillPatterns = React.memo(FillPatternsComponent);
