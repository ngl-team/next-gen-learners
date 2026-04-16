"use client";

import { useState, useEffect } from "react";
import { positions } from "@/data/profiles";

interface Profile {
  id: string;
  createdAt: string;
  playerFirstName: string;
  playerLastName: string;
  dateOfBirth: string;
  gender: string;
  position: string;
  secondaryPosition?: string;
  currentClub: string;
  currentLevel: string;
  heightFeet: string;
  heightInches: string;
  weight: string;
  playsHighSchool: string;
  highSchoolName?: string;
  graduationYear?: string;
  highlightVideoUrl?: string;
  lookingFor: string;
  willingToTravel: string;
  targetLevel: string;
  additionalNotes?: string;
  city: string;
  state: string;
}

const lookingForLabels: Record<string, string> = {
  exploring: "Exploring options",
  switching: "Ready to switch",
  relocating: "Relocating",
  "first-club": "Looking for first club",
};

function getAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function getAgeGroup(dob: string): string {
  const age = getAge(dob);
  if (age <= 19) return `U${age + 1}`;
  return `${age}`;
}

function getInitials(first: string, last: string): string {
  return (first[0] || "") + (last[0] || "");
}

const statusColors: Record<string, string> = {
  exploring: "bg-blue-100 text-blue-700",
  switching: "bg-amber-100 text-amber-700",
  relocating: "bg-purple-100 text-purple-700",
  "first-club": "bg-green-100 text-green-700",
};

export default function ProfileBrowser() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPosition, setFilterPosition] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetch("/api/transfer/profiles")
      .then((res) => res.json())
      .then((data) => {
        setProfiles(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = profiles.filter((p) => {
    if (filterPosition && p.position !== filterPosition) return false;
    if (filterLevel && p.currentLevel !== filterLevel) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="text-center py-16">
        <p className="text-stone-400">Loading profiles...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Position</label>
          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
          >
            <option value="">All Positions</option>
            {positions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">Current Level</label>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
          >
            <option value="">All Levels</option>
            <option value="ECNL">ECNL</option>
            <option value="ECNL Regional League">ECNL Regional League</option>
            <option value="EDP">EDP</option>
            <option value="Premier">Premier</option>
            <option value="Travel">Travel</option>
            <option value="Recreational">Recreational</option>
          </select>
        </div>
      </div>

      <p className="text-sm text-stone-500 mb-4">
        {filtered.length} player{filtered.length !== 1 ? "s" : ""} registered
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-stone-200 rounded-xl">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-stone-400 text-2xl">&#9917;</span>
          </div>
          <h3 className="font-semibold text-stone-700 mb-2">
            {profiles.length === 0 ? "No players registered yet" : "No players match your filters"}
          </h3>
          <p className="text-stone-400 text-sm max-w-md mx-auto">
            {profiles.length === 0
              ? "Player profiles will appear here as parents sign up. Share the platform with families to get started."
              : "Try removing some filters to see more players."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((profile) => (
            <button
              key={profile.id}
              onClick={() => setSelectedProfile(profile)}
              className="w-full text-left bg-white border border-stone-200 rounded-xl p-5 hover:border-stone-400 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-stone-900 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                  {getInitials(profile.playerFirstName, profile.playerLastName)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-stone-900 truncate">
                    {profile.playerFirstName} {profile.playerLastName}
                  </h3>
                  <p className="text-stone-500 text-sm">
                    {profile.position} - {getAgeGroup(profile.dateOfBirth)} ({getAge(profile.dateOfBirth)} yrs)
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-400">Club</span>
                  <span className="text-stone-700 font-medium">{profile.currentClub}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Level</span>
                  <span className="text-stone-700 font-medium">{profile.currentLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Location</span>
                  <span className="text-stone-700 font-medium">{profile.city}, {profile.state}</span>
                </div>
                {profile.heightFeet && (
                  <div className="flex justify-between">
                    <span className="text-stone-400">Size</span>
                    <span className="text-stone-700 font-medium">
                      {profile.heightFeet}&apos;{profile.heightInches}&quot;
                      {profile.weight ? ` / ${profile.weight} lbs` : ""}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[profile.lookingFor] || "bg-stone-100 text-stone-600"}`}>
                  {lookingForLabels[profile.lookingFor] || profile.lookingFor}
                </span>
                {profile.highlightVideoUrl && (
                  <span className="text-xs text-stone-400 flex items-center gap-1">
                    &#9654; Has video
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Profile detail modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedProfile(null)}>
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-stone-100">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-stone-900 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {getInitials(selectedProfile.playerFirstName, selectedProfile.playerLastName)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-stone-900">
                      {selectedProfile.playerFirstName} {selectedProfile.playerLastName}
                    </h2>
                    <p className="text-stone-500">
                      {selectedProfile.position} - {getAgeGroup(selectedProfile.dateOfBirth)} ({getAge(selectedProfile.dateOfBirth)} years old)
                    </p>
                  </div>
                </div>
                <button onClick={() => setSelectedProfile(null)} className="text-stone-400 hover:text-stone-600 text-2xl leading-none p-1">x</button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-50 rounded-lg p-3">
                  <span className="text-xs text-stone-400 uppercase tracking-wide">Current Club</span>
                  <p className="text-stone-900 font-semibold mt-0.5">{selectedProfile.currentClub}</p>
                </div>
                <div className="bg-stone-50 rounded-lg p-3">
                  <span className="text-xs text-stone-400 uppercase tracking-wide">Current Level</span>
                  <p className="text-stone-900 font-semibold mt-0.5">{selectedProfile.currentLevel}</p>
                </div>
                <div className="bg-stone-50 rounded-lg p-3">
                  <span className="text-xs text-stone-400 uppercase tracking-wide">Position(s)</span>
                  <p className="text-stone-900 font-semibold mt-0.5">
                    {selectedProfile.position}
                    {selectedProfile.secondaryPosition ? ` / ${selectedProfile.secondaryPosition}` : ""}
                  </p>
                </div>
                <div className="bg-stone-50 rounded-lg p-3">
                  <span className="text-xs text-stone-400 uppercase tracking-wide">Location</span>
                  <p className="text-stone-900 font-semibold mt-0.5">{selectedProfile.city}, {selectedProfile.state}</p>
                </div>
                {selectedProfile.heightFeet && (
                  <div className="bg-stone-50 rounded-lg p-3">
                    <span className="text-xs text-stone-400 uppercase tracking-wide">Height / Weight</span>
                    <p className="text-stone-900 font-semibold mt-0.5">
                      {selectedProfile.heightFeet}&apos;{selectedProfile.heightInches}&quot;
                      {selectedProfile.weight ? ` / ${selectedProfile.weight} lbs` : ""}
                    </p>
                  </div>
                )}
                <div className="bg-stone-50 rounded-lg p-3">
                  <span className="text-xs text-stone-400 uppercase tracking-wide">Will Travel</span>
                  <p className="text-stone-900 font-semibold mt-0.5">{selectedProfile.willingToTravel} min</p>
                </div>
              </div>

              {selectedProfile.playsHighSchool === "yes" && selectedProfile.highSchoolName && (
                <div className="bg-stone-50 rounded-lg p-3">
                  <span className="text-xs text-stone-400 uppercase tracking-wide">High School</span>
                  <p className="text-stone-900 font-semibold mt-0.5">
                    {selectedProfile.highSchoolName}
                    {selectedProfile.graduationYear ? ` (Class of ${selectedProfile.graduationYear})` : ""}
                  </p>
                </div>
              )}

              <div>
                <span className="text-xs text-stone-400 uppercase tracking-wide">Looking For</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-sm px-3 py-1 rounded-full ${statusColors[selectedProfile.lookingFor] || "bg-stone-100 text-stone-600"}`}>
                    {lookingForLabels[selectedProfile.lookingFor] || selectedProfile.lookingFor}
                  </span>
                  <span className="text-sm text-stone-500">
                    Target: {selectedProfile.targetLevel}
                  </span>
                </div>
              </div>

              {selectedProfile.additionalNotes && (
                <div>
                  <span className="text-xs text-stone-400 uppercase tracking-wide">Notes</span>
                  <p className="text-stone-700 text-sm mt-1">{selectedProfile.additionalNotes}</p>
                </div>
              )}

              {selectedProfile.highlightVideoUrl && (
                <a
                  href={selectedProfile.highlightVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-stone-900 text-white px-4 py-3 rounded-lg font-medium hover:bg-stone-800 transition-colors w-full justify-center"
                >
                  &#9654; Watch Highlight Video
                </a>
              )}

              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 text-center">
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">Interested in this player?</span>
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Contact us and we will connect you with the family.
                </p>
                <a
                  href="mailto:brayan@nextgenerationlearners.com"
                  className="inline-block mt-2 text-sm font-medium text-amber-900 underline underline-offset-2"
                >
                  brayan@nextgenerationlearners.com
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
