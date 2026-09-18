"use client";

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { useSession, PLANS } from "@/lib/session";

export default function SubscriptionPage() {
  const session = useSession();
  const plan = PLANS[session.plan] || PLANS.starter;

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-800 text-slate-900">My Subscription</h1>
        <p className="text-sm text-slate-500 mt-1">Mock plan details — no real billing is connected.</p>
      </div>

      <div className="bg-white border border-blue-200 ring-2 ring-blue-50 rounded-2xl p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-700 uppercase tracking-wide text-blue-600">Current plan</p>
            <h2 className="text-lg font-800 text-slate-900 mt-0.5">{plan.name}</h2>
          </div>
          <p className="text-xl font-800 text-slate-900">{plan.price}<span className="text-sm text-slate-400">{plan.period}</span></p>
        </div>

        <p className="text-xs text-slate-500">{plan.leadsPerMonth}</p>

        <ul className="flex flex-col gap-2">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
              <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              {f}
            </li>
          ))}
        </ul>

        <p className="text-xs text-slate-400">Signed in as {session.email || "demo@leadscraper.app"}</p>

        <Link
          href="/pricing"
          className="flex items-center justify-center gap-1.5 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-600 transition-all duration-150 self-start px-5"
        >
          Change Plan <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
