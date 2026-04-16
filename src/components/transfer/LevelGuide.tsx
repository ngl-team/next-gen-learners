"use client";

import { useState } from "react";
import { levels } from "@/data/clubs";

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

export default function LevelGuide() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm text-stone-500 hover:text-stone-700 underline underline-offset-2 transition-colors cursor-pointer"
      >
        {open ? "Hide" : "Show"} level guide - what do ECNL, EDP, etc. actually mean?
      </button>

      {open && (
        <div className="mt-4 bg-white border border-stone-200 rounded-xl p-5 space-y-3">
          <h3 className="font-semibold text-stone-900 text-sm uppercase tracking-wide">Youth Soccer Levels in CT (Highest to Lowest)</h3>
          <div className="space-y-2">
            {levels.map((level, i) => (
              <div key={level.value} className="flex items-start gap-3 py-2 border-b border-stone-50 last:border-0">
                <span className="text-stone-300 text-sm font-mono w-4 shrink-0">{i + 1}.</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 mt-0.5 ${levelColors[level.value] || "bg-stone-100 text-stone-700"}`}>
                  {level.label}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-stone-700">{level.description}</p>
                  <p className="text-xs text-stone-400 mt-0.5">{level.costRange}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-stone-100">
            <p className="text-xs text-stone-400">
              Note: Listed costs are base program fees only. Most families report actual annual spend is 40-60% higher once you add tournaments, travel, gear, winter training, and camps.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
