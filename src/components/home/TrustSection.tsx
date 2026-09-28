"use client";
import { motion } from "@/components/motion/motion";

export default function TrustSection() {
  return (
    <section className="relative mx-auto max-w-5xl px-4 py-24">
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Clean UX",
            desc: "Mobile-first layout with accessible components and predictable, butter-smooth interactions.",
            icon: (
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )
          },
          {
            title: "Local-first",
            desc: "Everything runs entirely in your browser. Zero tracking, zero unnecessary uploads. Your data stays yours.",
            icon: (
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )
          },
          {
            title: "SEO-ready",
            desc: "Each tool has dedicated metadata, canonical URLs, and structured data built for maximum discoverability.",
            icon: (
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )
          },
        ].map((x, i) => (
          <motion.div
            key={x.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="group relative flex flex-col h-full overflow-hidden p-8 transition-all duration-300 bg-transparent hover:bg-[rgba(var(--fg),0.02)] rounded-3xl border border-transparent hover:border-[rgba(var(--fg),0.05)]">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-indigo-500/10">
                  {x.icon}
                </div>
                <h3 className="font-bold text-lg tracking-tight">{x.title}</h3>
              </div>
              <p className="text-[15px] text-[rgb(var(--muted))] leading-relaxed">
                {x.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
