import { AccessibilityRule, Issue } from "../types";

export const ariaHiddenFocusableRule: AccessibilityRule = {
  id: "aria-hidden-focusable",
  category: "aria",
  severity: "critical",

  check(doc) {
    const issues: Issue[] = [];

    doc.querySelectorAll("[aria-hidden='true']").forEach((el) => {
      if (
        el.hasAttribute("tabindex") ||
        ["button", "a", "input"].includes(el.tagName.toLowerCase())
      ) {
        issues.push({
          id: "aria-hidden-focusable",
          category: "aria",
          severity: "critical",
          message: "Focusable element should not have aria-hidden='true'.",
          suggestion: "Remove aria-hidden or remove focusability.",
        });
      }
    });

    return issues.length ? issues : null;
  },
};

export const roleConflictRule: AccessibilityRule = {
  id: "role-conflict",
  category: "aria",
  severity: "moderate",

  check(doc) {
    const issues: Issue[] = [];

    doc.querySelectorAll("[role]").forEach((el) => {
      const role = el.getAttribute("role");
      const tag = el.tagName.toLowerCase();

      if (tag === "button" && role === "button") {
        issues.push({
          id: "role-conflict",
          category: "aria",
          severity: "moderate",
          message: "Redundant role='button' on <button>.",
          suggestion: "Remove unnecessary role attribute.",
        });
      }
    });

    return issues.length ? issues : null;
  },
};

export const iconButtonLabelRule: AccessibilityRule = {
  id: "icon-button-no-label",
  category: "aria",
  severity: "critical",

  check(doc) {
    const issues: Issue[] = [];

    doc.querySelectorAll("button").forEach((btn) => {
      if (!btn.textContent?.trim() && !btn.getAttribute("aria-label")) {
        issues.push({
          id: "icon-button-no-label",
          category: "aria",
          severity: "critical",
          message: "Button without accessible name.",
          suggestion: "Add aria-label or visible text.",
        });
      }
    });

    return issues.length ? issues : null;
  },
};
