"use client";

import type { CSSProperties, PointerEvent } from "react";
import { contact, positioning, roles } from "@/lib/content";
import { btnPrimary, btnSecondary, btnGhost } from "@/lib/styles";
import { useCanvasEffect } from "@/lib/canvas/use-canvas-effect";
import { usePointerCapable } from "@/lib/use-pointer-capable";
import { EffectCanvas, PauseButton } from "./effect-controls";

const loadSignalField = () => import("./effects/signal-field").then((m) => m.createSignalField);

// Stagger index for the CSS entrance (see .hero-in in globals.css).
const enter = (i: number) => ({ "--d": i }) as CSSProperties;

export function Hero() {
  const { canvasRef, effectRef, status, paused, togglePause, invalidate } = useCanvasEffect(
    loadSignalField,
    { lowPowerScale: 0.6 },
  );
  const pointerCapable = usePointerCapable();

  function trackPointer(e: PointerEvent<HTMLElement>) {
    // Touch keeps the idle drift; a finger dragging the lens fights scrolling.
    if (e.pointerType !== "mouse") return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    effectRef.current?.setPointer(
      (e.clientX - rect.left) / rect.width,
      1 - (e.clientY - rect.top) / rect.height,
    );
    invalidate();
  }

  return (
    <section
      id="top"
      onPointerMove={trackPointer}
      onPointerLeave={() => effectRef.current?.releasePointer()}
      className="relative isolate flex min-h-[88svh] flex-col justify-end overflow-hidden pt-36 pb-24 lg:pb-32"
    >
      <div id="top-sentinel" className="absolute top-0 left-0 h-px w-px" />
      <div aria-hidden="true" className="hero-fallback absolute inset-0 -z-10" />
      <EffectCanvas canvasRef={canvasRef} status={status} className="absolute inset-0 -z-10" />

      <div className="section-gutter">
        <p className="hero-in font-mono text-xs tracking-[0.12em] text-accent-text uppercase" style={enter(0)}>
          {contact.location} · open to Tier 2/3 SaaS roles
        </p>
        <h1
          className="hero-in hero-shadow mt-5 text-[clamp(2.75rem,8.5vw,7rem)] leading-[0.95] font-semibold tracking-[-0.025em] text-ink"
          style={enter(1)}
        >
          Richu Thankachan
        </h1>
        <p className="hero-in hero-shadow mt-5 font-mono text-base text-accent-text sm:text-xl" style={enter(2)}>
          {roles.join(" · ")}
        </p>
        <p
          className="hero-in hero-shadow content-col mt-6 text-lg text-ink-muted sm:text-xl"
          style={enter(3)}
        >
          I resolve SaaS, network, and application issues fast — and understand the code and
          systems behind them.
        </p>
        <p className="hero-in hero-shadow content-col mt-3 text-base text-ink-muted" style={enter(3)}>
          {positioning}
        </p>
        <div className="hero-in mt-10 flex flex-wrap items-center gap-3" style={enter(4)}>
          <a href="#projects" className={btnPrimary}>
            View Projects
          </a>
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
            LinkedIn
          </a>
          <a href="#contact" className={btnGhost}>
            Contact
          </a>
        </div>
      </div>

      <div className="section-gutter absolute inset-x-0 bottom-5 flex items-center justify-end gap-4">
        {pointerCapable && status === "ready" && !paused ? (
          <span className="hidden font-mono text-xs text-ink-muted md:inline">
            Move your cursor over the noise
          </span>
        ) : null}
        {status === "ready" ? (
          <PauseButton paused={paused} onToggle={togglePause} label="background animation" />
        ) : null}
      </div>
    </section>
  );
}
