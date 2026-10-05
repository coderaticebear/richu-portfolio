import type { CSSProperties, ElementType, ReactNode } from "react";

/*
  Server-rendered reveal wrappers. They only add data attributes; the
  animation is CSS (globals.css) and the trigger is RevealObserver, so the
  markup is identical with or without JavaScript and nothing ships hidden.
*/

interface RevealProps {
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** Fades and rises into view once, the first time it scrolls on screen. */
export function Reveal({ as: Tag = "div", ...props }: RevealProps) {
  return <Tag data-reveal="" {...props} />;
}

/** Reveals its RevealItem children together, staggered by `stagger` seconds. */
export function RevealGroup({
  as: Tag = "div",
  stagger = 0.09,
  style,
  ...props
}: RevealProps & { stagger?: number }) {
  const groupStyle = { ...style, "--reveal-step": `${Math.round(stagger * 1000)}ms` } as CSSProperties;
  return <Tag data-reveal="group" style={groupStyle} {...props} />;
}

export function RevealItem({ as: Tag = "div", ...props }: RevealProps) {
  return <Tag data-reveal-item="" {...props} />;
}
