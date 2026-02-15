import type { MetadataRoute } from "next";
import { TOOLS } from "@/features/tools/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://toolmate.co.in";
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now },
    { url: `${base}/tools`, lastModified: now },
    ...TOOLS.map((t) => ({
      url: `${base}/tools/${t.slug}`,
      lastModified: now,
    })),
  ];
}
