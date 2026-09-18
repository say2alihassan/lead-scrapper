"use client";

import { useState } from "react";
import { Phone, Globe, MapPin, Map, Star, TrendingUp, Lightbulb, Mail, Copy, Check, Loader2, X, Sparkles, CalendarCheck, Info, ExternalLink, AtSign, Share2, Bookmark, BookmarkCheck } from "lucide-react";
import { useSaved, STATUSES } from "@/lib/savedLeads";

const VERDICT = {
  STRONG: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-200",
    bar: "score-bar-strong",
    glow: "hover:ring-2 hover:ring-emerald-200/60",
  },
  MAYBE: {
    badge: "bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-200",
    bar: "score-bar-maybe",
    glow: "hover:ring-2 hover:ring-amber-200/60",
  },
  SKIP: {
    badge: "bg-slate-100 text-slate-500 border-slate-200",
    bar: "score-bar-skip",
    glow: "",
  },
};

function StarRating({ rating }) {
  if (!rating) return null;
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400 text-xs">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={11}
          className={
            i < full
              ? "fill-amber-400 text-amber-400"
              : i === full && half
              ? "fill-amber-200 text-amber-400"
              : "fill-none text-slate-300"
          }
        />
      ))}
    </span>
  );
}

function PitchModal({ email, onClose }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <Mail size={14} className="text-blue-500" />
            </div>
            <h3 className="text-sm font-700 text-slate-800">AI Pitch Email</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{email}</p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-600 transition-all duration-150 cursor-pointer active:scale-[0.98]"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
          {copied ? "Copied!" : "Copy to Clipboard"}
        </button>
      </div>
    </div>
  );
}

export default function LeadCard({ lead, query, seenBefore }) {
  const cfg = VERDICT[lead.verdict] || VERDICT.SKIP;
  const { toggleSave, isSaved, setStatus, saved } = useSaved();
  const savedEntry = saved[lead.place_id];
  const isBookmarked = isSaved(lead.place_id);
  const [pitchState, setPitchState] = useState("idle"); // idle | loading | done | error
  const [pitchEmail, setPitchEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [enrichState, setEnrichState] = useState("idle"); // idle | loading | done | error
  const [enrichData, setEnrichData] = useState(null);

  async function handleEnrich() {
    setEnrichState("loading");
    try {
      const res = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website: lead.website }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEnrichData(data);
      setEnrichState("done");
    } catch {
      setEnrichState("error");
      setTimeout(() => setEnrichState("idle"), 3000);
    }
  }

  async function handleGeneratePitch() {
    setPitchState("loading");
    try {
      const res = await fetch("/api/pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead, query }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPitchEmail(data.email);
      setPitchState("done");
      setShowModal(true);
    } catch {
      setPitchState("error");
      setTimeout(() => setPitchState("idle"), 3000);
    }
  }

  return (
    <>
      {showModal && pitchEmail && (
        <PitchModal email={pitchEmail} onClose={() => setShowModal(false)} />
      )}

      <article
        className={`
          group flex flex-col
          bg-white border border-slate-100
          rounded-2xl overflow-hidden
          card-lift ${cfg.glow}
          transition-all duration-200
        `}
      >
        {/* Top accent strip */}
        <div className={`h-1 w-full ${cfg.bar}`} />

        <div className="flex flex-col gap-4 p-5 flex-1">

          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-700 text-slate-900 leading-snug line-clamp-2">
                {lead.name}
              </h3>
              {seenBefore && (
                <span className="inline-block mt-1 text-[10px] font-600 text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  Seen in previous search
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => toggleSave(lead)}
                title={isBookmarked ? "Remove from saved" : "Save lead"}
                className="cursor-pointer text-slate-300 hover:text-amber-400 transition-colors"
              >
                {isBookmarked
                  ? <BookmarkCheck size={16} className="text-amber-400" />
                  : <Bookmark size={16} />
                }
              </button>
              <span className={`text-[10px] font-700 tracking-wide uppercase px-2.5 py-1 rounded-full border ${cfg.badge}`}>
                {lead.verdict}
              </span>
            </div>
          </div>

          {/* Status dropdown — only when saved */}
          {isBookmarked && (
            <select
              value={savedEntry?.savedStatus || "New"}
              onChange={(e) => setStatus(lead.place_id, e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}

          {/* Rating row */}
          {(lead.rating || lead.user_ratings_total > 0) && (
            <div className="flex items-center gap-2">
              <StarRating rating={lead.rating} />
              {lead.rating && (
                <span className="text-xs font-600 text-slate-700">{lead.rating}</span>
              )}
              {lead.user_ratings_total > 0 && (
                <span className="text-xs text-slate-400">
                  ({lead.user_ratings_total.toLocaleString()} reviews)
                </span>
              )}
            </div>
          )}

          {/* Score bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1 text-slate-500 font-500">
                <TrendingUp size={11} />
                Lead Score
              </span>
              <span className="font-700 text-slate-800">{lead.score}<span className="text-slate-400 font-400">/100</span></span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${cfg.bar}`}
                style={{ width: `${lead.score}%` }}
              />
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-2">
            {lead.formatted_phone_number && (
              <a
                href={`tel:${lead.formatted_phone_number}`}
                className="flex items-center gap-2.5 text-xs text-slate-600 hover:text-blue-600 transition-colors cursor-pointer group/link"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-50 group-hover/link:bg-blue-100 transition-colors">
                  <Phone size={11} className="text-blue-500" />
                </span>
                <span className="font-500">{lead.formatted_phone_number}</span>
              </a>
            )}
            {lead.website && (
              <a
                href={lead.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-xs text-slate-600 hover:text-blue-600 transition-colors cursor-pointer group/link min-w-0"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-violet-50 group-hover/link:bg-violet-100 transition-colors shrink-0">
                  <Globe size={11} className="text-violet-500" />
                </span>
                <span className="truncate font-500">
                  {lead.website.replace(/^https?:\/\/(www\.)?/, "")}
                </span>
              </a>
            )}
            {lead.formatted_address && (
              <div className="flex items-start gap-2.5 text-xs text-slate-500">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-50 shrink-0 mt-0.5">
                  <MapPin size={11} className="text-slate-400" />
                </span>
                <span className="leading-snug">{lead.formatted_address}</span>
              </div>
            )}
          </div>

          {/* Pitch angle */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <Lightbulb size={13} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 leading-relaxed">
                <span className="font-600">Pitch: </span>
                {lead.pitchAngle}
              </p>
            </div>
          </div>

          {/* Enriched data panel */}
          {enrichState === "done" && enrichData && (
            <div className="bg-violet-50/70 border border-violet-100 rounded-xl p-3 space-y-2">
              <p className="text-[10px] font-700 text-violet-500 uppercase tracking-wide flex items-center gap-1">
                <Sparkles size={10} /> AI Enriched
              </p>
              {enrichData.description && (
                <p className="text-xs text-slate-600 leading-relaxed">{enrichData.description}</p>
              )}
              <div className="space-y-1.5">
                {enrichData.owner_name && (
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <Info size={11} className="text-violet-400 shrink-0" />
                    <span className="font-500">{enrichData.owner_name}</span>
                  </div>
                )}
                {enrichData.email && (
                  <a href={`mailto:${enrichData.email}`} className="flex items-center gap-2 text-xs text-violet-700 hover:underline">
                    <Mail size={11} className="shrink-0" />
                    <span className="truncate">{enrichData.email}</span>
                  </a>
                )}
                {enrichData.phone && (
                  <a href={`tel:${enrichData.phone}`} className="flex items-center gap-2 text-xs text-slate-600">
                    <Phone size={11} className="shrink-0" />
                    <span>{enrichData.phone}</span>
                  </a>
                )}
                <div className="flex items-center gap-2 flex-wrap pt-0.5">
                  {enrichData.instagram && (
                    <a href={enrichData.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full hover:bg-pink-100">
                      <AtSign size={9} /> Instagram
                    </a>
                  )}
                  {enrichData.facebook && (
                    <a href={enrichData.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full hover:bg-blue-100">
                      <Share2 size={9} /> Facebook
                    </a>
                  )}
                  {enrichData.twitter && (
                    <a href={enrichData.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full hover:bg-sky-100">
                      <AtSign size={9} /> Twitter/X
                    </a>
                  )}
                  {enrichData.linkedin && (
                    <a href={enrichData.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full hover:bg-blue-100">
                      <ExternalLink size={9} /> LinkedIn
                    </a>
                  )}
                </div>
                {enrichData.has_booking !== undefined && (
                  <div className={`flex items-center gap-1.5 text-[10px] font-600 ${enrichData.has_booking ? "text-emerald-600" : "text-orange-600"}`}>
                    <CalendarCheck size={10} />
                    {enrichData.has_booking ? "Has online booking" : "No booking system — pitch opportunity"}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-auto flex flex-col gap-2">
           <div className="flex gap-2">
            {lead.url && (
              <a
                href={lead.url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex-1 flex items-center justify-center gap-2
                  h-9 rounded-xl
                  border border-slate-200 bg-white
                  text-xs font-600 text-slate-600
                  hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300
                  transition-all duration-150
                  cursor-pointer active:scale-[0.98]
                "
              >
                <Map size={13} />
                Maps
              </a>
            )}

            <button
              onClick={pitchState === "done" ? () => setShowModal(true) : handleGeneratePitch}
              disabled={pitchState === "loading"}
              className={`
                flex-1 flex items-center justify-center gap-2
                h-9 rounded-xl text-xs font-600
                transition-all duration-150 cursor-pointer active:scale-[0.98]
                disabled:cursor-not-allowed disabled:opacity-60
                ${pitchState === "error"
                  ? "bg-red-50 border border-red-200 text-red-600"
                  : pitchState === "done"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-200"
                }
              `}
            >
              {pitchState === "loading" && <Loader2 size={13} className="animate-spin" />}
              {pitchState === "done" && <Mail size={13} />}
              {pitchState === "error" && <X size={13} />}
              {pitchState === "idle" && <Mail size={13} />}
              {pitchState === "loading" ? "Writing…" : pitchState === "done" ? "View Email" : pitchState === "error" ? "Failed" : "AI Pitch"}
            </button>
           </div>

            {lead.website && (
              <button
                onClick={enrichState === "done" ? () => {} : handleEnrich}
                disabled={enrichState === "loading" || enrichState === "done"}
                title="Enrich lead with AI — finds email, socials, booking info"
                className={`
                  w-full flex items-center justify-center gap-2
                  h-9 px-3 rounded-xl text-xs font-600
                  transition-all duration-150 cursor-pointer active:scale-[0.98]
                  disabled:cursor-not-allowed
                  ${enrichState === "error"
                    ? "bg-red-50 border border-red-200 text-red-600"
                    : enrichState === "done"
                    ? "bg-violet-100 border border-violet-200 text-violet-700 opacity-60"
                    : "bg-violet-50 border border-violet-200 text-violet-700 hover:bg-violet-100"
                  }
                `}
              >
                {enrichState === "loading"
                  ? <Loader2 size={13} className="animate-spin" />
                  : enrichState === "error"
                  ? <X size={13} />
                  : <Sparkles size={13} />
                }
                {enrichState === "loading" ? "Enriching…" : enrichState === "done" ? "Enriched" : enrichState === "error" ? "Failed" : "Find Email & Socials"}
              </button>
            )}
          </div>
        </div>
      </article>
    </>
  );
}
