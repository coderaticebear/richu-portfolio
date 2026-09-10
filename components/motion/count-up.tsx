"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";

/**
 * Counts up to `value` once, the first time it scrolls into view.
 * Purely additive/decorative — under reduced motion it just sets the
 * final number directly, no animation.
 */
export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (!isInView) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      count.set(value);
      return;
    }
    const controls = animate(count, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, value]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
