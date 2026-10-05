import { metrics, summaryFull } from "@/lib/content";
import { SectionHeading } from "./section-heading";
import { Reveal, RevealGroup, RevealItem } from "./reveal";
import { CountUp } from "./count-up";

/**
 * About as a service status page: a format anyone in ITSM recognizes at a
 * glance. The rows are the résumé's headline numbers.
 */
export function About() {
  return (
    <section id="about" className="section-pad section-gutter border-t border-hairline">
      <SectionHeading id="about" title="About" />

      <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal as="p" className="text-lg leading-relaxed text-ink-muted lg:col-span-5">
          {summaryFull}
        </Reveal>

        <Reveal className="surface-card overflow-hidden rounded-2xl border border-hairline-strong lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-6 py-5 sm:px-8">
            <p className="font-mono text-xs tracking-[0.08em] text-ink-muted uppercase">
              status.richu-thankachan
            </p>
            <p className="flex items-center gap-2.5 text-sm font-medium text-ink">
              <span aria-hidden="true" className="status-dot" />
              All systems operational
            </p>
          </div>
          <RevealGroup as="dl" stagger={0.1} className="divide-y divide-hairline">
            {metrics.map((metric) => (
              <RevealItem
                key={metric.service}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-1 px-6 py-6 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:px-8"
              >
                <dt className="min-w-0">
                  <span className="block font-medium text-ink">{metric.service}</span>
                  <span className="mt-0.5 block text-sm text-ink-muted">{metric.label}</span>
                </dt>
                <dd className="text-right text-[clamp(2rem,4.5vw,3.25rem)] leading-none font-semibold tracking-[-0.02em] text-ink tabular-nums">
                  <CountUp value={metric.value} suffix={metric.suffix} />
                </dd>
                <dd className="col-span-2 flex items-center gap-2 font-mono text-xs text-ok sm:col-span-1">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ok" />
                  Operational
                </dd>
              </RevealItem>
            ))}
          </RevealGroup>
        </Reveal>
      </div>
    </section>
  );
}
