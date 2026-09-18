"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2, MapPin, TrendingUp, AlertTriangle, Sparkles, BrainCircuit,
  History, ArrowRight, ScanLine,
} from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { useLeads } from "@/lib/leadsStore";
import { CATEGORIES, buildQuery } from "@/lib/searchFilters";

function LoadingProgress({ query, progress, totalFound, strategy }) {
  const pct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;
  const areaLabel = progress.area === "base query" ? "base query" : progress.area ? `"${progress.area}"` : "…";

  return (
    <div className="flex flex-col items-center py-14 gap-5 max-w-sm mx-auto text-center">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-[3px] border-blue-100" />
        <div className="absolute inset-0 rounded-full border-[3px] border-blue-500 border-t-transparent animate-spin" />
        <div className="absolute inset-2 rounded-full bg-blue-50 flex items-center justify-center">
          <MapPin size={16} className="text-blue-500" />
        </div>
      </div>
      <div>
        <p className="text-slate-800 font-700 text-base">Scanning Google Maps…</p>
        <p className="text-slate-400 text-sm mt-0.5 truncate max-w-xs">&ldquo;{query}&rdquo;</p>
        {strategy?.city && (
          <p className="text-xs text-blue-500 mt-1 font-500">
            {strategy.areas} areas detected in {strategy.city}{strategy.source === "ai" ? " (AI)" : ""}
          </p>
        )}
      </div>
      <div className="w-full">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-500">
          <span className="truncate max-w-[180px]">Scanning {areaLabel}</span>
          <span className="font-700 text-slate-700 shrink-0 ml-2">{pct}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-linear-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-slate-400 mt-1.5">{progress.done} / {progress.total} areas done</p>
      </div>
      {totalFound > 0 && (
        <div className="w-full bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 text-sm text-emerald-700 font-500 flex items-center gap-2">
          <TrendingUp size={14} className="shrink-0" />
          {totalFound} unique leads found so far
        </div>
      )}
      <p className="text-xs text-slate-400 leading-relaxed">
        Scanning each neighbourhood separately for maximum coverage.<br />This takes 3–6 minutes.
      </p>
    </div>
  );
}

function ErrorState({ error }) {
  return (
    <div className="flex flex-col items-center py-14 gap-4 max-w-md mx-auto text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
        <AlertTriangle size={24} className="text-red-500" />
      </div>
      <div>
        <h3 className="text-base font-700 text-red-700">Something went wrong</h3>
        <p className="text-sm text-slate-500 mt-1">Check the details below and try again.</p>
      </div>
      <p className="text-xs bg-red-50 border border-red-100 rounded-xl p-3 text-red-700 text-left w-full leading-relaxed">{error}</p>
    </div>
  );
}

function SearchPageInner() {
  const { loading, error, leads, hasSearched, lastQuery, progress, suggestions, summary, summaryLoading, strategy, searchHistory, handleSearch } = useLeads();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") || "");
  const [category, setCategory] = useState("");

  const [countries, setCountries] = useState([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [country, setCountry] = useState("");

  const [states, setStates] = useState([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [stateCode, setStateCode] = useState("");

  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [city, setCity] = useState("");

  const ranInitialSearch = useRef(false);

  // Fetch countries once
  useEffect(() => {
    fetch("/api/geo/countries")
      .then((r) => r.json())
      .then((d) => setCountries(d.countries || []))
      .catch(() => {})
      .finally(() => setCountriesLoading(false));
  }, []);

  // Loads cities for a country (+ optional state), triggered from onChange handlers below
  async function loadCities(countryCode, stateIsoCode) {
    setCitiesLoading(true);
    try {
      const url = stateIsoCode
        ? `/api/geo/cities?country=${countryCode}&state=${stateIsoCode}`
        : `/api/geo/cities?country=${countryCode}`;
      const res = await fetch(url);
      const data = await res.json();
      setCities(data.cities || []);
    } catch {
      setCities([]);
    } finally {
      setCitiesLoading(false);
    }
  }

  // Fetch states for the chosen country; countries with no subdivisions fetch cities directly
  async function handleCountryChange(isoCode) {
    setCountry(isoCode);
    setStateCode("");
    setStates([]);
    setCity("");
    setCities([]);
    if (!isoCode) return;

    setStatesLoading(true);
    try {
      const res = await fetch(`/api/geo/states?country=${isoCode}`);
      const data = await res.json();
      setStates(data.states || []);
      if (!data.states || data.states.length === 0) {
        await loadCities(isoCode, "");
      }
    } catch {
      setStates([]);
    } finally {
      setStatesLoading(false);
    }
  }

  function handleStateChange(isoCode) {
    setStateCode(isoCode);
    setCity("");
    setCities([]);
    if (isoCode) loadCities(country, isoCode);
  }

  useEffect(() => {
    if (ranInitialSearch.current) return;
    ranInitialSearch.current = true;
    const q = searchParams.get("q");
    if (q) handleSearch(q);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function runScan() {
    const stateName = states.find((s) => s.isoCode === stateCode)?.name;
    const countryName = countries.find((c) => c.isoCode === country)?.name;
    const q = buildQuery(category, city, stateName, countryName);
    if (!q) return;
    setSearchQuery(q);
    handleSearch(q);
  }

  const totalLeads = leads.length;

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-800 text-slate-900">Search Leads</h1>
        <p className="text-sm text-slate-500 mt-1">
          Pick a category and city for a guided scan, or type a fully custom query below.
        </p>
      </div>

      {/* Structured filter row: Country -> State -> City -> Category (all fetched dynamically) */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl">
        <select
          value={country}
          onChange={(e) => handleCountryChange(e.target.value)}
          disabled={countriesLoading}
          className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <option value="">{countriesLoading ? "Loading countries…" : "Country…"}</option>
          {countries.map((c) => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
        </select>

        <select
          value={stateCode}
          onChange={(e) => handleStateChange(e.target.value)}
          disabled={!country || statesLoading || states.length === 0}
          className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <option value="">
            {statesLoading ? "Loading states…" : states.length === 0 ? "No states" : "State…"}
          </option>
          {states.map((s) => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
        </select>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={citiesLoading || cities.length === 0}
          className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <option value="">{citiesLoading ? "Loading cities…" : "City…"}</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
        >
          <option value="">Category…</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <button
          onClick={runScan}
          disabled={!category || !city || loading}
          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-700 transition-all duration-150 cursor-pointer active:scale-[0.97]"
        >
          <ScanLine size={13} />
          Scan for Leads
        </button>

        <span className="text-[11px] text-slate-400 ml-1">or use a custom query below ↓</span>
      </div>

      <SearchBar onSearch={handleSearch} loading={loading} value={searchQuery} onValueChange={setSearchQuery} />

      {loading && <LoadingProgress query={lastQuery} progress={progress} totalFound={totalLeads} strategy={strategy} />}

      {error && !loading && <ErrorState error={error} />}

      {!loading && !hasSearched && searchHistory.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <History size={13} className="text-slate-400" />
            <p className="text-xs font-600 text-slate-400 uppercase tracking-widest">Recent searches</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((h) => (
              <button
                key={h}
                onClick={() => { setSearchQuery(h); handleSearch(h); }}
                className="text-xs bg-white border border-slate-200 text-slate-600 px-3.5 py-1.5 rounded-full hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150 cursor-pointer active:scale-[0.97]"
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Sparkles size={13} className="text-violet-500" />
            <p className="text-xs font-600 text-slate-500 uppercase tracking-widest">AI — try these searches</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => { setSearchQuery(s); handleSearch(s); }}
                className="text-xs bg-white border border-violet-200 text-violet-700 px-3.5 py-1.5 rounded-full hover:bg-violet-50 hover:border-violet-300 transition-all duration-150 cursor-pointer active:scale-[0.97]"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {(summary || summaryLoading) && !loading && (
        <div className="bg-linear-to-r from-blue-50 to-violet-50 border border-blue-100 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
              <BrainCircuit size={14} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-700 text-blue-700 uppercase tracking-wide mb-1">AI Market Insight</p>
              {summaryLoading ? (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Loader2 size={12} className="animate-spin" /> Analysing {totalLeads} leads…
                </div>
              ) : (
                <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {hasSearched && totalLeads > 0 && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-emerald-700 font-600">
            {totalLeads} unique leads saved for &ldquo;{lastQuery}&rdquo;
          </p>
          <Link
            href="/leads"
            className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-white border border-emerald-200 text-emerald-700 text-xs font-700 hover:bg-emerald-100 transition-all duration-150"
          >
            View in My Leads <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {!loading && !error && hasSearched && totalLeads === 0 && (
        <div className="flex flex-col items-center py-16 gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-1">
            <MapPin size={22} className="text-slate-400" />
          </div>
          <h3 className="text-base font-700 text-slate-600">No results found</h3>
          <p className="text-sm text-slate-400">Try a different category or city.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageInner />
    </Suspense>
  );
}
