import { projects } from "@/lib/content";
import { underlineLink } from "@/lib/styles";
import { SectionHeading } from "./section-heading";

function TodoField({ label, todoHint }: { label: string; todoHint: string }) {
  return (
    <div>
      <dt className="font-mono text-xs text-ink-muted">{label}</dt>
      <dd className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-md border border-dashed border-accent/50 px-2 py-1 text-sm text-accent-text">
        TODO — {todoHint}
      </dd>
    </div>
  );
}

function Field({
  label,
  value,
  todoHint,
}: {
  label: string;
  value: string | null;
  todoHint: string;
}) {
  if (!value) return <TodoField label={label} todoHint={todoHint} />;
  return (
    <div>
      <dt className="font-mono text-xs text-ink-muted">{label}</dt>
      <dd className="mt-1 text-ink">{value}</dd>
    </div>
  );
}

function LinkField({ value, todoHint }: { value: string | null; todoHint: string }) {
  if (!value) return <TodoField label="Link" todoHint={todoHint} />;
  const isGithub = (() => {
    try {
      return new URL(value).hostname === "github.com";
    } catch {
      return false;
    }
  })();
  return (
    <div>
      <dt className="font-mono text-xs text-ink-muted">Link</dt>
      <dd className="mt-1">
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-ink ${underlineLink}`}
        >
          {isGithub ? "View on GitHub" : "View project"}
        </a>
      </dd>
    </div>
  );
}

export function Projects() {
  return (
    <section
      id="projects"
      className="section-pad section-gutter border-t border-hairline"
    >
      <SectionHeading
        id="projects"
        title="Projects"
        description="Two self-directed builds — a Laravel ERP and a from-scratch PHP framework — both open source."
      />

      <div className="mt-12 grid gap-6">
        {projects.map((project, index) => (
          <article
            key={project.name}
            data-reveal=""
            className="surface-card relative rounded-2xl border border-hairline-strong p-8 sm:p-14"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-4 right-6 text-[7rem] leading-none font-semibold text-ink/[0.05] sm:top-6 sm:text-[9rem]"
            >
              {String(index + 1).padStart(2, "0")}
            </span>

            <h3 className="relative text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02] font-medium tracking-[-0.015em] text-ink">
              {project.name}
            </h3>
            <p className="relative mt-3 max-w-lg text-lg text-ink-muted">
              {project.problem}
            </p>

            <dl className="relative mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
              <LinkField value={project.link} todoHint="add a live/repo link" />
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
