import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import type { DesignStyle } from "./design-styles";

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
};

export type RenderResult = {
  after: Buffer;
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

const SCAN_PROMPT = `You are prepping a homeowner's bathroom photo for a photo-realistic remodel render. Return ONLY JSON with these keys:
{"is_bathroom": boolean (true only if this is a bathroom, shower or tub),
 "has_person": boolean (true if any person or face is visible),
 "camera": "camera position, height and angle, and the framing",
 "layout": "very specific: which walls are visible, the shower or tub footprint and where it sits in the frame, tub vs shower stall, window position and size, door or doorway positions, toilet or vanity positions if visible, the valve and showerhead wall, the ceiling line",
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
  try {
    const raw = choices?.[0]?.message?.content ?? "";
    const match = raw.match(/\{[\s\S]*\}/);
    parsed = match ? JSON.parse(match[0]) : {};
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
    },
  };
}

export function buildEditPrompt(style: DesignStyle, scan: RoomScan) {
  const clutter = scan.clutter.length ? `${scan.clutter.join(", ")}, ` : "";
  return `Photo-realistic remodel of THIS exact bathroom (image 1). Keep the exact camera position, camera angle and framing, the room dimensions, wall positions, ceiling line, window and door positions and sizes, and the lighting direction identical to image 1.
Layout to preserve: ${scan.layout || "as shown in image 1"}. Camera: ${scan.camera || "as shown in image 1"}. Lighting: ${scan.lighting || "as shown in image 1"}.
Keep the same shower or tub footprint and size. Replace ONLY the shower or tub surround walls, the shower floor or tub, the shower door, glass or curtain, and the plumbing fixtures with: ${style.spec}. Replace any old framed door or curtain with the new glass.
Use image 2 only as a reference for materials, colors and finish. Do NOT copy its room layout, size or camera angle.
Remove ALL clutter completely: ${clutter}every shampoo, conditioner and soap bottle, bar soap, razor, towel, washcloth, loofah, sponge, toiletry, toy, bath mat, shoe, laundry basket or hamper, trash can, and anything on ledges, shelves, the tub edge or the floor. Every surface must be clean and empty, like a professionally staged finished-remodel photo, bright and tidy.
Do not add rooms, windows, doors or fixtures that are not in image 1. No people, no text, no logos, no watermark.`;
}

async function styleReference(style: DesignStyle) {
  const file = path.join(process.cwd(), "design-refs", `${style.key}.jpg`);
  return readFile(file);
}

export async function editRoom(photo: Buffer, style: DesignStyle, scan: RoomScan) {
  const reference = await styleReference(style);
  const json = await xai(
    "/images/edits",
    {
      model: IMAGE_MODEL,
      prompt: buildEditPrompt(style, scan),
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

export async function renderDesign(photo: Buffer, style: DesignStyle): Promise<RenderResult> {
  const started = Date.now();
  const { scan, costUsd: scanCost } = await scanRoom(photo);
  if (!scan.is_bathroom) {
    throw new RenderError("not a bathroom", "That doesn't look like a bathroom. Try a photo of your shower or tub.", false, scanCost);
  }
  if (scan.has_person) {
    throw new RenderError("person in photo", "We see a person in that photo. Try one with just the bathroom.", false, scanCost);
  }
  let edit;
  try {
    edit = await editRoom(photo, style, scan);
  } catch (error) {
    if (error instanceof RenderError) error.costUsd += scanCost;
    throw error;
  }
  const after = await sharp(edit.bytes).rotate().jpeg({ quality: 88 }).toBuffer();
  return {
    after,
    scan,
    costUsd: scanCost + edit.costUsd,
    latencyMs: Date.now() - started,
    model: IMAGE_MODEL,
  };
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
