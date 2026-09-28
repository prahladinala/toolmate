"use client";
import Link from "next/link";
import Image from "next/image";
import { DEVELOPER } from "@/content/developer";
import { motion } from "@/components/motion/motion";

const avatarSrc =
  typeof DEVELOPER.avatar === "string" &&
  (DEVELOPER.avatar.startsWith("/") || DEVELOPER.avatar.startsWith("http"))
    ? DEVELOPER.avatar
    : "";

export function DeveloperSection() {
  return (
    <section className="relative mx-auto max-w-5xl px-4 py-24">
      <div className="flex flex-col items-center justify-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(var(--fg),0.03)] border border-[rgba(var(--fg),0.05)] text-[13px] font-medium text-[rgb(var(--muted))]">
          <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
          Meet the Developer
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl mx-auto"
      >
        <div className="group relative overflow-hidden p-8 md:p-12 transition-all duration-500 bg-[rgb(var(--card))] shadow-[0_4px_24px_rgba(0,0,0,0.03)] ring-1 ring-[rgba(var(--fg),0.04)] rounded-[2.5rem]">
          {/* Subtle bg glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[300px] h-[300px] bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-10">
            <div className="flex flex-col gap-6 md:max-w-sm">
              <div className="flex items-center gap-5">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-4 ring-[rgba(var(--fg),0.02)] shadow-lg">
                  {avatarSrc ? (
                    <Image
                      src={avatarSrc}
                      alt={`${DEVELOPER.name} avatar`}
                      fill
                      sizes="80px"
                      className="object-cover"
                      quality={100}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-indigo-500/10 text-indigo-500 font-bold text-xl">
                      {DEVELOPER.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest mb-1.5">
                    Creator
                  </div>
                  <div className="text-2xl font-bold tracking-tight">
                    {DEVELOPER.name}
                  </div>
                </div>
              </div>

              <p className="text-[15px] text-[rgb(var(--muted))] leading-relaxed">
                {DEVELOPER.about}
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                {DEVELOPER.stack.map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-full bg-[rgba(var(--fg),0.04)] text-[12px] font-semibold text-[rgb(var(--fg))] opacity-80">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 min-w-[200px] w-full md:w-auto mt-4 md:mt-0">
              <div className="text-[11px] font-bold text-[rgb(var(--muted))] uppercase tracking-widest mb-1 md:text-right">
                Connect
              </div>
              <div className="flex flex-col gap-2.5">
                {DEVELOPER.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      group/link flex items-center justify-between rounded-2xl
                      bg-[rgba(var(--fg),0.03)] border border-transparent
                      px-5 py-3.5 text-[14px] font-semibold transition-all duration-300
                      hover:bg-[rgba(var(--fg),0.06)] hover:shadow-sm
                    "
                  >
                    <span>{l.label}</span>
                    <span className="text-indigo-500 opacity-0 -translate-x-2 transition-all duration-300 group-hover/link:opacity-100 group-hover/link:translate-x-0">
                      ↗
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
