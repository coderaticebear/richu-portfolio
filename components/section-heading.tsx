import type { CSSProperties, ReactNode } from "react";
import { CopyLink } from "./copy-link";

/**
 * Section title with a word-by-word mask reveal (pure CSS, see
 * globals.css) and a copy-link button. The words are real text in reading
 * order, so the accessible name is just the title.
 */
export function SectionHeading({
  id,
  title,
  description,
}: {
  /** The id of the section this heads, for the copy-link button. */
  id: string;
  title: string;
  description?: ReactNode;
}) {
  const words = title.split(" ");
  return (
    <div className="max-w-[44rem]">
      <div className="group/heading flex flex-wrap items-center gap-x-4 gap-y-2">
        <h2
          data-reveal="mask"
          className="text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.05] font-medium tracking-[-0.015em] text-ink"
        >
          {words.map((word, i) => (
            <span key={i}>
              <span className="split-word">
                <span style={{ "--w": i } as CSSProperties}>{word}</span>
              </span>
              {i < words.length - 1 ? " " : null}
            </span>
          ))}
        </h2>
        <CopyLink targetId={id} label={title} />
      </div>
      {description && (
        <p data-reveal="" className="mt-3 text-lg text-ink-muted">
          {description}
        </p>
      )}
    </div>
  );
}
