// components/MedalBadge.tsx
import React from "react";

type MedalBadgeProps = {
  label: string;
  count: number;
  color: string; // e.g. "bg-yellow-500"
};

export function MedalBadge({ label, count, color }: MedalBadgeProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Circular badge with count */}
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-full ${color} text-white text-sm font-bold`}
      >
        {count}
      </div>
      {/* Label below the badge */}
      <span className="mt-1 text-xs text-gray-700">{label}</span>
    </div>
  );
}
