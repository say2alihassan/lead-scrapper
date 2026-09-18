"use client";

import { ArrowUpDown, X } from "lucide-react";

export const DEFAULT_FILTERS = {
  verdict: "all",
  hasPhone: false,
  hasWebsite: false,
  sort: "score",
};

export function applyFilters(leads, filters) {
  let out = [...leads];
  if (filters.verdict !== "all") out = out.filter((l) => l.verdict === filters.verdict);
  if (filters.hasPhone) out = out.filter((l) => l.formatted_phone_number);
  if (filters.hasWebsite) out = out.filter((l) => l.website);
  if (filters.sort === "score") out.sort((a, b) => b.score - a.score);
  else if (filters.sort === "reviews") out.sort((a, b) => (b.user_ratings_total || 0) - (a.user_ratings_total || 0));
  else if (filters.sort === "rating") out.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  else if (filters.sort === "name") out.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  return out;
}

export function isDefaultFilters(filters) {
  return (
    filters.verdict === "all" &&
    !filters.hasPhone &&
    !filters.hasWebsite &&
    filters.sort === "score"
  );
}

export default function FilterBar({ filters, onChange, totalBefore, totalAfter }) {
  const isDirty = !isDefaultFilters(filters);

  function set(key, value) {
    onChange({ ...filters, [key]: value });
  }

  function reset() {
    onChange(DEFAULT_FILTERS);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-5 p-3 bg-white border border-slate-200 rounded-2xl">

      {/* Sort */}
      <div className="flex items-center gap-1.5">
        <ArrowUpDown size={13} className="text-slate-400 shrink-0" />
        <select
          value={filters.sort}
          onChange={(e) => set("sort", e.target.value)}
          className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
        >
          <option value="score">Sort: Score</option>
          <option value="reviews">Sort: Reviews</option>
          <option value="rating">Sort: Rating</option>
          <option value="name">Sort: Name</option>
        </select>
      </div>

      <div className="w-px h-5 bg-slate-200" />

      {/* Verdict filter */}
      <div className="flex items-center gap-1">
        {["all", "STRONG", "MAYBE", "SKIP"].map((v) => (
          <button
            key={v}
            onClick={() => set("verdict", v)}
            className={`text-[11px] font-600 px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
              filters.verdict === v
                ? v === "STRONG"
                  ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                  : v === "MAYBE"
                  ? "bg-amber-100 text-amber-700 border-amber-300"
                  : v === "SKIP"
                  ? "bg-slate-200 text-slate-600 border-slate-300"
                  : "bg-blue-100 text-blue-700 border-blue-300"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
            }`}
          >
            {v === "all" ? "All" : v}
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-slate-200" />

      {/* Toggle chips */}
      <button
        onClick={() => set("hasPhone", !filters.hasPhone)}
        className={`text-[11px] font-600 px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
          filters.hasPhone
            ? "bg-blue-100 text-blue-700 border-blue-300"
            : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
        }`}
      >
        Has Phone
      </button>

      <button
        onClick={() => set("hasWebsite", !filters.hasWebsite)}
        className={`text-[11px] font-600 px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
          filters.hasWebsite
            ? "bg-blue-100 text-blue-700 border-blue-300"
            : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
        }`}
      >
        Has Website
      </button>

      {/* Results count + reset */}
      <div className="ml-auto flex items-center gap-2">
        {isDirty && totalBefore !== totalAfter && (
          <span className="text-[11px] text-slate-400">
            {totalAfter} of {totalBefore}
          </span>
        )}
        {isDirty && (
          <button
            onClick={reset}
            className="flex items-center gap-1 text-[11px] font-600 text-slate-500 hover:text-slate-700 border border-slate-200 hover:border-slate-300 px-2.5 py-1 rounded-full transition-all cursor-pointer"
          >
            <X size={10} /> Reset
          </button>
        )}
      </div>
    </div>
  );
}
