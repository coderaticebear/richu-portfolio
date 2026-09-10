import type { ReactNode } from "react";

export function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: ReactNode;
}) {
  return (
    <div className="max-w-[40rem]">
      <h2 className="text-[clamp(2rem,4vw,2.75rem)] font-semibold tracking-normal text-ink">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-ink-muted">{description}</p>
      )}
    </div>
  );
}
