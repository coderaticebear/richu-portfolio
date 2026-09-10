"use client";

import { motion, useReducedMotion } from "motion/react";
import { credentials, education } from "@/lib/content";
import { springSmooth, viewportOnce } from "@/lib/motion";
import { SectionHeading } from "./section-heading";
import { Reveal, RevealGroup, RevealItem } from "./motion/reveal";
import { CountUp } from "./motion/count-up";

export function Credentials() {
  const reduceMotion = useReducedMotion();
  // See motion/reveal.tsx for why this swaps whileInView for animate
  // under reduced motion rather than just dropping the trigger.
  const barTrigger = (target: { scaleX: number }) =>
    reduceMotion
      ? { animate: target, transition: { duration: 0 } }
      : { whileInView: target, viewport: viewportOnce, transition: { ...springSmooth, delay: 0.15 } };

  return (
    <section
      id="credentials"
      className="section-pad section-gutter border-t border-hairline"
    >
      <Reveal>
        <SectionHeading title="Credentials & Education" />
      </Reveal>

      <div className="mt-12">
        <h3 className="text-sm font-semibold text-ink">Certifications</h3>
        <RevealGroup stagger={0.12} className="mt-5 grid gap-5 sm:grid-cols-2">
          {credentials.map((cred) => (
            <RevealItem
              key={cred.name}
              className="surface-card flex flex-col gap-6 rounded-2xl border border-hairline-strong p-7 sm:flex-row sm:items-center sm:gap-8"
            >
              <div className="shrink-0 text-[clamp(3rem,6vw,4.5rem)] leading-none font-semibold tracking-[-0.02em] text-ink">
                <CountUp value={cred.progress ?? 0} suffix="%" />
              </div>

              <div className="min-w-0">
                <p className="text-lg font-medium text-ink">{cred.name}</p>
                <p className="mt-0.5 text-sm text-ink-muted">{cred.issuer}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-accent/40 px-2.5 py-0.5 font-mono text-xs text-accent-text">
                    In progress
                  </span>
                  <span className="text-sm text-ink-muted">
                    targeting {cred.target}
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-label={`${cred.name} progress`}
                  aria-valuenow={cred.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="mt-3 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-hairline-strong"
                >
                  <motion.div
                    initial={{ scaleX: 0 }}
                    {...barTrigger({ scaleX: (cred.progress ?? 0) / 100 })}
                    style={{ transformOrigin: "left" }}
                    className="h-full w-full rounded-full bg-accent"
                  />
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      <div className="mt-14">
        <h3 className="text-sm font-semibold text-ink">Education</h3>
        <RevealGroup stagger={0.12} className="mt-5 grid gap-5 sm:grid-cols-2">
          {education.map((edu) => (
            <RevealItem
              key={edu.school}
              className="surface-card rounded-2xl border border-hairline-strong p-7"
            >
              <p className="font-mono text-sm text-ink-muted">{edu.period}</p>
              <p className="mt-2 text-xl font-medium text-ink">{edu.school}</p>
              <p className="mt-1 text-ink-muted">{edu.credential}</p>
              <p className="mt-1 text-sm text-ink-muted">{edu.location}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
