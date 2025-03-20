// components/ProfileBadges.tsx
import React from "react";
import { MedalBadge } from "./MedalBadge";

type ProfileBadgesProps = {
  reputation: number;
  goldCount: number;
  silverCount: number;
  bronzeCount: number;
};

export default function ProfileBadges({
  reputation,
  goldCount,
  silverCount,
  bronzeCount,
}: ProfileBadgesProps) {
  return (
    <div className="bg-gray-200 rounded p-4 inline-flex flex-col items-center gap-4">
      {/* Reputation display */}
      <div className="text-lg font-bold text-purple-900">
        Reputation: {reputation}
      </div>
      {/* Row of medal badges */}
      <div className="flex gap-6">
        <MedalBadge label="Gold" count={goldCount} color="bg-yellow-500" />
        <MedalBadge label="Silver" count={silverCount} color="bg-gray-400" />
        <MedalBadge label="Bronze" count={bronzeCount} color="bg-amber-600" />
      </div>
    </div>
  );
}
