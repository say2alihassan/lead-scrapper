"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSession } from "@/lib/session";
import { LeadsProvider } from "@/lib/leadsStore";
import AppSidebar from "@/components/AppSidebar";

export default function AppShellLayout({ children }) {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session.hydrated) return;
    if (!session.loggedIn) router.replace("/login");
  }, [session.hydrated, session.loggedIn, router]);

  if (!session.hydrated || !session.loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <Loader2 size={20} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <LeadsProvider>
      <div className="flex min-h-screen bg-[#F8FAFC]">
        <AppSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </LeadsProvider>
  );
}
