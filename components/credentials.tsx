import { credentials, education } from "@/lib/content";
import { SectionHeading } from "./section-heading";

export function Credentials() {
  return (
    <section
      id="credentials"
      className="section-pad section-gutter border-t border-hairline"
    >
      <SectionHeading title="Credentials & Education" />

      <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <h3 className="text-sm font-semibold text-ink">Certifications</h3>
          <ul className="mt-5 flex flex-col gap-6">
            {credentials.map((cred) => (
              <li key={cred.name}>
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
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${cred.progress}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink">Education</h3>
          <ul className="mt-5 flex flex-col gap-6">
            {education.map((edu) => (
              <li key={edu.school}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <p className="font-medium text-ink">{edu.school}</p>
                  <p className="font-mono text-sm text-ink-muted">
                    {edu.period}
                  </p>
                </div>
                <p className="mt-1 text-ink-muted">{edu.credential}</p>
                <p className="text-sm text-ink-muted">{edu.location}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
