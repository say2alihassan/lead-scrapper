"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Target } from "lucide-react";
import { useSession, PLANS } from "@/lib/session";

export default function PricingPage() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.hydrated && session.loggedIn && !session.plan) {
      // already picking a plan mid-session is fine, no redirect needed
    }
  }, [session.hydrated, session.loggedIn, session.plan]);

  function choosePlan(planId) {
    session.selectPlan(planId);
    router.push(session.loggedIn ? "/subscription" : "/login");
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-16 px-5">
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
          <Target size={16} className="text-white" />
        </div>
        <span className="font-800 text-lg tracking-tight text-slate-900">LeadScraper</span>
      </div>

      <h1 className="text-3xl font-800 text-slate-900 text-center">Choose your plan</h1>
      <p className="text-slate-500 text-sm mt-2 text-center max-w-md">
        Mock pricing for demo purposes — no real payment is processed. Pick a plan to continue to login.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10 max-w-4xl w-full">
        {Object.values(PLANS).map((plan) => {
          const isCurrent = session.plan === plan.id;
          return (
            <div
              key={plan.id}
              className={`
                flex flex-col gap-4 p-6 rounded-3xl border bg-white
                ${plan.id === "pro" ? "border-blue-300 ring-2 ring-blue-100" : "border-slate-200"}
              `}
            >
              {plan.id === "pro" && (
                <span className="text-[10px] font-700 uppercase tracking-wide text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded-full w-fit">
                  Most popular
                </span>
              )}
              <div>
                <h2 className="text-lg font-800 text-slate-900">{plan.name}</h2>
                <p className="mt-1">
                  <span className="text-2xl font-800 text-slate-900">{plan.price}</span>
                  <span className="text-sm text-slate-400">{plan.period}</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">{plan.leadsPerMonth}</p>
              </div>

              <ul className="flex flex-col gap-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-slate-600">
                    <Check size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => choosePlan(plan.id)}
                className={`
                  h-10 rounded-xl text-sm font-600 transition-all duration-150 cursor-pointer active:scale-[0.98]
                  ${plan.id === "pro"
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-200"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"}
                `}
              >
                {isCurrent ? "Current plan" : "Choose plan"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
