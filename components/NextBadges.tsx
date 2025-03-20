// components/NextBadges.tsx
import React from "react";

type NextBadgesProps = {
  tasks: string[];
};

export default function NextBadges({ tasks }: NextBadgesProps) {
  return (
    <div className="bg-gray-200 p-6 rounded shadow-md w-full max-w-sm">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Next Badges</h3>
      <ul className="space-y-4">
        {tasks.map((task, index) => (
          <li key={index} className="text-gray-700 flex items-center">
            <span className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></span>
            {task}
          </li>
        ))}
      </ul>
    </div>
  );
}