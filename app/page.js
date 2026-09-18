"use client";

import Link from "next/link";
import { Target, Zap, TrendingUp, MapPin, Columns3 } from "lucide-react";

const FEATURES = [
  { icon: Zap, label: "35+ areas per city", sub: "AI-powered area scanning", color: "bg-blue-50 text-blue-600 border-blue-100" },
  { icon: MapPin, label: "1,000+ leads per search", sub: "Google Maps sourced", color: "bg-violet-50 text-violet-600 border-violet-100" },
  { icon: TrendingUp, label: "Scored & pitch-ready", sub: "AI cold emails included", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { icon: Columns3, label: "Kanban pipeline", sub: "Track every lead to close", color: "bg-amber-50 text-amber-600 border-amber-100" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0F172A]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
              <Target size={14} className="text-white" />
            </div>
            <span className="text-white font-800 text-base tracking-tight">LeadScraper</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-xs font-600 text-slate-300 hover:text-white px-3 py-2 transition-colors">
              Log In
            </Link>
            <Link
              href="/pricing"
              className="text-xs font-700 text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 bg-linear-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] px-5 py-20 relative">
        <div className="absolute top-14 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-blue-500/10 blur-[80px] pointer-events-none rounded-full" />

        <div className="relative max-w-4xl mx-auto flex flex-col items-center gap-6 text-center">
          <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-600 px-3.5 py-1.5 rounded-full">
            <Zap size={11} />
            Area-based scanning · 1,000+ leads per city
          </div>

          <h1 className="text-3xl sm:text-5xl font-800 text-white leading-[1.1] tracking-tight max-w-3xl">
            Find Business Leads{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-sky-300">At Scale</span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-lg leading-relaxed">
            We scan every neighbourhood in a city separately to surface 500–2,000+ unique leads from Google Maps —
            scored, segmented, and pitch-ready. Save them to a Kanban pipeline and work them to close.
          </p>

          <Link
            href="/pricing"
            className="h-12 px-7 flex items-center justify-center rounded-2xl bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-sm font-700 shadow-lg shadow-blue-500/30 transition-all duration-200 active:scale-[0.97]"
          >
            Get Started
          </Link>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 w-full max-w-3xl">
            {FEATURES.map(({ icon: Icon, label, sub, color }) => (
              <div key={label} className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border ${color}`}>
                <Icon size={20} />
                <span className="text-xs font-700 text-center">{label}</span>
                <span className="text-[11px] opacity-70 text-center">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 bg-white">
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-blue-500 flex items-center justify-center">
              <Target size={11} className="text-white" />
            </div>
            <span className="text-xs font-600 text-slate-500">LeadScraper</span>
          </div>
          <p className="text-xs text-slate-400">Data sourced from Google Maps Places API</p>
        </div>
      </footer>
    </div>
  );
}
