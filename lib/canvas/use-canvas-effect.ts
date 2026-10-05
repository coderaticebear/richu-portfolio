"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { readThemeColors, type ThemeColors } from "./theme-colors";

export interface CanvasEffect {
  /** `dt` is 0 for a redraw that must not advance any simulation. */
  frame(time: number, dt: number): void;
  resize(width: number, height: number, dpr: number): void;
  setTheme(colors: ThemeColors): void;
  dispose(): void;
}

/** Returns null when the browser can't run the effect (e.g. no WebGL). */
export type CreateEffect<E extends CanvasEffect> = (
  canvas: HTMLCanvasElement,
  colors: ThemeColors,
) => E | null;

export type EffectStatus = "idle" | "ready" | "unsupported";

interface Options {
  /** false for effects that only draw on demand, like a one-off burst. */
  loop?: boolean;
  /** Resolution multiplier on phones and touch screens, for heavy shaders. */
  lowPowerScale?: number;
}

/**
 * Owns the lifecycle every canvas effect on the page shares:
 * - the effect's code is imported only once its canvas is within a screen of the viewport;
 * - the loop runs only while the canvas is on screen, unpaused, and the tab is visible;
 * - under prefers-reduced-motion it starts paused, drawing one still frame;
 * - size follows the element (DPR capped at 2), colors follow the theme.
 */
export function useCanvasEffect<E extends CanvasEffect>(
  load: () => Promise<CreateEffect<E>>,
  { loop = true, lowPowerScale = 1 }: Options = {},
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const effectRef = useRef<E | null>(null);
  const loadRef = useRef(load);
  const controlRef = useRef({ sync: () => {}, invalidate: () => {} });
  const pausedRef = useRef(false);
  const [status, setStatus] = useState<EffectStatus>("idle");
  const reducedMotion = usePrefersReducedMotion();
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const paused = userPaused ?? reducedMotion;

  useEffect(() => {
    loadRef.current = load;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const lowPower = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    let effect: E | null = null;
    let disposed = false;
    let raf = 0;
    let redraw = 0;
    let last = 0;
    let time = 0;
    let onScreen = false;
    let lastSize = "";

    const tick = (now: number) => {
      const dt = Math.min(Math.max(0, (now - last) / 1000), 1 / 30);
      last = now;
      time += dt;
      effect?.frame(time, dt);
      raf = requestAnimationFrame(tick);
    };
    const sync = () => {
      const run =
        !!effect && loop && onScreen && !pausedRef.current && document.visibilityState === "visible";
      if (run && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      } else if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const invalidate = () => {
      if (!effect || raf || redraw) return;
      redraw = requestAnimationFrame(() => {
        redraw = 0;
        effect?.frame(time, 0);
      });
    };
    controlRef.current = { sync, invalidate };

    const resize = () => {
      if (!effect) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * (lowPower.matches ? lowPowerScale : 1);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      // ResizeObserver also fires when nothing changed (e.g. a screenshot);
      // some effects rebuild their state on resize, so skip no-op calls.
      const size = `${w}x${h}@${dpr}`;
      if (size === lastSize) return;
      lastSize = size;
      canvas.width = w;
      canvas.height = h;
      effect.resize(w, h, dpr);
      invalidate();
    };

    const start = async () => {
      const create = await loadRef.current();
      if (disposed) return;
      effect = create(canvas, readThemeColors());
      effectRef.current = effect;
      if (!effect) {
        setStatus("unsupported");
        return;
      }
      resize();
      setStatus("ready");
      sync();
    };

    const near = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        near.disconnect();
        start().catch((err) => {
          console.error(err);
          if (!disposed) setStatus("unsupported");
        });
      },
      { rootMargin: "100% 0px" },
    );
    const visible = new IntersectionObserver((entries) => {
      onScreen = entries[entries.length - 1].isIntersecting;
      sync();
    });
    const sizeWatch = new ResizeObserver(resize);
    const themeWatch = new MutationObserver(() => {
      if (!effect) return;
      effect.setTheme(readThemeColors());
      invalidate();
    });
    near.observe(canvas);
    visible.observe(canvas);
    sizeWatch.observe(canvas);
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    document.addEventListener("visibilitychange", sync);
    lowPower.addEventListener("change", resize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(redraw);
      near.disconnect();
      visible.disconnect();
      sizeWatch.disconnect();
      themeWatch.disconnect();
      document.removeEventListener("visibilitychange", sync);
      lowPower.removeEventListener("change", resize);
      effect?.dispose();
      effect = null;
      effectRef.current = null;
      controlRef.current = { sync: () => {}, invalidate: () => {} };
    };
  }, [loop, lowPowerScale]);

  useEffect(() => {
    pausedRef.current = paused;
    controlRef.current.sync();
    controlRef.current.invalidate();
  }, [paused]);

  const togglePause = useCallback(
    () => setUserPaused((current) => !(current ?? reducedMotion)),
    [reducedMotion],
  );
  /** Ask for one redraw, e.g. after input while the loop is paused. */
  const invalidate = useCallback(() => controlRef.current.invalidate(), []);

  return { canvasRef, effectRef, status, paused, togglePause, invalidate };
}
