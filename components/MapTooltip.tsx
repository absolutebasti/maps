"use client";

import { useEffect, useState } from "react";

interface TooltipProps {
  x: number;
  y: number;
  countryName: string;
  visited: boolean;
  notes?: string;
}

export function MapTooltip({ x, y, countryName, visited, notes }: TooltipProps) {
  const [position, setPosition] = useState({ x, y });

  useEffect(() => {
    setPosition({ x, y });
  }, [x, y]);

  return (
    <div
      className="fixed pointer-events-none z-50 transition-opacity duration-200"
      style={{
        left: `${position.x + 15}px`,
        top: `${position.y + 15}px`,
      }}
    >
      <div className="bg-black/95 text-white px-3 py-2 rounded-lg shadow-xl backdrop-blur-sm max-w-xs">
        <div className="font-semibold text-sm mb-1">{countryName}</div>
        <div className="text-xs text-gray-300 mb-1">
          {visited ? "✓ Visited" : "Not visited"}
        </div>
        {notes && (
          <div className="text-xs text-gray-400 mt-2 border-t border-gray-700 pt-2">
            {notes.length > 100 ? `${notes.substring(0, 100)}...` : notes}
          </div>
        )}
      </div>
    </div>
  );
}

