import { AccessibilityResult, Issue } from "./types";
import { rules } from "./rules";

function calculateScore(issues: Issue[]): number {
  let score = 100;

  issues.forEach((issue) => {
    if (issue.severity === "critical") score -= 20;
    if (issue.severity === "moderate") score -= 10;
    if (issue.severity === "minor") score -= 5;
  });

  return Math.max(score, 0);
}

export function analyzeAccessibility(
  input: string,
  autoFix = true,
): AccessibilityResult {
  const parser = new DOMParser();
  const doc = parser.parseFromString(input, "text/html");

  const issues: Issue[] = [];

  rules.forEach((rule) => {
    const result = rule.check(doc);
    if (result) issues.push(...result);

    if (autoFix && rule.fix) {
      rule.fix(doc);
    }
  });

  const score = calculateScore(issues);

  return {
    score,
    issues,
    fixedCode: doc.documentElement.outerHTML,
  };
}
