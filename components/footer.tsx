import { contact } from "@/lib/content";
import { underlineLink } from "@/lib/styles";

export function Footer() {
  return (
    <footer className="section-gutter border-t border-hairline py-8">
      <div className="flex flex-col items-start justify-between gap-3 text-sm text-ink-muted sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} Richu Thankachan. Built with Next.js.</p>
        <a href={`mailto:${contact.email}`} className={underlineLink}>
          {contact.email}
        </a>
      </div>
    </footer>
  );
}
