export type Severity = "critical" | "moderate" | "minor";

export type RuleCategory =
  | "semantic"
  | "forms"
  | "structure"
  | "keyboard"
  | "aria"
  | "interactive"
  | "performance";

export type Issue = {
  id: string;
  category: RuleCategory;
  severity: Severity;
  message: string;
  suggestion: string;
};

export type AccessibilityRule = {
  id: string;
  category: RuleCategory;
  severity: Severity;
  check: (doc: Document) => Issue[] | null;
  fix?: (doc: Document) => void;
};

export type AccessibilityResult = {
  score: number;
  issues: Issue[];
  fixedCode: string;
};
