// components/UserProfile.tsx
import React from "react";
import ProfileBadges from "./ProfileBadge";
import NextBadges from "./NextBadges";

type UserProfileProps = {
  profilePicUrl: string;
  name: string;
  bio?: string;
  reputation: number;
  goldCount: number;
  silverCount: number;
  bronzeCount: number;
  nextBadgeTasks: string[]; // New prop to handle next badge tasks
};

export default function UserProfile({
  profilePicUrl,
  name,
  bio,
  reputation,
  goldCount,
  silverCount,
  bronzeCount,
  nextBadgeTasks,
}: UserProfileProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md flex flex-col md:flex-row items-center gap-6">
      {/* Profile Picture */}
      <div className="flex-shrink-0">
        <img
          src={profilePicUrl}
          alt={`${name}'s profile picture`}
          className="w-24 h-24 rounded-full object-cover"
        />
      </div>

      {/* User Details and Profile Badges */}
      <div className="flex flex-col items-center md:items-start flex-grow">
        <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
        {bio && <p className="text-gray-600 mt-2">{bio}</p>}
        <div className="mt-4">
          <ProfileBadges
            reputation={reputation}
            goldCount={goldCount}
            silverCount={silverCount}
            bronzeCount={bronzeCount}
          />
        </div>
      </div>

      {/* Next Badges Section */}
      <div className="flex-shrink-0 mt-6 md:mt-0">
        <NextBadges tasks={nextBadgeTasks} />
      </div>
    </div>
  );
}
