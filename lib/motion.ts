import type { Transition } from "motion/react";

/**
 * Shared Motion curve for frequent, high-visibility UI (the nav's active
 * pill). Scroll reveals are CSS (see globals.css) and share
 * --ease-out-expo instead; both decelerate smoothly with no overshoot.
 */
export const springSnappy: Transition = { type: "spring", duration: 0.35, bounce: 0 };
