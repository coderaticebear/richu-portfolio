"use client";

import clsx from "clsx";
import type { RefObject } from "react";
import type { EffectStatus } from "@/lib/canvas/use-canvas-effect";

/** The canvas every effect draws into: decorative, fades in once its first frame is ready. */
export function EffectCanvas({
  canvasRef,
  status,
  className,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  status: EffectStatus;
  className?: string;
}) {
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={clsx(
        "block h-full w-full transition-opacity duration-700",
        status === "ready" ? "opacity-100" : "opacity-0",
        className,
      )}
    />
  );
}

/**
 * Every looping effect gets one of these (WCAG 2.2.2: moving content that
 * lasts more than five seconds needs a way to stop it).
 */
export function PauseButton({
  paused,
  onToggle,
  label,
  className,
}: {
  paused: boolean;
  onToggle: () => void;
  /** What's animating, e.g. "background animation". Completes the accessible name. */
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`${paused ? "Play" : "Pause"} ${label}`}
      className={clsx(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-hairline-strong bg-bg/70 px-3 py-1.5 font-mono text-xs text-ink-muted backdrop-blur-sm transition-[color,border-color,transform] duration-150 hover:border-accent/50 hover:text-ink active:scale-[0.96]",
        className,
      )}
    >
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" fill="currentColor">
        {paused ? <path d="M2 1.2v7.6L8.6 5z" /> : <path d="M2 1h2.2v8H2zM5.8 1H8v8H5.8z" />}
      </svg>
      {paused ? "Play" : "Pause"}
    </button>
  );
}
