"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Drives smooth, eased scrolling so scroll-linked reveals and the hero
 * parallax read as deliberate rather than jittery. Skipped entirely under
 * prefers-reduced-motion — eased scroll that doesn't track 1:1 with input
 * is itself a motion effect some people find disorienting.
 */
export function SmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false, // native touch scroll already feels right
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
