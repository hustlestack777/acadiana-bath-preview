"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { AddressAutocomplete } from "@/components/address-autocomplete";
import { designCopy, designStyles, findStyle } from "@/lib/design-styles";
import { resizePhoto } from "@/lib/photo-resize";
import { brand } from "@/lib/copy";
import { budgetOptions, budgetQuestion, orderByBudget } from "@/lib/budget";
import { cn } from "cn";

type Step = "photos" | "budget" | "style" | "rendering" | "teaser" | "reveal";
type Shot = { file: File; url: string };

const MAX_TRIES = 3; // first try + up to 2 retries
const TOKEN_KEY = "abc-design-token";

const field =
  "h-12 w-full rounded-xl border border-border bg-card px-4 text-base outline-none focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive";

export function DesignTool({ initialStyle = "" }: { initialStyle?: string }) {
  const [step, setStep] = useState<Step>("photos");
  const [shots, setShots] = useState<Shot[]>([]);
  const [style, setStyle] = useState(findStyle(initialStyle)?.key ?? "");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState("");
  const [busyMsg, setBusyMsg] = useState(0);
  const [progress, setProgress] = useState(0);
  const [design, setDesign] = useState<{ id: string; teaser: string } | null>(null);
  const [reveal, setReveal] = useState<{ before: string; after: string; style: string } | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", street: "", city: "", zip: "", latitude: "", longitude: "", smsConsent: false, company_fax: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const shotsRef = useRef<Shot[]>([]);
  useEffect(() => {
    shotsRef.current = shots;
  }, [shots]);
  useEffect(() => () => shotsRef.current.forEach((shot) => URL.revokeObjectURL(shot.url)), []);
  const firstStep = useRef(true);
  useEffect(() => {
    if (firstStep.current) {
      firstStep.current = false;
      return;
    }
    // scrollIntoView can return a Promise in newer browsers; never return it from the effect.
    void topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  // Rotating scanner copy; the bar stays under 90% until the server answers.
  useEffect(() => {
    if (step !== "rendering") return;
    const started = Date.now();
    const timer = window.setInterval(() => {
      const seconds = (Date.now() - started) / 1000;
      setBusyMsg(Math.min(designCopy.steps.length - 1, Math.floor(seconds / 9)));
      setProgress(Math.min(90, Math.round(90 * (1 - Math.exp(-seconds / 18)))));
    }, 400);
    return () => window.clearInterval(timer);
  }, [step]);

  async function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    setError("");
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    const next = [...shots];
    for (const file of files) {
      if (next.length >= 2) break;
      const resized = await resizePhoto(file);
      if (!resized) {
        setError("We couldn't open that photo. Try a JPEG or a screenshot of it.");
        continue;
      }
      next.push({ file: resized, url: URL.createObjectURL(resized) });
    }
    setShots(next);
  }

  function removeShot(index: number) {
    setShots((current) => {
      const gone = current[index];
      if (gone) URL.revokeObjectURL(gone.url);
      return current.filter((_, i) => i !== index);
    });
  }

  const render = useCallback(async () => {
    if (!shots[0] || !style) return;
    setError("");
    setProgress(0);
    setBusyMsg(0);
    setStep("rendering");
    for (let attempt = 1; attempt <= MAX_TRIES; attempt += 1) {
      const body = new FormData();
      body.set("photo", shots[0].file);
      if (shots[1]) body.set("photo2", shots[1].file);
      body.set("style", style);
      body.set("budget", budget);
      body.set("company_fax", form.company_fax);
      body.set("token", window.localStorage.getItem(TOKEN_KEY) || "");
      try {
        const response = await fetch("/api/design/render", { method: "POST", body });
        const json = await response.json().catch(() => ({}));
        if (response.ok && json.ok) {
          setProgress(100);
          setDesign({ id: json.id, teaser: json.teaser });
          window.setTimeout(() => setStep("teaser"), 350);
          return;
        }
        if (json.retryable === false || attempt === MAX_TRIES) {
          setError(json.error || "The designer hit a snag. Try another photo.");
          setStep("style");
          return;
        }
      } catch {
        if (attempt === MAX_TRIES) {
          setError("We lost the connection. Check your signal and try again.");
          setStep("style");
          return;
        }
      }
    }
  }, [shots, style, budget, form.company_fax]);

  async function unlock(event: FormEvent) {
    event.preventDefault();
    if (!design) return;
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "Enter your name.";
    if (form.phone.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "").length !== 10) next.phone = "Enter a 10-digit mobile number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email.";
    if (!/\d/.test(form.street)) next.street = "Enter the street address with the house number.";
    if (!form.city.trim()) next.city = "Enter your town.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSending(true);
    const body = new FormData();
    body.set("id", design.id);
    for (const [key, value] of Object.entries(form)) body.set(key, String(value));
    try {
      const response = await fetch("/api/design/unlock", { method: "POST", body });
      const json = await response.json().catch(() => ({}));
      if (!response.ok || !json.ok) {
        setErrors(json.errors || {});
        setError(json.error || "We couldn't unlock that. Try again.");
        return;
      }
      window.localStorage.setItem(TOKEN_KEY, json.token);
      setReveal({ before: json.before, after: json.after, style: json.style });
      setError("");
      setStep("reveal");
    } catch {
      setError("We lost the connection. Try again.");
    } finally {
      setSending(false);
    }
  }

  function tryAnother() {
    setDesign(null);
    setReveal(null);
    setStyle("");
    setError("");
    setStep("style");
  }

  const chosen = findStyle(style);

  return (
    <div ref={topRef} className="scroll-mt-24 mx-auto w-full max-w-3xl px-5 pb-20" data-testid="design-tool">
      {error ? (
        <p role="alert" className="mb-5 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm" data-testid="design-error">
          {error}
        </p>
      ) : null}

      {step === "photos" ? (
        <section aria-labelledby="design-step-1">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Step 1 of 3</p>
          <h2 id="design-step-1" className="mt-2 font-heading text-3xl">Snap your shower</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{designCopy.tips} Add 1 or 2 photos. We design from the first one.</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <label className="flex h-14 cursor-pointer items-center justify-center rounded-full bg-primary px-5 text-base font-semibold text-primary-foreground">
              Take photo
              <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={addPhotos} disabled={shots.length >= 2} />
            </label>
            <label className="flex h-14 cursor-pointer items-center justify-center rounded-full border border-border bg-card px-5 text-base font-semibold">
              Upload
              <input type="file" accept="image/*" multiple className="sr-only" onChange={addPhotos} disabled={shots.length >= 2} data-testid="design-upload" />
            </label>
          </div>
          {shots.length ? (
            <ul className="mt-5 grid grid-cols-2 gap-3">
              {shots.map((shot, index) => (
                <li key={shot.url} className="relative overflow-hidden rounded-2xl border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={shot.url} alt={`Your photo ${index + 1}`} className="aspect-[4/3] w-full object-cover" />
                  <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">{index === 0 ? "We design this one" : "Extra photo"}</span>
                  <button type="button" onClick={() => removeShot(index)} className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <button
            type="button"
            disabled={!shots.length}
            onClick={() => setStep("budget")}
            className="mt-6 h-14 w-full rounded-full bg-[#1c1014] text-base font-semibold text-white disabled:opacity-40"
            data-testid="design-next"
          >
            Next: pick a look
          </button>
        </section>
      ) : null}

      {step === "budget" ? (
        <section aria-labelledby="design-budget">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Optional</p>
          <h2 id="design-budget" className="mt-2 font-heading text-3xl">{budgetQuestion}</h2>
          <p className="mt-2 text-sm text-muted-foreground">We&apos;ll show the looks that fit best first. You&apos;ll still see every look.</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {budgetOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                data-testid={`budget-${option.id}`}
                onClick={() => {
                  setBudget(option.id);
                  setStep("style");
                }}
                className={cn(
                  "h-14 rounded-2xl border bg-card px-3 text-base font-semibold",
                  budget === option.id ? "border-primary ring-3 ring-primary/40" : "border-border",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            data-testid="budget-skip"
            onClick={() => {
              setBudget("");
              setStep("style");
            }}
            className="mt-4 text-sm font-semibold underline underline-offset-4"
          >
            Skip
          </button>
        </section>
      ) : null}

      {step === "style" ? (
        <section aria-labelledby="design-step-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Step 2 of 3</p>
          <h2 id="design-step-2" className="mt-2 font-heading text-3xl">Pick a look</h2>
          <div className="mt-4 -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0" role="radiogroup" aria-label="Looks">
            {orderByBudget(designStyles, budget).map((item) => (
              <button
                key={item.key}
                type="button"
                role="radio"
                aria-checked={style === item.key}
                onClick={() => setStyle(item.key)}
                data-testid={`style-${item.key}`}
                className={cn(
                  "w-[72%] shrink-0 snap-start overflow-hidden rounded-2xl border bg-card text-left transition md:w-auto",
                  style === item.key ? "border-primary ring-3 ring-primary/40" : "border-border",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.alt} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <span className="block px-4 pt-3 font-semibold">{item.name}</span>
                <span className="block px-4 pb-1 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {item.path === "solid-surface" ? "Solid surface" : "Custom tile"}
                </span>
                <span className="block px-4 pb-4 text-sm text-muted-foreground">{item.blurb}</span>
              </button>
            ))}
          </div>
          <input
            type="text"
            name="company_fax"
            value={form.company_fax}
            onChange={(e) => setForm({ ...form, company_fax: e.target.value })}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />
          <div className="mt-5 flex gap-3">
            <button type="button" onClick={() => setStep("budget")} className="h-14 rounded-full border border-border px-6 font-semibold">
              Back
            </button>
            <button
              type="button"
              disabled={!style || !shots.length}
              onClick={render}
              className="h-14 flex-1 rounded-full bg-primary text-base font-semibold text-primary-foreground disabled:opacity-40"
              data-testid="design-render"
            >
              Design my bathroom
            </button>
          </div>
        </section>
      ) : null}

      {step === "rendering" && shots[0] ? (
        <section aria-live="polite" aria-busy="true" data-testid="design-rendering">
          <div className="relative overflow-hidden rounded-3xl bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={shots[0].url} alt="Your bathroom being scanned" className="aspect-[4/3] w-full object-cover opacity-80" />
            <span className="design-scanline pointer-events-none absolute inset-x-0 top-0 h-1/4" aria-hidden="true" />
          </div>
          <p className="mt-5 font-heading text-2xl">{designCopy.steps[busyMsg]}</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
            <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Usually 30 to 60 seconds. Keep this page open.</p>
        </section>
      ) : null}

      {step === "teaser" && design ? (
        <section aria-labelledby="design-step-3">
          <div className="relative overflow-hidden rounded-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={design.teaser} alt="Blurred preview of your new bathroom design" className="w-full" data-testid="design-teaser" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/25 p-6 text-center">
              <p className="font-heading text-2xl text-white drop-shadow">Unlock your full design + before/after.</p>
            </div>
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Step 3 of 3</p>
          <h2 id="design-step-3" className="mt-2 font-heading text-3xl">Where should we send it?</h2>
          <form onSubmit={unlock} noValidate className="mt-4 grid gap-4" data-testid="design-unlock-form">
            <Field id="d-name" label="First and last name" error={errors.name}>
              <input id="d-name" className={field} autoComplete="name" value={form.name} aria-invalid={Boolean(errors.name)} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field id="d-phone" label="Mobile phone" error={errors.phone}>
              <input id="d-phone" className={field} type="tel" inputMode="tel" autoComplete="tel" value={form.phone} aria-invalid={Boolean(errors.phone)} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Field>
            <Field id="d-street" label="Street address" error={errors.street}>
              <AddressAutocomplete
                id="d-street"
                value={form.street}
                invalid={Boolean(errors.street)}
                onChange={(street) => setForm((f) => ({ ...f, street, latitude: "", longitude: "" }))}
                onSelect={(address) =>
                  setForm((f) => ({
                    ...f,
                    street: address.street,
                    city: address.city || f.city,
                    zip: address.zip || f.zip,
                    latitude: address.lat != null ? String(address.lat) : "",
                    longitude: address.lon != null ? String(address.lon) : "",
                  }))
                }
              />
            </Field>
            <div className="grid grid-cols-[2fr_1fr] gap-3">
              <Field id="d-city" label="Town" error={errors.city}>
                <input id="d-city" className={field} autoComplete="address-level2" value={form.city} aria-invalid={Boolean(errors.city)} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </Field>
              <Field id="d-zip" label="ZIP (optional)" error={errors.zip}>
                <input id="d-zip" className={field} inputMode="numeric" autoComplete="postal-code" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} />
              </Field>
            </div>
            <Field id="d-email" label="Email" error={errors.email}>
              <input id="d-email" className={field} type="email" autoComplete="email" value={form.email} aria-invalid={Boolean(errors.email)} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <label className="flex items-start gap-3 text-sm leading-6" htmlFor="d-sms">
              <input id="d-sms" type="checkbox" className="mt-1 size-5 shrink-0" checked={form.smsConsent} onChange={(e) => setForm({ ...form, smsConsent: e.target.checked })} />
              <span>{designCopy.smsConsent} (Optional)</span>
            </label>
            <button type="submit" disabled={sending} className="h-14 rounded-full bg-primary text-base font-semibold text-primary-foreground disabled:opacity-50" data-testid="design-unlock">
              {sending ? "Unlocking…" : "Unlock my design"}
            </button>
            <p className="-mt-2 text-center text-[0.7rem] text-muted-foreground/80" data-testid="design-fine-print">{designCopy.finePrint}</p>
            <p className="text-xs leading-5 text-muted-foreground">
              {designCopy.privacy}{" "}
              <a href="/privacy" className="underline underline-offset-4">Privacy policy</a>
            </p>
          </form>
        </section>
      ) : null}

      {step === "reveal" && reveal ? (
        <section aria-labelledby="design-reveal" data-testid="design-reveal">
          <h2 id="design-reveal" className="font-heading text-3xl">Your new {reveal.style} bathroom</h2>
          <BeforeAfter before={reveal.before} after={reveal.after} />
          <div className="mt-4 grid grid-cols-2 gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={reveal.before} alt="Your bathroom now" className="rounded-2xl" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={reveal.after} alt="Your bathroom, redesigned" className="rounded-2xl" />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <a href={`/${chosen?.path === "solid-surface" ? "solid-surface#solid-quote" : "custom-tile#tile-quote"}`} className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground" data-testid="design-quote">
              Get my free quote
            </a>
            <a href={reveal.after} download="acadiana-bathroom-design.jpg" className="inline-flex h-14 items-center justify-center rounded-full border border-border bg-card px-6 text-base font-semibold">
              Download
            </a>
            <button type="button" onClick={tryAnother} className="h-14 rounded-full border border-border px-6 text-base font-semibold">
              Try your other free look
            </button>
            <a href={brand.phoneHref} className="inline-flex h-14 items-center justify-center rounded-full border border-border px-6 text-base font-semibold">
              Call {brand.phone}
            </a>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Thanks! Justin has your photos and the look you picked, and will reach out about your free quote.</p>
        </section>
      ) : null}
    </div>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">{label}</label>
      {children}
      {error ? <p id={`${id}-error`} className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

function BeforeAfter({ before, after }: { before: string; after: string }) {
  const [split, setSplit] = useState(50);
  return (
    <div className="relative mt-4 select-none overflow-hidden rounded-3xl" data-testid="design-slider">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt="Your bathroom, redesigned" className="block w-full" draggable={false} />
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt="Your bathroom now" className="h-full w-full object-cover" draggable={false} />
      </div>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: `${split}%` }} aria-hidden="true">
        <span className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xs font-bold text-[#1c1014] shadow">⇆</span>
      </div>
      <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">Before</span>
      <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">After</span>
      <input
        type="range"
        min={0}
        max={100}
        value={split}
        onChange={(e) => setSplit(Number(e.target.value))}
        aria-label="Slide between before and after"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
