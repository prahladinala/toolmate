import { AccessibilityRule, Issue } from "../types";

export const anchorNoHrefRule: AccessibilityRule = {
  id: "anchor-no-href",
  category: "interactive",
  severity: "critical",

  check(doc) {
    const issues: Issue[] = [];

    doc.querySelectorAll("a").forEach((a) => {
      if (!a.getAttribute("href")) {
        issues.push({
          id: "anchor-no-href",
          category: "interactive",
          severity: "critical",
          message: "Anchor missing href attribute.",
          suggestion: "Add href or use <button> instead.",
        });
      }
    });

    return issues.length ? issues : null;
  },
};
