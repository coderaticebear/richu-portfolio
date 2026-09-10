import { contact } from "@/lib/content";
import { underlineLink } from "@/lib/styles";

export function Footer() {
  return (
    <footer className="section-gutter border-t border-hairline pt-16 pb-8">
      <p
        aria-hidden="true"
        className="select-none text-[clamp(2.5rem,12vw,9rem)] leading-none font-semibold tracking-[-0.03em] text-ink/[0.06]"
      >
        Richu Thankachan
      </p>
      <div className="mt-8 flex flex-col items-start justify-between gap-3 text-sm text-ink-muted sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} Richu Thankachan. Built with Next.js.</p>
        <a href={`mailto:${contact.email}`} className={underlineLink}>
          {contact.email}
        </a>
      </div>
    </footer>
  );
}
