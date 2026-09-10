import type { Transition, Variants } from "motion/react";

/**
 * Shared motion vocabulary — one set of curves/durations used everywhere,
 * so the page reads as one system rather than a pile of one-off tweaks.
 * Weighting: Jakub (production polish) primary, Jhey (a little personality)
 * on the persona-toggle moment specifically, Emil (speed, no bounce) on
 * nav/buttons/anything frequent.
 */

// Jakub's production default: smooth deceleration, no overshoot.
export const springSmooth: Transition = { type: "spring", duration: 0.5, bounce: 0 };

// Snappier variant for frequent/high-visibility UI (nav indicator, toggle).
export const springSnappy: Transition = { type: "spring", duration: 0.35, bounce: 0 };

// The one place a little bounce is allowed — the flagship persona-toggle
// indicator. Occasional-frequency interaction, Jhey gets a say here.
export const springPlayful: Transition = { type: "spring", duration: 0.45, bounce: 0.12 };

// Jakub's standard enter recipe: opacity + translateY + blur "materializing".
export const enterVariant: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: springSmooth },
};

// Container for staggered children (hero sequence, section reveals).
export function staggerContainer(staggerChildren = 0.09, delayChildren = 0): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren, delayChildren },
    },
  };
}

export const viewportOnce = { once: true, margin: "-10% 0px -10% 0px" } as const;
