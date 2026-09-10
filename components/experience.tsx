"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { experience } from "@/lib/content";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./motion/reveal";

function ExperienceCard({
  entry,
  index,
}: {
  entry: (typeof experience)[number];
  index: number;
}) {
  const wrapperRef = useRef<HTMLLIElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end start"],
  });
  // Holds at full size while the card is the focus, then eases back in the
  // final stretch as the next card arrives to cover it — a stacked-deck
  // read, not a persistent parallax drift.
  const scale = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0.55]);

  return (
    <li
      ref={wrapperRef}
      className="relative"
      style={{ height: "60vh", minHeight: "28rem" }}
    >
      <motion.div
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
      <Reveal>
        <SectionHeading title="Experience" />
      </Reveal>

      <ol className="relative mt-12 flex flex-col gap-6">
        {experience.map((entry, index) => (
          <ExperienceCard key={entry.company} entry={entry} index={index} />
        ))}
      </ol>
    </section>
  );
}
