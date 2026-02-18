import { AccessibilityRule, Issue } from "../types";

export const clickableNonInteractiveRule: AccessibilityRule = {
  id: "clickable-non-interactive",
  category: "keyboard",
  severity: "critical",

  check(doc) {
    const issues: Issue[] = [];

    doc.querySelectorAll("[onclick]").forEach((el) => {
      const tag = el.tagName.toLowerCase();

      if (!["button", "a"].includes(tag)) {
        issues.push({
          id: "clickable-non-interactive",
          category: "keyboard",
          severity: "critical",
          message: `Non-interactive <${tag}> used as clickable element.`,
          suggestion:
            "Replace with <button> or add role='button' + keyboard handlers.",
        });
      }
    });

    return issues.length ? issues : null;
  },
};

export const missingKeyboardHandlerRule: AccessibilityRule = {
  id: "missing-keyboard-handler",
  category: "keyboard",
  severity: "moderate",

  check(doc) {
    const issues: Issue[] = [];

    doc.querySelectorAll("[onclick]").forEach((el) => {
      if (!el.hasAttribute("onkeydown") && !el.hasAttribute("onkeyup")) {
        issues.push({
          id: "missing-keyboard-handler",
          category: "keyboard",
          severity: "moderate",
          message: "Clickable element missing keyboard support.",
          suggestion: "Add onKeyDown handler for Enter/Space keys.",
        });
      }
    });

    return issues.length ? issues : null;
  },
};

export const tabindexRule: AccessibilityRule = {
  id: "tabindex-positive",
  category: "keyboard",
  severity: "moderate",

  check(doc) {
    const issues: Issue[] = [];

    doc.querySelectorAll("[tabindex]").forEach((el) => {
      const val = parseInt(el.getAttribute("tabindex") || "0");

      if (val > 0) {
        issues.push({
          id: "tabindex-positive",
          category: "keyboard",
          severity: "moderate",
          message: "Avoid positive tabindex values.",
          suggestion: "Use tabindex=0 or natural DOM order.",
        });
      }
    });

    return issues.length ? issues : null;
  },
};
