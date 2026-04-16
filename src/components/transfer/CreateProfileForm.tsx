"use client";

import { useState } from "react";
import { positions, currentLevels, targetLevels, lookingForLabels } from "@/data/profiles";

interface FormData {
  playerFirstName: string;
  playerLastName: string;
  dateOfBirth: string;
  gender: string;
  position: string;
  secondaryPosition: string;
  currentClub: string;
  currentLevel: string;
  heightFeet: string;
  heightInches: string;
  weight: string;
  playsHighSchool: string;
  highSchoolName: string;
  graduationYear: string;
  highlightVideoUrl: string;
  lookingFor: string;
  willingToTravel: string;
  targetLevel: string;
  additionalNotes: string;
  parentFirstName: string;
  parentLastName: string;
  parentEmail: string;
  parentPhone: string;
  city: string;
  state: string;
}

const initialForm: FormData = {
  playerFirstName: "",
  playerLastName: "",
  dateOfBirth: "",
  gender: "",
  position: "",
  secondaryPosition: "",
  currentClub: "",
  currentLevel: "",
  heightFeet: "",
  heightInches: "",
  weight: "",
  playsHighSchool: "",
  highSchoolName: "",
  graduationYear: "",
  highlightVideoUrl: "",
  lookingFor: "",
  willingToTravel: "",
  targetLevel: "",
  additionalNotes: "",
  parentFirstName: "",
  parentLastName: "",
  parentEmail: "",
  parentPhone: "",
  city: "",
  state: "CT",
};

function getInitials(first: string, last: string): string {
  return ((first?.[0] || "") + (last?.[0] || "")).toUpperCase() || "?";
}

function getAge(dob: string): string {
  if (!dob) return "--";
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return String(age);
}

function getAgeGroup(dob: string): string {
  if (!dob) return "U--";
  const age = Number(getAge(dob));
  return `U${age + 1}`;
}

const levelColors: Record<string, string> = {
  "MLS NEXT": "bg-purple-100 text-purple-800",
  "ECNL": "bg-blue-100 text-blue-800",
  "ECNL Regional League": "bg-sky-100 text-sky-800",
  "Girls Academy": "bg-pink-100 text-pink-800",
  "EDP": "bg-emerald-100 text-emerald-800",
  "Premier": "bg-amber-100 text-amber-800",
  "Travel": "bg-orange-100 text-orange-800",
  "Academy": "bg-teal-100 text-teal-800",
  "Recreational": "bg-stone-100 text-stone-700",
  "High School Only": "bg-indigo-100 text-indigo-800",
  "No Club Currently": "bg-stone-100 text-stone-500",
};

const statusColors: Record<string, string> = {
  exploring: "bg-blue-100 text-blue-700",
  switching: "bg-amber-100 text-amber-700",
  relocating: "bg-purple-100 text-purple-700",
  "first-club": "bg-green-100 text-green-700",
};

// Inline editable field that looks like part of the profile
function InlineField({
  value,
  placeholder,
  onChange,
  className = "",
  type = "text",
}: {
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  className?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`bg-transparent border-b-2 border-dashed border-stone-300 focus:border-green-500 outline-none transition-colors placeholder:text-stone-300 ${className}`}
    />
  );
}

function InlineSelect({
  value,
  placeholder,
  options,
  onChange,
  className = "",
}: {
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-transparent border-b-2 border-dashed border-stone-300 focus:border-green-500 outline-none transition-colors appearance-none cursor-pointer ${!value ? "text-stone-300" : ""} ${className}`}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export default function CreateProfileForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [showContact, setShowContact] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const hasBasics = form.playerFirstName && form.playerLastName && form.position && form.currentLevel;
  const hasNeeds = form.lookingFor && form.willingToTravel;
  const canSubmit = hasBasics && hasNeeds && form.parentEmail && form.parentPhone && form.city;

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/transfer/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-green-600 text-2xl">&#10003;</span>
        </div>
        <h2 className="text-2xl font-bold text-stone-900 mb-3">
          {form.playerFirstName} is live.
        </h2>
        <p className="text-stone-600 mb-2">
          Club coaches in Connecticut can now find {form.playerFirstName}&apos;s profile.
        </p>
        <p className="text-stone-500 text-sm mb-8">
          We will reach out to <span className="font-medium">{form.parentEmail}</span> when a club expresses interest.
        </p>
        <a
          href="/transfer"
          className="inline-block bg-stone-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-stone-800 transition-colors"
        >
          Browse Clubs
        </a>
      </div>
    );
  }

  const completionItems = [
    { done: !!form.playerFirstName && !!form.playerLastName, label: "Name" },
    { done: !!form.position, label: "Position" },
    { done: !!form.currentClub, label: "Club" },
    { done: !!form.currentLevel, label: "Level" },
    { done: !!form.dateOfBirth, label: "Age" },
    { done: !!form.heightFeet, label: "Size" },
    { done: !!form.lookingFor, label: "Status" },
    { done: !!form.parentEmail, label: "Contact" },
  ];
  const completionPct = Math.round((completionItems.filter((i) => i.done).length / completionItems.length) * 100);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* === LIVE PROFILE CARD === */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">

            {/* Profile header */}
            <div className="bg-gradient-to-br from-stone-900 to-stone-800 p-6 sm:p-8">
              <div className="flex items-start gap-5">
                {/* Avatar */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shrink-0 border border-white/20">
                  {getInitials(form.playerFirstName, form.playerLastName)}
                </div>
                <div className="flex-1 min-w-0">
                  {/* Name */}
                  <div className="flex flex-wrap items-baseline gap-2">
                    <InlineField
                      value={form.playerFirstName}
                      placeholder="First"
                      onChange={(v) => update("playerFirstName", v)}
                      className="text-2xl sm:text-3xl font-bold text-white w-32 sm:w-40 border-white/30 focus:border-green-400 placeholder:text-white/30"
                    />
                    <InlineField
                      value={form.playerLastName}
                      placeholder="Last"
                      onChange={(v) => update("playerLastName", v)}
                      className="text-2xl sm:text-3xl font-bold text-white w-32 sm:w-40 border-white/30 focus:border-green-400 placeholder:text-white/30"
                    />
                  </div>
                  {/* Position + Age */}
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <InlineSelect
                      value={form.position}
                      placeholder="Position"
                      options={positions.map((p) => ({ value: p, label: p }))}
                      onChange={(v) => update("position", v)}
                      className="text-white/80 text-sm sm:text-base border-white/30 focus:border-green-400"
                    />
                    {form.position && (
                      <span className="text-white/40">|</span>
                    )}
                    <InlineSelect
                      value={form.secondaryPosition}
                      placeholder="2nd position"
                      options={positions.filter((p) => p !== form.position).map((p) => ({ value: p, label: p }))}
                      onChange={(v) => update("secondaryPosition", v)}
                      className="text-white/60 text-sm border-white/20 focus:border-green-400"
                    />
                  </div>
                  {/* Level badge */}
                  <div className="mt-3">
                    {form.currentLevel ? (
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${levelColors[form.currentLevel] || "bg-white/10 text-white/70"}`}>
                        {form.currentLevel}
                      </span>
                    ) : (
                      <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/30 border border-dashed border-white/20">
                        Select level below
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile body */}
            <div className="p-6 sm:p-8 space-y-6">

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-stone-50 rounded-xl p-4 text-center">
                  <div className="text-xs text-stone-400 uppercase tracking-wide mb-1">Age Group</div>
                  <div className="text-xl font-bold text-stone-900">{getAgeGroup(form.dateOfBirth)}</div>
                  <input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) => update("dateOfBirth", e.target.value)}
                    className="mt-1 text-xs text-stone-400 bg-transparent border-b border-dashed border-stone-200 focus:border-green-500 outline-none w-full text-center"
                  />
                </div>

                <div className="bg-stone-50 rounded-xl p-4 text-center">
                  <div className="text-xs text-stone-400 uppercase tracking-wide mb-1">Height</div>
                  <div className="flex items-baseline justify-center gap-1">
                    <select
                      value={form.heightFeet}
                      onChange={(e) => update("heightFeet", e.target.value)}
                      className="text-xl font-bold text-stone-900 bg-transparent outline-none appearance-none text-center cursor-pointer w-8"
                    >
                      <option value="">-</option>
                      {[3, 4, 5, 6].map((f) => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <span className="text-stone-400">&apos;</span>
                    <select
                      value={form.heightInches}
                      onChange={(e) => update("heightInches", e.target.value)}
                      className="text-xl font-bold text-stone-900 bg-transparent outline-none appearance-none text-center cursor-pointer w-8"
                    >
                      <option value="">-</option>
                      {Array.from({ length: 12 }, (_, i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                    <span className="text-stone-400">&quot;</span>
                  </div>
                </div>

                <div className="bg-stone-50 rounded-xl p-4 text-center">
                  <div className="text-xs text-stone-400 uppercase tracking-wide mb-1">Weight</div>
                  <div className="flex items-baseline justify-center gap-1">
                    <input
                      type="number"
                      value={form.weight}
                      onChange={(e) => update("weight", e.target.value)}
                      placeholder="---"
                      className="text-xl font-bold text-stone-900 bg-transparent outline-none w-12 text-center placeholder:text-stone-300"
                    />
                    <span className="text-stone-400 text-sm">lbs</span>
                  </div>
                </div>

                <div className="bg-stone-50 rounded-xl p-4 text-center">
                  <div className="text-xs text-stone-400 uppercase tracking-wide mb-1">Gender</div>
                  <div className="flex justify-center gap-2 mt-1">
                    {["Male", "Female"].map((g) => (
                      <button
                        key={g}
                        onClick={() => update("gender", g)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors cursor-pointer ${
                          form.gender === g
                            ? "bg-stone-900 text-white"
                            : "bg-white border border-stone-200 text-stone-500 hover:border-stone-400"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Club + Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-stone-50 rounded-xl p-4">
                  <div className="text-xs text-stone-400 uppercase tracking-wide mb-2">Current Club</div>
                  <InlineField
                    value={form.currentClub}
                    placeholder="e.g. AC Connecticut, DYSC, None"
                    onChange={(v) => update("currentClub", v)}
                    className="text-stone-900 font-semibold text-lg w-full"
                  />
                </div>
                <div className="bg-stone-50 rounded-xl p-4">
                  <div className="text-xs text-stone-400 uppercase tracking-wide mb-2">Current Level</div>
                  <InlineSelect
                    value={form.currentLevel}
                    placeholder="Select your level"
                    options={currentLevels.map((l) => ({ value: l, label: l }))}
                    onChange={(v) => update("currentLevel", v)}
                    className="text-stone-900 font-semibold text-lg w-full"
                  />
                </div>
              </div>

              {/* Location + Travel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-stone-50 rounded-xl p-4">
                  <div className="text-xs text-stone-400 uppercase tracking-wide mb-2">Location</div>
                  <div className="flex items-center gap-2">
                    <InlineField
                      value={form.city}
                      placeholder="City"
                      onChange={(v) => update("city", v)}
                      className="text-stone-900 font-semibold text-lg flex-1"
                    />
                    <span className="text-stone-400">,</span>
                    <InlineField
                      value={form.state}
                      placeholder="ST"
                      onChange={(v) => update("state", v)}
                      className="text-stone-900 font-semibold text-lg w-12 text-center"
                    />
                  </div>
                </div>
                <div className="bg-stone-50 rounded-xl p-4">
                  <div className="text-xs text-stone-400 uppercase tracking-wide mb-2">Will Travel</div>
                  <div className="flex gap-1.5 flex-wrap">
                    {["10", "20", "30", "45", "60+"].map((min) => (
                      <button
                        key={min}
                        onClick={() => update("willingToTravel", min)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors cursor-pointer ${
                          form.willingToTravel === min
                            ? "bg-stone-900 text-white"
                            : "bg-white border border-stone-200 text-stone-500 hover:border-stone-400"
                        }`}
                      >
                        {min} min
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* High School */}
              <div className="bg-stone-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-stone-400 uppercase tracking-wide">High School</div>
                  <div className="flex gap-2">
                    {["yes", "no"].map((v) => (
                      <button
                        key={v}
                        onClick={() => update("playsHighSchool", v)}
                        className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                          form.playsHighSchool === v
                            ? "bg-stone-900 text-white"
                            : "bg-white border border-stone-200 text-stone-500 hover:border-stone-400"
                        }`}
                      >
                        {v === "yes" ? "Plays HS" : "No HS"}
                      </button>
                    ))}
                  </div>
                </div>
                {form.playsHighSchool === "yes" && (
                  <div className="flex items-center gap-3 mt-2">
                    <InlineField
                      value={form.highSchoolName}
                      placeholder="School name"
                      onChange={(v) => update("highSchoolName", v)}
                      className="text-stone-900 font-medium flex-1"
                    />
                    <span className="text-stone-400 text-sm">Class of</span>
                    <InlineSelect
                      value={form.graduationYear}
                      placeholder="Year"
                      options={[2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033].map((y) => ({ value: String(y), label: String(y) }))}
                      onChange={(v) => update("graduationYear", v)}
                      className="text-stone-900 font-medium w-20"
                    />
                  </div>
                )}
              </div>

              {/* Video */}
              <div className="bg-stone-50 rounded-xl p-4">
                <div className="text-xs text-stone-400 uppercase tracking-wide mb-2">Highlight Video</div>
                <div className="flex items-center gap-3">
                  <span className="text-stone-300 text-lg">&#9654;</span>
                  <InlineField
                    value={form.highlightVideoUrl}
                    placeholder="Paste YouTube, Hudl, or Vimeo link"
                    onChange={(v) => update("highlightVideoUrl", v)}
                    className="text-stone-700 flex-1"
                    type="url"
                  />
                </div>
                <p className="text-xs text-stone-400 mt-2">Profiles with video get 5x more views from coaches</p>
              </div>

              {/* Looking for - status */}
              <div>
                <div className="text-xs text-stone-400 uppercase tracking-wide mb-3">What are you looking for?</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(lookingForLabels).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => update("lookingFor", value)}
                      className={`text-left px-4 py-3 rounded-xl text-sm transition-all cursor-pointer ${
                        form.lookingFor === value
                          ? `${statusColors[value]} ring-2 ring-offset-1 ring-stone-300 font-medium`
                          : "bg-stone-50 text-stone-500 hover:bg-stone-100"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target level */}
              {form.lookingFor && (
                <div>
                  <div className="text-xs text-stone-400 uppercase tracking-wide mb-3">Target Level</div>
                  <div className="flex flex-wrap gap-2">
                    {targetLevels.map((level) => (
                      <button
                        key={level}
                        onClick={() => update("targetLevel", level)}
                        className={`px-4 py-2 rounded-full text-sm transition-all cursor-pointer ${
                          form.targetLevel === level
                            ? "bg-stone-900 text-white"
                            : "bg-stone-50 text-stone-500 hover:bg-stone-100 border border-stone-200"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div className="bg-stone-50 rounded-xl p-4">
                <div className="text-xs text-stone-400 uppercase tracking-wide mb-2">Anything else?</div>
                <textarea
                  value={form.additionalNotes}
                  onChange={(e) => update("additionalNotes", e.target.value)}
                  rows={2}
                  className="w-full bg-transparent border-b-2 border-dashed border-stone-300 focus:border-green-500 outline-none resize-none text-stone-700 placeholder:text-stone-300"
                  placeholder="Awards, tournament results, what makes this player stand out..."
                />
              </div>

            </div>
          </div>
        </div>

        {/* === SIDEBAR === */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">

            {/* Completion tracker */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-stone-900 text-sm">Profile Strength</h3>
                <span className={`text-sm font-bold ${completionPct === 100 ? "text-green-600" : "text-stone-400"}`}>
                  {completionPct}%
                </span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden mb-4">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    completionPct === 100 ? "bg-green-500" : completionPct >= 50 ? "bg-amber-500" : "bg-stone-300"
                  }`}
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <div className="space-y-2">
                {completionItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    <span className={item.done ? "text-green-500" : "text-stone-300"}>
                      {item.done ? "\u2713" : "\u25CB"}
                    </span>
                    <span className={item.done ? "text-stone-700" : "text-stone-400"}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Parent contact section */}
            {!showContact && hasBasics ? (
              <button
                onClick={() => setShowContact(true)}
                className="w-full bg-green-600 text-white rounded-2xl p-5 text-left hover:bg-green-700 transition-colors cursor-pointer"
              >
                <h3 className="font-semibold mb-1">Ready to go live?</h3>
                <p className="text-green-100 text-sm">Add your contact info to publish this profile. Coaches will be able to find {form.playerFirstName || "your player"}.</p>
              </button>
            ) : showContact ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-4">
                <div>
                  <h3 className="font-semibold text-stone-900 text-sm mb-1">Parent/Guardian Contact</h3>
                  <p className="text-xs text-stone-400">Private. Clubs contact us first, then we connect you.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">First Name</label>
                    <input
                      type="text"
                      value={form.parentFirstName}
                      onChange={(e) => update("parentFirstName", e.target.value)}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-400 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={form.parentLastName}
                      onChange={(e) => update("parentLastName", e.target.value)}
                      className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-stone-400 mb-1">Email *</label>
                  <input
                    type="email"
                    value={form.parentEmail}
                    onChange={(e) => update("parentEmail", e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-400 mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={form.parentPhone}
                    onChange={(e) => update("parentPhone", e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                    placeholder="(203) 555-0123"
                  />
                </div>

                {error && (
                  <p className="text-red-600 text-xs bg-red-50 p-2 rounded-lg">{error}</p>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || submitting}
                  className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                    canSubmit && !submitting
                      ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                      : "bg-stone-200 text-stone-400 cursor-not-allowed"
                  }`}
                >
                  {submitting ? "Publishing..." : "Publish Profile"}
                </button>

                <p className="text-xs text-stone-400 text-center">
                  Your phone and email are never shown to clubs. We act as the middleman.
                </p>
              </div>
            ) : (
              <div className="bg-stone-50 rounded-2xl border border-dashed border-stone-200 p-5 text-center">
                <p className="text-sm text-stone-400">Fill in the profile to unlock publishing</p>
              </div>
            )}

            {/* What coaches see */}
            <div className="bg-stone-50 rounded-2xl border border-stone-200 p-5">
              <h3 className="font-semibold text-stone-700 text-xs uppercase tracking-wide mb-3">What coaches see</h3>
              <ul className="space-y-2 text-xs text-stone-500">
                <li className="flex gap-2"><span className="text-green-500">&#10003;</span> Name, position, age group</li>
                <li className="flex gap-2"><span className="text-green-500">&#10003;</span> Current club and level</li>
                <li className="flex gap-2"><span className="text-green-500">&#10003;</span> Height, weight, location</li>
                <li className="flex gap-2"><span className="text-green-500">&#10003;</span> Highlight video (if added)</li>
                <li className="flex gap-2"><span className="text-green-500">&#10003;</span> What you are looking for</li>
              </ul>
              <div className="border-t border-stone-200 mt-3 pt-3">
                <h4 className="font-semibold text-stone-700 text-xs uppercase tracking-wide mb-2">What stays private</h4>
                <ul className="space-y-2 text-xs text-stone-500">
                  <li className="flex gap-2"><span className="text-stone-300">&#128274;</span> Parent email</li>
                  <li className="flex gap-2"><span className="text-stone-300">&#128274;</span> Parent phone</li>
                  <li className="flex gap-2"><span className="text-stone-300">&#128274;</span> Parent name</li>
                </ul>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
