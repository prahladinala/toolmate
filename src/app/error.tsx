"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--fg),0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--fg),0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center max-w-xl w-full"
      >
        <div className="mb-8 relative flex items-center justify-center">
           <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full" />
           <div className="relative bg-red-500/10 text-red-500 border border-red-500/20 w-24 h-24 rounded-3xl flex items-center justify-center shadow-2xl shadow-red-500/20 rotate-12 hover:rotate-0 transition-transform duration-500">
             <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
             </svg>
           </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-[rgb(var(--fg))]">
          System <span className="text-red-500">Malfunction</span>
        </h1>

        <p className="text-[16px] text-[rgb(var(--muted))] mb-8 leading-relaxed max-w-md mx-auto">
          We encountered an unexpected runtime error. Our hyper-drives have temporarily stalled, but a quick restart usually fixes the issue.
        </p>
        
        {/* Error Details block (hidden in prod but useful for dev) */}
        <div className="mb-10 w-full bg-[rgba(var(--fg),0.02)] border border-[rgba(var(--fg),0.05)] rounded-2xl p-4 text-left overflow-hidden">
           <div className="text-[11px] font-bold uppercase tracking-widest text-[rgb(var(--muted))] mb-2 flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
             Error Diagnostics
           </div>
           <code className="text-[12px] text-red-400 font-mono break-words line-clamp-3">
             {error?.message || "Unknown internal error occurred."}
           </code>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <button
            onClick={() => reset()}
            className="group relative flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[rgb(var(--fg))] text-[rgb(var(--bg))] font-bold text-[14px] transition-transform hover:scale-105 active:scale-95"
          >
            <svg className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Reboot System
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-transparent border border-[rgba(var(--fg),0.1)] text-[rgb(var(--fg))] font-bold text-[14px] hover:bg-[rgba(var(--fg),0.03)] transition-colors"
          >
            Return to Base
          </button>
        </div>
      </motion.div>
    </main>
  );
}
