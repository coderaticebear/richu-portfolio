"use client";

import { motion, useReducedMotion } from "motion/react";
import { credentials, education } from "@/lib/content";
import { springSmooth, viewportOnce } from "@/lib/motion";
import { SectionHeading } from "./section-heading";
import { Reveal, RevealGroup, RevealItem } from "./motion/reveal";

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

      <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h3 className="text-sm font-semibold text-ink">Certifications</h3>
          <RevealGroup as="ul" stagger={0.12} className="mt-5 flex flex-col gap-6">
            {credentials.map((cred) => (
              <RevealItem as="li" key={cred.name}>
                <p className="font-medium text-ink">{cred.name}</p>
                <p className="mt-0.5 text-sm text-ink-muted">{cred.issuer}</p>
                <div className="mt-3 flex items-center gap-2">
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
                  className="mt-2.5 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-hairline-strong"
                >
                  <motion.div
                    initial={{ scaleX: 0 }}
                    {...barTrigger({ scaleX: (cred.progress ?? 0) / 100 })}
                    style={{ transformOrigin: "left" }}
                    className="h-full w-full rounded-full bg-accent"
                  />
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink">Education</h3>
          <RevealGroup as="ul" stagger={0.12} className="mt-5 flex flex-col gap-6">
            {education.map((edu) => (
              <RevealItem as="li" key={edu.school}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <p className="font-medium text-ink">{edu.school}</p>
                  <p className="font-mono text-sm text-ink-muted">
                    {edu.period}
                  </p>
                </div>
                <p className="mt-1 text-ink-muted">{edu.credential}</p>
                <p className="text-sm text-ink-muted">{edu.location}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
