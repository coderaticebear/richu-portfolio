"use client";

import { skillGroups } from "@/lib/content";
import { SectionHeading } from "./section-heading";
import { Reveal, RevealGroup, RevealItem } from "./motion/reveal";

export function Skills() {
  return (
    <section id="skills" className="section-pad section-gutter border-t border-hairline">
      <Reveal>
        <SectionHeading title="Core Skills" />
      </Reveal>

      <RevealGroup stagger={0.1} className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
        {skillGroups.map((group) => (
          <RevealItem key={group.label}>
            <h3 className="text-sm font-semibold text-ink">{group.label}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item.name}
                  className="rounded-full border border-hairline-strong px-3 py-1.5 text-sm text-ink transition-transform duration-150 hover:scale-[1.04]"
                >
                  {item.name}
                </span>
              ))}
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
