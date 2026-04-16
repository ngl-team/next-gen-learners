"use client";

import { Club } from "@/data/clubs";
import { getClubAverageRating } from "@/data/reviews";

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
  "USL2": "bg-red-100 text-red-800 border-red-200",
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-sm ${star <= Math.round(rating) ? "text-amber-400" : "text-stone-200"}`}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
}

function CostBar({ min, max }: { min: number; max: number }) {
  const maxCost = 15000;
  const width = Math.min((max / maxCost) * 100, 100);
  let color = "bg-green-500";
  if (max > 5000) color = "bg-amber-500";
  if (max > 8000) color = "bg-red-500";

  return (
    <div className="mt-1">
      <div className="flex justify-between text-xs text-stone-500 mb-1">
        <span>${min.toLocaleString()}</span>
        <span>${max.toLocaleString()}+/yr</span>
      </div>
      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export default function ClubCard({ club, onSelect }: { club: Club; onSelect: (club: Club) => void }) {
  const { average, count } = getClubAverageRating(club.id);

  return (
    <button
      onClick={() => onSelect(club)}
      className="w-full text-left bg-white border border-stone-200 rounded-xl p-5 hover:border-stone-400 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-stone-900 text-lg leading-tight">{club.name}</h3>
          <p className="text-stone-500 text-sm mt-0.5">{club.city}, CT</p>
        </div>
        {count > 0 || club.googleRating ? (
          <div className="text-right shrink-0">
            {count > 0 ? (
              <>
                <Stars rating={average} />
                <span className="text-xs text-stone-400">{average.toFixed(1)} ({count} review{count !== 1 ? "s" : ""})</span>
              </>
            ) : club.googleRating ? (
              <>
                <Stars rating={club.googleRating} />
                <span className="text-xs text-stone-400">{club.googleRating} Google ({club.googleReviewCount})</span>
              </>
            ) : null}
          </div>
        ) : club.playerCount ? (
          <span className="text-xs text-stone-400 bg-stone-50 px-2 py-1 rounded-full border border-stone-100">
            {club.playerCount} players
          </span>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {club.levels.map((level) => (
          <span
            key={level}
            className={`text-xs px-2 py-0.5 rounded-full border ${levelColors[level] || "bg-stone-100 text-stone-700 border-stone-200"}`}
          >
            {level}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
        <div>
          <span className="text-stone-400 text-xs uppercase tracking-wide">Ages</span>
          <p className="text-stone-700 font-medium">{club.ageGroups}</p>
        </div>
        <div>
          <span className="text-stone-400 text-xs uppercase tracking-wide">County</span>
          <p className="text-stone-700 font-medium">{club.county}</p>
        </div>
      </div>

      <CostBar min={club.costMin} max={club.costMax} />

      {count > 0 && (
        <div className="mt-3 pt-3 border-t border-stone-100">
          <p className="text-xs text-stone-400">
            {count} parent review{count !== 1 ? "s" : ""} - click to read
          </p>
        </div>
      )}
    </button>
  );
}
