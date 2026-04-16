"use client";

import { useState } from "react";
import { Club } from "@/data/clubs";
import { levels as levelInfo } from "@/data/clubs";
import { getClubReviews, getClubAverageRating, ClubReview } from "@/data/reviews";
import { currentLevels } from "@/data/profiles";

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

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${size === "lg" ? "text-xl" : "text-sm"} ${star <= Math.round(rating) ? "text-amber-400" : "text-stone-200"}`}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
}

function ClickableStars({ rating, onRate }: { rating: number; onRate: (r: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRate(star)}
          className={`text-2xl cursor-pointer transition-colors ${star <= rating ? "text-amber-400" : "text-stone-200 hover:text-amber-200"}`}
        >
          &#9733;
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: ClubReview }) {
  return (
    <div className="border border-stone-100 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <Stars rating={review.rating} />
            <h4 className="font-medium text-stone-900 text-sm">{review.title}</h4>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            {review.parentName} - {review.playerAgeGroup} - {review.level} - {review.yearsAtClub}
          </p>
        </div>
        {review.verified && (
          <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full shrink-0">Verified</span>
        )}
      </div>
      <p className="text-sm text-stone-700 mb-3">{review.body}</p>
      <div className="grid grid-cols-2 gap-3">
        {review.pros.length > 0 && (
          <div>
            <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Pros</span>
            <ul className="mt-1 space-y-1">
              {review.pros.map((pro, i) => (
                <li key={i} className="text-xs text-stone-600 flex gap-1">
                  <span className="text-green-500 shrink-0">+</span> {pro}
                </li>
              ))}
            </ul>
          </div>
        )}
        {review.cons.length > 0 && (
          <div>
            <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">Cons</span>
            <ul className="mt-1 space-y-1">
              {review.cons.map((con, i) => (
                <li key={i} className="text-xs text-stone-600 flex gap-1">
                  <span className="text-red-400 shrink-0">-</span> {con}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="mt-3 pt-2 border-t border-stone-50">
        <span className={`text-xs ${review.wouldRecommend ? "text-green-600" : "text-red-500"}`}>
          {review.wouldRecommend ? "Would recommend to other families" : "Would not recommend"}
        </span>
      </div>
    </div>
  );
}

function ReviewForm({ clubId, clubName, onSubmit }: { clubId: string; clubName: string; onSubmit: () => void }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [parentName, setParentName] = useState("");
  const [playerAgeGroup, setPlayerAgeGroup] = useState("");
  const [yearsAtClub, setYearsAtClub] = useState("");
  const [level, setLevel] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = rating > 0 && title && body && parentName && wouldRecommend !== null;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await fetch("/api/transfer/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clubId,
          rating,
          title,
          body,
          parentName,
          playerAgeGroup,
          yearsAtClub,
          level,
          pros: pros.split(",").map((p) => p.trim()).filter(Boolean),
          cons: cons.split(",").map((c) => c.trim()).filter(Boolean),
          wouldRecommend,
        }),
      });
      setSubmitted(true);
      onSubmit();
    } catch {
      // handle error
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
        <p className="text-green-800 font-medium">Thank you for your review!</p>
        <p className="text-green-600 text-sm mt-1">Your honest feedback helps other families make better decisions.</p>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 rounded-lg p-5 space-y-4">
      <h4 className="font-semibold text-stone-900">Share Your Experience at {clubName}</h4>
      <p className="text-xs text-stone-500">Your review helps other parents. Be honest. What would you want to know?</p>

      <div>
        <label className="block text-xs text-stone-500 mb-1">Overall Rating *</label>
        <ClickableStars rating={rating} onRate={setRating} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-stone-500 mb-1">Your Name *</label>
          <input
            type="text"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            placeholder="e.g. Soccer Mom, Danbury Dad"
            className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
          />
        </div>
        <div>
          <label className="block text-xs text-stone-500 mb-1">Player Age Group</label>
          <select
            value={playerAgeGroup}
            onChange={(e) => setPlayerAgeGroup(e.target.value)}
            className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
          >
            <option value="">Select</option>
            {["U6","U7","U8","U9","U10","U11","U12","U13","U14","U15","U16","U17","U18","U19"].map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-stone-500 mb-1">Program Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
          >
            <option value="">Select</option>
            {currentLevels.map((l) => (
              <option key={l} value={l}>{l}</option>
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
            <option value="1 year">1 year</option>
            <option value="2 years">2 years</option>
            <option value="3 years">3 years</option>
            <option value="4+ years">4+ years</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs text-stone-500 mb-1">Review Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sum it up in one line"
          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
        />
      </div>

      <div>
        <label className="block text-xs text-stone-500 mb-1">Your Review *</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder="What should other parents know about this club?"
          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-stone-500 mb-1">Pros (comma separated)</label>
          <input
            type="text"
            value={pros}
            onChange={(e) => setPros(e.target.value)}
            placeholder="Great coaching, affordable"
            className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
          />
        </div>
        <div>
          <label className="block text-xs text-stone-500 mb-1">Cons (comma separated)</label>
          <input
            type="text"
            value={cons}
            onChange={(e) => setCons(e.target.value)}
            placeholder="Expensive, far drive"
            className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-stone-500 mb-2">Would you recommend this club to another family? *</label>
        <div className="flex gap-3">
          <button
            onClick={() => setWouldRecommend(true)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
              wouldRecommend === true ? "bg-green-100 text-green-800 ring-2 ring-green-300" : "bg-white border border-stone-200 text-stone-500 hover:border-stone-300"
            }`}
          >
            Yes, I would recommend
          </button>
          <button
            onClick={() => setWouldRecommend(false)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
              wouldRecommend === false ? "bg-red-100 text-red-800 ring-2 ring-red-300" : "bg-white border border-stone-200 text-stone-500 hover:border-stone-300"
            }`}
          >
            No, I would not
          </button>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit || submitting}
        className={`w-full py-3 rounded-lg font-medium transition-colors ${
          canSubmit && !submitting
            ? "bg-stone-900 text-white hover:bg-stone-800 cursor-pointer"
            : "bg-stone-200 text-stone-400 cursor-not-allowed"
        }`}
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}

export default function ClubDetail({ club, onClose }: { club: Club; onClose: () => void }) {
  const [tab, setTab] = useState<"info" | "reviews">("info");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const reviews = getClubReviews(club.id);
  const { average, count } = getClubAverageRating(club.id);
  const recommendPct = count > 0 ? Math.round((reviews.filter((r) => r.wouldRecommend).length / count) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-100">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-stone-900">{club.name}</h2>
              <p className="text-stone-500 mt-1">{club.city}, CT - {club.county} County</p>
              {count > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <Stars rating={average} size="lg" />
                  <span className="text-sm text-stone-600 font-medium">{average.toFixed(1)}</span>
                  <span className="text-sm text-stone-400">({count} review{count !== 1 ? "s" : ""})</span>
                  <span className="text-xs text-stone-400">-</span>
                  <span className="text-xs text-green-600">{recommendPct}% recommend</span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-600 text-2xl leading-none p-1"
            >
              x
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setTab("info")}
              className={`text-sm font-medium pb-2 border-b-2 transition-colors cursor-pointer ${
                tab === "info" ? "border-stone-900 text-stone-900" : "border-transparent text-stone-400 hover:text-stone-600"
              }`}
            >
              Club Info
            </button>
            <button
              onClick={() => setTab("reviews")}
              className={`text-sm font-medium pb-2 border-b-2 transition-colors cursor-pointer ${
                tab === "reviews" ? "border-stone-900 text-stone-900" : "border-transparent text-stone-400 hover:text-stone-600"
              }`}
            >
              Parent Reviews {count > 0 ? `(${count})` : ""}
            </button>
          </div>
        </div>

        <div className="p-6">
          {tab === "info" ? (
            <div className="space-y-6">
              <p className="text-stone-700 leading-relaxed">{club.description}</p>

              <div>
                <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wide mb-3">Programs Offered</h3>
                <div className="space-y-2">
                  {club.levels.map((level) => {
                    const info = levelInfo.find((l) => l.value === level);
                    return (
                      <div key={level} className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
                        <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 mt-0.5 ${levelColors[level] || "bg-stone-100 text-stone-700 border-stone-200"}`}>
                          {level}
                        </span>
                        <div>
                          <p className="text-sm text-stone-600">{info?.description || ""}</p>
                          {info?.costRange && (
                            <p className="text-xs text-stone-400 mt-1">Typical cost: {info.costRange}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-50 rounded-lg p-4">
                  <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Age Groups</span>
                  <p className="text-stone-900 font-semibold text-lg mt-1">{club.ageGroups}</p>
                </div>
                <div className="bg-stone-50 rounded-lg p-4">
                  <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Annual Cost Range</span>
                  <p className="text-stone-900 font-semibold text-lg mt-1">{club.costRange}</p>
                  <p className="text-xs text-stone-400 mt-1">Does not include tournaments, travel, gear</p>
                </div>
                {club.playerCount && (
                  <div className="bg-stone-50 rounded-lg p-4">
                    <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Players</span>
                    <p className="text-stone-900 font-semibold text-lg mt-1">{club.playerCount}</p>
                  </div>
                )}
                {club.founded && (
                  <div className="bg-stone-50 rounded-lg p-4">
                    <span className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Founded</span>
                    <p className="text-stone-900 font-semibold text-lg mt-1">{club.founded}</p>
                  </div>
                )}
              </div>

              {club.notable.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wide mb-3">What Parents Should Know</h3>
                  <ul className="space-y-2">
                    {club.notable.map((note, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
                        <span className="text-green-500 mt-0.5 shrink-0">&#10003;</span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <a
                  href={club.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-stone-900 text-white py-3 rounded-lg font-medium hover:bg-stone-800 transition-colors"
                >
                  Visit Website
                </a>
                {club.phone && (
                  <a
                    href={`tel:${club.phone}`}
                    className="flex-1 text-center bg-white border border-stone-200 text-stone-700 py-3 rounded-lg font-medium hover:bg-stone-50 transition-colors"
                  >
                    Call {club.phone}
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Rating summary */}
              {count > 0 && (
                <div className="bg-stone-50 rounded-xl p-5">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-stone-900">{average.toFixed(1)}</div>
                      <Stars rating={average} size="lg" />
                      <p className="text-xs text-stone-400 mt-1">{count} review{count !== 1 ? "s" : ""}</p>
                    </div>
                    <div className="flex-1 space-y-1">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const starCount = reviews.filter((r) => r.rating === star).length;
                        const pct = count > 0 ? (starCount / count) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-xs text-stone-400 w-3">{star}</span>
                            <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-stone-400 w-6 text-right">{starCount}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-stone-200 flex items-center justify-between">
                    <span className="text-sm text-stone-600">
                      <span className="font-semibold text-green-600">{recommendPct}%</span> of parents recommend this club
                    </span>
                  </div>
                </div>
              )}

              {/* Reviews */}
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-stone-400 mb-1">No reviews yet for this club.</p>
                  <p className="text-stone-400 text-sm">Be the first parent to share your experience.</p>
                </div>
              )}

              {/* Write review */}
              {!showReviewForm ? (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="w-full py-3 rounded-lg font-medium border-2 border-dashed border-stone-300 text-stone-500 hover:border-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                >
                  Write a Review
                </button>
              ) : (
                <ReviewForm
                  clubId={club.id}
                  clubName={club.name}
                  onSubmit={() => setShowReviewForm(false)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
