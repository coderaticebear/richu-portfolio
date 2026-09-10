"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { navLinks, contact } from "@/lib/content";
import { useActiveSection } from "@/lib/use-active-section";
import { PersonaToggle } from "@/components/persona-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { springSnappy } from "@/lib/motion";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useActiveSection(navLinks.map((l) => l.href.slice(1)));

  useEffect(() => {
    const sentinel = document.getElementById("top-sentinel");
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-hairline bg-surface/80 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="section-gutter flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link
          href="#top"
          className="shrink-0 text-base font-semibold tracking-tight text-ink focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          Richu Thankachan
        </Link>

        <nav
          aria-label="Section"
          className="hidden items-center gap-1 lg:flex"
        >
          {navLinks.map((link) => {
            const isActive = activeId === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "location" : undefined}
                className={clsx(
                  "relative rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
                  isActive ? "text-ink" : "text-ink-muted hover:text-ink",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-ink/[0.07]"
                    transition={springSnappy}
                  />
                )}
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <PersonaToggle scope="desktop" />
          <ThemeToggle />
          <a
            href={contact.resumeHref}
            download
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            Download Résumé
          </a>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-ink lg:hidden focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.path
                  key="close"
                  d="M3 3l12 12M15 3 3 15"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  initial={{ opacity: 0, rotate: -45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.18 }}
                  style={{ transformOrigin: "center" }}
                />
              ) : (
                <motion.path
                  key="open"
                  d="M2 4.5h14M2 9h14M2 13.5h14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  initial={{ opacity: 0, rotate: 45 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -45 }}
                  transition={{ duration: 0.18 }}
                  style={{ transformOrigin: "center" }}
                />
              )}
            </AnimatePresence>
          </svg>
        </button>
      </div>

      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="section-gutter flex flex-col gap-6 border-t border-hairline bg-surface pb-8 pt-6 lg:hidden"
      >
        <nav aria-label="Section" className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-2 py-2.5 text-base font-medium text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center justify-between gap-3">
          <PersonaToggle scope="mobile" />
          <ThemeToggle />
        </div>
        <a
          href={contact.resumeHref}
          download
          className="rounded-full bg-accent px-4 py-3 text-center text-sm font-semibold text-accent-ink transition-transform duration-150 active:scale-[0.97]"
        >
          Download Résumé
        </a>
      </div>
    </header>
  );
}
