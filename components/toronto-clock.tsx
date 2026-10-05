"use client";

import { useSyncExternalStore } from "react";

const formatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Toronto",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function subscribe(onTick: () => void) {
  const id = window.setInterval(onTick, 15_000);
  return () => window.clearInterval(id);
}

/**
 * Richu's local time, for recruiters in other time zones. The server
 * can't know the visitor's "now", so it renders just the city and the
 * time appears right after hydration.
 */
export function TorontoClock({ className }: { className?: string }) {
  const time = useSyncExternalStore(
    subscribe,
    () => formatter.format(new Date()),
    () => "",
  );

  return (
    <span className={className} data-testid="toronto-clock">
      <span>Toronto</span>
      {time ? (
        <>
          {" "}
          <span className="font-mono tabular-nums text-ink">{time}</span>
          <span className="sr-only"> local time</span>
        </>
      ) : null}
    </span>
  );
}
