import { contact } from "@/lib/content";
import { underlineLink } from "@/lib/styles";
import { DebugMode } from "./debug-mode";

export function Footer() {
  return (
    <footer className="section-gutter border-t border-hairline pt-10 pb-8">
      {/* A quiet closing mark, not a second hero moment — branding.md is
          explicit that a repeated logo should defer to content, and the
          site already spends its "big" typography on real data (About's
          stats, Experience's ordinals, Credentials' percentages). This
          stays small on purpose. */}
      <p
        aria-hidden="true"
        className="select-none text-[clamp(1.25rem,3.5vw,1.75rem)] leading-none font-medium tracking-[-0.01em] text-ink/[0.14]"
      >
        Richu Thankachan
      </p>
      <div className="mt-5 flex flex-col items-start justify-between gap-3 text-sm text-ink-muted sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} Richu Thankachan. Built with Next.js.</p>
        <div className="flex flex-wrap items-center gap-4">
          <a href={`mailto:${contact.email}`} className={underlineLink}>
            {contact.email}
          </a>
          <DebugMode />
        </div>
      </div>
    </footer>
  );
}
