import { AccessibilityRule, Issue } from "../types";

export const buttonTypeRule: AccessibilityRule = {
  id: "button-type",
  category: "forms",
  severity: "moderate",

  check(doc) {
    const issues: Issue[] = [];

    doc.querySelectorAll("button").forEach((btn) => {
      if (!btn.getAttribute("type")) {
        issues.push({
          id: "button-type",
          category: "forms",
          severity: "moderate",
          message: "Button missing type attribute.",
          suggestion: 'Add type="button" or type="submit".',
        });
      }
    });

    return issues.length ? issues : null;
  },

  fix(doc) {
    doc.querySelectorAll("button").forEach((btn) => {
      if (!btn.getAttribute("type")) {
        btn.setAttribute("type", "button");
      }
    });
  },
};
