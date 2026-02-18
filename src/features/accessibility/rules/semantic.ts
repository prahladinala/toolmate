import { AccessibilityRule, Issue } from "../types";

export const missingAltRule: AccessibilityRule = {
  id: "missing-alt",
  category: "semantic",
  severity: "critical",

  check(doc) {
    const issues: Issue[] = [];

    doc.querySelectorAll("img").forEach((img) => {
      if (!img.hasAttribute("alt")) {
        issues.push({
          id: "missing-alt",
          category: "semantic",
          severity: "critical",
          message: "Image missing alt attribute.",
          suggestion: 'Add meaningful alt="" text.',
        });
      }
    });

    return issues.length ? issues : null;
  },

  fix(doc) {
    doc.querySelectorAll("img").forEach((img) => {
      if (!img.hasAttribute("alt")) {
        img.setAttribute("alt", "");
      }
    });
  },
};
