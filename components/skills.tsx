"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { skillGroups, skillLinks } from "@/lib/content";
import type { ThemeColors } from "@/lib/canvas/theme-colors";
import { useCanvasEffect } from "@/lib/canvas/use-canvas-effect";
import { EffectCanvas, PauseButton } from "./effect-controls";
import { SectionHeading } from "./section-heading";
import { Reveal, RevealGroup, RevealItem } from "./reveal";

const loadNetwork = () =>
  import("./effects/skill-network").then(
    (m) => (canvas: HTMLCanvasElement, colors: ThemeColors) =>
      m.createSkillNetwork(canvas, colors, skillGroups, skillLinks),
  );

export function Skills() {
  const { canvasRef, effectRef, status, paused, togglePause, invalidate } = useCanvasEffect(loadNetwork);
  const termRef = useRef<HTMLPreElement>(null);
  const [announcement, setAnnouncement] = useState("");

  // The map writes its ping log straight into the terminal readout.
  useEffect(() => {
    effectRef.current?.onLog((text) => {
      if (termRef.current) termRef.current.textContent = text;
    });
  }, [effectRef, status]);

  function ping(name: string) {
    const summary = effectRef.current?.ping(name, paused);
    invalidate();
    if (summary) {
      setAnnouncement(
        `${summary.name} connects to ${summary.reached} other skills within ${summary.hops} hops.`,
      );
    }
  }

  // The overlay sits exactly on the canvas, so its rect is the canvas rect.
  function hover(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const name = effectRef.current?.hoverAt(e.clientX - rect.left, e.clientY - rect.top) ?? null;
    e.currentTarget.style.cursor = name ? "pointer" : "default";
    invalidate();
  }

  return (
    <section id="skills" className="section-pad section-gutter border-t border-hairline">
      <SectionHeading
        id="skills"
        title="Core Skills"
        description="Click any skill, on the map or in the list, to ping it and see what it connects to."
      />

      <Reveal className="mt-12 overflow-hidden rounded-2xl border border-hairline-strong">
        <div className="relative aspect-[3/4] sm:aspect-[16/10] lg:aspect-[16/8]">
          <EffectCanvas
            canvasRef={canvasRef}
            status={status}
            className="absolute inset-0"
          />
          {/* Mouse convenience on top of the canvas; the list below is the accessible path. */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            onPointerMove={hover}
            onPointerLeave={() => {
              effectRef.current?.clearHover();
              invalidate();
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const name = effectRef.current?.hoverAt(e.clientX - rect.left, e.clientY - rect.top);
              if (name) ping(name);
            }}
          />
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3 border-t border-hairline px-4 py-3">
          <pre
            ref={termRef}
            aria-hidden="true"
            className="min-h-[7.5em] min-w-0 flex-1 overflow-hidden font-mono text-xs leading-[1.5] whitespace-pre text-ink-muted"
          >
            $ click a skill to ping it
          </pre>
          {status === "ready" ? (
            <PauseButton paused={paused} onToggle={togglePause} label="skill map animation" />
          ) : null}
        </div>
      </Reveal>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      <RevealGroup stagger={0.08} className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group) => (
          <RevealItem key={group.key}>
            <h3 className="text-sm font-semibold text-ink">{group.label}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li key={item.name}>
                  <button
                    type="button"
                    onClick={() => ping(item.name)}
                    title={`Ping ${item.name} on the map`}
                    className="cursor-pointer rounded-full border border-hairline-strong px-3 py-1.5 text-sm text-ink transition-[transform,border-color,color] duration-150 hover:scale-[1.04] hover:border-accent/50 hover:text-accent-text active:scale-[0.97]"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
