"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

export { motion };

export function useMotionSafe() {
  const reduce = useReducedMotion();
  return {
    reduce,
    fadeUp: (delay = 0) => ({
      initial: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
      animate: { opacity: 1, y: 0 },
      transition: reduce
        ? { duration: 0 }
        : { duration: 0.55, ease: "easeOut", delay },
    }),
    fade: (delay = 0) => ({
      initial: reduce ? { opacity: 1 } : { opacity: 0 },
      animate: { opacity: 1 },
      transition: reduce
        ? { duration: 0 }
        : { duration: 0.5, ease: "easeOut", delay },
    }),
  };
}
