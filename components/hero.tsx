"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { roles, contact } from "@/lib/content";
import { btnPrimary, btnSecondary, btnGhost } from "@/lib/styles";
import { enterVariant, staggerContainer, springSmooth } from "@/lib/motion";
import { usePointerCapable } from "@/lib/use-pointer-capable";
import { SplitReveal } from "./motion/split-reveal";

const ROLE_INTERVAL_MS = 2600;

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const pointerCapable = usePointerCapable();
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  // Subtle drift on the background glow only — never on the text, only for
  // devices with a real pointer/scroll wheel (not touch), and off entirely
  // under reduced motion — parallax is a vestibular trigger.
  const parallaxDistance = pointerCapable && !reduceMotion ? 120 : 0;
  const parallaxY = useTransform(scrollY, [0, 800], [0, parallaxDistance]);

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
      <motion.div
        aria-hidden="true"
        style={{ y: parallaxY }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-accent/20 blur-[120px]" />
        <div className="absolute right-10 top-60 h-[24rem] w-[24rem] rounded-full bg-accent/10 blur-[100px]" />
      </motion.div>

      <div className="section-gutter">
        <motion.div initial="hidden" animate="show" variants={staggerContainer(0.12, 0.05)}>
          <h1 className="text-[clamp(2.75rem,8.5vw,7rem)] leading-[0.96] font-semibold tracking-[-0.02em] text-ink">
            <SplitReveal text="Richu Thankachan" by="char" trigger="mount" stagger={0.02} />
          </h1>

          <motion.p
            variants={enterVariant}
            className="mt-5 h-8 font-mono text-xl text-accent-text sm:h-9 sm:text-2xl"
            aria-live="polite"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIndex}
                initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -6, filter: "blur(3px)" }}
                transition={springSmooth}
                className="inline-block"
              >
                {roles[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </motion.p>

          <motion.p
            variants={enterVariant}
            className="content-col mt-6 text-lg text-ink-muted sm:text-xl"
          >
            I resolve SaaS, network, and application issues fast — and
            understand the code and systems behind them.
          </motion.p>

          <motion.div
            variants={enterVariant}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a href="#projects" className={btnPrimary}>
              View Projects
            </a>
            <a href={contact.resumeHref} download className={btnSecondary}>
              Download Résumé
            </a>
            <a href="#contact" className={btnGhost}>
              Contact
            </a>
          </motion.div>
        </motion.div>
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
