"use client";

import clsx from "clsx";
import { motion } from "motion/react";
import { skillGroups } from "@/lib/content";
import { usePersona, emphasisFor } from "@/lib/persona-context";
import { springSmooth } from "@/lib/motion";
import { SectionHeading } from "./section-heading";
import { Reveal, RevealGroup, RevealItem } from "./motion/reveal";

export function Skills() {
  const { view } = usePersona();

  return (
    <section id="skills" className="section-pad section-gutter border-t border-hairline">
      <Reveal>
        <SectionHeading
          title="Core Skills"
          description="Use the toggle in the nav to see this reshape for a Support or Developer read — nothing here disappears, it just comes forward or steps back."
        />
      </Reveal>

      <RevealGroup stagger={0.1} className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
        {skillGroups.map((group) => (
          <RevealItem key={group.label}>
            <h3 className="text-sm font-semibold text-ink">{group.label}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item, i) => {
                const state = emphasisFor(view, item.persona);
                const fg = state === "fg";
                return (
                  <motion.span
                    key={item.name}
                    animate={{ opacity: fg ? 1 : 0.94, scale: fg ? 1 : 0.96 }}
                    transition={{ ...springSmooth, delay: Math.min(i, 8) * 0.015 }}
                    whileHover={{ scale: fg ? 1.04 : 1 }}
                    className={clsx(
                      "cursor-default rounded-full border px-3 py-1.5 text-sm transition-colors duration-200",
                      fg
                        ? "border-hairline-strong text-ink"
                        : "border-hairline text-ink-recede",
                    )}
                  >
                    {item.name}
                  </motion.span>
                );
              })}
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
