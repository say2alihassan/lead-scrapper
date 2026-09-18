"use client";

import { useLocalStorage } from "./useLocalStorage";

export const PLANS = {
  starter: { id: "starter", name: "Starter", price: "$49", period: "/mo", leadsPerMonth: "500 leads / month", features: ["1 saved search", "CSV export", "Email pitch generator"] },
  pro: { id: "pro", name: "Pro", price: "$99", period: "/mo", leadsPerMonth: "2,000 leads / month", features: ["Unlimited saved searches", "Kanban pipeline", "AI pitch + enrichment", "Priority support"] },
  agency: { id: "agency", name: "Agency", price: "$249", period: "/mo", leadsPerMonth: "Unlimited leads", features: ["Everything in Pro", "Multi-city scans", "EOD sales tracking", "White-label export"] },
};

const DEFAULT_SESSION = { plan: null, loggedIn: false, email: null };

export function useSession() {
  const [session, setSession, hydrated] = useLocalStorage("mock_session", DEFAULT_SESSION);

  function selectPlan(planId) {
    setSession((prev) => ({ ...prev, plan: planId }));
  }

  function login(email) {
    setSession((prev) => ({ ...prev, loggedIn: true, email: email || prev.email }));
  }

  function logout() {
    setSession((prev) => ({ ...prev, loggedIn: false }));
  }

  return { ...session, hydrated, selectPlan, login, logout };
}
