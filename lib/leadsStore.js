"use client";

import { createContext, useContext, useRef, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

const LeadsContext = createContext(null);

export function LeadsProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [leads, setLeads] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [progress, setProgress] = useState({ done: 0, total: 0, area: "" });
  const [suggestions, setSuggestions] = useState([]);
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [strategy, setStrategy] = useState(null);
  const [seenIds, setSeenIds] = useState(new Set());

  const [searchHistory, setSearchHistory] = useLocalStorage("search_history", []);
  const [globalSeenIds, setGlobalSeenIds] = useLocalStorage("global_seen_ids", []);
  const abortRef = useRef(null);

  async function handleSearch(query) {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setSearchHistory((prev) => {
      const filtered = prev.filter((h) => h !== query);
      return [query, ...filtered].slice(0, 10);
    });

    const prevSeenSet = new Set(globalSeenIds);
    setSeenIds(prevSeenSet);

    setLoading(true);
    setError(null);
    setLeads([]);
    setHasSearched(false);
    setLastQuery(query);
    setProgress({ done: 0, total: 0, area: "" });
    setSuggestions([]);
    setSummary("");
    setStrategy(null);

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

  const value = {
    loading, error, leads, hasSearched, lastQuery, progress,
    suggestions, summary, summaryLoading, strategy, searchHistory,
    seenIds, handleSearch,
  };

  return <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>;
}

export function useLeads() {
  return useContext(LeadsContext);
}
