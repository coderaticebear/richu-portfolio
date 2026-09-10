"use client";

import { useEffect, useState } from "react";

/**
 * True for devices with a fine pointer that can hover (mouse/trackpad).
 * Used to gate parallax and other pointer-only flourishes — touch devices
 * keep the reveal animations but lose cursor-driven effects.
 */
export function usePointerCapable() {
  const [capable, setCapable] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    // matchMedia isn't available at SSR time, so this has to sync on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCapable(mq.matches);
    const listener = (e: MediaQueryListEvent) => setCapable(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  return capable;
}
