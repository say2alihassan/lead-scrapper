"use client";

import { Search, Loader2 } from "lucide-react";

export default function SearchBar({ onSearch, loading, value = "", onValueChange }) {
  function handleSubmit(e) {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-slate-400 pointer-events-none">
          {loading ? (
            <Loader2 size={18} className="animate-spin text-blue-500" />
          ) : (
            <Search size={18} />
          )}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onValueChange?.(e.target.value)}
          placeholder='e.g. "restaurants in Lahore" or "salons in Dubai"'
          disabled={loading}
          aria-label="Search for business leads"
          className="
            w-full h-14 pl-12 pr-40 text-base
            bg-white/10 backdrop-blur-sm
            border border-white/20
            rounded-2xl
            text-white placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:border-blue-400/60
            disabled:opacity-60 disabled:cursor-not-allowed
            transition-all duration-200
          "
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="
            absolute right-2
            h-10 px-6
            bg-linear-to-r from-blue-500 to-blue-600
            hover:from-blue-400 hover:to-blue-500
            text-white text-sm font-semibold
            rounded-xl
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            active:scale-[0.97]
            cursor-pointer
            shadow-lg shadow-blue-500/30
          "
        >
          {loading ? "Scanning…" : "Search"}
        </button>
      </div>
    </form>
  );
}
