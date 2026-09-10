"use client";

import clsx from "clsx";
import { projects } from "@/lib/content";
import { usePersona, emphasisFor } from "@/lib/persona-context";
import { SectionHeading } from "./section-heading";

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
  const { view } = usePersona();

  return (
    <section
      id="projects"
      className="section-pad section-gutter border-t border-hairline"
    >
      <SectionHeading
        title="Projects"
        description="One case study is ready to publish; more are on the way."
      />

      <div className="mt-12 grid gap-6">
        {projects.map((project) => {
          const state = emphasisFor(view, project.persona);
          return (
            <article
              key={project.name}
              className={clsx(
                "surface-card rounded-2xl border p-8 sm:p-10",
                state === "fg" ? "border-hairline-strong" : "border-hairline",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-ink">
                    {project.name}
                  </h3>
                  <p className="mt-2 max-w-lg text-ink-muted">
                    {project.problem}
                  </p>
                </div>
                <span
                  className={clsx(
                    "shrink-0 rounded-full border px-3 py-1 font-mono text-xs",
                    state === "fg"
                      ? "border-hairline-strong text-ink"
                      : "border-hairline text-ink-recede",
                  )}
                >
                  {project.persona === "both"
                    ? "Support + Dev"
                    : project.persona === "support"
                      ? "Support"
                      : "Developer"}
                </span>
              </div>

              <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <dt className="font-mono text-xs text-ink-muted">Stack</dt>
                  <dd className="mt-1 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className={clsx(
                          "rounded-full border px-2.5 py-1 text-sm",
                          state === "fg"
                            ? "border-hairline-strong text-ink"
                            : "border-hairline text-ink-recede",
                        )}
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
            </article>
          );
        })}
      </div>
    </section>
  );
}
