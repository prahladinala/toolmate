"use client";

import React from "react";
import Link from "next/link";
import { getRecentTools } from "@/features/tools/recent";

type Props = {
  fallbackHref: string;
  fallbackLabel: string;
};

export function TryLastToolCta({ fallbackHref, fallbackLabel }: Props) {
  const [href, setHref] = React.useState(fallbackHref);
  const [label, setLabel] = React.useState(fallbackLabel);

  React.useEffect(() => {
    const recent = getRecentTools();
    if (recent?.length) {
      const last = recent[0];
      setHref(`/tools/${last.slug}`);
      setLabel(`Try ${last.name} →`);
    }
  }, []);

  return (
    <Link
      href={href}
      className="
        inline-flex h-11 items-center justify-center rounded-[var(--radius)]
        border border-[rgb(var(--border))] bg-[rgb(var(--card))] px-5 text-sm font-medium
        text-[rgb(var(--fg))] transition
        hover:border-[rgba(var(--accent),0.55)] hover:bg-[rgba(var(--accent),0.08)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))]
        focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--bg))]
      "
    >
      {label}
    </Link>
  );
}
