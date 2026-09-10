"use client";

import { useState, type FormEvent } from "react";
import { contact } from "@/lib/content";
import { btnPrimary, underlineLink } from "@/lib/styles";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./motion/reveal";

const inputClass =
  "w-full rounded-lg border border-hairline-strong bg-bg px-4 py-3 text-ink placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio contact from ${name || "a visitor"}`);
    const body = encodeURIComponent(
      `${message}\n\n— ${name}${email ? ` (${email})` : ""}`,
    );
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
  }

  return (
    <section
      id="contact"
      className="section-pad section-gutter border-t border-hairline"
    >
      <Reveal>
        <SectionHeading
          title="Let's talk"
          description="Open to Tier 2/3 SaaS support, ITSM, and dev-adjacent roles."
        />
      </Reveal>

      <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <ul className="flex flex-col gap-5">
            <li>
              <p className="text-sm text-ink-muted">Email</p>
              <a
                href={`mailto:${contact.email}`}
                className={`text-lg text-ink ${underlineLink}`}
              >
                {contact.email}
              </a>
            </li>
            <li>
              <p className="text-sm text-ink-muted">Phone</p>
              <a
                href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
                className={`text-lg text-ink ${underlineLink}`}
              >
                {contact.phone}
              </a>
            </li>
            <li>
              <p className="text-sm text-ink-muted">LinkedIn</p>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-lg text-ink ${underlineLink}`}
              >
                linkedin.com/in/richu-thankachan
              </a>
            </li>
            <li>
              <p className="text-sm text-ink-muted">Location</p>
              <p className="text-lg text-ink">{contact.location}</p>
            </li>
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 lg:col-span-6 lg:col-start-7"
        >
          <div>
            <label htmlFor="contact-name" className="mb-1.5 block text-sm text-ink-muted">
              Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="mb-1.5 block text-sm text-ink-muted">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="mb-1.5 block text-sm text-ink-muted">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={inputClass}
            />
          </div>
          <button type="submit" className={`${btnPrimary} mt-1 self-start`}>
            Send message
          </button>
          <p className="text-xs text-ink-muted">
            Opens your email client with this addressed to {contact.email}.
          </p>
        </form>
      </div>
    </section>
  );
}
