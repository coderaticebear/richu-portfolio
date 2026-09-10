"use client";

import { motion, useReducedMotion } from "motion/react";
import { springSmooth, viewportOnce } from "@/lib/motion";

/**
 * Word- or character-level "mask reveal": each unit sits inside an
 * overflow-hidden clip and slides up into place, staggered — the same
 * read as GSAP's SplitText, built on Motion instead so the page keeps a
 * single animation library.
 *
 * `trigger="mount"` fires immediately (the hero name, visible on load).
 * `trigger="scroll"` fires once on scroll into view (section headings).
 * Reduced motion renders the text as plain, unsplit text — no clipping,
 * no stagger, nothing for a screen reader or copy/paste to trip over.
 */
export function SplitReveal({
  text,
  by = "word",
  trigger = "scroll",
  stagger = 0.04,
  delay = 0,
  className,
}: {
  text: string;
  by?: "word" | "char";
  trigger?: "mount" | "scroll";
  stagger?: number;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <span className={className}>{text}</span>;
  }

  const words = text.split(" ");
  const viewportProps =
    trigger === "scroll" ? { whileInView: "show" as const, viewport: viewportOnce } : {};
  const mountProps = trigger === "mount" ? { animate: "show" as const } : {};
  const space = String.fromCharCode(32);

  function Unit({ content, index }: { content: string; index: number }) {
    return (
      <span
        className="inline-block overflow-hidden"
        style={{ verticalAlign: "bottom" }}
        aria-hidden="true"
      >
        <motion.span
          className="inline-block"
          initial={{ y: "115%" }}
          variants={{ show: { y: "0%" } }}
          transition={{ ...springSmooth, delay: delay + index * stagger }}
          {...viewportProps}
          {...mountProps}
        >
          {content}
        </motion.span>
      </span>
    );
  }

  let charIndex = 0;

  return (
    <span className={className} aria-label={text}>
      {words.map((word, wi) => {
        const isLast = wi === words.length - 1;

        if (by === "word") {
          return (
            <span key={wi}>
              <Unit content={word} index={wi} />
              {isLast ? null : space}
            </span>
          );
        }

        // char mode: keep each word's letters as one unbreakable group so
        // the line only ever wraps between words, never mid-word. The
        // space is a sibling of the group, not inside it, so it stays a
        // valid break point.
        const chars = Array.from(word).map((char) => {
          const unit = <Unit key={charIndex} content={char} index={charIndex} />;
          charIndex += 1;
          return unit;
        });

        return (
          <span key={wi}>
            <span className="inline-block whitespace-nowrap">{chars}</span>
            {isLast ? null : space}
          </span>
        );
      })}
    </span>
  );
}
