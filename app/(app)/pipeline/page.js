"use client";

import { Inbox } from "lucide-react";
import PipelineBoard from "@/components/PipelineBoard";
import { useSaved } from "@/lib/savedLeads";

export default function PipelinePage() {
  const { savedList } = useSaved();

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-800 text-slate-900">Pipeline</h1>
        <p className="text-sm text-slate-500 mt-1">Drag saved leads between stages as you work them.</p>
      </div>

      {savedList.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
            <Inbox size={22} className="text-slate-400" />
          </div>
          <p className="text-sm font-600 text-slate-600">No leads in your pipeline yet</p>
          <p className="text-xs text-slate-400">Bookmark leads from My Leads to start building it</p>
        </div>
      ) : (
        <PipelineBoard />
      )}
    </div>
  );
}
