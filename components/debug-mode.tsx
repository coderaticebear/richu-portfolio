"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
}

function describe(el: Element) {
  const rect = el.getBoundingClientRect();
  const style = getComputedStyle(el);
  const cls = typeof el.className === "string" ? el.className.trim().split(/\s+/)[0] : "";
  const name = `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : cls ? `.${cls}` : ""}`;
  const px = (v: string) => Math.round(parseFloat(v));
  return {
    name,
    size: `${Math.round(rect.width)}×${Math.round(rect.height)}`,
    padding: `${px(style.paddingTop)} ${px(style.paddingRight)} ${px(style.paddingBottom)} ${px(style.paddingLeft)}`,
  };
}

/**
 * Debug mode: press D (or use the footer toggle) to see the page the way
 * its builder does — element outlines, the 12-column grid, section ids,
 * and a HUD with the viewport, DPR, and the hovered element's size and
 * padding. Ignored while typing, so it never eats a "d" in the form.
 */
export function DebugMode() {
  const [on, setOn] = useState(false);
  const [glitch, setGlitch] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const hudRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "d" || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTyping(e.target)) return;
      setOn((v) => !v);
      setGlitch((n) => n + 1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.toggleAttribute("data-debug", on);
    if (!on) return;

    let raf = 0;
    let last: PointerEvent | null = null;
    const render = () => {
      raf = 0;
      const hud = hudRef.current;
      if (!hud) return;
      const center = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
      const section = center?.closest("main > section")?.id ?? "—";
      const hovered = last ? document.elementFromPoint(last.clientX, last.clientY) : null;
      const info = hovered && !hud.contains(hovered) ? describe(hovered) : null;
      hud.textContent = [
        `viewport ${window.innerWidth}×${window.innerHeight} · dpr ${window.devicePixelRatio}`,
        `section  #${section}`,
        info ? `hover    ${info.name}` : "hover    —",
        info ? `size     ${info.size}  padding ${info.padding}` : "",
        "press D to exit",
      ]
        .filter(Boolean)
        .join("\n");
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };
    const onMove = (e: PointerEvent) => {
      last = e;
      schedule();
    };
    render();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      root.removeAttribute("data-debug");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [on]);

  return (
    <>
      <button
        type="button"
        aria-pressed={on}
        onClick={() => {
          setOn((v) => !v);
          setGlitch((n) => n + 1);
        }}
        className="cursor-pointer rounded-full border border-hairline-strong px-3 py-1.5 font-mono text-xs text-ink-muted transition-colors duration-150 hover:border-accent/50 hover:text-ink aria-pressed:border-accent aria-pressed:text-ink"
      >
        Debug mode <span className="text-ink-recede">· press D</span>
      </button>

      {on ? (
        <>
          <div aria-hidden="true" className="debug-grid">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} />
            ))}
          </div>
          <div
            ref={hudRef}
            aria-hidden="true"
            className="fixed bottom-4 left-4 z-50 max-w-[calc(100vw-2rem)] rounded-lg border border-accent/50 bg-bg/90 px-3.5 py-2.5 font-mono text-[0.7rem] leading-[1.6] whitespace-pre text-ink backdrop-blur-sm"
          />
        </>
      ) : null}
      {glitch > 0 && !reducedMotion ? <div key={glitch} aria-hidden="true" className="debug-glitch" /> : null}
    </>
  );
}
