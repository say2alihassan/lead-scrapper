import Link from "next/link";
import { Search, Sparkles, Columns3, ArrowLeft } from "lucide-react";

const STEPS = [
  { icon: Search, title: "Search Leads", body: "Pick a category and city (or type a custom query) and scan Google Maps across dozens of neighbourhoods at once." },
  { icon: Sparkles, title: "Score & pitch", body: "Every lead is scored, categorised, and given a tailored pitch angle — plus an AI-written cold email on demand." },
  { icon: Columns3, title: "Work the pipeline", body: "Save leads and move them through New → Contacted → Closed on the Kanban pipeline as you work them." },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] px-5 py-16">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <Link href="/" className="flex items-center gap-1.5 text-xs font-600 text-slate-500 hover:text-slate-700">
          <ArrowLeft size={13} /> Back to home
        </Link>

        <h1 className="text-2xl font-800 text-slate-900">How it works</h1>

        <div className="flex flex-col gap-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="flex items-start gap-4 bg-white border border-slate-200 rounded-2xl p-5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-700 text-blue-500 mb-0.5">Step {i + 1}</p>
                  <h2 className="text-sm font-700 text-slate-900">{step.title}</h2>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{step.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
