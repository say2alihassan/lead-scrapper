"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Target, Loader2 } from "lucide-react";
import { useSession, PLANS } from "@/lib/session";

export default function LoginPage() {
  const session = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (session.hydrated && !session.plan) router.replace("/pricing");
  }, [session.hydrated, session.plan, router]);

  if (!session.hydrated || !session.plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 size={20} className="animate-spin text-blue-500" />
      </div>
    );
  }

  const plan = PLANS[session.plan];

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    session.login(email.trim());
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-5">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center">
            <Target size={17} className="text-white" />
          </div>
          <h1 className="text-xl font-800 text-slate-900">Log in to LeadScraper</h1>
          {plan && (
            <p className="text-xs text-slate-500">
              Continuing with the <span className="font-700 text-slate-700">{plan.name}</span> plan
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-white border border-slate-200 rounded-2xl p-6">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-600 text-slate-600">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@agency.com"
              required
              className="h-10 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-600 text-slate-600">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="h-10 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>

          <button
            type="submit"
            className="h-10 mt-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-600 transition-all duration-150 cursor-pointer active:scale-[0.98]"
          >
            Log In
          </button>

          <p className="text-[11px] text-slate-400 text-center mt-1">
            Demo login — any email &amp; password works.
          </p>
        </form>
      </div>
    </div>
  );
}
