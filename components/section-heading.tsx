import type { ReactNode } from "react";
import { SplitReveal } from "./motion/split-reveal";

export function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: ReactNode;
}) {
  return (
    <div className="max-w-[44rem]">
      <h2 className="text-[clamp(2.25rem,5.5vw,4rem)] font-medium tracking-[-0.015em] text-ink">
        <SplitReveal text={title} by="word" trigger="scroll" stagger={0.06} />
      </h2>
      {description && <p className="mt-3 text-lg text-ink-muted">{description}</p>}
    </div>
  );
}
