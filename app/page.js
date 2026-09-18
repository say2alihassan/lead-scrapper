"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MapPin, Zap, Target, TrendingUp, AlertTriangle, Loader2, Sparkles, BrainCircuit, History, Share2, Check } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import LeadTabs from "@/components/LeadTabs";
import ExportButton from "@/components/ExportButton";
import { useLocalStorage } from "@/lib/useLocalStorage";

const EXAMPLES = [
  "restaurants in Gulberg Lahore",
  "salons in Dubai",
  "gyms in Karachi",
  "dental clinics in London",
  "hotels in Bangkok",
  "retail shops in Islamabad",
];

const STATS = [
  { value: "35+", label: "areas per city" },
  { value: "1,000+", label: "leads per search" },
  { value: "AI", label: "area detection" },
];

function LoadingProgress({ query, progress, totalFound, strategy }) {
  const pct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;
  const areaLabel = progress.area === "base query"
    ? "base query"
    : progress.area
    ? `"${progress.area}"`
    : "…";

  return (
    <div className="flex flex-col items-center py-14 gap-5 max-w-sm mx-auto text-center">
      {/* Spinner */}
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
            {strategy.areas} areas detected in {strategy.city}
            {strategy.source === "ai" ? " (AI)" : ""}
          </p>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-500">
          <span className="truncate max-w-[180px]">Scanning {areaLabel}</span>
          <span className="font-700 text-slate-700 shrink-0 ml-2">{pct}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-1.5">
          {progress.done} / {progress.total} areas done
        </p>
      </div>

      {totalFound > 0 && (
        <div className="w-full bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 text-sm text-emerald-700 font-500 flex items-center gap-2">
          <TrendingUp size={14} className="shrink-0" />
          {totalFound} unique leads found — results loading below
        </div>
      )}

      <p className="text-xs text-slate-400 leading-relaxed">
        Scanning each neighbourhood separately for maximum coverage.
        <br />This takes 3–6 minutes.
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
      <p className="text-xs bg-red-50 border border-red-100 rounded-xl p-3 text-red-700 text-left w-full leading-relaxed">
        {error}
      </p>
      <p className="text-xs text-slate-400">
        Make sure your{" "}
        <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[11px]">GOOGLE_MAPS_API_KEY</code>{" "}
        is set in{" "}
        <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[11px]">.env.local</code>{" "}
        and the Places API is enabled.
      </p>
    </div>
  );
}

function WelcomeState({ onExampleClick }) {
  return (
    <div className="flex flex-col items-center py-16 gap-8 text-center max-w-2xl mx-auto">
      {/* Feature pills */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {[
          { icon: Zap, label: "35+ areas", sub: "per city", color: "bg-blue-50 text-blue-600 border-blue-100" },
          { icon: Target, label: "1,000+ leads", sub: "per search", color: "bg-violet-50 text-violet-600 border-violet-100" },
          { icon: TrendingUp, label: "Scored & ranked", sub: "pitch-ready", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
        ].map(({ icon: Icon, label, sub, color }) => (
          <div key={label} className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border ${color}`}>
            <Icon size={20} />
            <span className="text-xs font-700">{label}</span>
            <span className="text-[11px] opacity-70">{sub}</span>
          </div>
        ))}
      </div>

      {/* Example chips */}
      <div>
        <p className="text-xs font-600 text-slate-400 uppercase tracking-widest mb-3">
          Try an example
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => onExampleClick?.(ex)}
              className="
                text-xs bg-white border border-slate-200 text-slate-600
                px-3.5 py-1.5 rounded-full
                hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50
                transition-all duration-150 cursor-pointer
                active:scale-[0.97]
              "
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [leads, setLeads] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [progress, setProgress] = useState({ done: 0, total: 27, letter: "" });
  const [suggestions, setSuggestions] = useState([]);
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [strategy, setStrategy] = useState(null);

  // Search history — persisted in localStorage
  const [searchHistory, setSearchHistory] = useLocalStorage("search_history", []);
  // Cross-search dedup — persisted in localStorage
  const [globalSeenIds, setGlobalSeenIds] = useLocalStorage("global_seen_ids", []);
  // seenIds for current search (to badge "seen before")
  const seenIdsRef = useRef(new Set());

  const abortRef = useRef(null);
  const searchBarRef = useRef(null);

  // Auto-run search from ?q= URL param on mount
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearchQuery(q);
      handleSearch(q);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleShare() {
    const url = `${window.location.origin}${window.location.pathname}?q=${encodeURIComponent(lastQuery)}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSearch(query) {
    setSearchQuery(query);
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Update URL without navigation
    router.replace(`?q=${encodeURIComponent(query)}`, { scroll: false });

    // Save to history (max 10, deduped)
    setSearchHistory((prev) => {
      const filtered = prev.filter((h) => h !== query);
      return [query, ...filtered].slice(0, 10);
    });

    // Snapshot current global seen IDs before this search
    const prevSeenSet = new Set(globalSeenIds);
    seenIdsRef.current = prevSeenSet;

    setLoading(true);
    setError(null);
    setLeads([]);
    setHasSearched(false);
    setLastQuery(query);
    setProgress({ done: 0, total: 0, area: "" });
    setSuggestions([]);
    setSummary("");
    setStrategy(null);

    // Fetch AI query suggestions in parallel with the scrape
    fetch("/api/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })
      .then((r) => r.json())
      .then((d) => { if (d.suggestions) setSuggestions(d.suggestions); })
      .catch(() => {});

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch leads");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        if (controller.signal.aborted) break;

        const { done, value } = await reader.read();
        if (done) break;

        if (controller.signal.aborted) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const msg = JSON.parse(line.slice(6));
            if (msg.type === "status") {
              setProgress((p) => ({ ...p, area: msg.message }));
            } else if (msg.type === "strategy") {
              setStrategy({ city: msg.city, areas: msg.areas, source: msg.source });
              setProgress((p) => ({ ...p, total: msg.areas + 1 }));
            } else if (msg.type === "progress") {
              setProgress({ done: msg.done, total: msg.total, area: msg.area });
            } else if (msg.type === "leads") {
              setLeads((prev) => [...prev, ...msg.leads].sort((a, b) => b.score - a.score));
              setHasSearched(true);
              setGlobalSeenIds((prev) => {
                const next = new Set(prev);
                msg.leads.forEach((l) => l.place_id && next.add(l.place_id));
                return [...next];
              });
            } else if (msg.type === "done") {
              setHasSearched(true);
              setLeads((currentLeads) => {
                if (currentLeads.length > 0 && !controller.signal.aborted) {
                  setSummaryLoading(true);
                  fetch("/api/summary", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ query, leads: currentLeads }),
                  })
                    .then((r) => r.json())
                    .then((d) => { if (d.summary) setSummary(d.summary); })
                    .catch(() => {})
                    .finally(() => setSummaryLoading(false));
                }
                return currentLeads;
              });
            } else if (msg.type === "error") {
              throw new Error(msg.message);
            }
          } catch (parseErr) {
            if (!(parseErr instanceof SyntaxError)) throw parseErr;
          }
        }
      }
    } catch (err) {
      if (err.name !== "AbortError" && !controller.signal.aborted) setError(err.message);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }

  const totalLeads = leads.length;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0F172A]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
              <Target size={14} className="text-white" />
            </div>
            <span className="text-white font-800 text-base tracking-tight">LeadScraper</span>
          </div>
          <span className="text-xs text-slate-500 hidden sm:block font-500">
            Powered by Google Maps Places API
          </span>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-linear-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] px-5 pt-14 pb-16">

        {/* Ambient glow */}
        <div className="absolute top-14 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-blue-500/10 blur-[80px] pointer-events-none rounded-full" />

        <div className="relative max-w-4xl mx-auto flex flex-col items-center gap-5 text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-600 px-3.5 py-1.5 rounded-full">
            <Zap size={11} />
            Area-based scanning · 1,000+ leads per city
          </div>

          <h1 className="text-3xl sm:text-5xl font-800 text-white leading-[1.1] tracking-tight max-w-3xl">
            Find Business Leads{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-sky-300">
              At Scale
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-lg leading-relaxed">
            We scan every neighbourhood in a city separately — 35+ area sub-queries — to surface 500–2,000+ unique leads from Google Maps, scored and pitch-ready.
          </p>

          <SearchBar onSearch={handleSearch} loading={loading} value={searchQuery} onValueChange={setSearchQuery} />

          {/* Stats */}
          <div className="flex items-center gap-6 mt-2">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-white font-800 text-lg leading-none">{value}</div>
                <div className="text-slate-500 text-xs mt-0.5 font-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Results area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Results header */}
        {(hasSearched || loading) && !error && totalLeads > 0 && (
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3 animate-fade-slide-up">
            <div>
              <h2 className="text-lg font-700 text-slate-800 flex items-center gap-2">
                {totalLeads} unique leads
                {loading && (
                  <span className="inline-flex items-center gap-1 text-xs font-500 text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                    <Loader2 size={10} className="animate-spin" />
                    scanning…
                  </span>
                )}
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">for &ldquo;{lastQuery}&rdquo;</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 h-10 px-4 bg-white border border-slate-200 text-slate-600 text-sm font-600 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-150 cursor-pointer active:scale-[0.97]"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
                {copied ? "Copied!" : "Share"}
              </button>
              <ExportButton leads={leads} />
            </div>
          </div>
        )}

        {/* Loading progress */}
        {loading && (
          <LoadingProgress query={lastQuery} progress={progress} totalFound={totalLeads} strategy={strategy} />
        )}

        {/* Error */}
        {error && !loading && <ErrorState error={error} />}

        {/* Search history */}
        {!loading && !hasSearched && searchHistory.length > 0 && (
          <div className="mb-6 animate-fade-slide-up">
            <div className="flex items-center gap-2 mb-2.5">
              <History size={13} className="text-slate-400" />
              <p className="text-xs font-600 text-slate-400 uppercase tracking-widest">Recent searches</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((h) => (
                <button
                  key={h}
                  onClick={() => handleSearch(h)}
                  className="text-xs bg-white border border-slate-200 text-slate-600 px-3.5 py-1.5 rounded-full hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150 cursor-pointer active:scale-[0.97]"
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Welcome */}
        {!loading && !error && !hasSearched && (
          <WelcomeState onExampleClick={handleSearch} />
        )}

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <div className="mb-6 animate-fade-slide-up">
            <div className="flex items-center gap-2 mb-2.5">
              <Sparkles size={13} className="text-violet-500" />
              <p className="text-xs font-600 text-slate-500 uppercase tracking-widest">AI — try these searches</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSearch(s)}
                  className="text-xs bg-white border border-violet-200 text-violet-700 px-3.5 py-1.5 rounded-full hover:bg-violet-50 hover:border-violet-300 transition-all duration-150 cursor-pointer active:scale-[0.97]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* AI Market Summary */}
        {(summary || summaryLoading) && !loading && (
          <div className="mb-6 bg-linear-to-r from-blue-50 to-violet-50 border border-blue-100 rounded-2xl p-4 animate-fade-slide-up">
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

        {/* Live results grid */}
        {hasSearched && totalLeads > 0 && (
          <div className={loading ? "opacity-95 mt-4" : ""}>
            <LeadTabs leads={leads} query={lastQuery} seenIds={seenIdsRef.current} />
          </div>
        )}

        {/* Zero results */}
        {!loading && !error && hasSearched && totalLeads === 0 && (
          <div className="flex flex-col items-center py-16 gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-1">
              <MapPin size={22} className="text-slate-400" />
            </div>
            <h3 className="text-base font-700 text-slate-600">No results found</h3>
            <p className="text-sm text-slate-400">
              Try: restaurants in Dubai, salons in Karachi, gyms in London
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-blue-500 flex items-center justify-center">
              <Target size={11} className="text-white" />
            </div>
            <span className="text-xs font-600 text-slate-500">LeadScraper</span>
          </div>
          <p className="text-xs text-slate-400">
            Data sourced from Google Maps Places API
          </p>
        </div>
      </footer>
    </div>
  );
}

import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <HomePage />
    </Suspense>
  );
}
