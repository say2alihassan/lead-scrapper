"use client";

import Link from "next/link";
import { Search, Users, Bookmark, PhoneCall, CheckCircle2, ArrowRight, History } from "lucide-react";
import { useLeads } from "@/lib/leadsStore";
import { useSaved, STATUSES } from "@/lib/savedLeads";

const STATUS_ACCENT = {
  New: "text-blue-600 bg-blue-50",
  Contacted: "text-amber-600 bg-amber-50",
  Closed: "text-emerald-600 bg-emerald-50",
  Skip: "text-slate-500 bg-slate-100",
};

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
        <Icon size={17} />
      </div>
      <div>
        <p className="text-lg font-800 text-slate-900 leading-none">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { leads, lastQuery, searchHistory } = useLeads();
  const { savedList } = useSaved();

  const closed = savedList.filter((l) => l.savedStatus === "Closed").length;
  const contacted = savedList.filter((l) => l.savedStatus === "Contacted").length;

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-800 text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">A quick overview of where things stand.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Search} label="Leads found (last search)" value={leads.length} accent="text-blue-600 bg-blue-50" />
        <StatCard icon={Bookmark} label="Saved to pipeline" value={savedList.length} accent="text-amber-600 bg-amber-50" />
        <StatCard icon={PhoneCall} label="Contacted" value={contacted} accent="text-violet-600 bg-violet-50" />
        <StatCard icon={CheckCircle2} label="Closed" value={closed} accent="text-emerald-600 bg-emerald-50" />
      </div>

      {/* Pipeline breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-700 text-slate-800">Pipeline breakdown</h2>
          <Link href="/pipeline" className="flex items-center gap-1 text-xs font-600 text-blue-600 hover:text-blue-700">
            Open pipeline <ArrowRight size={12} />
          </Link>
        </div>
        {savedList.length === 0 ? (
          <p className="text-xs text-slate-400">No saved leads yet — bookmark leads from My Leads to see them here.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {STATUSES.map((s) => (
              <div key={s} className={`rounded-xl px-3 py-2.5 ${STATUS_ACCENT[s]}`}>
                <p className="text-lg font-800 leading-none">{savedList.filter((l) => l.savedStatus === s).length}</p>
                <p className="text-[11px] font-600 mt-0.5">{s}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent searches + quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <History size={13} className="text-slate-400" />
            <h2 className="text-sm font-700 text-slate-800">Recent searches</h2>
          </div>
          {searchHistory.length === 0 ? (
            <p className="text-xs text-slate-400">No searches yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {searchHistory.slice(0, 8).map((h) => (
                <Link
                  key={h}
                  href={`/search?q=${encodeURIComponent(h)}`}
                  className="text-xs bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150"
                >
                  {h}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-2.5">
          <div className="flex items-center gap-2 mb-1">
            <Users size={13} className="text-slate-400" />
            <h2 className="text-sm font-700 text-slate-800">Quick actions</h2>
          </div>
          <Link href="/search" className="flex items-center justify-between h-10 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-700 transition-all duration-150">
            Search Leads <ArrowRight size={13} />
          </Link>
          <Link href="/leads" className="flex items-center justify-between h-10 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-700 transition-all duration-150">
            Browse My Leads{lastQuery ? ` (${leads.length})` : ""} <ArrowRight size={13} />
          </Link>
          <Link href="/eod-sales" className="flex items-center justify-between h-10 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-700 transition-all duration-150">
            Log a sale <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
