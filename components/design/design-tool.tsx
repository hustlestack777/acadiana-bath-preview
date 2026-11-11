import { CallWindowFields } from "@/components/call-window-fields";
import { consentLabel } from "@/lib/copy";
"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ChangeEvent, type Dispatch, type FormEvent, type SetStateAction } from "react";
import { AddressAutocomplete } from "@/components/address-autocomplete";
import { appendAttribution } from "@/components/lead-attribution";
import { WindowsQuoteLine } from "@/components/windows-quote-line";
import { SaveJustinContact } from "@/components/save-justin-contact";
import { designCopy } from "@/lib/design-styles";
import {
  designFinishes,
  designFloors,
  designLayouts,
  designWalls,
  findWall,
  relatedLooksFor,
  resolvePicks,
  type RelatedLook,
} from "@/lib/design-picks";
import {
  clearStartingLook,
  findStartingLook,
  LOOK_CHANGE_EVENT,
  persistStartingLook,
  picksFromLook,
  readStartingLook,
  type StartingLook,
} from "@/lib/starting-looks";

function subscribeStartingLook(onChange: () => void) {
  window.addEventListener(LOOK_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(LOOK_CHANGE_EVENT, onChange);
}
import { resizePhoto } from "@/lib/photo-resize";
import { budgetOptions, budgetQuestion } from "@/lib/budget";
import { cn } from "cn";
import { useScrollToStep } from "@/lib/scroll-to-step";

type Step =
  | "layout"
  | "walls"
  | "floor"
  | "finish"
  | "budget"
  | "photos"
  | "rendering"
  | "teaser"
  | "cap-pending"
  | "reveal"
  | "custom-done";
type Shot = { file: File; url: string };

const MAX_TRIES = 2;
const TOKEN_KEY = "abc-design-token";
const STEP_LABELS: Record<Exclude<Step, "rendering" | "teaser" | "cap-pending" | "reveal" | "custom-done">, { n: number; title: string }> = {
  layout: { n: 1, title: "What's the plan?" },
  walls: { n: 2, title: "Pick a wall style" },
  floor: { n: 3, title: "Pick a floor" },
  finish: { n: 4, title: "Pick a fixture finish" },
  budget: { n: 5, title: budgetQuestion },
  photos: { n: 6, title: "Snap your shower" },
};
const STEP_TOTAL = 6;

const field =
  "h-12 w-full rounded-xl border border-border bg-card px-4 text-base outline-none focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive";

export function DesignTool({ initialStyle = "", initialLook = "" }: { initialStyle?: string; initialLook?: string }) {
  const storedId = useSyncExternalStore(subscribeStartingLook, readStartingLook, () => "");
  const [clearedLook, setClearedLook] = useState(false);
  const startingLook: StartingLook | null = clearedLook
    ? null
    : findStartingLook(initialLook) || findStartingLook(storedId);
  const seeded = startingLook ? picksFromLook(startingLook) : { layout: "", wall: "", floor: "", finish: "" };
  const [step, setStep] = useState<Step>("layout");
  const [shots, setShots] = useState<Shot[]>([]);
  const [layout, setLayout] = useState(seeded.layout);
  const [wall, setWall] = useState(seeded.wall || findWall(initialStyle)?.key || "");
  const [floor, setFloor] = useState(seeded.floor);
  const [finish, setFinish] = useState(seeded.finish);
  const [budget, setBudget] = useState("");
  const [error, setError] = useState("");
  const [busyMsg, setBusyMsg] = useState(0);
  const [progress, setProgress] = useState(0);
  const [design, setDesign] = useState<{ id: string; teaser: string | null; capped?: boolean } | null>(null);
  const [reveal, setReveal] = useState<{ before: string; after: string; style: string } | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", street: "", city: "", state: "LA", zip: "", latitude: "", longitude: "", smsConsent: false, preferredCallDay: "", preferredCallTime: "", company_fax: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const shotsRef = useRef<Shot[]>([]);
  useEffect(() => {
    shotsRef.current = shots;
  }, [shots]);
  useEffect(() => () => shotsRef.current.forEach((shot) => URL.revokeObjectURL(shot.url)), []);
  useEffect(() => {
    document.documentElement.dataset.stickyCta = "true";
    return () => {
      delete document.documentElement.dataset.stickyCta;
    };
  }, []);
  useScrollToStep(step, topRef);

  useEffect(() => {
    if (startingLook) persistStartingLook(startingLook.id);
  }, [startingLook]);

  const layoutValue = layout || seeded.layout;
  const wallValue = wall || seeded.wall;
  const floorValue = floor || seeded.floor;
  const finishValue = finish || seeded.finish;

  const picks = resolvePicks({ layout: layoutValue, wall: wallValue, floor: floorValue, finish: finishValue, budget });
  const related = picks ? relatedLooksFor(picks) : [];

  useEffect(() => {
    if (step !== "rendering") return;
    const started = Date.now();
    const timer = window.setInterval(() => {
      const seconds = (Date.now() - started) / 1000;
      setProgress((current) => Math.max(current, Math.min(90, Math.round(90 * (1 - Math.exp(-seconds / 25))))));
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
    if (!shots[0] || !resolvePicks({ layout: layoutValue, wall: wallValue, floor: floorValue, finish: finishValue })) return;
    setError("");
    setProgress(0);
    setBusyMsg(0);
    setStep("rendering");
    for (let attempt = 1; attempt <= MAX_TRIES; attempt += 1) {
      const body = new FormData();
      body.set("photo", shots[0].file);
      if (shots[1]) body.set("photo2", shots[1].file);
      body.set("layout", layoutValue);
      body.set("wall", wallValue);
      body.set("floor", floorValue);
      body.set("finish", finishValue);
      body.set("budget", budget);
      if (startingLook) body.set("look", startingLook.id);
      body.set("company_fax", form.company_fax);
      body.set("token", window.localStorage.getItem(TOKEN_KEY) || "");
      try {
        const response = await fetch("/api/design/render", {
          method: "POST",
          body,
          headers: { Accept: "application/x-ndjson, application/json", "x-design-progress": "1" },
        });
        const json = await readRenderResponse(response, (stage) => {
          if (stage === "preparing") {
            setBusyMsg(0);
            setProgress((current) => Math.max(current, 12));
          } else if (stage === "editing" || stage === "retrying") {
            setBusyMsg(2);
            setProgress((current) => Math.max(current, stage === "retrying" ? 50 : 28));
          } else if (stage === "checking") {
            setBusyMsg(4);
            setProgress((current) => Math.max(current, 80));
          }
        });
        if (response.ok && json.ok) {
          setProgress(100);
          if (json.capped) {
            setDesign({ id: json.id, teaser: null, capped: true });
            window.setTimeout(() => setStep("cap-pending"), 200);
            return;
          }
          setDesign({ id: json.id, teaser: json.qaFailed ? null : json.teaser });
          window.setTimeout(() => setStep("teaser"), 350);
          return;
        }
        if (json.retryable === false || attempt === MAX_TRIES) {
          setError(json.error || "The designer hit a snag. Try another photo.");
          setStep("photos");
          return;
        }
      } catch {
        if (attempt === MAX_TRIES) {
          setError("We lost the connection. Check your signal and try again.");
          setStep("photos");
          return;
        }
      }
    }
  }, [shots, layoutValue, wallValue, floorValue, finishValue, budget, form.company_fax, startingLook]);

  async function unlock(event: FormEvent) {
    event.preventDefault();
    if (!design) return;
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = "Enter your name.";
    if (form.phone.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "").length !== 10) next.phone = "Enter a 10-digit mobile number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email.";
    if (!/\d/.test(form.street)) next.street = "Enter the street address with the house number.";
    if (!form.city.trim()) next.city = "Enter your town.";
    if (!form.preferredCallDay) next.preferredCallDay = "Pick the best day for Justin to call.";
    if (!form.preferredCallTime) next.preferredCallTime = "Pick the best time for Justin to call.";
    if (!form.smsConsent) next.consent = "Check the box so Acadiana Bathrooms and Countertops can contact you about this request.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSending(true);
    const body = new FormData();
    body.set("id", design.id);
    for (const [key, value] of Object.entries(form)) body.set(key, String(value));
    appendAttribution(body, "/design");
    try {
      const response = await fetch("/api/design/unlock", { method: "POST", body });
      const json = await response.json().catch(() => ({}));
      if (!response.ok || !json.ok) {
        setErrors(json.errors || {});
        setError(json.error || "We couldn't unlock that. Try again.");
        return;
      }
      window.localStorage.setItem(TOKEN_KEY, json.token);
      setError("");
      if (json.custom) {
        setStep("custom-done");
        return;
      }
      setReveal({ before: json.before, after: json.after, style: json.style });
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
    setError("");
    setStep("layout");
  }

  const lookName = picks ? `${picks.wall.name}` : "";

  function changeStarting() {
    clearStartingLook();
    setClearedLook(true);
    setWall("");
    setFloor("");
    setFinish("");
    setStep(layoutValue ? "walls" : "layout");
  }

  const showBanner = Boolean(startingLook) && ["layout", "walls", "floor", "finish", "budget", "photos"].includes(step);

  return (
    <div ref={topRef} className="scroll-mt-24 mx-auto w-full max-w-3xl px-5 pb-20" data-testid="design-tool">
      {showBanner && startingLook ? (
        <div
          className="mb-5 flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
          data-testid="starting-look-banner"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={startingLook.jpg || startingLook.src}
            alt=""
            className="size-14 shrink-0 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Starting from</p>
            <p className="truncate font-semibold" data-testid="starting-look-name">
              {startingLook.name}
            </p>
          </div>
          <button type="button" onClick={changeStarting} className="shrink-0 text-sm font-semibold underline underline-offset-4" data-testid="starting-look-change">
            Change
          </button>
        </div>
      ) : null}
      {error ? (
        <p role="alert" className="mb-5 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm" data-testid="design-error">
          {error}
        </p>
      ) : null}

      {step === "layout" ? (
        <PickStep
          stepKey="layout"
          back={null}
          items={designLayouts}
          value={layoutValue}
          testId="layout"
          onPick={(key) => {
            setLayout(key);
            setStep("walls");
          }}
        />
      ) : null}

      {step === "walls" ? (
        <PickStep
          stepKey="walls"
          back="layout"
          onBack={() => setStep("layout")}
          items={designWalls}
          value={wallValue}
          testId="wall"
          onPick={(key) => {
            setWall(key);
            setStep("floor");
          }}
        />
      ) : null}

      {step === "floor" ? (
        <PickStep
          stepKey="floor"
          back="walls"
          onBack={() => setStep("walls")}
          items={designFloors}
          value={floorValue}
          testId="floor"
          onPick={(key) => {
            setFloor(key);
            setStep("finish");
          }}
        />
      ) : null}

      {step === "finish" ? (
        <PickStep
          stepKey="finish"
          back="floor"
          onBack={() => setStep("floor")}
          items={designFinishes}
          value={finishValue}
          testId="finish"
          aspect="aspect-[4/5]"
          onPick={(key) => {
            setFinish(key);
            setStep("budget");
          }}
        />
      ) : null}

      {step === "budget" ? (
        <section aria-labelledby="design-budget">
          <StepKicker n={STEP_LABELS.budget.n} optional />
          <h2 id="design-budget" tabIndex={-1} data-step-heading className="mt-2 font-heading text-3xl">{budgetQuestion}</h2>
          <p className="mt-2 text-sm text-muted-foreground">This helps Justin, the owner, recommend the right path. You can skip this.</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {budgetOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                data-testid={`budget-${option.id}`}
                onClick={() => {
                  setBudget(option.id);
                  setStep("photos");
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
          <div className="mt-4 flex items-center gap-4">
            <button type="button" onClick={() => setStep("finish")} className="text-sm font-semibold underline underline-offset-4">
              Back
            </button>
            <button
              type="button"
              data-testid="budget-skip"
              onClick={() => {
                setBudget("");
                setStep("photos");
              }}
              className="text-sm font-semibold underline underline-offset-4"
            >
              Skip
            </button>
          </div>
        </section>
      ) : null}

      {step === "photos" ? (
        <section aria-labelledby="design-step-photos">
          <StepKicker n={STEP_LABELS.photos.n} />
          <h2 id="design-step-photos" tabIndex={-1} data-step-heading className="mt-2 font-heading text-3xl">{STEP_LABELS.photos.title}</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{designCopy.tips} Add 1 or 2 photos. We design from the first one.</p>
          {picks ? <p className="mt-3 text-sm font-semibold" data-testid="design-picks-summary">{picks.layout.name} · {picks.wall.name} · {picks.floor.name} · {picks.finish.name}</p> : null}
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
          <div className="sticky bottom-0 z-30 -mx-5 mt-6 border-t border-border bg-background/95 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:static md:mx-0 md:mt-6 md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none flex gap-3">
            <button type="button" onClick={() => setStep("budget")} className="h-14 rounded-full border border-border px-6 font-semibold">
              Back
            </button>
            <button
              type="button"
              disabled={!shots.length || !picks}
              onClick={render}
              className="h-14 min-w-0 flex-1 rounded-full bg-primary px-4 text-base font-semibold text-primary-foreground disabled:opacity-40"
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
          <p tabIndex={-1} data-step-heading className="mt-5 font-heading text-2xl">{designCopy.steps[busyMsg]}</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
            <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Keep this page open.</p>
        </section>
      ) : null}

      {(step === "teaser" || step === "cap-pending") && design ? (
        <section aria-labelledby={step === "cap-pending" ? "design-cap-pending" : "design-step-unlock"}>
          {step === "cap-pending" ? (
            <div className="rounded-3xl border border-border bg-card p-6" data-testid="design-cap-pending">
              <h2 id="design-cap-pending" tabIndex={-1} data-step-heading className="font-heading text-2xl">Your photos are in! We&apos;ll create your custom design by hand. Tell us where to send it.</h2>
            </div>
          ) : design.teaser ? (
            <div className="relative overflow-hidden rounded-3xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={design.teaser} alt="Blurred preview of your new bathroom design" className="w-full" data-testid="design-teaser" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/25 p-6 text-center">
                <p className="font-heading text-2xl text-white drop-shadow">Unlock your full design + before/after.</p>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card p-6" data-testid="design-custom">
              <h2 tabIndex={-1} data-step-heading className="font-heading text-2xl">{designCopy.customTitle}</h2>
              <p className="mt-2 text-base leading-7 text-muted-foreground">{designCopy.customBody(lookName)}</p>
            </div>
          )}
          {step === "cap-pending" ? null : <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Last step</p>}
          {step === "cap-pending" ? null : <h2 id="design-step-unlock" tabIndex={-1} data-step-heading className="mt-2 font-heading text-3xl">Where should we send it?</h2>}
          <UnlockForm
            form={form}
            setForm={setForm}
            errors={errors}
            sending={sending}
            onSubmit={unlock}
            finePrint={step === "cap-pending" ? null : designCopy.finePrint}
            submitLabel={sending ? "Sending…" : step === "cap-pending" ? "Send Me My Design" : design.teaser ? "Unlock my design" : "Get my custom design"}
          />
          {related.length ? <RelatedLooks items={related} /> : null}
        </section>
      ) : null}

      {step === "custom-done" ? (
        <section aria-labelledby="design-custom-done" data-testid="design-custom-done">
          <h2 id="design-custom-done" tabIndex={-1} data-step-heading className="font-heading text-3xl">Justin will call you</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">{designCopy.customThanks(lookName)}</p>
          <SaveJustinContact className="mt-6" buttonClassName="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground" />
          <WindowsQuoteLine className="mt-4 text-muted-foreground" />
          {related.length ? <RelatedLooks items={related} /> : null}
        </section>
      ) : null}

      {step === "reveal" && reveal ? (
        <section aria-labelledby="design-reveal" data-testid="design-reveal">
          <h2 id="design-reveal" tabIndex={-1} data-step-heading className="font-heading text-3xl">Your new {reveal.style} bathroom</h2>
          <BeforeAfter before={reveal.before} after={reveal.after} />
          <div className="mt-4 grid grid-cols-2 gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={reveal.before} alt="Your bathroom now" className="rounded-2xl" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={reveal.after} alt="Your bathroom, redesigned" className="rounded-2xl" />
          </div>
          <div className="mt-6 rounded-[1.4rem] border border-border bg-card p-5" data-testid="design-quote">
            <h3 className="font-heading text-2xl">Justin will call you</h3>
            <p className="mt-2 text-base leading-7 text-muted-foreground">You're on Justin's list. He'll call around the time you picked to discuss your project.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <a href={reveal.after} download="acadiana-bathroom-design.jpg" className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground">
                Download
              </a>
              <button type="button" onClick={tryAnother} className="h-14 rounded-full border border-border px-6 text-base font-semibold">
                Try your other free look
              </button>
            </div>
            <SaveJustinContact className="mt-5" />
          </div>
          {related.length ? <RelatedLooks items={related} /> : null}
          <WindowsQuoteLine className="mt-4 text-muted-foreground" />
        </section>
      ) : null}
    </div>
  );
}

function StepKicker({ n, optional = false }: { n: number; optional?: boolean }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
      {optional ? "Optional" : `Step ${n} of ${STEP_TOTAL}`}
    </p>
  );
}

function PickStep<T extends { key: string; name: string; blurb: string; image: string; alt: string }>({
  stepKey,
  items,
  value,
  testId,
  onPick,
  back,
  onBack,
  aspect = "aspect-[4/5]",
}: {
  stepKey: keyof typeof STEP_LABELS;
  items: T[];
  value: string;
  testId: string;
  onPick: (key: string) => void;
  back: Step | null;
  onBack?: () => void;
  aspect?: string;
}) {
  const meta = STEP_LABELS[stepKey];
  return (
    <section aria-labelledby={`design-step-${stepKey}`}>
      <StepKicker n={meta.n} />
      <h2 id={`design-step-${stepKey}`} tabIndex={-1} data-step-heading className="mt-2 font-heading text-3xl">{meta.title}</h2>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3" role="radiogroup" aria-label={meta.title}>
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            role="radio"
            aria-checked={value === item.key}
            onClick={() => onPick(item.key)}
            data-testid={`${testId}-${item.key}`}
            className={cn(
              "relative overflow-hidden rounded-2xl border bg-card text-left transition",
              value === item.key ? "border-primary ring-3 ring-primary/40" : "border-border",
            )}
          >
            {value === item.key ? (
              <span
                className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground"
                data-testid="your-pick"
              >
                <span aria-hidden="true">✓</span> Your pick
              </span>
            ) : null}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={item.alt} loading="lazy" className={cn("w-full object-cover", aspect)} />
            <span className="block px-3 pt-3 font-semibold leading-5">{item.name}</span>
            <span className="block px-3 pb-3 pt-1 text-sm text-muted-foreground">{item.blurb}</span>
          </button>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        {back && onBack ? (
          <button type="button" onClick={onBack} className="text-sm font-semibold underline underline-offset-4">
            Back
          </button>
        ) : null}
        {value ? (
          <button
            type="button"
            onClick={() => onPick(value)}
            className="inline-flex h-12 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
            data-testid={`${testId}-continue`}
          >
            Continue
          </button>
        ) : null}
      </div>
    </section>
  );
}

function RelatedLooks({ items }: { items: RelatedLook[] }) {
  return (
    <section className="mt-10" data-testid="design-related" aria-labelledby="design-related">
      <h3 id="design-related" className="font-heading text-2xl">You might also like</h3>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <li key={item.key}>
            <a href={item.href} className="block overflow-hidden rounded-2xl border border-border bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.alt} className="aspect-[4/5] w-full object-cover" />
              <span className="block px-3 py-3 text-sm font-semibold">{item.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function UnlockForm({
  form,
  setForm,
  errors,
  sending,
  onSubmit,
  finePrint,
  submitLabel,
}: {
  form: { name: string; phone: string; email: string; street: string; city: string; state: string; zip: string; latitude: string; longitude: string; smsConsent: boolean; preferredCallDay: string; preferredCallTime: string; company_fax: string };
  setForm: Dispatch<SetStateAction<{
    name: string; phone: string; email: string; street: string; city: string; state: string; zip: string; latitude: string; longitude: string; smsConsent: boolean; preferredCallDay: string; preferredCallTime: string; company_fax: string;
  }>>;
  errors: Record<string, string>;
  sending: boolean;
  onSubmit: (event: FormEvent) => void;
  finePrint: string | null;
  submitLabel: string;
}) {
  return (
    <form onSubmit={onSubmit} noValidate className="mt-4 grid gap-4" data-testid="design-unlock-form">
      <Field id="d-name" label="First and last name" error={errors.name}>
        <input id="d-name" name="name" className={field} autoComplete="name" value={form.name} aria-invalid={Boolean(errors.name)} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </Field>
      <Field id="d-phone" label="Mobile phone" error={errors.phone}>
        <input id="d-phone" name="phone" className={field} type="tel" inputMode="tel" autoComplete="tel" value={form.phone} aria-invalid={Boolean(errors.phone)} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
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
              state: address.region || f.state || "LA",
              zip: address.zip || f.zip,
              latitude: address.lat != null ? String(address.lat) : "",
              longitude: address.lon != null ? String(address.lon) : "",
            }))
          }
        />
      </Field>
      <div className="grid grid-cols-[2fr_0.7fr_1fr] gap-3">
        <Field id="d-city" label="Town" error={errors.city}>
          <input id="d-city" name="city" className={field} autoComplete="address-level2" value={form.city} aria-invalid={Boolean(errors.city)} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </Field>
        <Field id="d-state" label="State">
          <input id="d-state" name="state" className={field} autoComplete="address-level1" value={form.state} maxLength={2} onChange={(e) => setForm({ ...form, state: e.target.value.toUpperCase() })} />
        </Field>
        <Field id="d-zip" label="ZIP (optional)" error={errors.zip}>
          <input id="d-zip" name="postal-code" className={field} inputMode="numeric" autoComplete="postal-code" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} />
        </Field>
      </div>
      <Field id="d-email" label="Email" error={errors.email}>
        <input id="d-email" name="email" className={field} type="email" autoComplete="email" value={form.email} aria-invalid={Boolean(errors.email)} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </Field>
      <CallWindowFields
        day={form.preferredCallDay}
        time={form.preferredCallTime}
        onDay={(value) => setForm({ ...form, preferredCallDay: value })}
        onTime={(value) => setForm({ ...form, preferredCallTime: value })}
        dayError={errors.preferredCallDay}
        timeError={errors.preferredCallTime}
        idPrefix="design-call"
      />
      <label className="flex items-start gap-3 text-sm leading-6" htmlFor="d-consent">
        <input
          id="d-consent"
          name="consent"
          type="checkbox"
          required
          aria-required="true"
          className="mt-1 size-5 shrink-0"
          checked={form.smsConsent}
          onChange={(e) => setForm({ ...form, smsConsent: e.target.checked })}
          aria-invalid={Boolean(errors.consent)}
        />
        <span>{consentLabel}</span>
      </label>
      {errors.consent ? <p className="text-sm text-destructive" role="alert">{errors.consent}</p> : null}
      <button type="submit" disabled={sending} className="h-14 rounded-full bg-primary text-base font-semibold text-primary-foreground disabled:opacity-50" data-testid="design-unlock">
        {submitLabel}
      </button>
      {finePrint ? <p className="-mt-2 text-center text-[0.7rem] text-muted-foreground/80" data-testid="design-fine-print">{finePrint}</p> : null}
      <p className="text-xs leading-5 text-muted-foreground">
        {designCopy.privacy}{" "}
        <a href="/privacy" className="underline underline-offset-4">Privacy policy</a>
      </p>
    </form>
  );
}

async function readRenderResponse(response: Response, onStage: (stage: string) => void) {
  const type = response.headers.get("content-type") || "";
  if (!type.includes("ndjson") || !response.body) {
    return response.json().catch(() => ({}));
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let last: Record<string, unknown> = {};
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const event = JSON.parse(line) as Record<string, unknown>;
        if (typeof event.stage === "string") onStage(event.stage);
        last = event;
      } catch {
        // Skip a partial or malformed line.
      }
    }
  }
  if (buffer.trim()) {
    try {
      const event = JSON.parse(buffer) as Record<string, unknown>;
      if (typeof event.stage === "string") onStage(event.stage);
      last = event;
    } catch {
      // Ignore a trailing fragment.
    }
  }
  return last;
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
        <span className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xs font-bold text-[#1c241c] shadow">⇆</span>
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
