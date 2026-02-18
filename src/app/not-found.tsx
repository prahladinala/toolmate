"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 20%, rgba(var(--accent),0.25), transparent 70%)",
        }}
      />

      {/* Floating animated 404 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-7xl font-bold tracking-tight"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-xl font-medium"
        >
          Tool not found.
        </motion.p>

        <p className="mt-2 text-sm text-[rgb(var(--muted))]">
          Looks like this tool doesn’t exist — or hasn’t been built yet.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button size="lg">Go Home</Button>
          </Link>

          <Link href="/tools">
            <Button size="lg" variant="secondary">
              Browse Tools
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Subtle floating dots */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute left-10 top-20 h-3 w-3 rounded-full bg-[rgb(var(--accent))] opacity-40"
      />
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="absolute right-12 bottom-24 h-2 w-2 rounded-full bg-[rgb(var(--accent))] opacity-30"
      />
    </main>
  );
}
