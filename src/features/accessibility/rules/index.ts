import { missingAltRule } from "./semantic";
import { buttonTypeRule } from "./forms";

import {
  langRule,
  mainLandmarkRule,
  multipleH1Rule,
  headingOrderRule,
  emptyHeadingRule,
  titleRule,
  viewportRule,
} from "./structure";

import {
  clickableNonInteractiveRule,
  missingKeyboardHandlerRule,
  tabindexRule,
} from "./keyboard";

import {
  ariaHiddenFocusableRule,
  roleConflictRule,
  iconButtonLabelRule,
} from "./aria";

import { anchorNoHrefRule } from "./interactive";

export const rules = [
  missingAltRule,
  buttonTypeRule,

  langRule,
  mainLandmarkRule,
  multipleH1Rule,
  headingOrderRule,
  emptyHeadingRule,
  titleRule,
  viewportRule,

  clickableNonInteractiveRule,
  missingKeyboardHandlerRule,
  tabindexRule,

  ariaHiddenFocusableRule,
  roleConflictRule,
  iconButtonLabelRule,

  anchorNoHrefRule,
];
