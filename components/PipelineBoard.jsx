"use client";

import { useState } from "react";
import { Phone, Globe, Star, GripVertical, X, Inbox } from "lucide-react";
import { useSaved, STATUSES } from "@/lib/savedLeads";

const COLUMN_STYLE = {
  New: { dot: "bg-blue-500", header: "text-blue-700 bg-blue-50 border-blue-100" },
  Contacted: { dot: "bg-amber-500", header: "text-amber-700 bg-amber-50 border-amber-100" },
  Closed: { dot: "bg-emerald-500", header: "text-emerald-700 bg-emerald-50 border-emerald-100" },
  Skip: { dot: "bg-slate-400", header: "text-slate-600 bg-slate-50 border-slate-100" },
};

function PipelineCard({ lead, dragging, onDragStart, onDragEnd, onMove }) {
  const { toggleSave } = useSaved();

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`
        group bg-white border border-slate-200 rounded-xl p-3 cursor-grab active:cursor-grabbing
        transition-all duration-150 hover:border-slate-300 hover:shadow-sm
        ${dragging ? "opacity-40" : ""}
      `}
    >
      <div className="flex items-start gap-2">
        <GripVertical size={13} className="text-slate-300 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-700 text-slate-800 leading-snug line-clamp-2">{lead.name}</p>
            <button
              onClick={() => toggleSave(lead)}
              title="Remove from saved"
              className="shrink-0 text-slate-300 hover:text-red-400 transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
            >
              <X size={13} />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {lead.score != null && (
              <span className="text-[10px] font-700 text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-full">
                {lead.score}/100
              </span>
            )}
            {lead.rating > 0 && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-600 text-amber-600">
                <Star size={9} className="fill-amber-400 text-amber-400" />
                {lead.rating}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 mt-1.5">
            {lead.formatted_phone_number && (
              <a href={`tel:${lead.formatted_phone_number}`} className="text-slate-400 hover:text-blue-600 transition-colors" title={lead.formatted_phone_number}>
                <Phone size={11} />
              </a>
            )}
            {lead.website && (
              <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors" title={lead.website}>
                <Globe size={11} />
              </a>
            )}
          </div>

          {/* Fallback move control — for touch devices without drag support */}
          <select
            value={lead.savedStatus || "New"}
            onChange={(e) => onMove(lead.place_id, e.target.value)}
            className="mt-2 w-full text-[10px] border border-slate-200 rounded-lg px-1.5 py-1 text-slate-500 bg-white focus:outline-none focus:ring-1 focus:ring-blue-300 cursor-pointer"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>Move to: {s}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default function PipelineBoard() {
  const { savedList, setStatus } = useSaved();
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  function handleDrop(status) {
    if (draggedId) setStatus(draggedId, status);
    setDraggedId(null);
    setDragOverCol(null);
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {STATUSES.map((status) => {
        const style = COLUMN_STYLE[status];
        const items = savedList.filter((l) => (l.savedStatus || "New") === status);
        const isDropTarget = dragOverCol === status;

        return (
          <div
            key={status}
            onDragOver={(e) => { e.preventDefault(); setDragOverCol(status); }}
            onDragLeave={() => setDragOverCol((c) => (c === status ? null : c))}
            onDrop={(e) => { e.preventDefault(); handleDrop(status); }}
            className={`
              flex flex-col gap-2 rounded-2xl border p-2.5 min-h-[160px] transition-colors
              ${isDropTarget ? "border-blue-300 bg-blue-50/40" : "border-slate-200 bg-slate-50/50"}
            `}
          >
            <div className={`flex items-center justify-between px-2 py-1.5 rounded-lg border ${style.header}`}>
              <span className="flex items-center gap-1.5 text-[11px] font-700">
                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                {status}
              </span>
              <span className="text-[10px] font-700 bg-white/70 px-1.5 py-0.5 rounded-full">
                {items.length}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center opacity-50">
                  <Inbox size={16} className="text-slate-400 mb-1" />
                  <p className="text-[10px] text-slate-400">No leads</p>
                </div>
              ) : (
                items.map((lead) => (
                  <PipelineCard
                    key={lead.place_id}
                    lead={lead}
                    dragging={draggedId === lead.place_id}
                    onDragStart={() => setDraggedId(lead.place_id)}
                    onDragEnd={() => { setDraggedId(null); setDragOverCol(null); }}
                    onMove={setStatus}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
