"use client";

import { useEffect, useRef } from "react";
import { experience, places } from "@/lib/content";
import type { ThemeColors } from "@/lib/canvas/theme-colors";
import { useCanvasEffect } from "@/lib/canvas/use-canvas-effect";
import { EffectCanvas, PauseButton } from "./effect-controls";
import { SectionHeading } from "./section-heading";

const loadGlobe = async () => {
  const [{ createJourneyGlobe }, land] = await Promise.all([
    import("./effects/journey-globe"),
    import("@/lib/geo/land-dots.json"),
  ]);
  return (canvas: HTMLCanvasElement, colors: ThemeColors) =>
    createJourneyGlobe(canvas, colors, land.default, places.kerala, places.toronto);
};

// Position of each role along the Kerala (0) → Toronto (1) arc.
const arcPositions = experience.map((entry) => (entry.place === "kerala" ? 0 : 1));

export function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const { canvasRef, effectRef, status, paused, togglePause, invalidate } = useCanvasEffect(loadGlobe);

  // On wide screens the globe is sticky beside the list and follows the
  // role crossing the reading line, so scrolling down flies the route back
  // from Toronto to Kerala. Narrow screens show the whole route instead.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const wide = window.matchMedia("(min-width: 1024px)");
    let raf = 0;

    const update = () => {
      raf = 0;
      const items = Array.from(list.querySelectorAll<HTMLElement>("[data-entry]"));
      const globe = effectRef.current;
      if (!wide.matches) {
        items.forEach((el) => el.removeAttribute("data-active"));
        globe?.setFocus(0.5, false);
        invalidate();
        return;
      }
      const line = window.innerHeight * 0.45;
      const tops = items.map((el) => el.getBoundingClientRect().top);
      let f = 0;
      if (tops[0] <= line) {
        f = items.length - 1;
        for (let i = 0; i < tops.length - 1; i++) {
          if (tops[i + 1] > line) {
            f = i + (line - tops[i]) / (tops[i + 1] - tops[i]);
            break;
          }
        }
      }
      const i0 = Math.floor(f);
      const i1 = Math.min(i0 + 1, items.length - 1);
      const t = f - i0;
      const eased = t * t * (3 - 2 * t);
      const active = Math.round(f);
      items.forEach((el, i) => el.toggleAttribute("data-active", i === active));
      globe?.setFocus(arcPositions[i0] + (arcPositions[i1] - arcPositions[i0]) * eased, true);
      invalidate();
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    wide.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      wide.removeEventListener("change", schedule);
    };
  }, [effectRef, invalidate, status]);

  return (
    <section id="experience" className="section-pad section-gutter border-t border-hairline">
      <SectionHeading
        id="experience"
        title="Experience"
        description="From Kerala to Toronto. On a wide screen, the globe follows the role you're reading."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <div className="relative mx-auto aspect-square w-full max-w-md lg:sticky lg:top-28 lg:max-w-none">
            <EffectCanvas canvasRef={canvasRef} status={status} className="absolute inset-0" />
            {status === "ready" ? (
              <PauseButton
                paused={paused}
                onToggle={togglePause}
                label="globe animation"
                className="absolute bottom-2 left-2"
              />
            ) : null}
          </div>
        </div>

        <ol ref={listRef} className="flex flex-col gap-6 lg:col-span-7">
          {experience.map((entry) => (
            <li
              key={entry.company}
              data-entry=""
              data-reveal=""
              className="surface-card rounded-2xl border border-hairline-strong p-8 data-[active]:border-accent/50 sm:p-10"
            >
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                {entry.current && (
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-ink">
                    Current
                  </span>
                )}
                <span className="font-mono text-sm text-ink-muted">{entry.period}</span>
                <span className="font-mono text-xs tracking-[0.08em] text-accent-text uppercase">
                  {places[entry.place].label}
                </span>
              </div>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                {entry.role}
              </h3>
              <p className="mt-1.5 text-lg text-ink-muted">
                {entry.company}, {entry.location}
              </p>
              <ul className="mt-6 flex max-w-[62ch] flex-col gap-2.5">
                {entry.bullets.map((bullet, i) => (
                  <li key={i} className="leading-relaxed text-ink-muted">
                    {bullet.text}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
