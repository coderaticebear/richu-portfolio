"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { Persona } from "./types";

export type ViewPersona = "neutral" | "support" | "developer";

interface PersonaContextValue {
  view: ViewPersona;
  setView: (v: ViewPersona) => void;
}

const PersonaContext = createContext<PersonaContextValue | null>(null);

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewPersona>("neutral");
  return (
    <PersonaContext.Provider value={{ view, setView }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const ctx = useContext(PersonaContext);
  if (!ctx) {
    throw new Error("usePersona must be used within a PersonaProvider");
  }
  return ctx;
}

/**
 * Re-weighting rule for the persona toggle: everything stays visible,
 * the toggle only decides what comes forward vs. recedes.
 * - neutral (default): nothing dims.
 * - support/developer: items tagged "both" always stay forward;
 *   items tagged for the other persona recede (dim), never hide.
 */
export function emphasisFor(view: ViewPersona, item: Persona): "fg" | "recede" {
  if (view === "neutral") return "fg";
  if (item === "both") return "fg";
  return item === view ? "fg" : "recede";
}
