"use client";

import { useState, useMemo } from "react";
import { clubs, ClubLevel, Club, counties } from "@/data/clubs";
import ClubCard from "./ClubCard";
import ClubDetail from "./ClubDetail";
import LevelGuide from "./LevelGuide";

const allLevels: ClubLevel[] = ["MLS NEXT", "ECNL", "ECRL", "Girls Academy", "EDP", "Premier", "Travel", "Academy", "Recreational"];

const levelColors: Record<string, string> = {
  "MLS NEXT": "bg-purple-100 text-purple-800 border-purple-200",
  "ECNL": "bg-blue-100 text-blue-800 border-blue-200",
  "ECRL": "bg-sky-100 text-sky-800 border-sky-200",
  "Girls Academy": "bg-pink-100 text-pink-800 border-pink-200",
  "EDP": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Premier": "bg-amber-100 text-amber-800 border-amber-200",
  "Travel": "bg-orange-100 text-orange-800 border-orange-200",
  "Academy": "bg-teal-100 text-teal-800 border-teal-200",
  "Recreational": "bg-stone-100 text-stone-700 border-stone-200",
};

type SortOption = "name" | "cost-low" | "cost-high" | "level";

export default function ClubDirectory() {
  const [search, setSearch] = useState("");
  const [selectedLevels, setSelectedLevels] = useState<ClubLevel[]>([]);
  const [selectedCounty, setSelectedCounty] = useState<string>("");
  const [maxCost, setMaxCost] = useState<number>(15000);
  const [sort, setSort] = useState<SortOption>("name");
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const toggleLevel = (level: ClubLevel) => {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const filtered = useMemo(() => {
    let result = clubs.filter((club) => {
      if (search) {
        const q = search.toLowerCase();
        const matchName = club.name.toLowerCase().includes(q);
        const matchCity = club.city.toLowerCase().includes(q);
        const matchLevel = club.levels.some((l) => l.toLowerCase().includes(q));
        if (!matchName && !matchCity && !matchLevel) return false;
      }

      if (selectedLevels.length > 0) {
        if (!selectedLevels.some((level) => club.levels.includes(level))) return false;
      }

      if (selectedCounty && club.county !== selectedCounty) return false;

      if (club.costMin > maxCost) return false;

      return true;
    });

    result.sort((a, b) => {
      switch (sort) {
        case "name":
          return a.name.localeCompare(b.name);
        case "cost-low":
          return a.costMin - b.costMin;
        case "cost-high":
          return b.costMax - a.costMax;
        case "level": {
          const getHighest = (c: Club) => {
            for (let i = 0; i < allLevels.length; i++) {
              if (c.levels.includes(allLevels[i])) return i;
            }
            return allLevels.length;
          };
          return getHighest(a) - getHighest(b);
        }
        default:
          return 0;
      }
    });

    return result;
  }, [search, selectedLevels, selectedCounty, maxCost, sort]);

  const clearFilters = () => {
    setSearch("");
    setSelectedLevels([]);
    setSelectedCounty("");
    setMaxCost(15000);
    setSort("name");
  };

  const hasFilters = search || selectedLevels.length > 0 || selectedCounty || maxCost < 15000;

  return (
    <div>
      <LevelGuide />

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search clubs, cities, or levels (e.g. 'Danbury', 'ECNL', 'Stamford')..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 focus:border-transparent text-sm"
        />
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-6">
        {/* Level filter */}
        <div>
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide block mb-2">Filter by Level</span>
          <div className="flex flex-wrap gap-2">
            {allLevels.map((level) => (
              <button
                key={level}
                onClick={() => toggleLevel(level)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                  selectedLevels.includes(level)
                    ? levelColors[level] + " ring-2 ring-stone-300"
                    : "bg-white text-stone-500 border-stone-200 hover:border-stone-300"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-end">
          {/* County filter */}
          <div>
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide block mb-2">County</span>
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
            >
              <option value="">All Counties</option>
              {counties.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Cost filter */}
          <div className="flex-1 min-w-[200px]">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide block mb-2">
              Max Budget: {maxCost >= 15000 ? "No limit" : `$${maxCost.toLocaleString()}/yr`}
            </span>
            <input
              type="range"
              min={0}
              max={15000}
              step={500}
              value={maxCost}
              onChange={(e) => setMaxCost(Number(e.target.value))}
              className="w-full accent-stone-700"
            />
            <div className="flex justify-between text-xs text-stone-400">
              <span>$0</span>
              <span>$15,000+</span>
            </div>
          </div>

          {/* Sort */}
          <div>
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide block mb-2">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
            >
              <option value="name">Name (A-Z)</option>
              <option value="cost-low">Cost (Low to High)</option>
              <option value="cost-high">Cost (High to Low)</option>
              <option value="level">Highest Level First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results header */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-stone-500">
          Showing <span className="font-semibold text-stone-700">{filtered.length}</span> of {clubs.length} clubs
        </p>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-stone-500 hover:text-stone-700 underline underline-offset-2 cursor-pointer"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Club grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((club) => (
            <ClubCard key={club.id} club={club} onSelect={setSelectedClub} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-stone-400 text-lg">No clubs match your filters.</p>
          <p className="text-stone-400 text-sm mt-2">Try broadening your search or removing some filters.</p>
          <button
            onClick={clearFilters}
            className="mt-4 text-sm text-stone-600 underline underline-offset-2 hover:text-stone-800 cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Detail modal */}
      {selectedClub && (
        <ClubDetail club={selectedClub} onClose={() => setSelectedClub(null)} />
      )}
    </div>
  );
}
