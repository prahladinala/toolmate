"use client";

import React from "react";
import { addRecentTool } from "./recent";

export function ToolVisitTracker({
  slug,
  name,
  category,
}: {
  slug: string;
  name: string;
  category: string;
}) {
  React.useEffect(() => {
    addRecentTool({ slug, name, category });
  }, [slug, name, category]);

  return null;
}
