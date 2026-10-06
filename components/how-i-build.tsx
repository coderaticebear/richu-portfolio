"use client";

import { useState } from "react";
import clsx from "clsx";
import { buildSteps } from "@/lib/content";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { underlineLink } from "@/lib/styles";
import { PauseButton } from "./effect-controls";
import { SectionHeading } from "./section-heading";
import { Reveal, RevealGroup, RevealItem } from "./reveal";

/**
 * How School ERP gets built with AI. The steps are real, linked to the
 * public repo; the travelling dot is decoration, so it can be paused and
 * disappears under reduced motion.
 */
export function HowIBuild() {
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();

  return (
    <section id="build" className="section-pad section-gutter border-t border-hairline">
      <SectionHeading
        id="build"
        title="How I build"
        description="How School ERP gets built with AI: written-down work, small reviewed changes, and tests on every step."
      />

      <Reveal className="mt-12">
        <div aria-hidden="true" className="build-rail" data-paused={paused || undefined}>
          {reduced ? null : <span className="build-token" />}
        </div>
        <div className="mt-3 flex min-h-8 justify-end">
          {reduced ? null : (
            <PauseButton paused={paused} onToggle={() => setPaused((p) => !p)} label="build process animation" />
          )}
        </div>
      </Reveal>

      <RevealGroup as="ol" stagger={0.08} className="mt-4 grid gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {buildSteps.map((step, i) => (
          <RevealItem
            as="li"
            key={step.title}
            className={clsx("sm:pr-6 lg:px-5", i === 0 ? "lg:pl-0" : "lg:border-l lg:border-dashed lg:border-hairline-strong")}
          >
            <p className="font-mono text-xs text-accent-text">0{i + 1}</p>
            <h3 className="mt-2 text-lg font-medium text-ink">{step.title}</h3>
            <p className="mt-2 text-ink-muted">{step.text}</p>
            {step.artifact ? (
              <a
                href={step.artifact.href}
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(underlineLink, "mt-3 inline-block text-sm")}
              >
                {step.artifact.label} <span className="sr-only">(opens GitHub in a new tab)</span>
              </a>
            ) : null}
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
