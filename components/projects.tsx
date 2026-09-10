"use client";

import { motion, useReducedMotion } from "motion/react";
import { projects } from "@/lib/content";
import { enterVariant, springSnappy, viewportOnce } from "@/lib/motion";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./motion/reveal";

function Field({
  label,
  value,
  todoHint,
}: {
  label: string;
  value: string | null;
  todoHint: string;
}) {
  return (
    <div>
      <dt className="font-mono text-xs text-ink-muted">{label}</dt>
      {value ? (
        <dd className="mt-1 text-ink">{value}</dd>
      ) : (
        <dd className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-md border border-dashed border-accent/50 px-2 py-1 text-sm text-accent-text">
          TODO — {todoHint}
        </dd>
      )}
    </div>
  );
}

export function Projects() {
  const reduceMotion = useReducedMotion();
  // See motion/reveal.tsx for why this swaps whileInView for animate
  // under reduced motion rather than just dropping the trigger.
  const entranceTrigger = reduceMotion
    ? { animate: "show" as const }
    : { whileInView: "show" as const, viewport: viewportOnce };

  return (
    <section
      id="projects"
      className="section-pad section-gutter border-t border-hairline"
    >
      <Reveal>
        <SectionHeading
          title="Projects"
          description="One case study is ready to publish; more are on the way."
        />
      </Reveal>

      <div className="mt-12 grid gap-6">
        {projects.map((project) => (
          <motion.article
            key={project.name}
            initial="hidden"
            variants={enterVariant}
            {...entranceTrigger}
            whileHover={{ y: -5 }}
            transition={springSnappy}
            className="surface-card rounded-2xl border border-hairline-strong p-8 sm:p-10"
          >
            <h3 className="text-2xl font-semibold text-ink">{project.name}</h3>
            <p className="mt-2 max-w-lg text-ink-muted">{project.problem}</p>

            <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="font-mono text-xs text-ink-muted">Stack</dt>
                <dd className="mt-1 flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-hairline-strong px-2.5 py-1 text-sm text-ink"
                    >
                      {tech}
                    </span>
                  ))}
                </dd>
              </div>
              <Field
                label="Role"
                value={project.role}
                todoHint="add your contribution"
              />
              <Field
                label="Outcome"
                value={project.outcome}
                todoHint="add a metric"
              />
              <Field
                label="Link"
                value={project.link}
                todoHint="add a live/repo link"
              />
            </dl>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
