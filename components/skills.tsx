"use client";

import clsx from "clsx";
import { skillGroups } from "@/lib/content";
import { usePersona, emphasisFor } from "@/lib/persona-context";
import { SectionHeading } from "./section-heading";

export function Skills() {
  const { view } = usePersona();

  return (
    <section id="skills" className="section-pad section-gutter border-t border-hairline">
      <SectionHeading
        title="Core Skills"
        description="Use the toggle in the nav to see this reshape for a Support or Developer read — nothing here disappears, it just comes forward or steps back."
      />

      <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
        {skillGroups.map((group) => (
          <div key={group.label}>
            <h3 className="text-sm font-semibold text-ink">{group.label}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => {
                const state = emphasisFor(view, item.persona);
                return (
                  <span
                    key={item.name}
                    className={clsx(
                      "rounded-full border px-3 py-1.5 text-sm",
                      state === "fg"
                        ? "border-hairline-strong text-ink"
                        : "border-hairline text-ink-recede",
                    )}
                  >
                    {item.name}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
