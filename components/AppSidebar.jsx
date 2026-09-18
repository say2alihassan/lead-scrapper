"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Search, Users, Columns3, Receipt, CreditCard,
  Moon, Home, BookOpen, LifeBuoy, LogOut, ChevronLeft, ChevronRight,
  Target,
} from "lucide-react";
import { useSession } from "@/lib/session";

const WORKSPACE_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/search", label: "Search Leads", icon: Search },
  { href: "/leads", label: "My Leads", icon: Users },
  { href: "/pipeline", label: "Pipeline", icon: Columns3 },
  { href: "/eod-sales", label: "EOD Sales", icon: Receipt },
  { href: "/subscription", label: "My Subscription", icon: CreditCard },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  const [collapsed, setCollapsed] = useState(false);

  function handleSignOut() {
    session.logout();
    router.push("/login");
  }

  return (
    <aside
      className={`
        shrink-0 h-screen sticky top-0 flex flex-col
        bg-[#0F172A] border-r border-white/5 transition-all duration-200
        ${collapsed ? "w-16" : "w-56"}
      `}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 h-14 px-4 border-b border-white/5 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
          <Target size={14} className="text-white" />
        </div>
        {!collapsed && <span className="text-white font-800 text-base tracking-tight truncate">LeadScraper</span>}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2.5 flex flex-col gap-6">
        <div>
          {!collapsed && (
            <p className="text-[10px] font-700 uppercase tracking-widest text-slate-500 px-2.5 mb-2">Workspace</p>
          )}
          <div className="flex flex-col gap-0.5">
            {WORKSPACE_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`
                    flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-600 transition-colors
                    ${active ? "bg-blue-500/15 text-blue-400" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}
                  `}
                >
                  <Icon size={15} className="shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          {!collapsed && (
            <p className="text-[10px] font-700 uppercase tracking-widest text-slate-500 px-2.5 mb-2">Account</p>
          )}
          <div className="flex flex-col gap-0.5">
            <button
              disabled
              title="Dark mode — coming soon"
              className="flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-lg text-xs font-600 text-slate-500 cursor-not-allowed"
            >
              <span className="flex items-center gap-2.5">
                <Moon size={15} className="shrink-0" />
                {!collapsed && <span>Dark Mode</span>}
              </span>
              {!collapsed && <span className="text-[9px] font-700 bg-white/5 px-1.5 py-0.5 rounded-full">Soon</span>}
            </button>

            <Link
              href="/"
              title={collapsed ? "Landing Page" : undefined}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-600 text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors"
            >
              <Home size={15} className="shrink-0" />
              {!collapsed && <span>Landing Page</span>}
            </Link>

            <Link
              href="/how-it-works"
              title={collapsed ? "How It Works" : undefined}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-600 text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors"
            >
              <BookOpen size={15} className="shrink-0" />
              {!collapsed && <span>How It Works</span>}
            </Link>

            <Link
              href="/support"
              title={collapsed ? "Support" : undefined}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-600 text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors"
            >
              <LifeBuoy size={15} className="shrink-0" />
              {!collapsed && <span>Support</span>}
            </Link>

            <button
              onClick={handleSignOut}
              title={collapsed ? "Sign Out" : undefined}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-600 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut size={15} className="shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </nav>

      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center gap-2 h-11 px-4 border-t border-white/5 text-slate-500 hover:text-slate-300 text-xs font-600 transition-colors cursor-pointer shrink-0"
      >
        {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /> Collapse</>}
      </button>
    </aside>
  );
}
