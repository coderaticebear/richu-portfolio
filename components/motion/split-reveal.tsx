"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";
import { springSmooth, viewportOnce } from "@/lib/motion";

/**
 * One clipped, animatable word or character. Defined at module scope, not
 * nested inside SplitReveal — a component defined inside another
 * component's render body is a new function reference on every render,
 * which React would treat as a brand new component type and remount it.
 *
 * The whileInView trigger lives on the OUTER (clipping) span, not the
 * inner transformed one. IntersectionObserver computes a target's visible
 * area by clipping through every ancestor's overflow — and the inner span
 * starts translated below its own parent's overflow-hidden bounds by
 * design (that's the mask effect). So the inner span's own geometry is
 * *always* fully clipped to nothing before it animates, and it would
 * never report as "intersecting" if it watched its own visibility — a
 * deadlock. The outer span isn't itself transformed, so its geometry is
 * normal; it holds the trigger, and the inner span just inherits the
 * resolved "show" state through Motion's ordinary variant propagation.
 *
 * Reduced motion is handled by swapping the trigger to "mount" (an
 * `animate` call MotionConfig's reducedMotion="user" reliably collapses
 * to instant) rather than branching to a differently-shaped plain-text
 * DOM — the same structure server- and client-side avoids a hydration
 * mismatch that would otherwise strand this at its initial clipped state.
 */
function SplitUnit({
  content,
  transition,
  trigger,
}: {
  content: string;
  transition: Transition;
  trigger: "mount" | "scroll";
}) {
  const triggerProps =
    trigger === "scroll"
      ? { whileInView: "show" as const, viewport: viewportOnce }
      : { animate: "show" as const };

  return (
    <motion.span
      className="inline-block overflow-hidden"
      style={{ verticalAlign: "bottom" }}
      aria-hidden="true"
      initial="hidden"
      variants={{ hidden: {}, show: {} }}
      {...triggerProps}
    >
      <motion.span
        className="inline-block"
        variants={{ hidden: { y: "115%" }, show: { y: "0%" } }}
        transition={transition}
      >
        {content}
      </motion.span>
    </motion.span>
  );
}

/**
 * Word- or character-level "mask reveal": each unit sits inside an
 * overflow-hidden clip and slides up into place, staggered — the same
 * read as GSAP's SplitText, built on Motion instead so the page keeps a
 * single animation library.
 *
 * `trigger="mount"` fires immediately (the hero name, visible on load).
 * `trigger="scroll"` fires once on scroll into view (section headings).
 * Under reduced motion every unit switches to the mount trigger, which
 * MotionConfig collapses to instant — see SplitUnit's docstring for why
 * this is a trigger swap rather than a structural branch.
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
  const effectiveTrigger = reduceMotion ? "mount" : trigger;

  const words = text.split(" ");
  const space = String.fromCharCode(32);
  let charIndex = 0;

  return (
    <span className={className} aria-label={text}>
      {words.map((word, wi) => {
        const isLast = wi === words.length - 1;

        if (by === "word") {
          return (
            <span key={wi}>
              <SplitUnit
                content={word}
                trigger={effectiveTrigger}
                transition={{ ...springSmooth, delay: delay + wi * stagger }}
              />
              {isLast ? null : space}
            </span>
          );
        }

        // char mode: keep each word's letters as one unbreakable group so
        // the line only ever wraps between words, never mid-word. The
        // space is a sibling of the group, not inside it, so it stays a
        // valid break point.
        const chars = Array.from(word).map((char) => {
          const node = (
            <SplitUnit
              key={charIndex}
              content={char}
              trigger={effectiveTrigger}
              transition={{ ...springSmooth, delay: delay + charIndex * stagger }}
            />
          );
          charIndex += 1;
          return node;
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
