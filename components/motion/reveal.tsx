"use client";

import type { ComponentType, ReactNode } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { enterVariant, staggerContainer, viewportOnce } from "@/lib/motion";

/**
 * Fades + slides an element up once, the first time it enters the
 * viewport. Never replays on scroll-back.
 *
 * Under reduced motion this swaps the trigger from `whileInView` to
 * `animate` (mount-triggered) instead. That's not cosmetic: MotionConfig's
 * `reducedMotion="user"` (layout.tsx) reliably collapses `animate`-driven
 * variant transitions to instant, matching the Hero's tested behavior —
 * but a `whileInView` that's SSR'd at its "hidden" state has nothing to
 * ever move it to "show" once reduced motion removes the trigger, so it
 * gets stuck exactly where the server left it. Keeping the trigger as a
 * variant label (not a raw style object) also preserves parent → child
 * stagger propagation into RevealItem in both cases.
 */
export function Reveal({ className, children, ...props }: HTMLMotionProps<"div">) {
  const reduceMotion = useReducedMotion();
  const trigger = reduceMotion
    ? { animate: "show" }
    : { whileInView: "show", viewport: viewportOnce };
  return (
    <motion.div
      initial="hidden"
      variants={enterVariant}
      className={className}
      {...trigger}
      {...props}
    >
      {children as ReactNode}
    </motion.div>
  );
}

/**
 * A Reveal whose direct children stagger in after it enters view.
 * Children should be plain elements — RevealGroup applies the variants
 * via context-free CSS-in-JS is overkill here, so wrap each child in
 * <RevealItem> (below) to opt it into the stagger.
 *
 * `as` picks the rendered tag when the surrounding markup needs to stay
 * semantically valid (e.g. a <dl> whose direct children must be dt/dd or
 * dt/dd-wrapping divs — see About's metric list).
 */
// The four tags share every prop we actually pass (initial/whileInView/
// variants/className/children); a common component type keeps callers
// type-safe on `as` without fighting each tag's distinct element type.
type GroupTag = "div" | "dl" | "ol" | "ul";
const GROUP_TAGS: Record<GroupTag, ComponentType<HTMLMotionProps<"div">>> = {
  div: motion.div,
  dl: motion.dl as unknown as ComponentType<HTMLMotionProps<"div">>,
  ol: motion.ol as unknown as ComponentType<HTMLMotionProps<"div">>,
  ul: motion.ul as unknown as ComponentType<HTMLMotionProps<"div">>,
};

export function RevealGroup({
  as = "div",
  className,
  children,
  stagger = 0.09,
  ...props
}: HTMLMotionProps<"div"> & { stagger?: number; as?: GroupTag }) {
  const reduceMotion = useReducedMotion();
  const trigger = reduceMotion
    ? { animate: "show" }
    : { whileInView: "show", viewport: viewportOnce };
  const Component = GROUP_TAGS[as];
  return (
    <Component
      initial="hidden"
      variants={staggerContainer(stagger)}
      className={className}
      {...trigger}
      {...props}
    >
      {children as ReactNode}
    </Component>
  );
}

type ItemTag = "div" | "li";
const ITEM_TAGS: Record<ItemTag, ComponentType<HTMLMotionProps<"div">>> = {
  div: motion.div,
  li: motion.li as unknown as ComponentType<HTMLMotionProps<"div">>,
};

export function RevealItem({
  as = "div",
  className,
  children,
  ...props
}: HTMLMotionProps<"div"> & { as?: ItemTag }) {
  const Component = ITEM_TAGS[as];
  return (
    <Component variants={enterVariant} className={className} {...props}>
      {children as ReactNode}
    </Component>
  );
}
