// Vector tab-bar icons drawn with react-native-svg (no icon-font dependency,
// always render regardless of platform emoji support). Map = globe,
// Countries = list, Settings = sliders.
import React from "react";
import Svg, { Circle, Ellipse, Line, Path } from "react-native-svg";

type Props = { name: "map" | "countries" | "settings"; color: string };

export function TabIcon({ name, color }: Props) {
  const stroke = color;
  const sw = 2;
  if (name === "map") {
    return (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Circle cx={12} cy={12} r={9} stroke={stroke} strokeWidth={sw} />
        <Line x1={3} y1={12} x2={21} y2={12} stroke={stroke} strokeWidth={sw} />
        <Ellipse cx={12} cy={12} rx={3.8} ry={9} stroke={stroke} strokeWidth={sw} />
      </Svg>
    );
  }
  if (name === "countries") {
    return (
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Circle cx={5} cy={6} r={1.6} fill={stroke} />
        <Circle cx={5} cy={12} r={1.6} fill={stroke} />
        <Circle cx={5} cy={18} r={1.6} fill={stroke} />
        <Line x1={9} y1={6} x2={20} y2={6} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <Line x1={9} y1={12} x2={20} y2={12} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <Line x1={9} y1={18} x2={20} y2={18} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      </Svg>
    );
  }
  // settings — sliders
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Line x1={4} y1={7} x2={20} y2={7} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <Line x1={4} y1={17} x2={20} y2={17} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      <Circle cx={9} cy={7} r={2.6} stroke={stroke} strokeWidth={sw} fill="none" />
      <Circle cx={15} cy={17} r={2.6} stroke={stroke} strokeWidth={sw} fill="none" />
    </Svg>
  );
}
