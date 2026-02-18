"use client";
import Link from "next/link";
import { TOOLS } from "@/features/tools/registry";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "@/components/motion/motion";

const featured = TOOLS.slice(0, 6);

export default function FeaturedSection() {
  return (
    <>
      {/* FEATURED */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Featured tools</h2>
            <p className="mt-1 text-sm text-[rgb(var(--muted))]">
              Polished utilities you’ll actually use.
            </p>
          </div>
          <Link
            href="/tools"
            className="text-sm underline text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] transition"
          >
            View all
          </Link>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.06, delayChildren: 0.05 },
            },
          }}
          className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {featured.map((t) => (
            <motion.div
              key={t.slug}
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.55, ease: "easeOut" },
                },
              }}
            >
              <Link href={`/tools/${t.slug}`}>
                <Card className="group p-4 transition hover:shadow-[var(--shadow-md)]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-medium leading-snug">{t.name}</div>
                    <Badge>{t.category}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-[rgb(var(--muted))]">
                    {t.shortDescription}
                  </p>

                  {t.tags?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {t.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} className="opacity-80">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : null}

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm underline opacity-0 transition group-hover:opacity-80">
                      Open →
                    </span>
                    <motion.span
                      className="h-8 w-8 rounded-[var(--radius)] bg-[rgba(var(--accent),0.16)]"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </>
  );
}
