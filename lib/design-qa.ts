import type { RoomScan } from "./design-render";
import type { DesignStyle } from "./design-styles";
import { layoutAllowsFixtureChange, layoutQaNotes, type DesignLayout } from "./design-picks";

/**
 * Automatic QA on every render: a second vision model compares the homeowner's photo (A)
 * with the redesign (B) and checks layout, plumbing and artifacts. The verdict is computed
 * here from the individual checks, never from a single "pass" flag the model could fudge.
 */
const XAI = "https://api.x.ai/v1";
// Fast non-reasoning vision model with a list-the-differences-first prompt: in our 12-image spike it
// caught the added grab bars, extra soap dishes and moved plumbing the reasoning model missed, in ~4 s instead of ~50 s.
export const QA_MODEL = process.env.DESIGN_QA_MODEL || "grok-4.20-0309-non-reasoning";
const USD_TICKS = 10_000_000_000;

export const QA_CHECKS = {
  same_camera: "camera angle or crop changed",
  layout_kept: "walls, windows or doors changed",
  footprint_kept: "tub or shower footprint changed",
  fixtures_kept: "a fixture was added, removed or duplicated",
  faucets_ok: "a faucet is not over a sink",
  sink_present: "the sink is missing",
  shower_plumbing_ok: "shower head or valve misplaced",
  handles_ok: "handles or knobs offset or odd",
  nothing_floating: "something is floating",
  geometry_ok: "warped geometry",
  no_text: "text, logo or watermark artifact",
  no_people: "a person is visible",
  realistic: "does not look real or buildable",
} as const;

export type QaCheck = keyof typeof QA_CHECKS;

export type QaVerdict = {
  pass: boolean;
  failed: QaCheck[];
  reasons: string[];
  model: string;
  costUsd: number;
  latencyMs: number;
  /** True when the QA call itself broke; treated as a fail (never show an unchecked image). */
  error?: string;
};

function qaPrompt(inventory: string, style: DesignStyle, layout?: DesignLayout) {
  const conversion = layout
    ? `The homeowner picked this conversion, which IS allowed: ${layout.name}. ${layout.prompt} Allowed conversion changes (these are NOT defects): ${layoutQaNotes(layout).join("; ") || "none beyond finishes"}.`
    : "Keep the existing tub or shower footprint. A tub should stay a tub and a shower should stay a shower unless the look above clearly says otherwise.";
  return `You are a strict quality inspector for a bathroom remodel visualizer. IMAGE A is the homeowner's real photo. IMAGE B is the redesigned version, which is supposed to apply the conversion and finishes the homeowner picked, remove clutter, and keep the same room, camera, walls, windows and doors. Fixtures that are not part of the conversion stay in the same place.
The look the homeowner picked: ${style.spec}.
${conversion}
Allowed changes (these are NOT defects): the conversion above; new wall, floor and surround materials and colors; a new metal finish or a new style of an existing faucet, handle, shower head, towel bar, light or mirror at the same spot; clear shower glass replacing a curtain or an old framed door; removing clutter, toiletries, towels, mats, curtains and loose items; removing a small wall accessory such as a soap dish, toothbrush holder, hook, vent cover or tissue holder, or showing it in a new style at the same spot; one recessed wall niche if the look above names one; one shower valve and one tub spout on the wet wall directly below an existing shower head when A has the shower head but its valve or spout is hidden or out of view.
Fixtures found in IMAGE A:
${inventory || "- (not listed; read them from IMAGE A)"}
Inspect IMAGE B closely (zoom into every faucet, sink, handle, knob, shower head and valve) and compare it with IMAGE A. Be strict about real defects, but do not fail B for text or logos that were already in A, or for small geometry drift such as a slightly larger TV or a slightly narrower doorway. Return ONLY JSON, filling the keys in this order:
{"b_fixtures": ["first, list every fixture you see in IMAGE B, one line each, with its place in the frame: sinks, faucets, toilets, tub, shower heads, valves, handles, spouts, shelves, soap dishes, niches, grab bars, towel bars, mirrors, lights, windows, doors"],
 "differences": [{"what": "then list every difference between A and B, one per item: anything added, missing, duplicated, moved, floating, misaligned or warped, any text or logo, and also each finish change", "allowed": boolean (true only if it is one of the allowed changes above; ADDING a grab bar, shelf, caddy, soap dish, second niche, extra valve, extra spout or extra shower head that A does not have is NOT allowed; a moved, missing or duplicated sink, faucet, toilet, tub, shower head, window, door or mirror is NOT allowed)}],
 "same_camera": boolean (same viewpoint, angle and crop; small zoom or perspective drift under about 5% is fine),
 "layout_kept": boolean (same walls, ceiling line, windows and doors; no wall, window, door or opening added, removed or moved to a different place. Small size or width drift of an existing doorway or opening is allowed),
 "footprint_kept": boolean (the wet area stays in the same place and size. If the conversion allows it, a tub may become a shower or a shower may become a tub, or a tub may become freestanding or curbless, in that same footprint. Fail only if the wet area moved to a different wall or a conversion that was not picked was done),
 "fixtures_kept": boolean (major fixtures that are not part of the conversion stay in B: the toilet, vanity, windows and doors are not missing or clearly relocated. The tub may be removed or added only when the conversion above allows it. Small geometry drift is allowed and must not fail this check: a TV a bit larger or smaller, a doorway a bit narrower or wider, or a slight perspective shift. Only fail if a toilet, vanity, window or door was clearly removed or moved, or if a tub changed in a way the conversion does not allow),
 "faucets_ok": boolean (every faucet in B sits over a real sink basin or tub with its spout pointing into it; no faucet over a countertop, wall or floor; no sink without a faucet; true if no faucet is visible in either image),
 "sink_present": boolean (if A has a sink, B has a real sink basin there; true if A has no sink),
 "shower_plumbing_ok": boolean (shower head and valve on a wall at sensible heights, valve below the head, connected, not floating, not duplicated; true if not visible),
 "handles_ok": boolean (handles and knobs are aligned, symmetrical, attached and normally shaped; no offset, melted, extra or odd handles),
 "nothing_floating": boolean (no floating, half-merged or impossible objects, shelves or pipes),
 "geometry_ok": boolean (straight walls, tile lines and edges; no warping, bending, melting or impossible perspective),
 "no_text": boolean (no NEW text, letters, logos, brand names or watermark artifacts in B that were not already in A. Text or logos already in A — for example a TV or appliance brand logo — that remain in the same place in B are allowed and must not fail this check),
 "no_people": boolean (no people, faces or body parts in B, including reflections),
 "realistic": boolean (looks like a real photo of a finished, buildable bathroom),
 "reasons": ["one short plain-English reason for every false check, saying where in the image; empty if all true"]}`;
}

export function inventoryText(scan: RoomScan) {
  return scan.fixtures.map((line) => `- ${line}`).join("\n");
}


/** Text/logos that were already in the homeowner's photo, e.g. a TV brand logo. */
export function isExistingPhotoText(reason: string) {
  const text = reason.toLowerCase();
  if (/(watermark|gibberish|lorem|new text|added text|letters floating)/.test(text)) return false;
  return (
    /already (in|present|visible)/.test(text) ||
    /same (place|spot|position)/.test(text) ||
    /tv (brand )?logo/.test(text) ||
    /logo (visible )?on (the )?(wall-mounted )?tv/.test(text) ||
    /brand (name|logo).{0,40}(tv|television|appliance|bezel)/.test(text) ||
    /\bphilips\b/.test(text) ||
    /(samsung|sony|vizio|hisense|toshiba)\s+logo/.test(text)
  );
}

const MAJOR_FIXTURE = /\b(tubs?|toilets?|vanitys?|vanities|windows?)\b/;
const MAJOR_DOOR = /(?:^|[\s,;:/])doors?\b(?!way)/;
const REMOVED = /\b(missing|removed|relocated|gone|deleted|missing from b)\b/;

/** Small TV-size or doorway-width drift, not a removed or relocated major fixture. */
export function isMinorFixtureDrift(reason: string) {
  const text = reason.toLowerCase();
  if (MAJOR_FIXTURE.test(text) && REMOVED.test(text)) return false;
  if (MAJOR_DOOR.test(text) && REMOVED.test(text) && !/doorway|door opening/.test(text)) return false;
  return (
    /\b(tv|television|doorway|door opening|opening to the hallway|open doorway)\b/.test(text) &&
    /\b(slightly|minimal(?:ly)?|small|perspective|larger|smaller|narrower|wider|repositioned)\b/.test(text)
  );
}

function isTextRelated(reason: string) {
  return /\b(text|logo|watermark|brand name|letters|philips)\b/.test(reason.toLowerCase());
}

function isFixtureRelated(reason: string) {
  return /\b(fixture|tv|television|doorway|vanity|tub|toilet|window|door)\b/.test(reason.toLowerCase());
}

/**
 * Soften a raw QA verdict: ignore text/logos already in the original photo,
 * and tolerate small geometry drift on TVs and doorways.
 */
export function softenQaVerdict(input: { failed: QaCheck[]; reasons: string[]; disallowed?: string[]; layout?: DesignLayout }) {
  const allowedByLayout = (reason: string) => (input.layout ? layoutAllowsFixtureChange(input.layout, reason) : false);
  const disallowed = (input.disallowed ?? []).filter(
    (item) => !isExistingPhotoText(item) && !isMinorFixtureDrift(item) && !allowedByLayout(item),
  );
  const drop = new Set<QaCheck>();
  if (input.failed.includes("no_text")) {
    const textReasons = input.reasons.filter(isTextRelated);
    if (!textReasons.length || textReasons.every(isExistingPhotoText)) drop.add("no_text");
  }
  if (input.failed.includes("fixtures_kept")) {
    const fixtureReasons = input.reasons.filter(isFixtureRelated);
    if (
      !fixtureReasons.length ||
      fixtureReasons.every((reason) => isMinorFixtureDrift(reason) || isExistingPhotoText(reason) || allowedByLayout(reason))
    ) {
      drop.add("fixtures_kept");
    }
  }
  if (input.failed.includes("footprint_kept")) {
    const footprintReasons = input.reasons.filter((reason) => /\b(tub|shower|footprint|alcove|curb|curbless)\b/.test(reason.toLowerCase()));
    if (!footprintReasons.length || footprintReasons.every((reason) => isMinorFixtureDrift(reason) || allowedByLayout(reason))) {
      drop.add("footprint_kept");
    }
  }
  if (input.failed.includes("layout_kept")) {
    const layoutReasons = input.reasons.filter((reason) => /doorway|opening|tv|layout|door|window|wall/.test(reason.toLowerCase()));
    if (layoutReasons.length && layoutReasons.every((reason) => isMinorFixtureDrift(reason))) drop.add("layout_kept");
  }
  const failed = input.failed.filter((check) => !drop.has(check));
  const reasons = input.reasons.filter((reason) => {
    if (drop.has("no_text") && isTextRelated(reason) && isExistingPhotoText(reason)) return false;
    if ((drop.has("fixtures_kept") || drop.has("footprint_kept")) && (isMinorFixtureDrift(reason) || allowedByLayout(reason))) return false;
    if (drop.has("layout_kept") && isMinorFixtureDrift(reason)) return false;
    return true;
  });
  return { failed, reasons, disallowed };
}

/** An attempt is usable when it produced a real image that isn't clearly broken. */
export function isUsableRedesign(failed: QaCheck[] | undefined, hasImage: boolean) {
  if (!hasImage) return false;
  const list = failed ?? [];
  if (list.includes("no_people")) return false;
  if (list.includes("geometry_ok") && list.includes("realistic")) return false;
  if (list.includes("nothing_floating") && list.includes("realistic")) return false;
  return true;
}

export function rankUsableAttempts<T extends { attempt: number; after?: unknown; verdict?: { failed: QaCheck[] } | null }>(attempts: T[]) {
  return attempts
    .filter((item) => isUsableRedesign(item.verdict?.failed, Boolean(item.after)))
    .sort((a, b) => {
      const failedA = a.verdict?.failed.length ?? 99;
      const failedB = b.verdict?.failed.length ?? 99;
      if (failedA !== failedB) return failedA - failedB;
      return b.attempt - a.attempt;
    });
}

const dataUri = (bytes: Buffer) => `data:image/jpeg;base64,${bytes.toString("base64")}`;

export async function qaCheck(before: Buffer, after: Buffer, scan: RoomScan, style: DesignStyle, layout?: DesignLayout): Promise<QaVerdict> {
  const started = Date.now();
  const base = { model: QA_MODEL, costUsd: 0 };
  const key = process.env.XAI_API_KEY;
  try {
    if (!key) throw new Error("XAI_API_KEY missing");
    const response = await fetch(`${XAI}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: QA_MODEL,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "IMAGE A (homeowner's original photo):" },
              { type: "image_url", image_url: { url: dataUri(before), detail: "high" } },
              { type: "text", text: "IMAGE B (redesign to inspect):" },
              { type: "image_url", image_url: { url: dataUri(after), detail: "high" } },
              { type: "text", text: qaPrompt(inventoryText(scan), style, layout) },
            ],
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0,
      }),
      signal: AbortSignal.timeout(60_000),
    });
    const json = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    const usage = json.usage as { cost_in_usd_ticks?: number } | undefined;
    base.costUsd = Number(usage?.cost_in_usd_ticks ?? 0) / USD_TICKS || 0;
    if (!response.ok) throw new Error(`qa http ${response.status}`);
    const choices = json.choices as Array<{ message?: { content?: string } }> | undefined;
    const raw = choices?.[0]?.message?.content ?? "";
    const match = raw.match(/\{[\s\S]*\}/);
    const parsed = (match ? JSON.parse(match[0]) : {}) as Record<string, unknown>;
    // A check passes only when the model explicitly says true. Missing or malformed = fail.
    const failed = (Object.keys(QA_CHECKS) as QaCheck[]).filter((check) => parsed[check] !== true);
    const reasons = Array.isArray(parsed.reasons)
      ? parsed.reasons.filter((item): item is string => typeof item === "string").map((item) => item.slice(0, 200)).slice(0, 12)
      : [];
    if (failed.length && !reasons.length) reasons.push(...failed.map((check) => QA_CHECKS[check]));
    // Any difference the inspector itself marks as not allowed is a fail too, even if every box was ticked.
    const disallowed = Array.isArray(parsed.differences)
      ? parsed.differences
          .filter((item): item is { what?: unknown; allowed?: unknown } => Boolean(item) && typeof item === "object")
          .filter((item) => item.allowed === false)
          .map((item) => (typeof item.what === "string" ? item.what.slice(0, 200) : "a change that isn't allowed"))
      : [];
    for (const item of disallowed.slice(0, 6)) if (!reasons.includes(item)) reasons.push(item);
    const softened = softenQaVerdict({ failed, reasons, disallowed, layout });
    const pass = softened.failed.length === 0 && softened.disallowed.length === 0;
    if (!pass && !softened.failed.length) softened.failed.push("fixtures_kept");
    return { ...base, pass, failed: softened.failed, reasons: softened.reasons, latencyMs: Date.now() - started };
  } catch (error) {
    const message = error instanceof Error ? `${error.name}: ${error.message}`.slice(0, 160) : "unknown";
    return { ...base, pass: false, failed: [], reasons: ["QA check could not run"], latencyMs: Date.now() - started, error: message };
  }
}
