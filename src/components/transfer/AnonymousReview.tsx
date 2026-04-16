"use client";

import { useState } from "react";
import { clubs } from "@/data/clubs";
import { currentLevels } from "@/data/profiles";

const ratingCategories = [
  { key: "coaching", label: "Coaching Quality", description: "How good are the coaches at developing your kid?" },
  { key: "communication", label: "Communication", description: "Does the club keep you informed? Do coaches give feedback?" },
  { key: "development", label: "Player Development", description: "Is your kid actually getting better?" },
  { key: "value", label: "Value for Money", description: "Is it worth what you pay?" },
  { key: "culture", label: "Culture & Environment", description: "Is it a healthy environment for kids and families?" },
  { key: "playingTime", label: "Playing Time Fairness", description: "Does your kid get a fair shot?" },
];

function ClickableStars({ rating, onRate, size = "md" }: { rating: number; onRate: (r: number) => void; size?: "sm" | "md" }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRate(star)}
          className={`cursor-pointer transition-colors ${size === "sm" ? "text-lg" : "text-2xl"} ${
            star <= rating ? "text-amber-400" : "text-stone-200 hover:text-amber-200"
          }`}
        >
          &#9733;
        </button>
      ))}
    </div>
  );
}

export default function AnonymousReview() {
  const [clubId, setClubId] = useState("");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [level, setLevel] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [yearsAtClub, setYearsAtClub] = useState("");
  const [stillAtClub, setStillAtClub] = useState<boolean | null>(null);
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const setRating = (key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const overallRating = Object.values(ratings).length > 0
    ? Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length
    : 0;

  const canSubmit = clubId && Object.values(ratings).length >= 3 && body.length >= 20 && wouldRecommend !== null;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await fetch("/api/transfer/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clubId,
          rating: Math.round(overallRating * 10) / 10,
          ratings,
          parentName: "Anonymous Parent",
          title: title || "Anonymous Review",
          body,
          level,
          playerAgeGroup: ageGroup,
          yearsAtClub,
          stillAtClub,
          wouldRecommend,
          pros: [],
          cons: [],
          anonymous: true,
        }),
      });
      setSubmitted(true);
    } catch {
      // silently handle
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-green-600 text-2xl">&#10003;</span>
        </div>
        <h2 className="text-2xl font-bold text-stone-900 mb-3">Review Posted</h2>
        <p className="text-stone-600 mb-2">Your anonymous review is live. Thank you for helping other families.</p>
        <p className="text-stone-500 text-sm mb-8">No one will know who wrote this. Your kid is safe.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => {
              setSubmitted(false);
              setClubId("");
              setRatings({});
              setTitle("");
              setBody("");
              setLevel("");
              setAgeGroup("");
              setYearsAtClub("");
              setStillAtClub(null);
              setWouldRecommend(null);
            }}
            className="bg-stone-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Review Another Club
          </button>
          <a
            href="/"
            className="bg-white border border-stone-200 text-stone-700 px-6 py-3 rounded-lg font-medium hover:bg-stone-50 transition-colors"
          >
            Browse Clubs
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="bg-stone-900 p-6 sm:p-8 text-white">
          <h2 className="text-2xl font-bold">Rate Your Club</h2>
          <p className="text-stone-400 mt-1">100% anonymous. Your name is never attached. Your kid is protected.</p>
          <div className="flex gap-4 mt-4 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <span className="text-green-400">&#128274;</span> No login required
            </span>
            <span className="flex items-center gap-1">
              <span className="text-green-400">&#128274;</span> No email collected
            </span>
            <span className="flex items-center gap-1">
              <span className="text-green-400">&#128274;</span> No tracking
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">

          {/* Club select */}
          <div>
            <label className="block text-sm font-semibold text-stone-900 mb-2">Which club are you reviewing?</label>
            <select
              value={clubId}
              onChange={(e) => setClubId(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 bg-stone-50"
            >
              <option value="">Select a club</option>
              {clubs.sort((a, b) => a.name.localeCompare(b.name)).map((club) => (
                <option key={club.id} value={club.id}>{club.name} - {club.city}</option>
              ))}
            </select>
          </div>

          {/* Context */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-stone-500 mb-1">Program Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
              >
                <option value="">Select</option>
                {currentLevels.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-stone-500 mb-1">Player Age Group</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
              >
                <option value="">Select</option>
                {["U6","U7","U8","U9","U10","U11","U12","U13","U14","U15","U16","U17","U18","U19"].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-stone-500 mb-1">Time at Club</label>
              <select
                value={yearsAtClub}
                onChange={(e) => setYearsAtClub(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
              >
                <option value="">Select</option>
                <option value="Less than 1 year">Less than 1 year</option>
                <option value="1-2 years">1-2 years</option>
                <option value="3-4 years">3-4 years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>
          </div>

          {/* Still at club */}
          <div>
            <label className="block text-xs text-stone-500 mb-2">Are you still at this club?</label>
            <div className="flex gap-2">
              {[
                { val: true, label: "Yes, currently here" },
                { val: false, label: "No, we left" },
              ].map(({ val, label }) => (
                <button
                  key={String(val)}
                  onClick={() => setStillAtClub(val)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                    stillAtClub === val
                      ? "bg-stone-900 text-white"
                      : "bg-stone-50 border border-stone-200 text-stone-500 hover:border-stone-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Category ratings */}
          <div>
            <h3 className="text-sm font-semibold text-stone-900 mb-1">Rate each area</h3>
            <p className="text-xs text-stone-400 mb-4">Rate at least 3. Be honest. This is what other parents need to see.</p>
            <div className="space-y-4">
              {ratingCategories.map((cat) => (
                <div key={cat.key} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="text-sm font-medium text-stone-800">{cat.label}</div>
                    <div className="text-xs text-stone-400">{cat.description}</div>
                  </div>
                  <ClickableStars
                    rating={ratings[cat.key] || 0}
                    onRate={(r) => setRating(cat.key, r)}
                    size="sm"
                  />
                </div>
              ))}
            </div>
            {Object.values(ratings).length > 0 && (
              <div className="mt-3 text-right">
                <span className="text-sm text-stone-500">Overall: </span>
                <span className="text-lg font-bold text-stone-900">{overallRating.toFixed(1)}</span>
                <span className="text-sm text-stone-400">/5</span>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-stone-900 mb-1">Sum it up in one line</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 'Great coaching, terrible communication' or 'Not worth the price'"
              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-semibold text-stone-900 mb-1">Tell your story</label>
            <p className="text-xs text-stone-400 mb-2">What should other parents know before writing the check? Be specific. (Min 20 characters)</p>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              placeholder="What was your experience? What did the club promise vs. deliver? How was the coaching? The communication? Was your kid happy? Would you do it again knowing what you know now?"
              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none"
            />
            <div className="text-right mt-1">
              <span className={`text-xs ${body.length >= 20 ? "text-green-500" : "text-stone-300"}`}>
                {body.length} characters
              </span>
            </div>
          </div>

          {/* Would recommend */}
          <div>
            <label className="block text-sm font-semibold text-stone-900 mb-2">
              Would you recommend this club to a friend?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setWouldRecommend(true)}
                className={`p-4 rounded-xl text-center transition-all cursor-pointer ${
                  wouldRecommend === true
                    ? "bg-green-50 border-2 border-green-400 text-green-800"
                    : "bg-stone-50 border-2 border-transparent text-stone-500 hover:border-stone-200"
                }`}
              >
                <div className="text-2xl mb-1">&#128077;</div>
                <div className="text-sm font-medium">Yes</div>
                <div className="text-xs mt-0.5 opacity-70">I would recommend this club</div>
              </button>
              <button
                onClick={() => setWouldRecommend(false)}
                className={`p-4 rounded-xl text-center transition-all cursor-pointer ${
                  wouldRecommend === false
                    ? "bg-red-50 border-2 border-red-400 text-red-800"
                    : "bg-stone-50 border-2 border-transparent text-stone-500 hover:border-stone-200"
                }`}
              >
                <div className="text-2xl mb-1">&#128078;</div>
                <div className="text-sm font-medium">No</div>
                <div className="text-xs mt-0.5 opacity-70">I would not recommend</div>
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors ${
              canSubmit && !submitting
                ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                : "bg-stone-200 text-stone-400 cursor-not-allowed"
            }`}
          >
            {submitting ? "Posting..." : "Post Anonymous Review"}
          </button>

          {!canSubmit && (
            <p className="text-xs text-stone-400 text-center">
              {!clubId ? "Select a club" : Object.values(ratings).length < 3 ? "Rate at least 3 categories" : body.length < 20 ? "Write at least 20 characters" : "Select recommend or not"}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
