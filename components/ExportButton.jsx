"use client";

import { Download } from "lucide-react";
import { exportToCSV } from "@/lib/csvExport";

export default function ExportButton({ leads }) {
  const total = leads.length;

  return (
    <button
      onClick={() => exportToCSV(leads)}
      disabled={total === 0}
      className="
        flex items-center gap-2
        h-10 px-5
        bg-white border border-emerald-200
        text-emerald-700 text-sm font-600
        rounded-xl
        hover:bg-emerald-50 hover:border-emerald-300
        disabled:opacity-40 disabled:cursor-not-allowed
        transition-all duration-150
        active:scale-[0.97]
        cursor-pointer
        shadow-sm
      "
    >
      <Download size={15} />
      Export CSV
      <span className="bg-emerald-100 text-emerald-700 text-xs font-700 px-2 py-0.5 rounded-full">
        {total}
      </span>

    </button>
  );
}
