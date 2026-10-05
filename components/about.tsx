import { metrics, summaryFull } from "@/lib/content";
import { SectionHeading } from "./section-heading";
import { Reveal, RevealGroup, RevealItem } from "./reveal";
import { CountUp } from "./count-up";

export function About() {
  return (
    <section id="about" className="section-pad section-gutter border-t border-hairline">
      <SectionHeading id="about" title="About" />
      <Reveal as="p" className="content-col mt-6 text-lg leading-relaxed text-ink-muted">
        {summaryFull}
      </Reveal>

      <RevealGroup stagger={0.1} className="mt-16 grid gap-x-8 gap-y-10 sm:grid-cols-3">
        {metrics.map((metric) => (
          <RevealItem key={metric.label} className="border-t border-hairline pt-5">
            <div className="text-[clamp(2.75rem,7vw,5.5rem)] leading-none font-semibold tracking-[-0.02em] text-ink">
              <CountUp value={metric.value} suffix={metric.suffix} />
            </div>
            <p className="mt-3 text-ink-muted">{metric.label}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
