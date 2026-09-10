import { metrics, summaryFull } from "@/lib/content";
import { SectionHeading } from "./section-heading";
import { Reveal, RevealGroup, RevealItem } from "./motion/reveal";
import { CountUp } from "./motion/count-up";

export function About() {
  return (
    <section id="about" className="section-pad section-gutter border-t border-hairline">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <Reveal>
            <SectionHeading title="About" />
            <p className="content-col mt-6 text-lg leading-relaxed text-ink-muted">
              {summaryFull}
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-4 lg:col-start-9">
          <RevealGroup
            as="dl"
            stagger={0.08}
            className="surface-card flex flex-col divide-y divide-hairline rounded-2xl border border-hairline"
          >
            {metrics.map((metric) => (
              <RevealItem
                key={metric.label}
                className="flex items-baseline justify-between gap-4 px-6 py-5"
              >
                <dt className="text-sm text-ink-muted">{metric.label}</dt>
                <dd className="font-mono text-2xl font-semibold whitespace-nowrap text-ink">
                  <CountUp value={metric.value} suffix={metric.suffix} />
                </dd>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
