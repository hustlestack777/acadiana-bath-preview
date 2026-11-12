"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { LRL_REACH_TIMES, LRL_TOPICS } from "@/lib/lrl-inquiry";

const field =
  "mt-1 w-full rounded-xl border border-input bg-card px-3 py-2 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring/60";
const labelClass = "text-sm font-medium text-foreground";

type Status = "idle" | "sending" | "sent" | "error";

export function LrlCredit() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [topic, setTopic] = useState("");
  const [reachTime, setReachTime] = useState("");
  const [comment, setComment] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const nameId = useId();
  const phoneId = useId();
  const emailId = useId();
  const businessId = useId();
  const topicId = useId();
  const timeId = useId();
  const commentId = useId();
  const errorId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const root = dialogRef.current;
    const first = root?.querySelector<HTMLElement>("input, select, textarea, button");
    first?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      return;
    }
    if (wasOpen.current) triggerRef.current?.focus();
  }, [open]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/lrl-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          business,
          topic,
          reachTime,
          comment,
          sourceSite: "Acadiana Bathrooms",
          sourcePage: typeof window !== "undefined" ? window.location.href : "",
          company_fax: (event.currentTarget.elements.namedItem("company_fax") as HTMLInputElement | null)?.value || "",
        }),
      });
      const payload = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !payload?.ok) {
        setStatus("error");
        setError(payload?.error || "We couldn't send that. Please try again.");
        return;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("We couldn't send that. Please try again.");
    }
  }

  function close() {
    setOpen(false);
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="underline underline-offset-4 decoration-white/35 hover:decoration-white/80"
        onClick={() => {
          setOpen(true);
          if (status === "sent") {
            setStatus("idle");
            setName("");
            setPhone("");
            setEmail("");
            setBusiness("");
            setTopic("");
            setReachTime("");
            setComment("");
            setError("");
          }
        }}
      >
        Designed &amp; marketed by Lagniappe Realm Labs
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/55 p-4 sm:items-center"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lrl-inquiry-title"
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-[color:var(--background,#f3efe4)] px-5 py-5 text-foreground shadow-2xl sm:px-6 sm:py-6"
          >
            {status === "sent" ? (
              <div className="py-4 text-center">
                <p id="lrl-inquiry-title" className="text-2xl">
                  Got it. Shaun will reach out personally.
                </p>
                <button type="button" className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" onClick={close}>
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Shaun Brasher · shaun@lagniapperealmlabs.com</p>
                    <h2 id="lrl-inquiry-title" className="mt-2 text-2xl leading-snug sm:text-3xl">
                      Want a site like this? Tell Shaun what you need.
                    </h2>
                  </div>
                  <button type="button" className="rounded-md px-2 py-1 text-sm text-muted-foreground hover:text-foreground" onClick={close} aria-label="Close">
                    Close
                  </button>
                </div>

                <div>
                  <label className={labelClass} htmlFor={nameId}>Name</label>
                  <input id={nameId} name="name" className={field} type="text" autoComplete="name" autoCapitalize="words" required value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div>
                  <label className={labelClass} htmlFor={phoneId}>Best phone number</label>
                  <input id={phoneId} name="phone" className={field} type="tel" inputMode="tel" autoComplete="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} />
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    By submitting, you agree Shaun may call or text you about your request. Msg and data rates may apply.{" "}
                    <a href="/lrl-privacy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                      Privacy note
                    </a>
                  </p>
                </div>

                <div>
                  <label className={labelClass} htmlFor={emailId}>
                    Email <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <input id={emailId} name="email" className={field} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div>
                  <label className={labelClass} htmlFor={businessId}>
                    Business name <span className="font-normal text-muted-foreground">(optional)</span>
                  </label>
                  <input id={businessId} name="organization" className={field} type="text" autoComplete="organization" autoCapitalize="words" value={business} onChange={(e) => setBusiness(e.target.value)} />
                </div>

                <div>
                  <label className={labelClass} htmlFor={topicId}>What&apos;s it about?</label>
                  <select id={topicId} name="topic" className={field} required value={topic} onChange={(e) => setTopic(e.target.value)}>
                    <option value="">Choose one</option>
                    {LRL_TOPICS.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass} htmlFor={timeId}>Best time to reach you</label>
                  <select id={timeId} name="reachTime" className={field} required value={reachTime} onChange={(e) => setReachTime(e.target.value)}>
                    <option value="">Choose one</option>
                    {LRL_REACH_TIMES.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass} htmlFor={commentId}>Anything else?</label>
                  <textarea id={commentId} name="comment" className={field + " min-h-24"} rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
                </div>

                <div className="hidden" aria-hidden="true">
                  <label htmlFor={`${nameId}-fax`}>Company fax</label>
                  <input id={`${nameId}-fax`} name="company_fax" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                {error ? (
                  <p id={errorId} className="text-sm text-destructive" role="alert">{error}</p>
                ) : null}

                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-base font-medium text-primary-foreground disabled:opacity-60"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending…" : "Send to Shaun"}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
