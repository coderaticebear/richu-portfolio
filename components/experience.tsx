"use client";

import clsx from "clsx";
import { experience } from "@/lib/content";
import { usePersona, emphasisFor } from "@/lib/persona-context";
import { SectionHeading } from "./section-heading";

export function Experience() {
  const { view } = usePersona();

  return (
    <section
      id="experience"
      className="section-pad section-gutter border-t border-hairline"
    >
      <SectionHeading title="Experience" />

      <ol className="relative mt-12 flex flex-col gap-10 border-l border-hairline pl-8 sm:pl-10">
        {experience.map((entry) => (
          <li key={entry.company} className="relative">
            <span
              aria-hidden="true"
              className={clsx(
                "absolute top-1.5 -left-[calc(2rem+5px)] h-2.5 w-2.5 rounded-full sm:-left-[calc(2.5rem+5px)]",
                entry.current
                  ? "bg-accent"
                  : "border-2 border-hairline-strong bg-bg",
              )}
            />

            <details open={entry.current} className="group">
              <summary className="flex cursor-pointer list-none flex-wrap items-baseline gap-x-3 gap-y-1 [&::-webkit-details-marker]:hidden">
                <span className="text-lg font-semibold text-ink">
                  {entry.role}
                </span>
                <span className="text-ink-muted">
                  at {entry.company}, {entry.location}
                </span>
                <span className="font-mono text-sm text-ink-muted sm:ml-auto">
                  {entry.period}
                </span>
                <svg
                  aria-hidden="true"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="mt-1 shrink-0 text-ink-muted group-open:rotate-180"
                >
                  <path
                    d="M2 4.5 6 8.5l4-4"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </summary>

              <ul className="mt-4 flex max-w-[62ch] flex-col gap-2.5">
                {entry.bullets.map((bullet, i) => {
                  const state = emphasisFor(view, bullet.persona);
                  return (
                    <li
                      key={i}
                      className={clsx(
                        "leading-relaxed",
                        state === "fg" ? "text-ink-muted" : "text-ink-recede",
                      )}
                    >
                      {bullet.text}
                    </li>
                  );
                })}
              </ul>
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
}
