import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] px-5 py-16">
      <div className="max-w-md mx-auto flex flex-col gap-6 text-center items-center">
        <Link href="/" className="self-start flex items-center gap-1.5 text-xs font-600 text-slate-500 hover:text-slate-700">
          <ArrowLeft size={13} /> Back to home
        </Link>

        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
          <Mail size={20} className="text-blue-500" />
        </div>

        <h1 className="text-xl font-800 text-slate-900">Need a hand?</h1>
        <p className="text-sm text-slate-500">
          Reach out and we&apos;ll get back to you as soon as we can.
        </p>

        <a
          href="mailto:support@leadscraper.app"
          className="h-10 px-5 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-600 transition-all duration-150"
        >
          support@leadscraper.app
        </a>
      </div>
    </div>
  );
}
