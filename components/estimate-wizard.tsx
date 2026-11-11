"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { OPEN_FORM_EVENT } from "@/components/consult-link";
import { resizePhoto } from "@/lib/photo-resize";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { AddressAutocomplete } from "@/components/address-autocomplete";
import { checkCity, SUPPORTED_TOWNS } from "@/lib/coverage";
import {
  brand,
  callTimeNote,
  consentLabel,
  dimensionNote,
  hero,
  homeowners,
  lead,
  paymentNote,
  payments,
  photoNote,
  projectNote,
  projects,
  timings,
} from "@/lib/copy";
import { validateDetails, validateExtras, validateStreet, validateZip } from "@/lib/estimate";
import { formatPhone, formatThankYouSize, localityLine, phoneTel } from "@/lib/lead-display";
import { heroSlides } from "@/lib/images";
import { cn } from "cn";

type Photo = { id: string; name: string; url: string; file: File };
type Step = "town" | "project" | "qualify" | "contact" | "result";

const fieldClass = "h-12 rounded-xl bg-card px-3 text-base md:text-base";
const MAX_PHOTOS = 8;
const MAX_PHOTO_BYTES = 2 * 1024 * 1024;

const empty = {
  street: "",
  latitude: "",
  longitude: "",
  city: "",
  zip: "",
  town: "",
  project: "",
  notSure: false,
  width: "",
  depth: "",
  height: "",
  measurements: "",
  finish: "unsure",
  features: "",
  name: "",
  phone: "",
  email: "",
  preferred: "",
  marketing: false,
  timing: "",
  budget: "",
  homeowner: "",
  payment: "",
  consent: false,
  preferredCallTime: "",
};

export function EstimateWizard() {
  const [step, setStep] = useState<Step>("town");
  const [submitting, setSubmitting] = useState(false);
  const [savingExtras, setSavingExtras] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [extrasError, setExtrasError] = useState("");
  const [extrasSaved, setExtrasSaved] = useState(false);
  const [leadId, setLeadId] = useState("");
  const [form, setForm] = useState(empty);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoMessage, setPhotoMessage] = useState("");
  const [coverageNote, setCoverageNote] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);

  /** Bring the whole form on screen under the fixed header and focus its first field. */
  const focusForm = useCallback(() => {
    const target = document.getElementById("start");
    if (!target) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    window.setTimeout(() => {
      const field =
        target.querySelector<HTMLElement>("#street") ??
        target.querySelector<HTMLElement>("#city") ??
        target.querySelector<HTMLElement>("#project") ??
        target.querySelector<HTMLElement>("#homeowner") ??
        target.querySelector<HTMLElement>("#name");
      field?.focus({ preventScroll: true });
    }, reduce ? 0 : 450);
  }, []);

  useEffect(() => {
    if (window.location.hash === "#start") {
      requestAnimationFrame(() => requestAnimationFrame(focusForm));
    }
    window.addEventListener(OPEN_FORM_EVENT, focusForm);
    return () => window.removeEventListener(OPEN_FORM_EVENT, focusForm);
  }, [focusForm]);

  const projectLabel = useMemo(() => {
    const selected = form.project.split(",").filter(Boolean);
    return selected
      .map((id) => projects.find((item) => item.id === id)?.label ?? id)
      .join(", ");
  }, [form.project]);
  const timingLabel = timings.find((item) => item.id === form.timing)?.label ?? "";
  const homeownerLabel = homeowners.find((item) => item.id === form.homeowner)?.label ?? "";
  const errorList = useMemo(() => Object.entries(errors), [errors]);

  function patch(partial: Partial<typeof empty>) {
    setForm((current) => ({ ...current, ...partial }));
  }

  function go(next: Step) {
    setStep(next);
    setErrors({});
    setSubmitError("");
    requestAnimationFrame(() => requestAnimationFrame(focusForm));
  }

  function checkTown(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    const streetError = validateStreet(form.street);
    if (streetError) next.street = streetError;
    const zipError = validateZip(form.zip);
    if (zipError) next.zip = zipError;
    const coverage = checkCity(form.city);
    if (coverage.status === "empty") next.city = "Enter the city first.";
    if (coverage.status === "unknown") {
      next.city =
        "Enter one planned city, such as Lafayette, Lake Charles, Houma, or Alexandria. ZIP codes are not used to approve a town.";
    }
    if (coverage.status === "excluded") {
      setCoverageNote(
        `${coverage.name} is outside the planned coverage. The I-10 corridor on this site stops at Baton Rouge. Prairieville and Gonzales are not included.`,
      );
      setErrors(next);
      return;
    }
    if (Object.keys(next).length) {
      setCoverageNote("");
      setErrors(next);
      return;
    }
    if (coverage.status !== "supported") return;
    setCoverageNote(
      `${coverage.name} is on the planned list. Justin still confirms capacity. Coverage was checked by city, not by ZIP.`,
    );
    patch({ town: coverage.name });
    go("project");
  }

  function checkProject(event: FormEvent) {
    event.preventDefault();
    const selected = form.project.split(",").filter(Boolean);
    if (!selected.length) {
      setErrors({ project: "Choose at least one project option." });
      return;
    }
    go("qualify");
  }

  function checkQualify(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!form.homeowner) next.homeowner = "Tell us whether you own or rent.";
    if (!form.timing) next.timing = "Choose a project timing.";
    if (!form.payment) next.payment = "Choose a payment preference. Not sure yet is fine.";
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    go("contact");
  }

  async function addFiles(list: FileList | File[]) {
    const incoming = Array.from(list);
    const images = incoming.filter((file) => file.type.startsWith("image/") || /\.(heic|heif)$/i.test(file.name));
    const skippedType = incoming.length - images.length;
    const room = MAX_PHOTOS - photos.length;
    const toProcess = images.slice(0, Math.max(room, 0));
    const notes: string[] = [];
    if (skippedType) notes.push("Documents were skipped. Use image files only.");
    if (images.length > room) notes.push(`You can add up to ${MAX_PHOTOS} photos.`);
    if (!toProcess.length) {
      setPhotoMessage(notes.join(" "));
      return;
    }
    setProcessing(true);
    const ready: Photo[] = [];
    let failed = 0;
    for (const original of toProcess) {
      const file = await resizePhoto(original).catch(() => null);
      if (!file || file.size > MAX_PHOTO_BYTES) {
        failed += 1;
        continue;
      }
      ready.push({
        id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
        name: file.name,
        url: URL.createObjectURL(file),
        file,
      });
    }
    if (failed) notes.push(`${failed} photo${failed === 1 ? "" : "s"} couldn't be read. Try a JPEG or a screenshot of it.`);
    setPhotoMessage(notes.join(" "));
    setProcessing(false);
    if (!ready.length) return;
    setPhotos((current) => [...current, ...ready].slice(0, MAX_PHOTOS));
  }

  function removePhoto(id: string) {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return current.filter((photo) => photo.id !== id);
    });
  }

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const preferred =
      form.preferred === "phone" || form.preferred === "email"
        ? form.preferred
        : form.phone.trim()
          ? "phone"
          : "email";
    const payload = { ...form, preferred, finish: form.finish || "unsure" };
    const next = validateDetails(payload);
    // Contact step only needs contact + consent fields; earlier steps already passed.
    const contactErrors: Record<string, string> = {};
    for (const key of ["name", "phone", "email", "preferred", "consent"] as const) {
      if (next[key]) contactErrors[key] = next[key];
    }
    setErrors(contactErrors);
    if (Object.keys(contactErrors).length) {
      const first = Object.keys(contactErrors)[0];
      document.getElementById(first)?.focus();
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    const body = new FormData();
    body.set("sourcePage", "/estimate");
    body.set("street", form.street);
    body.set("latitude", form.latitude);
    body.set("longitude", form.longitude);
    body.set("city", form.city);
    body.set("zip", form.zip);
    body.set("project", form.project);
    body.set("notSure", String(form.notSure));
    body.set("width", "");
    body.set("depth", "");
    body.set("height", "");
    body.set("measurements", "");
    body.set("finish", "unsure");
    body.set("features", "");
    body.set("name", form.name);
    body.set("phone", form.phone);
    body.set("email", form.email);
    body.set("preferred", preferred);
    body.set("marketing", "false");
    body.set("timing", form.timing);
    body.set("budget", "");
    body.set("homeowner", form.homeowner);
    body.set("payment", form.payment);
    body.set("consent", String(form.consent));
    body.set("preferredCallTime", "");
    body.set("company_fax", "");
    try {
      const response = await fetch("/api/leads", { method: "POST", body });
      const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string; id?: string } | null;
      if (!response.ok || !data?.ok || !data.id) {
        setSubmitError(data?.error || "We couldn't save your request. Nothing was confirmed.");
        return;
      }
      setLeadId(data.id);
      patch({ preferred });
      setStep("result");
      requestAnimationFrame(() => {
        document.getElementById("result-title")?.focus();
      });
    } catch {
      setSubmitError("We couldn't reach the server. Your request was not saved.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitExtras(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!leadId) {
      setExtrasError("Your request id is missing. Refresh and start again if needed.");
      return;
    }
    const fieldErrors = validateExtras({
      width: form.width,
      depth: form.depth,
      height: form.height,
      measurements: form.measurements,
      preferredCallTime: form.preferredCallTime,
    });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;
    if (
      !form.width.trim() &&
      !form.depth.trim() &&
      !form.height.trim() &&
      !form.measurements.trim() &&
      !form.preferredCallTime.trim() &&
      !photos.length
    ) {
      setExtrasError("Add a preferred call time, measurements, or photos first.");
      return;
    }
    setSavingExtras(true);
    setExtrasError("");
    const body = new FormData();
    body.set("width", form.width);
    body.set("depth", form.depth);
    body.set("height", form.height);
    body.set("measurements", form.measurements);
    body.set("preferredCallTime", form.preferredCallTime);
    photos.forEach((photo) => body.append("photos", photo.file, photo.file.name));
    try {
      const response = await fetch(`/api/leads/${leadId}`, { method: "PATCH", body });
      const data = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!response.ok || !data?.ok) {
        setExtrasError(data?.error || "We couldn't save those extras. Your original request is still saved.");
        return;
      }
      setExtrasSaved(true);
    } catch {
      setExtrasError("We couldn't reach the server. Your original request is still saved.");
    } finally {
      setSavingExtras(false);
    }
  }

  function reset() {
    photos.forEach((photo) => URL.revokeObjectURL(photo.url));
    setPhotos([]);
    setForm(empty);
    setErrors({});
    setPhotoMessage("");
    setCoverageNote("");
    setLeadId("");
    setExtrasSaved(false);
    setExtrasError("");
    setSubmitError("");
    setStep("town");
  }

  const banner = heroSlides[0];

  const sizeLine = formatThankYouSize(form.width, form.depth, form.height, form.measurements);
  const townValue = localityLine(form.town || form.city, form.zip);
  const phoneHref = phoneTel(form.phone);
  const phoneLabel = formatPhone(form.phone);

  return (
    <main id="content" tabIndex={-1} className={step === "result" ? "bg-[#f6f0e8]" : undefined}>
      {step === "result" ? null : (
      <section className="relative flex min-h-[44svh] items-end md:min-h-[52svh] overflow-hidden bg-[#1c1014] text-[#fbf6f2]">
        <Image src={banner.src} alt={banner.alt} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1014] via-[#1c1014]/55 to-[#1c1014]/40" />
        <div className="relative z-10 mx-auto w-full max-w-3xl px-5 pb-10 pt-28">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#f3d7cb]">{hero.eyebrow}</p>
          <h1 className="mt-3 max-w-xl text-5xl leading-[0.95] md:text-7xl">{lead.title}</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/85">{lead.subhead}</p>
          <p className="mt-5 text-lg">
            <a href={brand.phoneHref} className="underline underline-offset-4">
              {brand.phone}
            </a>
          </p>
          <p className="mt-4 text-sm text-white/85">
            Prefer a shorter form?{" "}
            <a href="/solid-surface#solid-quote" className="underline underline-offset-4">Solid surface quote</a>
            {" · "}
            <a href="/custom-tile#tile-quote" className="underline underline-offset-4">Custom tile consult</a>
          </p>
          <p className="mt-4 text-xs text-white/65">Examples of what your remodel could look like.</p>
        </div>
      </section>
      )}
      <div
        id="start"
        className={cn(
          "mx-auto w-full px-5",
          step === "result" ? "max-w-[420px] pb-16 pt-24" : "max-w-3xl py-8 md:py-12",
        )}
      >
        {step === "result" ? null : <Stepper step={step} />}

        {step === "town" ? (
          <form className="mt-8 grid gap-5" onSubmit={checkTown} noValidate>
            <p className="text-sm font-semibold text-muted-foreground">1. Where should we visit?</p>
            <Field id="street" label={lead.addressLabel} error={errors.street} hint={lead.addressHint} hintFirst>
              <AddressAutocomplete
                id="street"
                value={form.street}
                invalid={Boolean(errors.street)}
                describedBy={["street-hint", errors.street ? "street-error" : ""].filter(Boolean).join(" ")}
                onChange={(street) => patch({ street, latitude: "", longitude: "" })}
                onSelect={(address) =>
                  patch({
                    street: address.street,
                    city: address.city || form.city,
                    zip: address.zip || form.zip,
                    latitude: address.lat != null ? String(address.lat) : "",
                    longitude: address.lon != null ? String(address.lon) : "",
                  })
                }
              />
            </Field>
            <Field id="city" label="City / town" error={errors.city} hint="Enter one city. The planned list is checked before you continue.">
              <Input
                id="city"
                name="city"
                list="planned-towns"
                autoComplete="address-level2"
                value={form.city}
                onChange={(event) => patch({ city: event.target.value })}
                className={fieldClass}
                aria-invalid={Boolean(errors.city)}
                aria-describedby={errors.city ? "city-error" : "city-hint"}
              />
              <datalist id="planned-towns">
                {SUPPORTED_TOWNS.map((town) => (
                  <option key={town} value={town} />
                ))}
              </datalist>
            </Field>
            <Field
              id="zip"
              label="ZIP code (optional)"
              error={errors.zip}
              hint="A ZIP is not used to approve or decline coverage. The city decides."
            >
              <Input
                id="zip"
                name="zip"
                inputMode="numeric"
                autoComplete="postal-code"
                value={form.zip}
                onChange={(event) => patch({ zip: event.target.value })}
                className={fieldClass}
                aria-invalid={Boolean(errors.zip)}
              />
            </Field>
            {coverageNote ? (
              <p className="rounded-2xl border border-destructive/40 bg-card px-4 py-3 text-sm leading-6" role="alert" data-testid="coverage-message">
                {coverageNote}
              </p>
            ) : null}
            <Button type="submit" className="h-12 rounded-xl text-base">
              Continue
            </Button>
          </form>
        ) : null}

        {step === "project" ? (
          <form className="mt-8 grid gap-6" onSubmit={checkProject} noValidate>
            <p className="rounded-2xl bg-tint-lagoon px-4 py-3 text-sm leading-6" data-testid="coverage-message">
              {coverageNote}
            </p>
            <button type="button" className="w-fit text-sm underline underline-offset-4" onClick={() => go("town")}>
              Change town
            </button>
            <fieldset id="project" tabIndex={-1} className="grid gap-3 outline-none">
              <legend className="text-xl font-heading">2. What would you like to change?</legend>
              <p className="text-sm leading-6 text-muted-foreground">{projectNote}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {projects.map((item) => {
                  const selected = form.project.split(",").filter(Boolean);
                  const checked = selected.includes(item.id);
                  return (
                    <label
                      key={item.id}
                      className={cn(
                        "flex cursor-pointer gap-3 rounded-2xl border bg-card p-4",
                        checked ? "border-primary ring-2 ring-primary/30" : "border-border",
                        item.id === "tub-to-shower" ? "sm:col-span-2" : "",
                      )}
                    >
                      <Checkbox
                        id={item.id}
                        checked={checked}
                        onCheckedChange={(value) => {
                          const next = value
                            ? [...selected, item.id]
                            : selected.filter((entry) => entry !== item.id);
                          patch({ project: next.join(",") });
                        }}
                        className="mt-1 size-5"
                      />
                      <span>
                        <span className="block font-medium">{item.label}</span>
                        <span className="block text-sm text-muted-foreground">{item.detail}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
              {errors.project ? <p className="text-sm text-destructive" role="alert">{errors.project}</p> : null}
            </fieldset>
            <Button type="submit" className="h-12 rounded-xl text-base">
              Continue
            </Button>
          </form>
        ) : null}

        {step === "qualify" ? (
          <form className="mt-8 grid gap-8" onSubmit={checkQualify} noValidate>
            <button type="button" className="w-fit text-sm underline underline-offset-4" onClick={() => go("project")}>
              Back
            </button>
            <fieldset id="homeowner" tabIndex={-1} className="grid gap-3 outline-none">
              <legend className="text-xl font-heading">3. Home, timing, and payment</legend>
              <p className="text-sm font-medium">Do you own this home?</p>
              <RadioGroup
                value={form.homeowner}
                onValueChange={(value) => patch({ homeowner: value })}
                aria-label="Homeowner status"
                className="grid gap-2 sm:grid-cols-2"
              >
                {homeowners.map((item) => (
                  <label key={item.id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-border bg-card px-3">
                    <RadioGroupItem value={item.id} id={`homeowner-${item.id}`} />
                    {item.label}
                  </label>
                ))}
              </RadioGroup>
              {errors.homeowner ? <p className="text-sm text-destructive" role="alert">{errors.homeowner}</p> : null}
            </fieldset>

            <fieldset id="timing" tabIndex={-1} className="grid gap-3 outline-none">
              <p className="text-sm font-medium">When are you hoping to move forward?</p>
              <RadioGroup value={form.timing} onValueChange={(value) => patch({ timing: value })} aria-label="Project timing" className="grid gap-2">
                {timings.map((item) => (
                  <label key={item.id} className="flex min-h-11 items-center gap-3 rounded-xl border border-border bg-card px-3">
                    <RadioGroupItem value={item.id} id={`timing-${item.id}`} />
                    {item.label}
                  </label>
                ))}
              </RadioGroup>
              {errors.timing ? <p className="text-sm text-destructive" role="alert">{errors.timing}</p> : null}
            </fieldset>

            <fieldset id="payment" tabIndex={-1} className="grid gap-3 outline-none">
              <p className="text-sm font-medium">Payment preference</p>
              <p className="text-sm leading-6 text-muted-foreground">{paymentNote}</p>
              <RadioGroup value={form.payment} onValueChange={(value) => patch({ payment: value })} aria-label="Payment preference" className="grid gap-2">
                {payments.map((item) => (
                  <label key={item.id} className="flex min-h-11 items-center gap-3 rounded-xl border border-border bg-card px-3">
                    <RadioGroupItem value={item.id} id={`payment-${item.id}`} />
                    {item.label}
                  </label>
                ))}
              </RadioGroup>
              {errors.payment ? <p className="text-sm text-destructive" role="alert">{errors.payment}</p> : null}
            </fieldset>

            <Button type="submit" className="h-12 rounded-xl text-base">
              Continue
            </Button>
          </form>
        ) : null}

        {step === "contact" ? (
          <form className="relative mt-8 grid gap-6" onSubmit={submitContact} noValidate>
            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="company_fax">Fax</label>
              <input id="company_fax" name="company_fax" tabIndex={-1} autoComplete="off" />
            </div>
            <button type="button" className="w-fit text-sm underline underline-offset-4" onClick={() => go("qualify")}>
              Back
            </button>
            {errorList.length ? (
              <div className="rounded-2xl border border-destructive/40 bg-card px-4 py-3" role="alert">
                <p className="font-medium">Check the highlighted fields.</p>
                <ul className="mt-2 list-disc pl-5 text-sm">
                  {errorList.map(([key, message]) => (
                    <li key={key}>{message}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <fieldset className="grid gap-4">
              <legend className="text-xl font-heading">4. How can Justin reach you?</legend>
              <Field id="name" label="Name" error={errors.name}>
                <Input id="name" name="name" autoComplete="name" value={form.name} onChange={(event) => patch({ name: event.target.value })} className={fieldClass} aria-invalid={Boolean(errors.name)} />
              </Field>
              <Field id="phone" label="Phone" error={errors.phone} hint="Phone or email is enough. Add the one you prefer below.">
                <Input id="phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(event) => patch({ phone: event.target.value })} className={fieldClass} aria-invalid={Boolean(errors.phone)} />
              </Field>
              <Field id="email" label="Email" error={errors.email}>
                <Input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={(event) => patch({ email: event.target.value })} className={fieldClass} aria-invalid={Boolean(errors.email)} />
              </Field>
              <div id="preferred" tabIndex={-1} className="grid gap-2 outline-none">
                <p className="text-sm font-medium">Preferred contact for this project</p>
                <RadioGroup value={form.preferred} onValueChange={(value) => patch({ preferred: value })} className="grid gap-2 sm:grid-cols-2">
                  {[
                    ["phone", "Phone"],
                    ["email", "Email"],
                  ].map(([value, label]) => (
                    <label key={value} className="flex min-h-11 items-center gap-3 rounded-xl border border-border bg-card px-3">
                      <RadioGroupItem value={value} id={`preferred-${value}`} />
                      {label}
                    </label>
                  ))}
                </RadioGroup>
                {errors.preferred ? <p className="text-sm text-destructive" role="alert">{errors.preferred}</p> : null}
              </div>
              <div id="consent" tabIndex={-1} className="rounded-2xl border border-border bg-card p-4 outline-none">
                <label htmlFor="consent-check" className="flex items-start gap-3 text-sm leading-6">
                  <Checkbox
                    id="consent-check"
                    checked={form.consent}
                    onCheckedChange={(checked) => patch({ consent: Boolean(checked) })}
                    className="mt-1 size-5"
                    aria-invalid={Boolean(errors.consent)}
                  />
                  <span>{consentLabel}</span>
                </label>
                {errors.consent ? <p className="mt-2 text-sm text-destructive" role="alert">{errors.consent}</p> : null}
              </div>
            </fieldset>
            {submitError ? (
              <p className="rounded-2xl border border-destructive/40 bg-card px-4 py-3 text-sm leading-6" role="alert">
                {submitError}
              </p>
            ) : null}
            <Button type="submit" className="h-12 rounded-xl text-base" disabled={submitting}>
              {submitting ? "Saving your request…" : lead.submit}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              <a href="/privacy" className="underline underline-offset-4">
                Privacy Policy
              </a>
            </p>
          </form>
        ) : null}

        {step === "result" ? (
          <section className="text-[#1c1014]" aria-live="polite">
            <div className="flex size-14 items-center justify-center rounded-full bg-[#c46a4a] text-[26px] text-white" aria-hidden="true">
              ✓
            </div>
            <h1 id="result-title" tabIndex={-1} className="mt-4 font-heading text-[40px] font-medium leading-[0.95] outline-none">
              {lead.savedTitle}
            </h1>
            <p className="mt-2.5 text-lg leading-snug">{lead.thanks}</p>
            <p className="mt-2 mb-5 leading-snug text-[#6d5a54]">{lead.savedNote}</p>
            <section className="rounded-[24px] border border-[#e8ddd4] bg-[#fffdf9] px-5 py-[22px]">
              <p className="font-heading text-[32px] leading-[1.05]">{form.name.trim()}</p>
              <div className="mt-2.5">
                {phoneHref ? (
                  <a href={phoneHref} className="block text-xl font-semibold text-[#8c4030] underline underline-offset-4">
                    {phoneLabel}
                  </a>
                ) : null}
                {form.email.trim() ? (
                  <a href={`mailto:${form.email.trim()}`} className="mt-1 block text-[17px] font-medium text-[#1c1014] underline underline-offset-4">
                    {form.email.trim()}
                  </a>
                ) : null}
              </div>
              <hr className="my-[18px] border-0 border-t border-[#e8ddd4]" />
              <dl className="grid gap-3.5">
                <RecapRow label="Town" value={townValue} />
                <RecapRow label="Project" value={projectLabel} />
                <RecapRow label="Size" value={sizeLine} />
                <RecapRow label="Home" value={homeownerLabel} />
                <RecapRow label="Timing" value={timingLabel} />
              </dl>
            </section>

            {photos.length ? (
              <div className="mt-[22px]">
                <h2 className="font-heading text-2xl font-medium">{lead.photosTitle}</h2>
                <ul className="mt-3 grid grid-cols-2 gap-2.5" data-testid="photo-previews">
                  {photos.map((photo, index) => (
                    <li key={photo.id} className="relative overflow-hidden rounded-2xl border border-[#e8ddd4] bg-[#fffdf9]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={photo.url} alt={`Photo ${index + 1}`} className="aspect-square w-full object-cover" />
                      {extrasSaved ? null : (
                        <button
                          type="button"
                          className="absolute right-1 top-1 inline-flex size-8 items-center justify-center rounded-full bg-black/65 text-sm text-white"
                          onClick={() => removePhoto(photo.id)}
                          aria-label={`Remove photo ${index + 1}`}
                        >
                          ✕
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-6 rounded-[24px] border border-[#e8ddd4] bg-[#fffdf9] p-5">
              <h3 className="text-2xl font-heading">{lead.extrasTitle}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{lead.extrasBody}</p>
              {extrasSaved ? (
                <p className="mt-4 rounded-2xl bg-tint-lagoon px-4 py-3 text-sm leading-6" role="status">
                  {lead.extrasSaved}
                  {form.preferredCallTime.trim() ? ` Preferred call time: ${form.preferredCallTime.trim()}.` : ""}
                  {photos.length ? ` ${photos.length} photo${photos.length === 1 ? "" : "s"} attached.` : ""}
                </p>
              ) : (
                <form className="mt-5 grid gap-6" onSubmit={submitExtras} noValidate>
                  <Field id="preferredCallTime" label="Pick a good time to call" hint={callTimeNote} error={errors.preferredCallTime}>
                    <Input
                      id="preferredCallTime"
                      value={form.preferredCallTime}
                      placeholder="Weekday mornings, after 5 PM, Saturday…"
                      onChange={(event) => patch({ preferredCallTime: event.target.value })}
                      className={fieldClass}
                    />
                  </Field>

                  <fieldset className="grid gap-3 outline-none" id="dimensions" tabIndex={-1}>
                    <legend className="text-lg font-heading">Rough size (optional)</legend>
                    <p id="dimensions-hint" className="text-sm leading-6 text-muted-foreground">{dimensionNote}</p>
                    <div className="grid grid-cols-3 gap-3">
                      {(
                        [
                          ["width", "Width (in)"],
                          ["depth", "Depth (in)"],
                          ["height", "Height (in)"],
                        ] as const
                      ).map(([key, label]) => (
                        <Field key={key} id={key} label={label}>
                          <Input
                            id={key}
                            inputMode="decimal"
                            placeholder={key === "width" ? "60" : key === "depth" ? "32" : "72"}
                            value={form[key]}
                            onChange={(event) => patch({ [key]: event.target.value })}
                            className={fieldClass}
                            aria-describedby="dimensions-hint"
                            aria-invalid={Boolean(errors.dimensions)}
                          />
                        </Field>
                      ))}
                    </div>
                    {errors.dimensions ? (
                      <p id="dimensions-error" className="text-sm text-destructive" role="alert">
                        {errors.dimensions}
                      </p>
                    ) : null}
                    <Field id="measurements" label="Notes" error={errors.measurements}>
                      <Textarea
                        id="measurements"
                        value={form.measurements}
                        placeholder="Anything useful: tub to ceiling, window in the shower, door width…"
                        onChange={(event) => patch({ measurements: event.target.value })}
                        className="min-h-24 text-base md:text-base"
                      />
                    </Field>
                  </fieldset>

                  <fieldset className="grid gap-3" id="photos-field">
                    <legend className="text-lg font-heading">Photos (optional)</legend>
                    <p className="rounded-2xl bg-tint-clay px-4 py-3 text-sm leading-6">{photoNote}</p>
                    <div
                      className="rounded-2xl border border-dashed border-input bg-background px-4 py-6 text-center"
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => {
                        event.preventDefault();
                        if (event.dataTransfer.files.length) void addFiles(event.dataTransfer.files);
                      }}
                    >
                      <p className="text-sm text-muted-foreground" aria-live="polite">
                        {processing
                          ? "Preparing photos…"
                          : photos.length
                            ? `${photos.length} of ${MAX_PHOTOS} photos added.`
                            : "No photos yet. Photos are optional."}
                      </p>
                      <div className="mt-3 flex flex-col justify-center gap-2 sm:flex-row">
                        <Button
                          type="button"
                          className="h-12 rounded-xl"
                          disabled={processing || photos.length >= MAX_PHOTOS}
                          onClick={() => cameraRef.current?.click()}
                        >
                          Take a photo
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-12 rounded-xl"
                          disabled={processing || photos.length >= MAX_PHOTOS}
                          onClick={() => fileRef.current?.click()}
                        >
                          Choose from library
                        </Button>
                      </div>
                      <input
                        ref={cameraRef}
                        id="photos-camera"
                        className="sr-only"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        tabIndex={-1}
                        aria-hidden="true"
                        onChange={(event) => {
                          if (event.target.files) void addFiles(event.target.files);
                          event.target.value = "";
                        }}
                      />
                      <input
                        ref={fileRef}
                        id="photos"
                        className="sr-only"
                        type="file"
                        accept="image/*"
                        multiple
                        tabIndex={-1}
                        aria-hidden="true"
                        data-testid="photo-input"
                        onChange={(event) => {
                          if (event.target.files) void addFiles(event.target.files);
                          event.target.value = "";
                        }}
                      />
                    </div>
                    {photoMessage ? <p className="text-sm text-destructive" role="alert">{photoMessage}</p> : null}
                  </fieldset>

                  {extrasError ? (
                    <p className="rounded-2xl border border-destructive/40 bg-background px-4 py-3 text-sm leading-6" role="alert">
                      {extrasError}
                    </p>
                  ) : null}
                  <Button type="submit" className="h-12 rounded-xl text-base" disabled={savingExtras}>
                    {savingExtras ? "Saving extras…" : lead.extrasSubmit}
                  </Button>
                </form>
              )}
            </div>

            <button type="button" className="mt-4 text-sm underline underline-offset-4" onClick={reset}>
              Start over
            </button>
          </section>
        ) : null}
      </div>
    </main>
  );
}

function Stepper({ step }: { step: Step }) {
  const items = [
    ["town", "Town"],
    ["project", "Project"],
    ["qualify", "Details"],
    ["contact", "Contact"],
  ] as const;
  const order = { town: 0, project: 1, qualify: 2, contact: 3, result: 4 } as const;
  const current = Math.min(order[step], 3);
  return (
    <ol className="grid grid-cols-4 gap-2" aria-label="Progress">
      {items.map(([id, label], index) => (
        <li key={id} aria-current={step !== "result" && index === current ? "step" : undefined}>
          <div className={cn("h-1 rounded-full", index <= current || step === "result" ? "bg-primary" : "bg-border")} />
          <p className={cn("mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] sm:text-xs", index === current && step !== "result" ? "text-foreground" : "text-muted-foreground")}>
            0{index + 1} {label}
          </p>
        </li>
      ))}
    </ol>
  );
}

function Field({
  id,
  label,
  hint,
  hintFirst = false,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  hintFirst?: boolean;
  error?: string;
  children: ReactNode;
}) {
  const hintNode = hint ? (
    <p id={`${id}-hint`} className="text-sm leading-6 text-muted-foreground">
      {hint}
    </p>
  ) : null;
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {hintFirst ? hintNode : null}
      {children}
      {hintFirst ? null : hintNode}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function RecapRow({ label, value }: { label: string; value: string }) {
  if (!value.trim()) return null;
  return (
    <div className="grid grid-cols-[92px_1fr] gap-2 text-base leading-snug">
      <dt className="font-semibold text-[#6d5a54]">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
