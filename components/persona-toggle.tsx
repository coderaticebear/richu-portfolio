"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { usePersona, type ViewPersona } from "@/lib/persona-context";
import { springPlayful } from "@/lib/motion";
import clsx from "clsx";

const OPTIONS: { value: ViewPersona; label: string }[] = [
  { value: "support", label: "Support" },
  { value: "neutral", label: "Both" },
  { value: "developer", label: "Developer" },
];

const ANNOUNCE: Record<ViewPersona, string> = {
  support: "Emphasizing Support Engineer experience",
  neutral: "Showing a blended view of both personas",
  developer: "Emphasizing Developer experience",
};

/**
 * The flagship interaction: re-weights emphasis across Skills, Experience,
 * and Projects. Nothing is ever removed — this only decides what comes
 * forward. Implemented as a 3-option radiogroup so it's natively keyboard
 * operable (arrow keys move the selection) with a clear checked state.
 */
export function PersonaToggle({ scope }: { scope: "desktop" | "mobile" }) {
  const { view, setView } = usePersona();
  const groupRef = useRef<HTMLDivElement>(null);

  function selectIndex(index: number) {
    const clamped = (index + OPTIONS.length) % OPTIONS.length;
    const option = OPTIONS[clamped];
    setView(option.value);
    const btn = groupRef.current?.querySelectorAll<HTMLButtonElement>(
      "[role=radio]",
    )[clamped];
    btn?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      selectIndex(index + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      selectIndex(index - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      selectIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      selectIndex(OPTIONS.length - 1);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <div
        ref={groupRef}
        role="radiogroup"
        aria-label="Emphasize portfolio content for"
        className="relative flex items-center rounded-full border border-hairline bg-surface p-1 text-sm"
      >
        {OPTIONS.map((option, index) => {
          const checked = view === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
              onClick={() => setView(option.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={clsx(
                "relative z-10 rounded-full px-3.5 py-1.5 font-medium whitespace-nowrap cursor-pointer transition-colors duration-200",
                "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
                checked ? "text-accent-ink" : "text-ink-muted hover:text-ink",
              )}
            >
              {checked && (
                <motion.span
                  layoutId={`persona-pill-${scope}`}
                  className="absolute inset-0 -z-10 rounded-full bg-accent"
                  transition={springPlayful}
                />
              )}
              {option.label}
            </button>
          );
        })}
      </div>
      <span aria-live="polite" className="sr-only">
        {ANNOUNCE[view]}
      </span>
    </div>
  );
}
