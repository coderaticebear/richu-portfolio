import type { Transition, Variants } from "motion/react";

/**
 * Shared motion vocabulary — one set of curves/durations used everywhere,
 * so the page reads as one system rather than a pile of one-off tweaks.
 * Weighting: Jakub (production polish) primary, Emil (speed, no bounce) on
 * nav/buttons/anything frequent.
 */

// Jakub's production default: smooth deceleration, no overshoot.
export const springSmooth: Transition = { type: "spring", duration: 0.5, bounce: 0 };

// Snappier variant for frequent/high-visibility UI (nav indicator, hover-lift).
export const springSnappy: Transition = { type: "spring", duration: 0.35, bounce: 0 };

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
