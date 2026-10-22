import type { MetadataRoute } from "next";
import { TOOLS } from "@/features/tools/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://toolmate.co.in";
  // Stable build date to prevent misleading Googlebot with millisecond lastmod changes
  const lastMod = new Date("2026-10-22T00:00:00.000Z");

  return [
    {
      url: base,
      lastModified: lastMod,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${base}/tools`,
      lastModified: lastMod,
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...TOOLS.map((t) => ({
      url: `${base}/tools/${t.slug}`,
      lastModified: lastMod,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
