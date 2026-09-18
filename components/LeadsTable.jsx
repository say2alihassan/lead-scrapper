"use client";

import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight, Bookmark, BookmarkCheck } from "lucide-react";
import LeadCard from "./LeadCard";
import { useSaved } from "@/lib/savedLeads";

const CATEGORY_LABELS = {
  no_presence: "No Digital Presence",
  app_dev: "App Dev Lead",
  seo_ads: "SEO / Ads Lead",
  social_media: "Social Media Lead",
  reputation: "Reputation Mgmt",
  high_value: "High Value",
  newly_opened: "Newly Opened",
  at_risk: "Closed / At Risk",
};

const VERDICT_BADGE = {
  STRONG: "bg-emerald-50 text-emerald-700",
  MAYBE: "bg-amber-50 text-amber-700",
  SKIP: "bg-slate-100 text-slate-500",
};

export default function LeadsTable({ leads, query, seenIds }) {
  const [expandedId, setExpandedId] = useState(null);
  const { toggleSave, isSaved } = useSaved();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <p className="text-xs font-700 text-slate-600">{leads.length} results</p>
        <p className="text-[11px] text-slate-400">Click any row to view details</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[720px]">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-700 text-slate-400 uppercase tracking-wide">
              <th className="w-8 px-4 py-2.5"></th>
              <th className="px-2 py-2.5">Business</th>
              <th className="px-2 py-2.5">Category</th>
              <th className="px-2 py-2.5">Location</th>
              <th className="px-2 py-2.5">Website</th>
              <th className="px-2 py-2.5">Score</th>
              <th className="w-10 px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, i) => {
              const id = lead.place_id || i;
              const expanded = expandedId === id;
              const bookmarked = isSaved(lead.place_id);

              return (
                <Fragment key={id}>
                  <tr
                    onClick={() => setExpandedId(expanded ? null : id)}
                    className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-300">
                      {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </td>
                    <td className="px-2 py-3">
                      <p className="text-sm font-600 text-slate-800 leading-snug">{lead.name}</p>
                      {lead.formatted_phone_number && (
                        <p className="text-xs text-slate-400 mt-0.5">{lead.formatted_phone_number}</p>
                      )}
                    </td>
                    <td className="px-2 py-3">
                      <span className="text-[11px] text-slate-500">{CATEGORY_LABELS[lead.category] || lead.category}</span>
                    </td>
                    <td className="px-2 py-3">
                      <span className="text-[11px] text-slate-500 line-clamp-1 max-w-[200px] block">{lead.formatted_address || "—"}</span>
                    </td>
                    <td className="px-2 py-3">
                      <span className={`text-[10px] font-700 px-2 py-1 rounded-full whitespace-nowrap ${lead.website ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                        {lead.website ? "Has Website" : "No Website"}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <span className={`text-[11px] font-700 px-2 py-1 rounded-full ${VERDICT_BADGE[lead.verdict] || VERDICT_BADGE.SKIP}`}>
                        {lead.score}/100
                      </span>
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleSave(lead)}
                        title={bookmarked ? "Remove from saved" : "Save lead"}
                        className="text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        {bookmarked ? <BookmarkCheck size={15} className="text-amber-400" /> : <Bookmark size={15} />}
                      </button>
                    </td>
                  </tr>
                  {expanded && (
                    <tr>
                      <td colSpan={7} className="bg-slate-50/70 p-4">
                        <div className="max-w-md">
                          <LeadCard lead={lead} query={query} seenBefore={seenIds?.has(lead.place_id)} />
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
