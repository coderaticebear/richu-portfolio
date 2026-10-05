"use client";

import { useEffect, useState } from "react";

/**
 * Copies a shareable link straight to a section. Sits beside each section
 * heading; quiet until the heading is hovered or the button is focused
 * (always visible on touch screens, which have no hover).
 */
export function CopyLink({ targetId, label }: { targetId: string; label: string }) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return;
    const id = window.setTimeout(() => setMessage(""), 2200);
    return () => window.clearTimeout(id);
  }, [message]);

  async function copy() {
    const url = `${window.location.origin}${window.location.pathname}#${targetId}`;
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Link copied");
    } catch {
      setMessage(`Couldn't copy. The link ends in #${targetId}`);
    }
  }

  return (
    <span className="relative inline-flex shrink-0 items-center gap-2 self-center">
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy link to ${label}`}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-hairline-strong font-mono text-sm text-ink-muted opacity-0 transition-[opacity,color,transform] duration-150 group-hover/heading:opacity-100 hover:text-accent-text focus-visible:opacity-100 active:scale-[0.93] [@media(hover:none)]:opacity-100"
      >
        #
      </button>
      <span role="status" className="font-mono text-xs whitespace-nowrap text-ink-muted">
        {message}
      </span>
    </span>
  );
}
