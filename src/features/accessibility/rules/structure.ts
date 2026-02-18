import { AccessibilityRule, Issue } from "../types";

export const langRule: AccessibilityRule = {
  id: "missing-lang",
  category: "structure",
  severity: "critical",

  check(doc) {
    if (!doc.documentElement.getAttribute("lang")) {
      return [
        {
          id: "missing-lang",
          category: "structure",
          severity: "critical",
          message: "<html> is missing lang attribute.",
          suggestion: 'Add lang="en" (or correct language).',
        },
      ];
    }
    return null;
  },

  fix(doc) {
    if (!doc.documentElement.getAttribute("lang")) {
      doc.documentElement.setAttribute("lang", "en");
    }
  },
};

export const mainLandmarkRule: AccessibilityRule = {
  id: "missing-main",
  category: "structure",
  severity: "moderate",

  check(doc) {
    if (!doc.querySelector("main")) {
      return [
        {
          id: "missing-main",
          category: "structure",
          severity: "moderate",
          message: "Missing <main> landmark.",
          suggestion: "Wrap primary content inside <main>.",
        },
      ];
    }
    return null;
  },

  fix(doc) {
    if (!doc.querySelector("main")) {
      const body = doc.querySelector("body");
      if (body && body.children.length > 0) {
        const main = doc.createElement("main");
        while (body.firstChild) {
          main.appendChild(body.firstChild);
        }
        body.appendChild(main);
      }
    }
  },
};

export const multipleH1Rule: AccessibilityRule = {
  id: "multiple-h1",
  category: "structure",
  severity: "moderate",

  check(doc) {
    const h1s = doc.querySelectorAll("h1");
    if (h1s.length > 1) {
      return [
        {
          id: "multiple-h1",
          category: "structure",
          severity: "moderate",
          message: "Multiple <h1> elements detected.",
          suggestion: "Use only one primary heading.",
        },
      ];
    }
    return null;
  },
};

export const headingOrderRule: AccessibilityRule = {
  id: "heading-order",
  category: "structure",
  severity: "moderate",

  check(doc) {
    const issues: Issue[] = [];
    const headings = Array.from(doc.querySelectorAll("h1,h2,h3,h4,h5,h6"));

    let lastLevel = 0;

    headings.forEach((h) => {
      const level = parseInt(h.tagName[1]);

      if (lastLevel && level > lastLevel + 1) {
        issues.push({
          id: "heading-order",
          category: "structure",
          severity: "moderate",
          message: `Skipped heading level: ${h.tagName}`,
          suggestion: "Do not skip heading levels (e.g., h1 → h3).",
        });
      }

      lastLevel = level;
    });

    return issues.length ? issues : null;
  },
};

export const emptyHeadingRule: AccessibilityRule = {
  id: "empty-heading",
  category: "structure",
  severity: "minor",

  check(doc) {
    const issues: Issue[] = [];

    doc.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((h) => {
      if (!h.textContent?.trim()) {
        issues.push({
          id: "empty-heading",
          category: "structure",
          severity: "minor",
          message: "Empty heading detected.",
          suggestion: "Headings should contain meaningful text.",
        });
      }
    });

    return issues.length ? issues : null;
  },
};

export const titleRule: AccessibilityRule = {
  id: "missing-title",
  category: "structure",
  severity: "critical",

  check(doc) {
    const title = doc.querySelector("title");
    if (!title || !title.textContent?.trim()) {
      return [
        {
          id: "missing-title",
          category: "structure",
          severity: "critical",
          message: "Document missing <title>.",
          suggestion: "Add meaningful <title> inside <head>.",
        },
      ];
    }
    return null;
  },
};

export const viewportRule: AccessibilityRule = {
  id: "missing-viewport",
  category: "structure",
  severity: "moderate",

  check(doc) {
    if (!doc.querySelector('meta[name="viewport"]')) {
      return [
        {
          id: "missing-viewport",
          category: "structure",
          severity: "moderate",
          message: "Missing responsive viewport meta tag.",
          suggestion:
            'Add <meta name="viewport" content="width=device-width, initial-scale=1">.',
        },
      ];
    }
    return null;
  },
};
