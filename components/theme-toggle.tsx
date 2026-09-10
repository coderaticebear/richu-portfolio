"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Standard next-themes hydration guard: the server can't know the stored
  // theme, so we render a stable default and flip to the real value only
  // after mount, avoiding a hydration mismatch.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={!isDark}
      className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-hairline bg-surface text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
    >
      {mounted && isDark ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M14 8.5A6 6 0 0 1 7.5 2 6.5 6.5 0 1 0 14 8.5Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.3" />
          <path
            d="M8 1v1.6M8 13.4V15M15 8h-1.6M2.6 8H1M12.7 3.3l-1.1 1.1M4.4 11.6l-1.1 1.1M12.7 12.7l-1.1-1.1M4.4 4.4 3.3 3.3"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}
