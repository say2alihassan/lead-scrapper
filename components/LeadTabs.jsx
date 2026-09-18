"use client";

import { useState } from "react";
import {
  Globe,
  Smartphone,
  TrendingUp,
  Share2,
  Star,
  Zap,
  Sparkles,
  AlertTriangle,
  SearchX,
  Bookmark,
} from "lucide-react";
import LeadCard from "./LeadCard";
import FilterBar, { DEFAULT_FILTERS, applyFilters } from "./FilterBar";
import { useSaved, STATUSES } from "@/lib/savedLeads";

const TABS = [
  {
    id: "no_presence",
    label: "No Digital Presence",
    icon: Globe,
    description: "No website at all — hottest prospects",
    accent: { text: "text-rose-600", badge: "bg-rose-100 text-rose-700", bar: "bg-rose-500", border: "border-rose-500" },
  },
  {
    id: "app_dev",
    label: "App Dev Leads",
    icon: Smartphone,
    description: "Has website, ready for a mobile app",
    accent: { text: "text-blue-600", badge: "bg-blue-100 text-blue-700", bar: "bg-blue-600", border: "border-blue-600" },
  },
  {
    id: "seo_ads",
    label: "SEO / Ads Leads",
    icon: TrendingUp,
    description: "Low visibility — need search & ads",
    accent: { text: "text-amber-600", badge: "bg-amber-100 text-amber-700", bar: "bg-amber-500", border: "border-amber-500" },
  },
  {
    id: "social_media",
    label: "Social Media Leads",
    icon: Share2,
    description: "Weak online engagement",
    accent: { text: "text-violet-600", badge: "bg-violet-100 text-violet-700", bar: "bg-violet-500", border: "border-violet-500" },
  },
  {
    id: "reputation",
    label: "Reputation Mgmt",
    icon: Star,
    description: "Poor rating — needs review rescue",
    accent: { text: "text-orange-600", badge: "bg-orange-100 text-orange-700", bar: "bg-orange-500", border: "border-orange-500" },
  },
  {
    id: "high_value",
    label: "High Value",
    icon: Zap,
    description: "500+ reviews, strong presence",
    accent: { text: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700", bar: "bg-emerald-600", border: "border-emerald-600" },
  },
  {
    id: "newly_opened",
    label: "Newly Opened",
    icon: Sparkles,
    description: "Brand new — need launch package",
    accent: { text: "text-sky-600", badge: "bg-sky-100 text-sky-700", bar: "bg-sky-500", border: "border-sky-500" },
  },
  {
    id: "at_risk",
    label: "Closed / At Risk",
    icon: AlertTriangle,
    description: "Temporarily closed or inactive",
    accent: { text: "text-slate-500", badge: "bg-slate-100 text-slate-600", bar: "bg-slate-400", border: "border-slate-400" },
  },
];

function EmptyState({ description }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <SearchX size={24} className="text-slate-400" />
      </div>
      <p className="text-sm font-600 text-slate-600">No leads in this category</p>
      <p className="text-xs text-slate-400 mt-1">{description}</p>
    </div>
  );
}

export default function LeadTabs({ leads, query, seenIds }) {
  const [active, setActive] = useState("no_presence");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { savedList, setStatus } = useSaved();

  const ALL_TABS = [
    ...TABS,
    {
      id: "saved",
      label: "Saved Leads",
      icon: Bookmark,
      description: "Your bookmarked leads",
      accent: { text: "text-amber-600", badge: "bg-amber-100 text-amber-700", bar: "bg-amber-500", border: "border-amber-500" },
    },
  ];

  const byCategory = {};
  for (const tab of TABS) {
    byCategory[tab.id] = leads.filter((l) => l.category === tab.id);
  }
  byCategory["saved"] = savedList;

  const activeTab = ALL_TABS.find((t) => t.id === active);
  const rawLeads = byCategory[active] || [];
  const activeLeads = active === "saved" ? rawLeads : applyFilters(rawLeads, filters);

  return (
    <div className="w-full">
      {/* Scrollable tab bar */}
      <div className="overflow-x-auto -mx-1 px-1">
        <div className="flex items-end gap-0.5 border-b border-slate-200 mb-6 min-w-max">
          {ALL_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            const count = byCategory[tab.id]?.length || 0;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`
                  relative flex items-center gap-1.5 px-3.5 py-3 text-xs font-600
                  transition-colors duration-150 cursor-pointer whitespace-nowrap
                  ${isActive ? tab.accent.text : "text-slate-500 hover:text-slate-700"}
                `}
              >
                <Icon size={13} />
                {tab.label}
                <span className={`text-[10px] font-700 px-1.5 py-0.5 rounded-full ${isActive ? tab.accent.badge : "bg-slate-100 text-slate-500"}`}>
                  {count}
                </span>
                {isActive && (
                  <span className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full ${tab.accent.bar}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter bar — not shown on saved tab */}
      {active !== "saved" && rawLeads.length > 0 && (
        <FilterBar
          filters={filters}
          onChange={setFilters}
          totalBefore={rawLeads.length}
          totalAfter={activeLeads.length}
        />
      )}

      {/* Saved tab status filter */}
      {active === "saved" && savedList.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {STATUSES.map((s) => (
            <span key={s} className="text-[11px] font-600 text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {s}: {savedList.filter((l) => l.savedStatus === s).length}
            </span>
          ))}
        </div>
      )}

      {/* Active tab description */}
      {activeLeads.length > 0 && (
        <p className="text-xs text-slate-400 mb-4 -mt-2">{activeTab?.description}</p>
      )}

      {/* Grid */}
      {activeLeads.length === 0 ? (
        <EmptyState description={activeTab?.description || "Try a different search query"} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {activeLeads.map((lead, i) => (
            <div
              key={lead.place_id || i}
              className="animate-fade-slide-up"
              style={{ animationDelay: `${Math.min(i * 30, 300)}ms`, opacity: 0 }}
            >
              <LeadCard
                lead={lead}
                query={query}
                seenBefore={seenIds?.has(lead.place_id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
