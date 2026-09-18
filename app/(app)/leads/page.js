"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight, Table2, LayoutGrid } from "lucide-react";
import LeadTabs from "@/components/LeadTabs";
import LeadsTable from "@/components/LeadsTable";
import ExportButton from "@/components/ExportButton";
import { useLeads } from "@/lib/leadsStore";

export default function MyLeadsPage() {
  const { leads, lastQuery, seenIds } = useLeads();
  const [view, setView] = useState("table"); // table | cards

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-xl font-800 text-slate-900">My Leads</h1>
          <p className="text-sm text-slate-500 mt-1">
            {leads.length > 0 ? `${leads.length} leads discovered${lastQuery ? ` for "${lastQuery}"` : ""}` : "Leads you've discovered will show up here"}
          </p>
        </div>
        {leads.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setView("table")}
                className={`flex items-center gap-1.5 text-[11px] font-600 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  view === "table" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Table2 size={12} /> Table
              </button>
              <button
                onClick={() => setView("cards")}
                className={`flex items-center gap-1.5 text-[11px] font-600 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  view === "cards" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <LayoutGrid size={12} /> Cards
              </button>
            </div>
            <ExportButton leads={leads} />
          </div>
        )}
      </div>

      {leads.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
            <Search size={22} className="text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-600 text-slate-600">No leads yet</p>
            <p className="text-xs text-slate-400 mt-1">Run a search to start discovering businesses</p>
          </div>
          <Link
            href="/search"
            className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-600 transition-all duration-150"
          >
            Search Leads <ArrowRight size={14} />
          </Link>
        </div>
      ) : view === "table" ? (
        <LeadsTable leads={leads} query={lastQuery} seenIds={seenIds} />
      ) : (
        <LeadTabs leads={leads} query={lastQuery} seenIds={seenIds} />
      )}
    </div>
  );
}
