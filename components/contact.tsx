"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import clsx from "clsx";
import { contact, contactPriorities } from "@/lib/content";
import { btnPrimary, underlineLink } from "@/lib/styles";
import { useCanvasEffect } from "@/lib/canvas/use-canvas-effect";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { EffectCanvas } from "./effect-controls";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";

const inputClass =
  "w-full rounded-lg border border-hairline-strong bg-bg px-4 py-3 text-ink placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2";
const labelClass = "mb-1.5 block text-sm text-ink-muted";

const loadSparks = () => import("./effects/spark-burst").then((m) => m.createSparkBurst);

const STEPS = ["Received", "Routed to Richu", "Email draft opened"];

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState(contactPriorities[1].code);
  const [message, setMessage] = useState("");
  const [ticket, setTicket] = useState<{ id: string; step: number } | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const reducedMotion = usePrefersReducedMotion();
  const { canvasRef, effectRef, status } = useCanvasEffect(loadSparks, { loop: false });
  const submitRef = useRef<HTMLButtonElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.splice(0).forEach((id) => window.clearTimeout(id));
  }, []);

  const level = contactPriorities.find((p) => p.code === priority) ?? contactPriorities[1];
  const subjectLine = `[${level.code} · ${level.label}] ${subject.trim() || "Portfolio contact"}${
    name.trim() ? ` — ${name.trim()}` : ""
  }`;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const id = `RT-${1000 + Math.floor(Math.random() * 9000)}`;

    timers.current.splice(0).forEach((t) => window.clearTimeout(t));
    if (reducedMotion) {
      setTicket({ id, step: STEPS.length });
    } else {
      setTicket({ id, step: 1 });
      for (let step = 2; step <= STEPS.length; step++) {
        timers.current.push(
          window.setTimeout(() => setTicket((t) => (t ? { ...t, step } : t)), 480 * (step - 1)),
        );
      }
      const canvas = canvasRef.current?.getBoundingClientRect();
      const button = submitRef.current?.getBoundingClientRect();
      if (canvas && button) {
        effectRef.current?.burst(
          button.left + button.width / 2 - canvas.left,
          button.top + button.height / 2 - canvas.top,
        );
      }
    }
    setAnnouncement(`Ticket ${id} created. Your email app should open with the message ready to send.`);

    const body = `${message}\n\n— ${name}${email ? ` (${email})` : ""}\nTicket ${id}`;
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <section id="contact" className="section-pad section-gutter border-t border-hairline">
      <SectionHeading
        id="contact"
        title="Let's talk"
        description="Open to Tier 2/3 SaaS support, ITSM, and dev-adjacent roles. Send it like a ticket and I'll triage it."
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <ul className="flex flex-col gap-5">
            <li>
              <p className="text-sm text-ink-muted">Email</p>
              <a href={`mailto:${contact.email}`} className={`inline-block py-1 text-lg break-all text-ink ${underlineLink}`}>
                {contact.email}
              </a>
            </li>
            <li>
              <p className="text-sm text-ink-muted">Phone</p>
              <a
                href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
                className={`inline-block py-1 text-lg text-ink ${underlineLink}`}
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
                className={`inline-block py-1 text-lg text-ink ${underlineLink}`}
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

        <div className="relative lg:col-span-8">
          <Reveal className="surface-card grid overflow-hidden rounded-2xl border border-hairline-strong md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 sm:p-8 md:border-r md:border-hairline">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className={labelClass}>
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className={labelClass}>
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-subject" className={labelClass}>
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  placeholder="Tier 2 SaaS support role"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={inputClass}
                />
              </div>
              <fieldset>
                <legend className={labelClass}>Priority</legend>
                <div className="flex flex-wrap gap-2">
                  {contactPriorities.map((p) => (
                    <label
                      key={p.code}
                      className="cursor-pointer rounded-full border border-hairline-strong px-3 py-1.5 text-sm text-ink-muted transition-colors duration-150 has-[:checked]:border-accent has-[:checked]:bg-accent/10 has-[:checked]:text-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent"
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={p.code}
                        checked={priority === p.code}
                        onChange={() => setPriority(p.code)}
                        className="sr-only"
                      />
                      <span className="mr-1.5 font-mono font-medium text-ink">{p.code}</span>
                      {p.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor="contact-message" className={labelClass}>
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
              <button ref={submitRef} type="submit" className={`${btnPrimary} mt-1 self-start`}>
                Submit ticket
              </button>
            </form>

            <div className="flex flex-col gap-6 border-t border-hairline p-6 sm:p-8 md:border-t-0">
              <div>
                <p className="font-mono text-xs tracking-[0.08em] text-ink-muted uppercase">Ticket</p>
                <p className="mt-1 font-mono text-3xl tabular-nums text-ink">{ticket?.id ?? "RT-····"}</p>
              </div>
              <div>
                <p className="font-mono text-xs tracking-[0.08em] text-ink-muted uppercase">Subject line I receive</p>
                <p className="mt-1.5 rounded-lg border border-hairline bg-bg px-3 py-2 font-mono text-sm break-words text-ink">
                  {subjectLine}
                </p>
              </div>
              <ol className="flex flex-col gap-2.5">
                {STEPS.map((label, i) => {
                  const done = !!ticket && ticket.step > i;
                  return (
                    <li
                      key={label}
                      className={clsx(
                        "flex items-center gap-3 text-sm transition-colors duration-300",
                        done ? "text-ink" : "text-ink-muted",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={clsx(
                          "h-2.5 w-2.5 shrink-0 rounded-full border transition-colors duration-300",
                          done ? "border-accent bg-accent" : "border-hairline-strong",
                        )}
                      />
                      {label}
                      <span className="sr-only">{done ? " (done)" : " (pending)"}</span>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-auto text-xs text-ink-muted">
                Opens your email client with this addressed to {contact.email}.
              </p>
            </div>
          </Reveal>
          <EffectCanvas
            canvasRef={canvasRef}
            status={status}
            className="pointer-events-none absolute inset-0"
          />
          <p className="sr-only" aria-live="polite">
            {announcement}
          </p>
        </div>
      </div>
    </section>
  );
}
