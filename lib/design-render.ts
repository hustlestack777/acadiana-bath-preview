import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import type { DesignStyle } from "./design-styles";
import type { DesignLayout } from "./design-picks";
import { isUsableRedesign, qaCheck, rankUsableAttempts, type QaCheck, type QaVerdict } from "./design-qa";

/**
 * Two-step render (same pattern as GetMowed /api/landscape-design):
 * 1. a vision model describes the room (layout, camera, clutter),
 * 2. grok-imagine-image edits the photo, with the style card as a material reference.
 */
const XAI = "https://api.x.ai/v1";
export const VISION_MODEL = process.env.DESIGN_VISION_MODEL || "grok-4.20-0309-non-reasoning";
export const IMAGE_MODEL = process.env.DESIGN_IMAGE_MODEL || "grok-imagine-image-2.0";
const IMAGE_QUALITY = process.env.DESIGN_IMAGE_QUALITY || "medium";
const USD_TICKS = 10_000_000_000;
/** Long edge sent to the vision and image models. Smaller than the stored photo, faster to edit. */
export const MODEL_EDGE = 1024;

export class RenderError extends Error {
  constructor(
    message: string,
    public userMessage: string,
    public retryable: boolean,
    public costUsd = 0,
  ) {
    super(message);
  }
}

export type RoomScan = {
  is_bathroom: boolean;
  has_person: boolean;
  camera: string;
  layout: string;
  lighting: string;
  clutter: string[];
  /** One line per fixture or opening (count, place in frame, mounting). Locks them in the edit and the QA. */
  fixtures: string[];
  sinkCount: number;
};

export type RenderResult = {
  /** The first render that passed QA, or null when every attempt failed QA. */
  after: Buffer | null;
  attempts: RenderAttempt[];
  scan: RoomScan;
  costUsd: number;
  latencyMs: number;
  model: string;
};

function dataUri(bytes: Buffer, type: string) {
  return `data:${type};base64,${bytes.toString("base64")}`;
}

function ticksToUsd(ticks: unknown) {
  const value = Number(ticks);
  return Number.isFinite(value) ? value / USD_TICKS : 0;
}

async function xai(pathname: string, body: unknown, timeoutMs: number) {
  const key = process.env.XAI_API_KEY;
  if (!key) throw new RenderError("XAI_API_KEY missing", "The designer is offline right now.", false);
  const response = await fetch(`${XAI}${pathname}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  }).catch((error: unknown) => {
    throw new RenderError(
      `xai fetch failed: ${error instanceof Error ? error.name : "unknown"}`,
      "The designer took too long. Let's try again.",
      true,
    );
  });
  const json = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) {
    const status = response.status;
    throw new RenderError(
      `xai ${pathname} ${status}`,
      status === 400 ? "That photo didn't work. Try another one." : "The designer hit a snag. Let's try again.",
      status === 429 || status >= 500,
    );
  }
  return json;
}

const SCAN_PROMPT = `You are prepping a homeowner's bathroom photo for a photo-realistic remodel render that must keep every fixture exactly where it is. Return ONLY JSON with these keys:
{"is_bathroom": boolean (true only if this is a bathroom, shower or tub),
 "has_person": boolean (true if any person or face is visible, including in a mirror),
 "camera": "camera position, height, angle and framing in one sentence",
 "layout": "which walls are visible, the tub or shower footprint and where it sits in the frame, window and door or doorway positions, the ceiling line",
 "fixtures": ["one line per fixture or opening, with its count, where it is in the frame and how it is mounted, e.g. 'one white pedestal sink at the left wall, lower-left of frame, with one faucet centered on its back rim', 'one shower head on the back wall at head height, valve handle below it at waist height', 'one window above the tub, upper-center'. Cover every sink, faucet, toilet, tub, shower head, shower valve or handle, tub spout, vanity, mirror or medicine cabinet, light fixture, window, door or doorway, towel bar, grab bar and shower door or curtain that is visible. Write 'no sink visible' if there is no sink."],
 "sink_count": integer,
 "lighting": "light sources and direction",
 "clutter": ["every loose item that must be removed: bottles, razors, towels, loofahs, toys, mats, laundry, anything on ledges, shelves or the floor"]}`;

export async function scanRoom(photo: Buffer): Promise<{ scan: RoomScan; costUsd: number }> {
  const json = await xai(
    "/chat/completions",
    {
      model: VISION_MODEL,
      messages: [
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: dataUri(photo, "image/jpeg") } },
            { type: "text", text: SCAN_PROMPT },
          ],
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    },
    45_000,
  );
  const choices = json.choices as Array<{ message?: { content?: string } }> | undefined;
  const usage = json.usage as { cost_in_usd_ticks?: number } | undefined;
  const costUsd = ticksToUsd(usage?.cost_in_usd_ticks);
  let parsed: Partial<RoomScan> = {};
  let raw: Record<string, unknown> = {};
  try {
    const content = choices?.[0]?.message?.content ?? "";
    const match = content.match(/\{[\s\S]*\}/);
    raw = match ? JSON.parse(match[0]) : {};
    parsed = raw as Partial<RoomScan>;
  } catch {
    throw new RenderError("scan parse failed", "We couldn't read that photo. Let's try again.", true, costUsd);
  }
  const text = (value: unknown, max = 900) => (typeof value === "string" ? value.slice(0, max) : "");
  return {
    costUsd,
    scan: {
      is_bathroom: parsed.is_bathroom !== false,
      has_person: parsed.has_person === true,
      camera: text(parsed.camera, 300),
      layout: text(parsed.layout),
      lighting: text(parsed.lighting, 300),
      clutter: Array.isArray(parsed.clutter)
        ? parsed.clutter.filter((item): item is string => typeof item === "string").slice(0, 30).map((item) => item.slice(0, 60))
        : [],
      fixtures: Array.isArray(raw.fixtures)
        ? raw.fixtures.filter((item): item is string => typeof item === "string").slice(0, 24).map((item) => item.slice(0, 200))
        : [],
      sinkCount: Number.isFinite(Number(raw.sink_count)) ? Math.max(0, Math.min(4, Math.round(Number(raw.sink_count)))) : 0,
    },
  };
}

/**
 * Edit prompt, written per xAI's Imagine prompting guide: lead with the change, then lock the
 * fixtures one for one (from the scan) and the room geometry. The image service has no mask or
 * inpaint mode, so the fixture inventory plus the QA pass below is what keeps the layout.
 */
export function buildEditPrompt(style: DesignStyle, scan: RoomScan, layout?: DesignLayout) {
  const inventory = scan.fixtures.length
    ? scan.fixtures.map((line) => `- ${line}`).join("\n")
    : `- every fixture, window and door exactly as in <IMAGE_0>${scan.layout ? ` (${scan.layout})` : ""}`;
  const clutter = scan.clutter.length ? `${scan.clutter.join(", ")}, plus any` : "any";
  const conversion = layout
    ? `Apply this exact conversion: ${layout.name}. ${layout.prompt}`
    : "Keep the existing tub or shower footprint. Only surface materials and fixture finishes change.";
  const keep = layout
    ? "Keep every fixture and opening that is not part of that conversion where it is, one for one, at the same size and in the same spot in the frame. The toilet, vanity, sinks, windows, doors, lights, TV and mirrors stay put."
    : "Every fixture and opening stays where it is, one for one, at the same size and in the same spot in the frame.";
  const footprint = layout
    ? "the wet area stays in the same place in the room, following the conversion above"
    : "same tub or shower footprint";
  return `<IMAGE_0> is a homeowner's bathroom photo. Show this same bathroom remodeled with the conversion and finishes they picked: ${style.spec} ${conversion} Match the colors, texture and finish of <IMAGE_1>, which is a material sample only; take nothing else from it. Use clear shower glass in place of any old curtain or framed door. Update the vanity top only if a vanity is visible, and update the finish of the faucets, handles and lights.
${keep}
Fixtures found in the photo:
${inventory}
The plumbing reads correctly: each faucet sits centered over its own sink basin with the spout pointing into the bowl. The shower valve and its handle sit on the wet wall at waist height, under the shower head, which sits on the same wall at head height. Handles and knobs are level, symmetrical and attached to the fixture they control. Nothing floats, appears twice or goes missing. Do not add a grab bar, shelf, caddy, soap dish, towel bar, extra niche, extra valve, extra spout or extra shower head unless the conversion above calls for it, and do not add a new window, door or wall.
Remove the clutter: ${clutter} bottles, soap, razors, towels, loofahs, mats and loose items, so every ledge, shelf, tub edge and floor is clean and empty.
Same camera position, lens, angle and crop as <IMAGE_0> (${scan.camera || "as shown"}), same walls and ceiling line, same window and door openings at the same positions and sizes, ${footprint}, same light direction (${scan.lighting || "as shown"}). A bright, sharp, realistic real-estate photograph with no people and no text, letters, logos or watermark.`;
}

async function styleReference(style: DesignStyle) {
  const file = path.join(process.cwd(), "design-refs", `${style.key}.jpg`);
  return readFile(file);
}

export async function editRoom(photo: Buffer, style: DesignStyle, scan: RoomScan, layout?: DesignLayout) {
  const reference = await styleReference(style);
  const json = await xai(
    "/images/edits",
    {
      model: IMAGE_MODEL,
      prompt: buildEditPrompt(style, scan, layout),
      images: [
        { type: "image_url", url: dataUri(photo, "image/jpeg") },
        { type: "image_url", url: dataUri(reference, "image/jpeg") },
      ],
      response_format: "b64_json",
      ...(IMAGE_MODEL.includes("2.0") ? { quality: IMAGE_QUALITY } : {}),
    },
    120_000,
  );
  const data = json.data as Array<{ b64_json?: string }> | undefined;
  const usage = json.usage as { cost_in_usd_ticks?: number } | undefined;
  const b64 = data?.[0]?.b64_json;
  const costUsd = ticksToUsd(usage?.cost_in_usd_ticks);
  if (!b64) throw new RenderError("edit returned no image", "The designer hit a snag. Let's try again.", true, costUsd);
  return { bytes: Buffer.from(b64, "base64"), costUsd };
}

export type RenderAttempt = {
  attempt: number;
  /** null when the edit call itself failed (counted as a failed attempt). */
  after: Buffer | null;
  verdict: QaVerdict | null;
  editMs: number;
  costUsd: number;
  error?: string;
};

/** At most one extra try, and only when the first image is unusable. */
export const QA_RETRIES = Math.max(0, Math.min(3, Number(process.env.DESIGN_QA_RETRIES ?? 1)));
/** Stop starting a retry after this long so the visitor is never left waiting forever. */
const RENDER_BUDGET_MS = Number(process.env.DESIGN_RENDER_BUDGET_MS || 100_000);

const DRAFT_SCAN: RoomScan = {
  is_bathroom: true,
  has_person: false,
  camera: "as shown in the photo",
  layout: "",
  lighting: "as shown",
  clutter: [],
  fixtures: [],
  sinkCount: 0,
};

export type RenderStage = "preparing" | "editing" | "checking" | "retrying";

async function showable(bytes: Buffer | null, failed?: QaCheck[]) {
  if (!bytes || !isUsableRedesign(failed ?? [], true)) return false;
  try {
    const meta = await sharp(bytes).metadata();
    return Boolean(meta.width && meta.height && Math.min(meta.width, meta.height) >= 400);
  } catch {
    return false;
  }
}

/**
 * Downscale for the models, start the room scan and the first edit together, QA that
 * first image, and return as soon as we have a passing or usable preview (target: under
 * ~45 seconds). A second attempt runs only if the first image is clearly unusable.
 */
export async function renderDesign(
  photo: Buffer,
  style: DesignStyle,
  onProgress?: (stage: RenderStage) => void,
  layout?: DesignLayout,
): Promise<RenderResult> {
  const started = Date.now();
  onProgress?.("preparing");
  const source = await modelPhoto(photo);

  onProgress?.("editing");
  const scanPromise = scanRoom(source).then(
    (value) => ({ ok: true as const, value }),
    (error) => ({ ok: false as const, error }),
  );
  const firstEditPromise = (async () => {
    const editStarted = Date.now();
    try {
      const edit = await editRoom(source, style, DRAFT_SCAN, layout);
      const after = await sharp(edit.bytes).rotate().jpeg({ quality: 88 }).toBuffer();
      return { editStarted, after, costUsd: edit.costUsd, error: undefined as string | undefined };
    } catch (error) {
      const known = error instanceof RenderError ? error : null;
      return {
        editStarted,
        after: null as Buffer | null,
        costUsd: known?.costUsd ?? 0,
        error: known?.message ?? "edit failed",
        fatal: known && !known.retryable ? known : undefined,
      };
    }
  })();

  const scanned = await scanPromise;
  let scan = DRAFT_SCAN;
  let costUsd = 0;
  if (scanned.ok) {
    scan = scanned.value.scan;
    costUsd += scanned.value.costUsd;
    if (!scan.is_bathroom) {
      await firstEditPromise;
      throw new RenderError("not a bathroom", "That doesn't look like a bathroom. Try a photo of your shower or tub.", false, costUsd);
    }
    if (scan.has_person) {
      await firstEditPromise;
      throw new RenderError("person in photo", "We see a person in that photo. Try one with just the bathroom.", false, costUsd);
    }
  }

  const first = await firstEditPromise;
  if (first.fatal) {
    first.fatal.costUsd = costUsd + first.costUsd;
    throw first.fatal;
  }

  const attempts: RenderAttempt[] = [];
  let passed: Buffer | null = null;

  const finishAttempt = async (attempt: number, editMs: number, after: Buffer | null, editCost: number, error?: string) => {
    if (!after) {
      attempts.push({ attempt, after: null, verdict: null, editMs, costUsd: editCost, error: error ?? "edit failed" });
      costUsd += editCost;
      return;
    }
    onProgress?.("checking");
    const verdict = await qaCheck(source, after, scan, style, layout);
    costUsd += editCost + verdict.costUsd;
    attempts.push({ attempt, after, verdict, editMs, costUsd: editCost + verdict.costUsd });
    if (verdict.pass || (await showable(after, verdict.failed))) passed = after;
  };

  await finishAttempt(1, Date.now() - first.editStarted, first.after, first.costUsd, first.error);

  for (let attempt = 2; !passed && attempt <= 1 + QA_RETRIES; attempt += 1) {
    if (Date.now() - started > RENDER_BUDGET_MS) break;
    onProgress?.("retrying");
    const editStarted = Date.now();
    try {
      const edit = await editRoom(source, style, scan, layout);
      const after = await sharp(edit.bytes).rotate().jpeg({ quality: 88 }).toBuffer();
      await finishAttempt(attempt, Date.now() - editStarted, after, edit.costUsd);
    } catch (error) {
      const known = error instanceof RenderError ? error : null;
      if (known && !known.retryable) {
        known.costUsd = costUsd + (known.costUsd ?? 0);
        throw known;
      }
      await finishAttempt(attempt, Date.now() - editStarted, null, known?.costUsd ?? 0, known?.message ?? "edit failed");
    }
  }

  if (!attempts.some((item) => item.after) && attempts.length) {
    throw new RenderError("all edits failed", "The designer hit a snag. Let's try again.", true, costUsd);
  }
  if (!passed) {
    for (const candidate of rankUsableAttempts(attempts)) {
      if (await showable(candidate.after, candidate.verdict?.failed)) {
        passed = candidate.after;
        break;
      }
    }
  }
  return {
    after: passed,
    attempts,
    scan,
    costUsd,
    latencyMs: Date.now() - started,
    model: IMAGE_MODEL,
  };
}

/** Downscale a photo to the long edge used by the models. */
export async function modelPhoto(bytes: Buffer) {
  return sharp(bytes, { failOn: "error" })
    .rotate()
    .resize(MODEL_EDGE, MODEL_EDGE, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
}

/** Clean, stripped copy of the upload (EXIF/GPS removed, max 1600 px). */
export async function normalizePhoto(bytes: Buffer) {
  const image = sharp(bytes, { failOn: "error" }).rotate();
  const meta = await image.metadata();
  if (!meta.width || !meta.height) throw new RenderError("no dims", "We couldn't open that photo. Try a JPEG or PNG.", false);
  if (Math.max(meta.width, meta.height) < 600) {
    throw new RenderError("too small", "That photo is too small. Try a bigger one.", false);
  }
  return image.resize(1600, 1600, { fit: "inside", withoutEnlargement: true }).jpeg({ quality: 85 }).toBuffer();
}

const asset = (name: string) => readFile(path.join(process.cwd(), "design-refs", name));

/** Small, blurred, watermarked teaser. The full render never leaves the server before unlock. */
export async function teaser(after: Buffer) {
  const small = await sharp(after).resize(512, 512, { fit: "inside" }).blur(8).toBuffer();
  const meta = await sharp(small).metadata();
  const mark = await sharp(await asset("watermark.png"))
    .resize(meta.width ?? 512, meta.height ?? 384, { fit: "cover" })
    .png()
    .toBuffer();
  return sharp(small).composite([{ input: mark, top: 0, left: 0 }]).jpeg({ quality: 70 }).toBuffer();
}
