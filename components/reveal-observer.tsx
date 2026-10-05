"use client";

import { useLayoutEffect } from "react";

/**
 * Drives every [data-reveal] element on the page. Runs before first paint
 * after hydration: anything already on screen is marked revealed right
 * away (so nothing visible ever blinks out), then <html> gets
 * data-reveal-ready, which is what lets CSS hide the rest until it
 * scrolls into view. Under reduced motion everything is simply revealed.
 */
export function RevealObserver() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const pending = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])"));
    const reveal = (el: Element) => el.setAttribute("data-revealed", "");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pending.forEach(reveal);
      root.setAttribute("data-reveal-ready", "");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    const viewport = window.innerHeight;
    for (const el of pending) {
      const rect = el.getBoundingClientRect();
      if (rect.top < viewport && rect.bottom > 0) reveal(el);
      else observer.observe(el);
    }
    root.setAttribute("data-reveal-ready", "");
    return () => observer.disconnect();
  }, []);

  return null;
}
