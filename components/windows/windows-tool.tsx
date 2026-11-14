"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AddressAutocomplete, type AddressSelection } from "@/components/address-autocomplete";
import { CallWindowFields } from "@/components/call-window-fields";
import { CallbackConfirmation } from "@/components/callback-confirmation";
import { appendAttribution } from "@/components/lead-attribution";
import { brand } from "@/lib/copy";
import { cn } from "cn";
import { useScrollToStep } from "@/lib/scroll-to-step";
import {
  computeWindowEstimate,
  BUTTON_SUB,
  estimateHeadline,
  GET_MY_CUSTOM_QUOTE,
  MATERIALS,
  MAX_STANDARD_STEPPER,
  parseWindowCount,
  ROOMS,
  SERVICE_AREA_WINDOWS,
  STYLES,
  WINDOW_PRICE_LINE,
  WINDOWS_CONSENT_TEXT,
  type MaterialId,
  type RoomId,
  type StyleId,
} from "@/lib/windows";
import { OUTSIDE_AREA } from "@/lib/coverage";

const field =
  "mt-1.5 h-12 w-full rounded-xl border border-input bg-card px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";
const primaryBtn =
  "inline-flex h-12 w-full items-center justify-center rounded-full bg-bronze px-6 text-base font-semibold text-bronze-foreground hover:bg-bronze-hover disabled:opacity-40";
const secondaryBtn =
  "inline-flex h-12 w-full items-center justify-center rounded-full border border-border bg-card px-6 text-base font-semibold";

type Step = "start" | "address" | "lookup" | "count" | "rooms" | "style" | "material" | "contact" | "estimate" | "thanks";

const FLOW: Step[] = ["address", "count", "rooms", "style", "material", "contact"];

const LOOKUP_LINES = ["Finding your house…", "Opening Street View…", "Getting a clear look at the front…"];

export function WindowsTool() {
  const [step, setStep] = useState<Step>("start");
  const [manualCount, setManualCount] = useState(false);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [state, setState] = useState("LA");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [streetView, setStreetView] = useState<{ image: string; attribution: string } | null>(null);
  const [lookupFailed, setLookupFailed] = useState(false);
  const [lookupLine, setLookupLine] = useState(0);
  const [standardInput, setStandardInput] = useState("");
  const [overThirty, setOverThirty] = useState(false);
  const [unsureCount, setUnsureCount] = useState(false);
  const [replaceAll, setReplaceAll] = useState<"all" | "some" | "">("");
  const [bayBow, setBayBow] = useState<"yes" | "no" | "unsure" | "">("");
  const [bayBowCount, setBayBowCount] = useState(1);
  const [rooms, setRooms] = useState<RoomId[]>([]);
  const [styles, setStyles] = useState<StyleId[]>([]);
  const [material, setMaterial] = useState<MaterialId | "">("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [preferredCallDay, setPreferredCallDay] = useState("");
  const [preferredCallTime, setPreferredCallTime] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fax, setFax] = useState("");

  const rootRef = useRef<HTMLDivElement>(null);
  useScrollToStep(step, rootRef);

  const standardCount = unsureCount ? null : parseWindowCount(overThirty ? standardInput : standardInput || null);
  const estimate = useMemo(
    () =>
      material
        ? computeWindowEstimate({
            standardCount,
            bayBowCount: bayBow === "yes" ? bayBowCount : 0,
            material,
          })
        : null,
    [standardCount, bayBow, bayBowCount, material],
  );

  useEffect(() => {
    if (step !== "lookup") return;
    const timer = window.setInterval(() => setLookupLine((value) => (value + 1) % LOOKUP_LINES.length), 1600);
    return () => window.clearInterval(timer);
  }, [step]);

  useEffect(() => {
    if (bayBow !== "yes") return;
    setStyles((current) => (current.includes("bay-bow") || current.includes("unsure") ? current : [...current, "bay-bow"]));
  }, [bayBow]);

  function selectAddress(address: AddressSelection) {
    setStreet(address.street || address.label);
    setCity(address.city);
    if (address.region) setState(address.region);
    setZip(address.zip);
    setLatitude(address.lat);
    setLongitude(address.lon);
  }

  async function lookupHome() {
    if (!street.trim()) {
      setErrors({ street: "Enter your street address." });
      return;
    }
    setErrors({});
    setManualCount(false);
    setStep("lookup");
    setLookupFailed(false);
    setStreetView(null);
    try {
      const response = await fetch("/api/windows/street-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ street, city, zip, latitude, longitude }),
      });
      const data = (await response.json()) as { found?: boolean; image?: string | null; attribution?: string };
      if (data.found && data.image) {
        setStreetView({ image: data.image, attribution: data.attribution || "Photo from Google Street View" });
      } else {
        setLookupFailed(true);
      }
    } catch {
      setLookupFailed(true);
    }
    setStep("count");
  }

  function goCount(manual: boolean) {
    setManualCount(manual);
    if (manual) {
      setStreetView(null);
      setLookupFailed(false);
      setStep("count");
      return;
    }
    setStep("address");
  }

  function continueFromCount() {
    if (!unsureCount) {
      const count = parseWindowCount(standardInput);
      if (count == null) {
        setErrors({ count: "Enter how many windows you want replaced, or choose not sure." });
        return;
      }
    }
    setErrors({});
    setStep("rooms");
  }

  async function submitLead(event: React.FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Enter your first and last name.";
    if (phone.replace(/\D/g, "").length < 10) next.phone = "Enter a 10-digit mobile number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "Enter a valid email.";
    if (!street.trim()) next.street = "Enter your street address.";
    if (!city.trim()) next.city = "Enter your town.";
    if (!consent) next.consent = "Please check the box to continue.";
    if (!preferredCallDay) next.preferredCallDay = "Pick the best day for us to call.";
    if (!preferredCallTime) next.preferredCallTime = "Pick the best time for us to call.";
    if (!material) next.material = "Pick a material, or choose not sure.";
    setErrors(next);
    setSubmitError("");
    if (Object.keys(next).length) return;
    setSubmitting(true);
    try {
      const body = new FormData();
      body.set("name", name);
      body.set("phone", phone);
      body.set("email", email);
      body.set("street", street);
      body.set("city", city);
      body.set("zip", zip);
      if (latitude != null) body.set("latitude", String(latitude));
      if (longitude != null) body.set("longitude", String(longitude));
      body.set("material", material);
      if (!unsureCount && standardInput) body.set("standardCount", standardInput);
      else body.set("standardCount", "unsure");
      body.set("bayBowCount", bayBow === "yes" ? String(bayBowCount) : "0");
      body.set("styles", styles.join(","));
      body.set("rooms", rooms.join(","));
      body.set("replaceAll", replaceAll);
      body.set("consent", "true");
      body.set("preferredCallDay", preferredCallDay);
      body.set("preferredCallTime", preferredCallTime);
      body.set("company_fax", fax);
      appendAttribution(body, "/windows");
      const response = await fetch("/api/windows/lead", { method: "POST", body });
      const data = (await response.json()) as { ok?: boolean; error?: string; errors?: Record<string, string> };
      if (!response.ok || !data.ok) {
        setErrors(data.errors || {});
        setSubmitError(data.error || "We couldn't submit that. Please try again.");
        setSubmitting(false);
        return;
      }
      setStep("estimate");
    } catch {
      setSubmitError("We couldn't submit that. Please try again.");
    }
    setSubmitting(false);
  }

  const flowIndex = FLOW.indexOf(step);
  const progress = flowIndex >= 0 ? flowIndex + 1 : 0;

  return (
    <div ref={rootRef} className="mx-auto w-full max-w-3xl px-5 pb-16 pt-6 md:pt-12">
      {progress > 0 && step !== "estimate" && step !== "thanks" ? (
        <p className="mb-6 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          Step {progress} of {FLOW.length}
        </p>
      ) : null}

      {step === "start" ? (
        <section data-testid="windows-start">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground">Windows</p>
          <h1 tabIndex={-1} data-step-heading className="mt-3 font-heading text-[clamp(2.4rem,7vw,4.2rem)] leading-[0.98]">
            Get a ballpark for new windows. We&apos;ll call to discuss your windows, then set a time to take measurements for the real quote.
          </h1>
          <p className="mt-4 text-lg font-medium" data-testid="window-pricing">
            {WINDOW_PRICE_LINE}
          </p>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">{SERVICE_AREA_WINDOWS}</p>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">{OUTSIDE_AREA}</p>
          <p className="mt-4 text-base leading-7 text-foreground">
            Works for one window or a whole house. Enter your address and we&apos;ll look up a Street View photo so you can
            confirm or edit the count. Prefer to type the number yourself? You can do that too. Then pick a style and
            material, leave your name and phone, and see a ballpark estimate. We&apos;ll call you to discuss your
            windows and set a time to take measurements. When your consultant measures, you&apos;ll get your exact price right then. There&apos;s no obligation.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" className={primaryBtn} onClick={() => goCount(false)}>
              Start with my address
            </button>
            <button type="button" className={secondaryBtn} onClick={() => goCount(true)}>
              I&apos;ll enter the window count myself
            </button>
          </div>
        </section>
      ) : null}

      {step === "address" ? (
        <section>
          <h1 tabIndex={-1} data-step-heading className="font-heading text-[clamp(2rem,6vw,3.2rem)] leading-[1.02]">Where should we look?</h1>
          <p className="mt-3 text-lg leading-8 text-muted-foreground">
            We&apos;ll use this address to find your house on Street View. You&apos;ll confirm the window count before we go
            further — one window is fine, and so is a whole house.
          </p>
          <form
            className="mt-8 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void lookupHome();
            }}
          >
            <div>
              <label htmlFor="windows-street" className="text-sm font-medium">
                Home address
              </label>
              <AddressAutocomplete
                id="windows-street"
                value={street}
                onChange={setStreet}
                onSelect={selectAddress}
                invalid={Boolean(errors.street)}
                describedBy="windows-street-help"
              />
              <p id="windows-street-help" className="mt-1.5 text-sm text-muted-foreground">
                House number, street, city, and ZIP.
              </p>
              {errors.street ? <p className="mt-1.5 text-sm text-destructive">{errors.street}</p> : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-[2fr_0.7fr_1fr]">
              <div>
                <label htmlFor="windows-city" className="text-sm font-medium">
                  Town
                </label>
                <input id="windows-city" name="city" className={field} value={city} onChange={(event) => setCity(event.target.value)} autoComplete="address-level2" />
              </div>
              <div>
                <label htmlFor="windows-state" className="text-sm font-medium">
                  State
                </label>
                <input id="windows-state" name="state" className={field} value={state} maxLength={2} onChange={(event) => setState(event.target.value.toUpperCase())} autoComplete="address-level1" />
              </div>
              <div>
                <label htmlFor="windows-zip" className="text-sm font-medium">
                  ZIP
                </label>
                <input id="windows-zip" name="postal-code" className={field} value={zip} onChange={(event) => setZip(event.target.value)} autoComplete="postal-code" inputMode="numeric" />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button type="submit" className={primaryBtn}>
                Look up my home
              </button>
              <button type="button" className="text-sm underline underline-offset-4" onClick={() => goCount(true)}>
                Skip the photo and enter a count myself
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {step === "lookup" ? (
        <section aria-live="polite" aria-busy="true">
          <h1 tabIndex={-1} data-step-heading className="font-heading text-[clamp(2rem,6vw,3.2rem)] leading-[1.02]">Looking at your home…</h1>
          {streetView?.image ? (
            <div className="relative mt-6 overflow-hidden rounded-3xl bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={streetView.image} alt="" className="aspect-[16/10] w-full object-cover opacity-80" />
              <span className="design-scanline pointer-events-none absolute inset-x-0 top-0 h-1/4" aria-hidden="true" />
            </div>
          ) : (
            <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-3xl bg-secondary/80">
              <span className="design-scanline pointer-events-none absolute inset-x-0 top-0 h-1/4" aria-hidden="true" />
            </div>
          )}
          <p className="mt-5 font-heading text-2xl">{LOOKUP_LINES[lookupLine]}</p>
        </section>
      ) : null}

      {step === "count" ? (
        <section>
          <h1 tabIndex={-1} data-step-heading className="font-heading text-[clamp(2rem,6vw,3.2rem)] leading-[1.02]">How many windows do you want replaced?</h1>
          <p className="mt-3 text-lg leading-8 text-muted-foreground">One window is fine. So is a whole house, or anything in between.</p>
          {streetView?.image ? (
            <figure className="mt-6 overflow-hidden rounded-3xl border border-border bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={streetView.image} alt="Your house from the street" className="aspect-[16/10] w-full object-cover" />
              <figcaption className="px-4 py-2 text-xs text-muted-foreground">{streetView.attribution}</figcaption>
            </figure>
          ) : null}
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {lookupFailed || manualCount
              ? "Enter how many windows you want replaced — one is fine — or choose “Not sure” and your consultant will count them when they measure."
              : "Street View usually shows the front of the house, and sometimes a side. It often misses the back. Please confirm or edit the total you want replaced."}
          </p>
          <div className="mt-6">
            <label htmlFor="windows-count" className="text-sm font-medium">
              Total windows to replace
            </label>
            <div className="mt-1.5 flex items-center gap-3">
              <button
                type="button"
                className="inline-flex size-12 items-center justify-center rounded-full border border-border bg-card text-2xl"
                onClick={() => {
                  setUnsureCount(false);
                  const current = parseWindowCount(standardInput) ?? 1;
                  const next = Math.max(1, current - 1);
                  setOverThirty(next > MAX_STANDARD_STEPPER);
                  setStandardInput(String(next));
                }}
                aria-label="Fewer windows"
              >
                –
              </button>
              <input
                id="windows-count"
                className={cn(field, "mt-0 text-center text-xl font-semibold")}
                inputMode="numeric"
                value={unsureCount ? "" : standardInput}
                placeholder={unsureCount ? "Not sure" : "0"}
                onChange={(event) => {
                  setUnsureCount(false);
                  const raw = event.target.value.replace(/\D/g, "");
                  setStandardInput(raw);
                  const parsed = parseWindowCount(raw);
                  setOverThirty(parsed != null && parsed > MAX_STANDARD_STEPPER);
                }}
                disabled={unsureCount}
              />
              <button
                type="button"
                className="inline-flex size-12 items-center justify-center rounded-full border border-border bg-card text-2xl"
                onClick={() => {
                  setUnsureCount(false);
                  const current = parseWindowCount(standardInput) ?? 0;
                  const next = current + 1;
                  setOverThirty(next > MAX_STANDARD_STEPPER);
                  setStandardInput(String(next));
                }}
                aria-label="More windows"
              >
                +
              </button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">One window up to a whole house. There is no minimum.</p>
            {errors.count ? <p className="mt-1.5 text-sm text-destructive">{errors.count}</p> : null}
          </div>
          <div className="mt-5 flex flex-col gap-2">
            <label className="flex items-center gap-3 text-sm">
              <input type="radio" name="replace" checked={replaceAll === "all"} onChange={() => setReplaceAll("all")} />
              Replace all the windows in the house
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input type="radio" name="replace" checked={replaceAll === "some"} onChange={() => setReplaceAll("some")} />
              Only some of them, including a single window
            </label>
          </div>
          <button
            type="button"
            className="mt-4 text-sm underline underline-offset-4"
            onClick={() => {
              setUnsureCount(true);
              setStandardInput("");
            }}
          >
            Not sure — your consultant can count them when they measure.
          </button>
          <div className="mt-6 rounded-2xl border border-border bg-card p-4">
            <p className="text-sm font-medium">Add a bay or bow window?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(["yes", "no", "unsure"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setBayBow(option)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm capitalize",
                    bayBow === option ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background",
                  )}
                >
                  {option === "unsure" ? "Not sure" : option}
                </button>
              ))}
            </div>
            {bayBow === "yes" ? (
              <div className="mt-3">
                <p className="text-sm text-muted-foreground">How many? These are priced as their own openings.</p>
                <div className="mt-2 flex gap-2">
                  {[1, 2, 3].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setBayBowCount(count)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm",
                        bayBowCount === count ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background",
                      )}
                    >
                      {count === 3 ? "3+" : count}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" className={secondaryBtn} onClick={() => setStep(manualCount ? "start" : "address")}>
              Back
            </button>
            <button type="button" className={primaryBtn} onClick={continueFromCount}>
              Continue
            </button>
          </div>
        </section>
      ) : null}

      {step === "rooms" ? (
        <section>
          <h1 tabIndex={-1} data-step-heading className="font-heading text-[clamp(2rem,6vw,3.2rem)] leading-[1.02]">Which rooms are we talking about?</h1>
          <p className="mt-3 text-lg leading-8 text-muted-foreground">
            Tap every room that has windows you want replaced. If it&apos;s just one window, tap that room. This helps us
            plan. It doesn&apos;t change your options.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {ROOMS.map((room) => {
              const on = rooms.includes(room.id);
              return (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => setRooms((current) => (on ? current.filter((id) => id !== room.id) : [...current, room.id]))}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm",
                    on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
                  )}
                >
                  {room.name}
                </button>
              );
            })}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" className={secondaryBtn} onClick={() => setStep("count")}>
              Back
            </button>
            <button type="button" className={primaryBtn} onClick={() => setStep("style")}>
              Continue
            </button>
          </div>
        </section>
      ) : null}

      {step === "style" ? (
        <section>
          <h1 tabIndex={-1} data-step-heading className="font-heading text-[clamp(2rem,6vw,3.2rem)] leading-[1.02]">What style are you thinking?</h1>
          <p className="mt-3 text-lg leading-8 text-muted-foreground">
            You can pick more than one. Your consultant will confirm what fits each opening when they measure, and you&apos;ll get your exact price right then.
          </p>
          <div className="mt-6 grid gap-3">
            {STYLES.map((style) => {
              const on = styles.includes(style.id);
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => {
                    if (style.id === "unsure") {
                      setStyles(on ? [] : ["unsure"]);
                      return;
                    }
                    setStyles((current) => {
                      const without = current.filter((id) => id !== "unsure" && id !== style.id);
                      return on ? without : [...without, style.id];
                    });
                  }}
                  className={cn(
                    "rounded-2xl border p-4 text-left",
                    on ? "border-primary bg-tint-clay/40" : "border-border bg-card",
                  )}
                >
                  <p className="font-medium">{style.name}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{style.blurb}</p>
                </button>
              );
            })}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" className={secondaryBtn} onClick={() => setStep("rooms")}>
              Back
            </button>
            <button type="button" className={primaryBtn} onClick={() => setStep("material")}>
              Continue
            </button>
          </div>
        </section>
      ) : null}

      {step === "material" ? (
        <section>
          <h1 tabIndex={-1} data-step-heading className="font-heading text-[clamp(2rem,6vw,3.2rem)] leading-[1.02]">What material feels right?</h1>
          <p className="mt-3 text-lg leading-8 text-muted-foreground">
            This helps us build a ballpark range, not a quote. When your consultant measures, you&apos;ll get your exact price right then.
          </p>
          <div className="mt-6 grid gap-3">
            {MATERIALS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMaterial(item.id)}
                className={cn(
                  "rounded-2xl border p-4 text-left",
                  material === item.id ? "border-primary bg-tint-clay/40" : "border-border bg-card",
                )}
              >
                <p className="font-medium">{item.name}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.blurb}</p>
              </button>
            ))}
          </div>
          {errors.material ? <p className="mt-3 text-sm text-destructive">{errors.material}</p> : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" className={secondaryBtn} onClick={() => setStep("style")}>
              Back
            </button>
            <button
              type="button"
              className={primaryBtn}
              onClick={() => {
                if (!material) {
                  setErrors({ material: "Pick a material, or choose not sure." });
                  return;
                }
                setErrors({});
                setStep("contact");
              }}
            >
              Continue
            </button>
          </div>
        </section>
      ) : null}

      {step === "contact" ? (
        <section>
          <h1 tabIndex={-1} data-step-heading className="font-heading text-[clamp(2rem,6vw,3.2rem)] leading-[1.02]">Unlock your ballpark</h1>
          <p className="mt-3 text-lg leading-8 text-muted-foreground">
            Leave your name and a good number. We&apos;ll show a ballpark estimate for planning — not a quote.
          </p>
          <form className="mt-8 space-y-4" onSubmit={(event) => void submitLead(event)}>
            <input className="hidden" tabIndex={-1} autoComplete="off" value={fax} onChange={(event) => setFax(event.target.value)} name="company_fax" />
            <div>
              <label htmlFor="windows-name" className="text-sm font-medium">
                First and last name
              </label>
              <input id="windows-name" name="name" className={field} autoComplete="name" value={name} aria-invalid={Boolean(errors.name)} onChange={(event) => setName(event.target.value)} />
              {errors.name ? <p className="mt-1.5 text-sm text-destructive">{errors.name}</p> : null}
            </div>
            <div>
              <label htmlFor="windows-phone" className="text-sm font-medium">
                Mobile phone
              </label>
              <input id="windows-phone" name="phone" className={field} type="tel" inputMode="tel" autoComplete="tel" value={phone} aria-invalid={Boolean(errors.phone)} onChange={(event) => setPhone(event.target.value)} />
              {errors.phone ? <p className="mt-1.5 text-sm text-destructive">{errors.phone}</p> : null}
            </div>
            <div>
              <label htmlFor="windows-address" className="text-sm font-medium">
                Address
              </label>
              <AddressAutocomplete
                id="windows-address"
                value={street}
                onChange={setStreet}
                onSelect={selectAddress}
                invalid={Boolean(errors.street)}
              />
              {errors.street ? <p className="mt-1.5 text-sm text-destructive">{errors.street}</p> : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-[2fr_0.7fr_1fr]">
              <div>
                <label htmlFor="windows-town" className="text-sm font-medium">
                  Town
                </label>
                <input id="windows-town" name="city" className={field} autoComplete="address-level2" value={city} aria-invalid={Boolean(errors.city)} onChange={(event) => setCity(event.target.value)} />
                {errors.city ? <p className="mt-1.5 text-sm text-destructive">{errors.city}</p> : null}
              </div>
              <div>
                <label htmlFor="windows-contact-state" className="text-sm font-medium">
                  State
                </label>
                <input id="windows-contact-state" name="state" className={field} autoComplete="address-level1" value={state} maxLength={2} onChange={(event) => setState(event.target.value.toUpperCase())} />
              </div>
              <div>
                <label htmlFor="windows-contact-zip" className="text-sm font-medium">
                  ZIP
                </label>
                <input id="windows-contact-zip" name="postal-code" className={field} autoComplete="postal-code" inputMode="numeric" value={zip} onChange={(event) => setZip(event.target.value)} />
              </div>
            </div>
            <div>
              <label htmlFor="windows-email" className="text-sm font-medium">
                Email
              </label>
              <input id="windows-email" name="email" className={field} type="email" autoComplete="email" value={email} aria-invalid={Boolean(errors.email)} onChange={(event) => setEmail(event.target.value)} />
              {errors.email ? <p className="mt-1.5 text-sm text-destructive">{errors.email}</p> : null}
            </div>
            <CallWindowFields
              day={preferredCallDay}
              time={preferredCallTime}
              onDay={setPreferredCallDay}
              onTime={setPreferredCallTime}
              dayError={errors.preferredCallDay}
              timeError={errors.preferredCallTime}
              idPrefix="windows-call"
            />
            <label className="flex items-start gap-3 text-xs leading-5 text-muted-foreground" htmlFor="windows-consent">
              <input
                id="windows-consent"
                name="consent"
                type="checkbox"
                required
                aria-required="true"
                className="mt-0.5 size-5 shrink-0 accent-[var(--primary)]"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                aria-invalid={Boolean(errors.consent)}
              />
              <span>{WINDOWS_CONSENT_TEXT}</span>
            </label>
            {errors.consent ? <p className="text-sm text-destructive">{errors.consent}</p> : null}
            {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" className={secondaryBtn} onClick={() => setStep("material")}>
                Back
              </button>
              <button type="submit" className={primaryBtn} disabled={submitting}>
                {submitting ? "Saving…" : "See my estimate"}
              </button>
            </div>
            <p className="text-center text-sm text-muted-foreground">{BUTTON_SUB}</p>
          </form>
        </section>
      ) : null}

      {step === "estimate" ? (
        <section data-testid="windows-estimate">
          <h1 tabIndex={-1} data-step-heading className="font-heading text-[clamp(2rem,6vw,3.2rem)] leading-[1.02]">Your estimate</h1>
          {estimate ? (
            <p className="mt-4 text-lg leading-8">{estimateHeadline(estimate)}</p>
          ) : (
            <p className="mt-4 text-lg leading-8">
              We need a window count to show a dollar range. We&apos;ll call you to discuss your windows project and set a time to take measurements. When your consultant measures, you&apos;ll get your exact price right then.
            </p>
          )}
          <p className="mt-4 text-base leading-7 text-foreground">
            This is a ballpark range, not a quote. When your consultant measures, you&apos;ll get your exact price right then.
          </p>
          <div className="mt-6 rounded-2xl border border-border bg-card p-5 text-sm leading-6">
            <p className="font-medium">Your recap</p>
            <p className="mt-2 text-muted-foreground">
              {[street, city, zip].filter(Boolean).join(", ")}
              {standardCount != null ? ` · ${standardCount} window${standardCount === 1 ? "" : "s"}` : " · count to confirm"}
              {bayBow === "yes" ? ` · ${bayBowCount} bay or bow` : ""}
              {material ? ` · ${MATERIALS.find((item) => item.id === material)?.name}` : ""}
            </p>
          </div>
          <div className="mt-8">
            <button type="button" className={primaryBtn} onClick={() => setStep("thanks")} data-testid="windows-get-quote">
              {GET_MY_CUSTOM_QUOTE}
            </button>
            <p className="mt-3 text-center text-sm text-muted-foreground">{BUTTON_SUB}</p>
          </div>
        </section>
      ) : null}

      {step === "thanks" ? (
        <section data-testid="windows-thanks">
          <CallbackConfirmation
            name={name}
            day={preferredCallDay}
            time={preferredCallTime}
            buttonClassName={primaryBtn}
          >
            {estimate ? <p className="text-base leading-7">{estimateHeadline(estimate)}</p> : null}
            <p className="text-base leading-7 text-foreground">
              This is a ballpark range, not a quote. When your consultant measures, you&apos;ll get your exact price right then.
            </p>
          </CallbackConfirmation>
        </section>
      ) : null}
    </div>
  );
}
