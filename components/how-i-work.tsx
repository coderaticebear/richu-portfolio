"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";
import { methodology } from "@/lib/content";
import { useCanvasEffect } from "@/lib/canvas/use-canvas-effect";
import { EffectCanvas, PauseButton } from "./effect-controls";
import { SectionHeading } from "./section-heading";
import { Reveal, RevealGroup, RevealItem } from "./reveal";

const loadPipeline = () => import("./effects/ticket-pipeline").then((m) => m.createTicketPipeline);

export function HowIWork() {
  const { canvasRef, effectRef, status, paused, togglePause } = useCanvasEffect(loadPipeline);
  const resolvedRef = useRef<HTMLSpanElement>(null);
  const escalatedRef = useRef<HTMLSpanElement>(null);

  // Tally straight into the DOM: a counter ticking several times a second
  // has no business re-rendering the section.
  useEffect(() => {
    const id = window.setInterval(() => {
      const counts = effectRef.current?.counts();
      if (!counts) return;
      if (resolvedRef.current) resolvedRef.current.textContent = String(counts.resolved);
      if (escalatedRef.current) escalatedRef.current.textContent = String(counts.escalated);
    }, 400);
    return () => window.clearInterval(id);
  }, [effectRef]);

  return (
    <section id="process" className="section-pad section-gutter border-t border-hairline">
      <SectionHeading
        id="process"
        title="How I work"
        description="Every ticket goes through the same four steps, from a messy first report to a fix or a clean hand-off."
      />

      <Reveal className="mt-12 overflow-hidden rounded-2xl border border-hairline-strong">
        <div className="relative aspect-[4/3] sm:aspect-[16/8] lg:aspect-[16/6]">
          <EffectCanvas canvasRef={canvasRef} status={status} className="absolute inset-0" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid grid-cols-4">
            {methodology.map((step, i) => (
              <div
                key={step.title}
                className={clsx("p-2.5 font-mono text-[0.65rem] tracking-[0.08em] text-ink-recede uppercase sm:p-3 sm:text-xs", i > 0 && "border-l border-dashed border-hairline-strong")}
              >
                <span className="text-ink-muted">0{i + 1}</span>{" "}
                <span className="hidden sm:inline">{step.title}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline px-4 py-2.5 font-mono text-xs text-ink-muted">
          <span aria-hidden="true" className="tabular-nums">
            <span ref={resolvedRef} className="text-accent-text">0</span> resolved ·{" "}
            <span ref={escalatedRef} className="text-ink">0</span> sent to engineering
          </span>
          {status === "ready" ? (
            <PauseButton paused={paused} onToggle={togglePause} label="ticket pipeline animation" />
          ) : null}
        </div>
      </Reveal>

      <RevealGroup as="ol" stagger={0.08} className="mt-8 grid gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {methodology.map((step, i) => (
          <RevealItem
            as="li"
            key={step.title}
            className={clsx("sm:pr-6 lg:px-5", i === 0 ? "lg:pl-0" : "lg:border-l lg:border-dashed lg:border-hairline-strong")}
          >
            <p className="font-mono text-xs text-accent-text">0{i + 1}</p>
            <h3 className="mt-2 text-lg font-medium text-ink">{step.title}</h3>
            <p className="mt-2 text-ink-muted">{step.text}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
