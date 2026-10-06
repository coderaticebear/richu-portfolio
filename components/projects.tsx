"use client";

import { useRef, useState } from "react";
import { projects } from "@/lib/content";
import type { Project } from "@/lib/types";
import type { ThemeColors } from "@/lib/canvas/theme-colors";
import { useCanvasEffect } from "@/lib/canvas/use-canvas-effect";
import { underlineLink } from "@/lib/styles";
import { EffectCanvas, PauseButton } from "./effect-controls";
import { SectionHeading } from "./section-heading";

function repoSlug(link: string | null) {
  if (!link) return null;
  try {
    return new URL(link).pathname.split("/").filter(Boolean).pop() ?? null;
  } catch {
    return null;
  }
}

function isGithub(link: string) {
  try {
    return new URL(link).hostname === "github.com";
  } catch {
    return false;
  }
}

function ProjectCard({ project }: { project: Project }) {
  const { canvasRef, effectRef, status, paused, togglePause, invalidate } = useCanvasEffect(
    () =>
      import("./effects/case-file").then(
        (m) => (canvas: HTMLCanvasElement, colors: ThemeColors) =>
          m.createCaseFile(canvas, colors, project.diagram),
      ),
    { lowPowerScale: 0.75 },
  );
  // Hover previews the resolved diagram. The button pins whichever state
  // you ask for and overrides hover until the pointer leaves, so a click
  // always flips what you see.
  const state = useRef({ hovering: false, pinned: false, override: false });
  const [resolved, setResolved] = useState(false);

  function apply() {
    const s = state.current;
    const next = s.override ? s.pinned : s.pinned || s.hovering;
    effectRef.current?.setTarget(next ? 1 : 0);
    invalidate();
    setResolved(next);
  }

  const slug = repoSlug(project.link);

  return (
    <article
      data-reveal=""
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        state.current.hovering = true;
        apply();
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        state.current.hovering = false;
        state.current.override = false;
        apply();
      }}
      className="surface-card row-span-4 grid grid-rows-subgrid gap-0 overflow-hidden rounded-2xl border border-hairline-strong hover:-translate-y-1"
    >
      <div className="relative aspect-[16/9] border-b border-hairline bg-surface">
        <EffectCanvas canvasRef={canvasRef} status={status} className="absolute inset-0" />
        {status === "ready" ? (
          <>
            <button
              type="button"
              aria-pressed={resolved}
              onClick={() => {
                state.current.pinned = !resolved;
                state.current.override = true;
                apply();
              }}
              className="absolute top-3 right-3 cursor-pointer rounded-full border border-hairline-strong bg-bg/70 px-3 py-1.5 font-mono text-xs text-ink backdrop-blur-sm transition-[border-color,color,transform] duration-150 hover:border-accent/50 hover:text-accent-text active:scale-[0.96]"
            >
              {resolved ? "Show the noise" : "Resolve"}
            </button>
            <PauseButton
              paused={paused}
              onToggle={togglePause}
              label={`${project.name} preview animation`}
              className="absolute bottom-3 left-3"
            />
          </>
        ) : null}
      </div>

      <div className="px-7 pt-7 sm:px-9 sm:pt-9">
        <p className="font-mono text-xs tracking-[0.08em] text-ink-recede uppercase">
          Case file{slug ? ` · ${slug}` : ""}
        </p>
        <h3 className="mt-2 text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05] font-medium tracking-[-0.015em] text-ink">
          {project.name}
        </h3>
        <p className="mt-3 text-ink-muted">{project.problem}</p>
      </div>

      {/* Two columns only once the card itself is wide enough; side-by-side
          cards at 1024px are too narrow for it. */}
      <div className="@container px-7 pt-8 pb-7 sm:px-9 sm:pb-9">
        <dl className="grid gap-5 @lg:grid-cols-2">
          <div>
            <dt className="font-mono text-xs text-ink-muted">Stack</dt>
            <dd className="mt-1.5 flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <span key={tech} className="rounded-full border border-hairline-strong px-2.5 py-1 text-sm text-ink">
                  {tech}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-xs text-ink-muted">Role</dt>
            <dd className="mt-1.5 text-ink">{project.role}</dd>
          </div>
          <div className={project.aiNote ? undefined : "@lg:col-span-2"}>
            <dt className="font-mono text-xs text-ink-muted">Outcome</dt>
            <dd className="mt-1.5 text-ink">{project.outcome}</dd>
          </div>
          {project.aiNote ? (
            <div>
              <dt className="font-mono text-xs text-ink-muted">Built with AI</dt>
              <dd className="mt-1.5 text-ink">{project.aiNote}</dd>
            </div>
          ) : null}
        </dl>
      </div>

      <div className="flex items-center border-t border-hairline px-7 py-4 sm:px-9">
        {project.link ? (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className={`text-ink ${underlineLink}`}>
            {isGithub(project.link) ? "View on GitHub" : "View project"}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          <span className="text-sm text-ink-muted">Not public yet</span>
        )}
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <section id="projects" className="section-pad section-gutter border-t border-hairline">
      <SectionHeading
        id="projects"
        title="Projects"
        description="Two self-directed builds — a Laravel ERP and a from-scratch PHP framework — both open source. Hover a preview to resolve it."
      />
      {/* Each card is a 4-row subgrid (preview, header, details, link), so
          the parts line up across the two cards whatever the copy length. */}
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </section>
  );
}
