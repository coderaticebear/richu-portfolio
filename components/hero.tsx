"use client";

import { useEffect, useState } from "react";
import { roles, contact } from "@/lib/content";
import { btnPrimary, btnSecondary, btnGhost } from "@/lib/styles";

const ROLE_INTERVAL_MS = 2600;

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const id = window.setInterval(() => {
      setRoleIndex((i) => (i + 1) % roles.length);
    }, ROLE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      id="top"
      className="relative overflow-hidden pt-36 pb-24 lg:pt-52 lg:pb-36"
    >
      <div id="top-sentinel" className="absolute top-0 left-0 h-px w-px" />

      {/* ambient background — a fixed pair of soft gradient fields, not particles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-accent/20 blur-[120px]" />
        <div className="absolute right-10 top-60 h-[24rem] w-[24rem] rounded-full bg-accent/10 blur-[100px]" />
      </div>

      <div className="section-gutter">
        <div className="max-w-[54rem]">
          <h1 className="text-[clamp(2.75rem,8vw,6rem)] font-semibold leading-[0.98] tracking-tight text-ink">
            Richu Thankachan
          </h1>

          <p className="mt-5 font-mono text-xl text-accent-text sm:text-2xl" aria-live="polite">
            {roles[roleIndex]}
          </p>

          <p className="content-col mt-6 text-lg text-ink-muted sm:text-xl">
            I resolve SaaS, network, and application issues fast — and
            understand the code and systems behind them.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a href="#projects" className={btnPrimary}>
              View Projects
            </a>
            <a href={contact.resumeHref} download className={btnSecondary}>
              Download Résumé
            </a>
            <a href="#contact" className={btnGhost}>
              Contact
            </a>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-ink-muted sm:flex"
      >
        <span className="font-mono text-xs tracking-wide">scroll</span>
        <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
          <rect
            x="1"
            y="1"
            width="12"
            height="18"
            rx="6"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <circle cx="7" cy="6" r="1.4" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
}
