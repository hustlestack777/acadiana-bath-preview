"use client";

import { useEffect, useState, type FormEvent } from "react";
import { MAIN_TOWNS, checkCity } from "@/lib/coverage";
import { brand, consentLabel, homeowners, pathProjects, payments, timings } from "@/lib/copy";
import { budgetOptions, budgetQuestion, budgetTag } from "@/lib/budget";
import { validateDetails, validateStreet } from "@/lib/estimate";
import { GROUT_COLORS, GROUT_PICK_EVENT, groutLabel } from "@/lib/grout";
import { cn } from "cn";

type Path = "solid" | "tile";

const field =
  "h-12 w-full rounded-xl border border-input bg-card px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring/60";
const label = "text-sm font-medium";

/** One-page quote form for a path. Posts to the same /api/leads route as /estimate. */
export function QuickQuote({ path }: { path: Path }) {
  const isTile = path === "tile";
  const options = pathProjects.filter((item) => item.id.startsWith(isTile ? "tile-" : "ss-"));
  const sourcePage = isTile ? "/custom-tile" : "/solid-surface";
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    zip: "",
    project: [] as string[],
    timing: "",
    homeowner: "",
    payment: "not-sure",
    budget: "",
    notes: "",
    grout: "",
    consent: false,
    company_fax: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isTile) return;
    const onPick = (event: Event) => {
      const code = (event as CustomEvent<string>).detail;
      setForm((current) => ({ ...current, grout: code }));
    };
    window.addEventListener(GROUT_PICK_EVENT, onPick);
    return () => window.removeEventListener(GROUT_PICK_EVENT, onPick);
  }, [isTile]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggle(id: string) {
    set("project", form.project.includes(id) ? form.project.filter((item) => item !== id) : [...form.project, id]);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const preferred = form.phone.trim() ? "phone" : "email";
    const grout = GROUT_COLORS.find((color) => color.code === form.grout);
    const features = [
      `Path: ${isTile ? "Custom tile" : "Solid surface"} quote form`,
      grout ? `Grout color pick: ${groutLabel(grout)} (screen color approximate)` : "",
      form.notes.trim(),
    ]
      .filter(Boolean)
      .join(" · ")
      .slice(0, 600);
    const next = validateDetails({
      project: form.project.join(","),
      notSure: false,
      width: "",
      depth: "",
      finish: "unsure",
      features,
      name: form.name,
      phone: form.phone,
      email: form.email,
      preferred,
      timing: form.timing,
      homeowner: form.homeowner,
      payment: form.payment,
      consent: form.consent,
    });
    const streetError = validateStreet(form.street);
    if (streetError) next.street = streetError;
    const coverage = checkCity(form.city);
    if (coverage.status === "empty") next.city = "Enter your town.";
    if (coverage.status === "invalid") next.city = "Keep the town under 80 characters.";
    if (!form.phone.trim() && !form.email.trim()) next.phone = "Enter a phone number or an email.";
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      document.getElementById(`${path}-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    setMessage("");
    const body = new FormData();
    const values: Record<string, string> = {
      sourcePage,
      street: form.street,
      latitude: "",
      longitude: "",
      city: form.city,
      zip: form.zip,
      project: form.project.join(","),
      notSure: "false",
      width: "",
      depth: "",
      height: "",
      measurements: "",
      finish: "unsure",
      features,
      name: form.name,
      phone: form.phone,
      email: form.email,
      preferred,
      marketing: "false",
      timing: form.timing,
      budget: budgetTag(form.budget),
      homeowner: form.homeowner,
      payment: form.payment,
      consent: String(form.consent),
      preferredCallTime: "",
      company_fax: form.company_fax,
    };
    for (const [key, value] of Object.entries(values)) body.set(key, value);
    try {
      const response = await fetch("/api/leads", { method: "POST", body });
      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        errors?: Record<string, string>;
      } | null;
      if (!response.ok || !data?.ok) {
        if (data?.errors) setErrors(data.errors);
        setStatus("error");
        setMessage(data?.error || "We couldn't save your request. Nothing was confirmed.");
        return;
      }
      setStatus("done");
      requestAnimationFrame(() => document.getElementById(`${path}-done`)?.focus());
    } catch {
      setStatus("error");
      setMessage("We couldn't reach the server. Your request was not saved.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-[1.6rem] border border-border bg-card p-7 text-center" role="status">
        <h3 id={`${path}-done`} tabIndex={-1} className="text-3xl">
          Thanks. Justin has your request.
        </h3>
        <p className="mt-3 leading-7 text-muted-foreground">
          He&apos;ll follow up to talk through your space. No payment was collected, and this is not a final quote.
        </p>
        <p className="mt-4">
          <a className="font-medium underline underline-offset-4" href={brand.phoneHref}>
            {brand.phone}
          </a>
        </p>
      </div>
    );
  }

  const err = (key: string) =>
    errors[key] ? (
      <p id={`${path}-${key}-error`} className="mt-1 text-sm text-destructive">
        {errors[key]}
      </p>
    ) : null;
  const groutPick = GROUT_COLORS.find((color) => color.code === form.grout);

  return (
    <form noValidate onSubmit={submit} className="grid gap-5 rounded-[1.6rem] border border-border bg-card p-5 shadow-[0_30px_80px_-40px_rgba(28,36,28,0.45)] sm:p-7">
      <fieldset>
        <legend className={label}>What are you thinking about?</legend>
        <div className="mt-2 flex flex-wrap gap-2" id={`${path}-project`} tabIndex={-1}>
          {options.map((item) => {
            const on = form.project.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(item.id)}
                className={cn(
                  "min-h-11 rounded-full border px-4 text-sm transition-colors",
                  on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/60",
                )}
              >
                {item.short}
              </button>
            );
          })}
        </div>
        {err("project")}
      </fieldset>

      {isTile ? (
        <div>
          <label className={label} htmlFor={`${path}-grout`}>
            Grout color <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <div className="mt-2 flex items-center gap-3">
            <span
              className="size-12 shrink-0 rounded-xl border border-border"
              style={{ background: groutPick?.hex ?? "repeating-linear-gradient(45deg,#e7e3d6 0 6px,#fffaf3 6px 12px)" }}
              aria-hidden="true"
            />
            <select id={`${path}-grout`} className={field} value={form.grout} onChange={(e) => set("grout", e.target.value)}>
              <option value="">Not sure yet</option>
              {GROUT_COLORS.map((color) => (
                <option key={color.code} value={color.code}>
                  {groutLabel(color)}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Screen colors are approximate.</p>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor={`${path}-name`}>Name</label>
          <input id={`${path}-name`} className={cn(field, "mt-1")} autoComplete="name" value={form.name} onChange={(e) => set("name", e.target.value)} aria-invalid={Boolean(errors.name)} />
          {err("name")}
        </div>
        <div>
          <label className={label} htmlFor={`${path}-phone`}>Phone</label>
          <input id={`${path}-phone`} className={cn(field, "mt-1")} type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} aria-invalid={Boolean(errors.phone)} />
          {err("phone")}
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor={`${path}-email`}>
            Email <span className="font-normal text-muted-foreground">(optional if you gave a phone)</span>
          </label>
          <input id={`${path}-email`} className={cn(field, "mt-1")} type="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} aria-invalid={Boolean(errors.email)} />
          {err("email")}
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor={`${path}-street`}>Street address</label>
          <input id={`${path}-street`} className={cn(field, "mt-1")} autoComplete="street-address" placeholder="123 Main St" value={form.street} onChange={(e) => set("street", e.target.value)} aria-invalid={Boolean(errors.street)} />
          {err("street")}
        </div>
        <div>
          <label className={label} htmlFor={`${path}-city`}>Town</label>
          <input
            id={`${path}-city`}
            list={`${path}-towns`}
            className={cn(field, "mt-1")}
            autoComplete="address-level2"
            placeholder="Any Louisiana town"
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
            aria-invalid={Boolean(errors.city)}
          />
          <datalist id={`${path}-towns`}>
            {MAIN_TOWNS.map((town) => (
              <option key={town} value={town} />
            ))}
          </datalist>
          {err("city")}
        </div>
        <div>
          <label className={label} htmlFor={`${path}-zip`}>
            ZIP <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input id={`${path}-zip`} className={cn(field, "mt-1")} inputMode="numeric" autoComplete="postal-code" value={form.zip} onChange={(e) => set("zip", e.target.value)} aria-invalid={Boolean(errors.zip)} />
          {err("zip")}
        </div>
        <div>
          <label className={label} htmlFor={`${path}-timing`}>Timing</label>
          <select id={`${path}-timing`} className={cn(field, "mt-1")} value={form.timing} onChange={(e) => set("timing", e.target.value)} aria-invalid={Boolean(errors.timing)}>
            <option value="">Choose one</option>
            {timings.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
          {err("timing")}
        </div>
        <div>
          <label className={label} htmlFor={`${path}-homeowner`}>Home</label>
          <select id={`${path}-homeowner`} className={cn(field, "mt-1")} value={form.homeowner} onChange={(e) => set("homeowner", e.target.value)} aria-invalid={Boolean(errors.homeowner)}>
            <option value="">Choose one</option>
            {homeowners.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
          {err("homeowner")}
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor={`${path}-budget`}>
            {budgetQuestion} <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <select id={`${path}-budget`} className={cn(field, "mt-1")} value={form.budget} onChange={(e) => set("budget", e.target.value)} data-testid={`${path}-budget`}>
            <option value="">Prefer not to say</option>
            {budgetOptions.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor={`${path}-payment`}>Payment preference</label>
          <select id={`${path}-payment`} className={cn(field, "mt-1")} value={form.payment} onChange={(e) => set("payment", e.target.value)}>
            {payments.map((item) => (
              <option key={item.id} value={item.id}>{item.label}</option>
            ))}
          </select>
          {err("payment")}
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor={`${path}-notes`}>
            {isTile ? "Describe the look you want" : "Anything we should know?"}{" "}
            <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id={`${path}-notes`}
            rows={3}
            maxLength={400}
            className="mt-1 w-full rounded-xl border border-input bg-card px-3 py-2 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            placeholder={isTile ? "Zellige in sage, patterned floor, arched niche…" : "Current tub size, colors you like, a seat…"}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </div>
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor={`${path}-fax`}>Company fax</label>
        <input id={`${path}-fax`} tabIndex={-1} autoComplete="off" value={form.company_fax} onChange={(e) => set("company_fax", e.target.value)} />
      </div>

      <label className="flex items-start gap-3 text-sm leading-6" htmlFor={`${path}-consent`}>
        <input
          id={`${path}-consent`}
          type="checkbox"
          className="mt-1 size-5 shrink-0 accent-[var(--primary)]"
          checked={form.consent}
          onChange={(e) => set("consent", e.target.checked)}
          aria-invalid={Boolean(errors.consent)}
        />
        <span>{consentLabel}</span>
      </label>
      {err("consent")}

      {message ? (
        <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : isTile ? "Request my free tile consult" : "Get my solid surface quote"}
      </button>
      <p className="text-center text-xs text-muted-foreground">
        Free consult. No payment is collected. Not a final quote.{" "}
        <a href="/privacy" className="underline underline-offset-4">Privacy Policy</a>
      </p>
    </form>
  );
}
