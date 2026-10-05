"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { experience } from "@/lib/content";
import { SectionHeading } from "./section-heading";

const STICKY_OFFSET = 96; // matches `top-24`
const HANG = 320; // extra scroll distance the card holds fully in place

function ExperienceCard({
  entry,
  index,
}: {
  entry: (typeof experience)[number];
  index: number;
}) {
  const wrapperRef = useRef<HTMLLIElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // The wrapper's height has to be driven by the card's own rendered
  // height — bullet count differs per role and text reflows per
  // viewport, so a fixed vh guess either leaves no "hang" room or, worse,
  // makes the wrapper *shorter* than the card, which is exactly what was
  // overlapping cards on mobile: the card doesn't get clipped to its
  // wrapper (sticky positioning doesn't do that), it just spills into
  // the next card's space.
  const [cardHeight, setCardHeight] = useState<number | null>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const measure = () => setCardHeight(card.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(card);
    return () => ro.disconnect();
  }, []);

  const wrapperHeight = cardHeight ? cardHeight + STICKY_OFFSET + HANG : undefined;
  // The exact scroll progress at which the sticky card releases (its
  // wrapper's bottom edge reaches the sticky offset). Shrink/fade ease in
  // during the last stretch of the hold and land exactly as it releases,
  // instead of guessing a universal fraction that drifts out of sync
  // whenever content height changes.
  const releaseAt = wrapperHeight ? HANG / wrapperHeight : 0.85;
  const shrinkStart = releaseAt * 0.6;

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(
    scrollYProgress,
    [0, shrinkStart, releaseAt, 1],
    [1, 1, 0.94, 0.94],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, shrinkStart, releaseAt, 1],
    [1, 1, 0.55, 0.55],
  );

  return (
    <li ref={wrapperRef} className="relative" style={{ height: wrapperHeight, minHeight: "32rem" }}>
      <motion.div
        ref={cardRef}
        style={reduceMotion ? undefined : { scale, opacity }}
        className="surface-card sticky top-24 overflow-hidden rounded-2xl border border-hairline-strong p-8 sm:p-12"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-4 right-6 text-[7rem] leading-none font-semibold text-ink/[0.05] sm:text-[9rem]"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="relative flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {entry.current && (
            <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-ink">
              Current
            </span>
          )}
          <span className="font-mono text-sm text-ink-muted">{entry.period}</span>
        </div>

        <h3 className="relative mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {entry.role}
        </h3>
        <p className="relative mt-1.5 text-lg text-ink-muted">
          {entry.company}, {entry.location}
        </p>

        <ul className="relative mt-6 flex max-w-[62ch] flex-col gap-2.5">
          {entry.bullets.map((bullet, i) => (
            <li key={i} className="leading-relaxed text-ink-muted">
              {bullet.text}
            </li>
          ))}
        </ul>
      </motion.div>
    </li>
  );
}

export function Experience() {
  return (
    <section
      id="experience"
      className="section-pad section-gutter border-t border-hairline"
    >
      <SectionHeading id="experience" title="Experience" />

      <ol className="relative mt-12 flex flex-col">
        {experience.map((entry, index) => (
          <ExperienceCard key={entry.company} entry={entry} index={index} />
        ))}
      </ol>
    </section>
  );
}
