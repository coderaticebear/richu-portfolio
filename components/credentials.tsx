import type { CSSProperties } from "react";
import { credentials, education } from "@/lib/content";
import { SectionHeading } from "./section-heading";
import { RevealGroup, RevealItem } from "./reveal";
import { CountUp } from "./count-up";

export function Credentials() {
  return (
    <section
      id="credentials"
      className="section-pad section-gutter border-t border-hairline"
    >
      <SectionHeading id="credentials" title="Credentials & Education" />

      <div className="mt-12">
        <h3 className="text-sm font-semibold text-ink">Certifications</h3>
        <RevealGroup stagger={0.12} className="mt-5 grid gap-5 sm:grid-cols-2">
          {credentials.map((cred) => {
            const complete = cred.status === "complete";
            const progress = complete ? 100 : (cred.progress ?? 0);
            return (
              <RevealItem
                key={cred.name}
                className="surface-card flex flex-col gap-6 rounded-2xl border border-hairline-strong p-7 sm:flex-row sm:items-center sm:gap-8"
              >
                <div className="shrink-0 text-[clamp(3rem,6vw,4.5rem)] leading-none font-semibold tracking-[-0.02em] text-ink">
                  <CountUp value={progress} suffix="%" />
                </div>

                <div className="min-w-0">
                  <p className="text-lg font-medium text-ink">{cred.name}</p>
                  <p className="mt-0.5 text-sm text-ink-muted">{cred.issuer}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-accent/40 px-2.5 py-0.5 font-mono text-xs text-accent-text">
                      {complete ? "Complete" : "In progress"}
                    </span>
                    {!complete && cred.target ? (
                      <span className="text-sm text-ink-muted">targeting {cred.target}</span>
                    ) : null}
                  </div>
                  <div
                    role="progressbar"
                    aria-label={`${cred.name} progress`}
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    className="mt-3 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-hairline-strong"
                  >
                    <div
                      className="progress-fill h-full w-full rounded-full bg-accent"
                      style={{ "--p": progress / 100 } as CSSProperties}
                    />
                  </div>
                </div>
              </RevealItem>
            );
          })}
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
