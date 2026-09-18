"use client";

import { useState } from "react";
import { DollarSign, Trash2, Receipt } from "lucide-react";
import { useLocalStorage } from "@/lib/useLocalStorage";

function todayKey() {
  return new Date().toDateString();
}

export default function EODSalesPage() {
  const [sales, setSales] = useLocalStorage("eod_sales", []);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const today = todayKey();
  const todaysSales = sales.filter((s) => s.date === today).sort((a, b) => b.createdAt - a.createdAt);
  const todaysTotal = todaysSales.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !amount) return;
    setSales((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: name.trim(), amount: Number(amount), note: note.trim(), date: today, createdAt: Date.now() },
    ]);
    setName("");
    setAmount("");
    setNote("");
  }

  function removeSale(id) {
    setSales((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-8 flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-800 text-slate-900">EOD Sales</h1>
        <p className="text-sm text-slate-500 mt-1">Log the deals you closed today and track your running total.</p>
      </div>

      <div className="bg-linear-to-r from-emerald-50 to-blue-50 border border-emerald-100 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-700 text-emerald-700 uppercase tracking-wide">Today&apos;s total</p>
          <p className="text-2xl font-800 text-slate-900 mt-1">${todaysTotal.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-700 text-slate-500 uppercase tracking-wide">Sales logged</p>
          <p className="text-2xl font-800 text-slate-900 mt-1">{todaysSales.length}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3">
        <h2 className="text-sm font-700 text-slate-800">Log a sale</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Business / client name"
            className="flex-1 h-10 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <div className="relative sm:w-40">
            <DollarSign size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="w-full h-10 pl-7 pr-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note (optional)"
          className="h-10 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          type="submit"
          disabled={!name.trim() || !amount}
          className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-600 transition-all duration-150 cursor-pointer active:scale-[0.98] self-start px-5"
        >
          Log Sale
        </button>
      </form>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-700 text-slate-800">Today&apos;s sales</h2>
        {todaysSales.length === 0 ? (
          <div className="flex flex-col items-center py-12 gap-2 text-center bg-white border border-slate-200 rounded-2xl">
            <Receipt size={20} className="text-slate-300" />
            <p className="text-xs text-slate-400">No sales logged today yet</p>
          </div>
        ) : (
          todaysSales.map((sale) => (
            <div key={sale.id} className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3">
              <div>
                <p className="text-sm font-600 text-slate-800">{sale.name}</p>
                {sale.note && <p className="text-xs text-slate-400 mt-0.5">{sale.note}</p>}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-700 text-emerald-600">${Number(sale.amount).toLocaleString()}</span>
                <button
                  onClick={() => removeSale(sale.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
