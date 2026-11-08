"use client";

import { useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { checkCity, SUPPORTED_TOWNS } from "@/lib/coverage";
import {
  brand,
  dimensionNote,
  featureNote,
  finishes,
  lead,
  photoNote,
  projectNote,
  projects,
  timings,
} from "@/lib/copy";
import { validateDetails, validateZip } from "@/lib/estimate";
import { cn } from "cn";

type Photo = { id: string; name: string; url: string };
type Step = "town" | "details" | "result";

const fieldClass = "h-12 rounded-xl px-3 text-base md:text-base";

const empty = {
  city: "",
  zip: "",
  town: "",
  project: "",
  notSure: false,
  width: "",
  depth: "",
  finish: "",
  features: "",
  name: "",
  phone: "",
  email: "",
  preferred: "",
  marketing: false,
  timing: "",
  budget: "",
};

export function EstimateWizard() {
  const [step, setStep] = useState<Step>("town");
  const [form, setForm] = useState(empty);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoMessage, setPhotoMessage] = useState("");
  const [coverageNote, setCoverageNote] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const finishLabel = finishes.find((item) => item.id === form.finish)?.label ?? "";
  const projectLabel = projects.find((item) => item.id === form.project)?.label ?? "";
  const timingLabel = timings.find((item) => item.id === form.timing)?.label ?? "";
  const errorList = useMemo(() => Object.entries(errors), [errors]);

  function patch(partial: Partial<typeof empty>) {
    setForm((current) => ({ ...current, ...partial }));
  }

  function checkTown(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
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
        `${coverage.name} is outside the planned coverage. The I-10 corridor on this site stops at Baton Rouge. Prairieville and Gonzales are not included, so photos are not requested.`,
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
    setErrors({});
    setCoverageNote(
      `${coverage.name} is on the planned list. Justin still confirms capacity. There is no office listed in each town. Coverage was checked by city, not by ZIP.`,
    );
    patch({ town: coverage.name });
    setStep("details");
  }

  function addFiles(list: FileList | File[]) {
    const incoming = Array.from(list);
    const images = incoming.filter((file) => file.type.startsWith("image/"));
    const skippedType = incoming.length - images.length;
    const tooBig = images.filter((file) => file.size > 8 * 1024 * 1024);
    const ok = images.filter((file) => file.size <= 8 * 1024 * 1024);
    const room = 6 - photos.length;
    const accepted = ok.slice(0, Math.max(room, 0));
    const notes: string[] = [];
    if (skippedType) notes.push("Documents were skipped. Use image files only.");
    if (tooBig.length) notes.push("Images over 8MB were skipped.");
    if (ok.length > room) notes.push("You can preview up to 6 photos.");
    setPhotoMessage(notes.join(" "));
    if (!accepted.length) return;
    setPhotos((current) => [
      ...current,
      ...accepted.map((file) => ({
        id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    ]);
  }

  function removePhoto(id: string) {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return current.filter((photo) => photo.id !== id);
    });
  }

  function submitDetails(event: FormEvent) {
    event.preventDefault();
    const next = validateDetails(form);
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      document.getElementById(first)?.focus();
      return;
    }
    setStep("result");
    requestAnimationFrame(() => {
      document.getElementById("result-title")?.focus();
    });
  }

  function reset() {
    photos.forEach((photo) => URL.revokeObjectURL(photo.url));
    setPhotos([]);
    setForm(empty);
    setErrors({});
    setPhotoMessage("");
    setCoverageNote("");
    setStep("town");
  }

  return (
    <main id="content" tabIndex={-1} className="mx-auto w-full max-w-3xl px-5 py-10 md:py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brass">Project review</p>
      <h1 className="mt-3 text-4xl leading-[1.1] md:text-5xl">{lead.title}</h1>
      <p className="mt-4 text-lg leading-8 text-muted-foreground">{lead.subhead}</p>
      <p className="mt-4 rounded-2xl bg-tint-brass px-4 py-3 text-sm leading-6">
        Static prototype. Nothing you enter is submitted or saved. No payment is collected.
      </p>

      {step === "town" ? (
        <form className="mt-8 grid gap-5" onSubmit={checkTown} noValidate>
          <p className="text-sm font-semibold text-muted-foreground">1. City first</p>
          <Field id="city" label="City" error={errors.city} hint="Enter one city. The planned list is checked before any photos.">
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
            hint="A ZIP is not used to approve or decline coverage on this prototype."
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
            Check my town
          </Button>
        </form>
      ) : null}

      {step === "details" ? (
        <form className="mt-8 grid gap-8" onSubmit={submitDetails} noValidate>
          <p className="rounded-2xl bg-tint-lagoon px-4 py-3 text-sm leading-6" data-testid="coverage-message">
            {coverageNote}
          </p>
          <button type="button" className="w-fit text-sm underline underline-offset-4" onClick={() => setStep("town")}>
            Change town
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

          <fieldset id="project" tabIndex={-1} className="grid gap-3 outline-none">
            <legend className="text-xl font-heading">2. What would you like to change?</legend>
            <p className="text-sm leading-6 text-muted-foreground">{projectNote}</p>
            <RadioGroup
              value={form.project}
              onValueChange={(value) => patch({ project: value })}
              aria-label="What would you like to change?"
              className="grid gap-3 sm:grid-cols-2"
            >
              {projects.map((item) => (
                <label
                  key={item.id}
                  className={cn(
                    "flex cursor-pointer gap-3 rounded-2xl border bg-card p-4",
                    form.project === item.id ? "border-primary ring-2 ring-primary/30" : "border-border",
                  )}
                >
                  <RadioGroupItem value={item.id} id={item.id} className="mt-1" />
                  <span>
                    <span className="block font-medium">{item.label}</span>
                    <span className="block text-sm text-muted-foreground">{item.detail}</span>
                  </span>
                </label>
              ))}
            </RadioGroup>
            {errors.project ? <p className="text-sm text-destructive" role="alert">{errors.project}</p> : null}
          </fieldset>

          <fieldset className="grid gap-3 outline-none" id="dimensions" tabIndex={-1}>
            <legend className="text-xl font-heading">3. Approximate size</legend>
            <p id="dimensions-hint" className="text-sm leading-6 text-muted-foreground">{dimensionNote}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field id="width" label="Width (inches)">
                <Input
                  id="width"
                  inputMode="decimal"
                  value={form.width}
                  disabled={form.notSure}
                  onChange={(event) => patch({ width: event.target.value })}
                  className={fieldClass}
                  aria-describedby="dimensions-hint"
                />
              </Field>
              <Field id="depth" label="Depth (inches)">
                <Input
                  id="depth"
                  inputMode="decimal"
                  value={form.depth}
                  disabled={form.notSure}
                  onChange={(event) => patch({ depth: event.target.value })}
                  className={fieldClass}
                />
              </Field>
            </div>
            <label className="flex items-start gap-3 text-sm leading-6" htmlFor="not-sure">
              <Checkbox
                id="not-sure"
                checked={form.notSure}
                onCheckedChange={(checked) => patch({ notSure: checked })}
                className="mt-1 size-5"
              />
              Not sure
            </label>
            {errors.dimensions ? (
              <p id="dimensions-error" className="text-sm text-destructive" role="alert">
                {errors.dimensions}
              </p>
            ) : null}
          </fieldset>

          <fieldset id="finish" tabIndex={-1} className="grid gap-3 outline-none">
            <legend className="text-xl font-heading">4. Finish direction and features</legend>
            <RadioGroup
              value={form.finish}
              onValueChange={(value) => patch({ finish: value })}
              aria-label="Finish direction"
              className="grid gap-2"
            >
              {finishes.map((item) => (
                <label key={item.id} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-border bg-card px-3">
                  <RadioGroupItem value={item.id} id={`finish-${item.id}`} />
                  {item.label}
                </label>
              ))}
            </RadioGroup>
            {errors.finish ? <p className="text-sm text-destructive" role="alert">{errors.finish}</p> : null}
            <Field id="features" label="Features you want to talk about" hint={featureNote} hintFirst error={errors.features}>
              <Textarea
                id="features"
                value={form.features}
                onChange={(event) => patch({ features: event.target.value })}
                className="min-h-28 text-base md:text-base"
              />
            </Field>
          </fieldset>

          <fieldset className="grid gap-3">
            <legend className="text-xl font-heading">5. Photos, if you have them</legend>
            <p className="rounded-2xl bg-tint-clay px-4 py-3 text-sm leading-6">{photoNote}</p>
            <div
              className="rounded-2xl border border-dashed border-input bg-card px-4 py-6 text-center"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (event.dataTransfer.files.length) addFiles(event.dataTransfer.files);
              }}
            >
              <p className="text-sm text-muted-foreground">
                {photos.length ? `${photos.length} photo preview${photos.length === 1 ? "" : "s"} in this browser.` : "No photos added. Photos are optional."}
              </p>
              <Button type="button" variant="outline" className="mt-3 h-11 rounded-xl" onClick={() => fileRef.current?.click()}>
                Choose images
              </Button>
              <input
                ref={fileRef}
                id="photos"
                className="sr-only"
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => {
                  if (event.target.files) addFiles(event.target.files);
                  event.target.value = "";
                }}
              />
            </div>
            {photoMessage ? <p className="text-sm text-destructive" role="alert">{photoMessage}</p> : null}
            {photos.length ? (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {photos.map((photo) => (
                  <li key={photo.id} className="overflow-hidden rounded-xl border border-border bg-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.url} alt="Photo you selected, previewed only in this browser" className="aspect-square w-full object-cover" />
                    <button type="button" className="w-full px-2 py-2 text-sm underline" onClick={() => removePhoto(photo.id)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </fieldset>

          <fieldset className="grid gap-4">
            <legend className="text-xl font-heading">6. How can Justin reach you later?</legend>
            <Field id="name" label="Name" error={errors.name}>
              <Input id="name" autoComplete="name" value={form.name} onChange={(event) => patch({ name: event.target.value })} className={fieldClass} aria-invalid={Boolean(errors.name)} />
            </Field>
            <Field id="phone" label="Phone" error={errors.phone} hint="Phone or email is enough. Add the one you prefer below.">
              <Input id="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(event) => patch({ phone: event.target.value })} className={fieldClass} aria-invalid={Boolean(errors.phone)} />
            </Field>
            <Field id="email" label="Email" error={errors.email}>
              <Input id="email" type="email" autoComplete="email" value={form.email} onChange={(event) => patch({ email: event.target.value })} className={fieldClass} aria-invalid={Boolean(errors.email)} />
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
            <div className="rounded-2xl border border-dashed border-border p-4">
              <p className="text-sm font-semibold">Optional marketing</p>
              <p className="mt-1 text-sm text-muted-foreground">Separate from the project review request. Leave this unchecked if you only want the review.</p>
              <label htmlFor="marketing" className="mt-3 flex items-start gap-3 text-sm leading-6">
                <Checkbox
                  id="marketing"
                  checked={form.marketing}
                  onCheckedChange={(checked) => patch({ marketing: checked })}
                  className="mt-1 size-5"
                />
                You may also send me occasional project ideas.
              </label>
            </div>
          </fieldset>

          <fieldset id="timing" tabIndex={-1} className="grid gap-3 outline-none">
            <legend className="text-xl font-heading">7. Timing and budget</legend>
            <RadioGroup value={form.timing} onValueChange={(value) => patch({ timing: value })} aria-label="Project timing" className="grid gap-2">
              {timings.map((item) => (
                <label key={item.id} className="flex min-h-11 items-center gap-3 rounded-xl border border-border bg-card px-3">
                  <RadioGroupItem value={item.id} id={`timing-${item.id}`} />
                  {item.label}
                </label>
              ))}
            </RadioGroup>
            {errors.timing ? <p className="text-sm text-destructive" role="alert">{errors.timing}</p> : null}
            <Field id="budget" label="Budget note (optional)" hint="No payment is collected. A budget note stays in this browser and is not shown back as a price.">
              <Input id="budget" value={form.budget} onChange={(event) => patch({ budget: event.target.value })} className={fieldClass} />
            </Field>
          </fieldset>

          <Button type="submit" className="h-12 rounded-xl text-base">
            {lead.submit}
          </Button>
        </form>
      ) : null}

      {step === "result" ? (
        <section className="mt-8 grid gap-5" aria-live="polite">
          <h2 id="result-title" tabIndex={-1} className="text-3xl outline-none">
            Ready for a later review
          </h2>
          <p className="rounded-2xl bg-fig px-4 py-3 text-sm leading-6 text-fig-foreground">{lead.prototype}</p>
          <p className="text-lg leading-8">{lead.thanks}</p>
          <div className="rounded-2xl border-2 border-dashed border-brass bg-brass-soft p-5" data-testid="price-range">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass">Placeholder · not a dollar amount</p>
            <p className="mt-3 text-sm">{lead.rangeLabel}</p>
            <p className="font-heading text-4xl text-foreground md:text-5xl">{brand.priceRange}</p>
            <p className="mt-3 text-sm leading-6">{lead.rangeNote}</p>
          </div>
          <p className="leading-7">{lead.rangeDisclaimer}</p>
          <dl className="grid gap-3 rounded-2xl border border-border bg-card p-5 text-sm leading-6">
            <Row label="Town" value={form.town} />
            <Row label="Project" value={projectLabel} />
            <Row label="Size" value={form.notSure ? "Not sure" : `${form.width} in wide by ${form.depth} in deep, your estimate`} />
            <Row label="Finish direction" value={finishLabel} />
            <Row label="Features" value={form.features.trim() || "None added"} />
            <Row label="Photos" value={`${photos.length} held in this browser only`} />
            <Row label="Name" value={form.name} />
            <Row label="Preferred contact" value={form.preferred === "phone" ? "Phone" : "Email"} />
            <Row label="Timing" value={timingLabel} />
            <Row label="Marketing opt-in" value={form.marketing ? "Yes, separate from this review" : "No"} />
            <Row label="Budget note" value="Held in this browser and not displayed." />
          </dl>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="outline" className="h-12 rounded-xl" onClick={() => setStep("details")}>
              Edit details
            </Button>
            <Button type="button" className="h-12 rounded-xl" onClick={reset}>
              Start over
            </Button>
          </div>
        </section>
      ) : null}
    </main>
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[10rem_1fr]">
      <dt className="font-medium">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
