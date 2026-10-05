"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";

const format = (v: number) => Math.round(v).toLocaleString("en-US");

/**
 * Renders the real number in the HTML. Only if the figure is still off
 * screen once the page is interactive does it drop to zero and count up
 * when scrolled to, so crawlers, no-JS visitors, and anyone already
 * looking at it always see the true value.
 */
export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const count = useMotionValue(value);
  const text = useTransform(count, format);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    count.set(0);
    let controls: ReturnType<typeof animate> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        controls = animate(count, value, { duration: 1.2, ease: [0.16, 1, 0.3, 1] });
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      controls?.stop();
    };
  }, [count, value]);

  return (
    <span ref={ref}>
      <motion.span>{text}</motion.span>
      {suffix}
    </span>
  );
}
