"use client";

import React from "react";
import { addRecentTool } from "./recent";

type Props = {
  slug: string;
  name: string;
  shortDescription: string;
  category: string;
};

export function ToolVisitTracker({
  slug,
  name,
  shortDescription,
  category,
}: Props) {
  React.useEffect(() => {
    addRecentTool({
      slug,
      name,
      shortDescription,
      category,
    });
  }, [slug, name, shortDescription, category]);

  return null;
}
