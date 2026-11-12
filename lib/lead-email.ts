import {
  choiceLabel,
  formatChicago,
  formatEmailSize,
  formatPhone,
  fullAddress,
  homeownerLabel,
  leadSubject,
  localityLine,
  paymentLabel,
  phoneTel,
  projectLabels,
  timingLabel,
} from "./lead-display";
import { mapsDirectionsUrl, mapsSearchUrl, openInMapsUrl } from "./street-view";
import { campaignLine, leadSourceLabel, sourceLine } from "./lead-attribution";
import { buildCallInvite, callbackWindow, callWindowLabel } from "./call-window";
import { finishes } from "./copy";
import { FLOOD_ZONE_LABEL, type HouseFacts } from "./house-facts";
import { esc, escLines, type Row } from "./email-layout";

export type LeadEmailPhoto = {
  filename: string;
  contentType: string;
  bytes: Buffer;
};

export type LeadEmailContent = {
  kind: "new" | "update";
  id: string;
  createdAt: Date;
  now?: Date;
  name: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  zip: string;
  latitude: number | null;
  longitude: number | null;
  project: string;
  width: string;
  depth: string;
  height: string;
  measurements: string;
  features: string;
  budget: string;
  homeowner: string;
  payment: string;
  timing: string;
  preferredCallDay?: string;
  preferredCallTime: string;
  finish?: string;
  photos: LeadEmailPhoto[];
  /** Full-size links for each photo, same order as `photos`. Empty strings are skipped. */
  photoLinks?: string[];
  newPhotoCount?: number;
  houseImage?: { bytes: Buffer; contentType: string } | null;
  /** Parish, FEMA flood zone, and later property records. Skipped when null. */
  houseFacts?: HouseFacts | null;
  consent?: boolean;
  consentAt?: Date | string | null;
  consentText?: string;
  test?: boolean;
  sourcePage?: string;
  formPage?: string;
  referrer?: string;
  src?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

export type LeadEmailAttachment = {
  filename: string;
  content: string;
  contentType: string;
  contentId?: string;
};

const TEST_LINE = "TEST LEAD — sent to Shaun only, not to Justin.";

function safeFilename(filename: string, index: number) {
  const cleaned = filename.replace(/[/\\]/g, "").replace(/[^\w.\- ]+/g, "").trim() || "photo.jpg";
  return `${String(index + 1).padStart(2, "0")}-${cleaned}`;
}

/** Caption for a photo, from the filenames the design and estimate flows use. */
export function photoCaption(filename: string, index: number, style = "") {
  const name = filename.toLowerCase();
  if (name.includes("after-design-preview")) return style ? `Design preview · ${style}` : "Design preview";
  if (name.includes("before-their-photo")) return "Their bathroom (before)";
  if (name.includes("their-second-photo")) return "Their second photo";
  return `Photo ${index + 1}`;
}

type Parsed = { rows: Row[]; style: string; customDesign: string; notes: string[] };

/** Turn the stored features text ("Label: value" lines) into clean rows. */
export function parseFeatures(features: string, consent: boolean): Parsed {
  const rows: Row[] = [];
  const notes: string[] = [];
  let style = "";
  let customDesign = "";
  const pieces = features
    .split("\n")
    .flatMap((line) => line.split(" \u00b7 "))
    .map((piece) => piece.trim());
  for (const line of pieces) {
    if (!line) continue;
    if (/^photo 1 is their bathroom/i.test(line)) continue;
    if (/^qa_failed/i.test(line)) {
      customDesign = line.replace(/^qa_failed:\s*/i, "");
      continue;
    }
    if (/^sms consent:/i.test(line) && consent) continue;
    const match = /^([A-Za-z][A-Za-z /()-]{1,40}):\s+(.+)$/.exec(line);
    if (!match) {
      notes.push(line);
      continue;
    }
    const label = match[1].trim();
    const rawValue = match[2].trim();
    const value = /^[a-z]/.test(rawValue) ? rawValue[0].toUpperCase() + rawValue.slice(1) : rawValue;
    if (/^style picked$/i.test(label)) {
      style = value;
    }
    rows.push({ label, value });
  }
  return { rows, style, customDesign, notes };
}

export function buildLeadEmail(input: LeadEmailContent) {
  const name = input.name.trim();
  const town = input.city.trim();
  const when = formatChicago(input.createdAt);
  const now = input.now ?? input.createdAt;
  const callback = callbackWindow(input.preferredCallDay || "", input.preferredCallTime.trim(), now);
  const subject = leadSubject(name, town, input.kind, callback?.compact);
  const phone = formatPhone(input.phone);
  const tel = phoneTel(input.phone);
  const email = input.email.trim();
  const test = Boolean(input.test);
  const street = input.street.trim();
  const locality = localityLine(town, input.zip);
  const address = fullAddress(street, town, input.zip);
  const mapsUrl = street ? mapsSearchUrl(address) : "";
  const streetViewUrl = street ? openInMapsUrl(address, input.latitude, input.longitude) : "";
  const directionsUrl = street ? mapsDirectionsUrl(address) : "";
  const kicker = input.kind === "update" ? "Lead update" : "New lead";
  const isWindows = input.project.split(",").map((item) => item.trim()).includes("windows");

  const parsed = parseFeatures(input.features, Boolean(input.consent));
  const project = projectLabels(input.project);
  const size = formatEmailSize(input.width, input.depth, input.height);
  const finishId = (input.finish || "").trim();
  const finish = !isWindows && finishId && finishId !== "unsure" ? choiceLabel(finishId, finishes) : "";
  const budgetLines = parseFeatures(input.budget, true);

  const details: Row[] = [
    { label: "Project", value: project },
    { label: "Size", value: size },
    { label: "Measurements", value: input.measurements.trim() },
    { label: "Finish", value: finish },
    ...parsed.rows.filter((row) => !/^style picked$/i.test(row.label)),
    ...budgetLines.rows,
    ...budgetLines.notes.map((value) => ({ label: "Budget", value })),
    { label: "Home", value: homeownerLabel(input.homeowner) },
    { label: "Timing", value: timingLabel(input.timing) },
    { label: "Payment", value: paymentLabel(input.payment) },
    { label: "Call window", value: callWindowLabel(input.preferredCallDay || "", input.preferredCallTime.trim()) || input.preferredCallTime.trim() },
    ...(parsed.notes.length ? [{ label: "Their notes", value: parsed.notes.join("\n") }] : []),
  ].filter((row) => (row.value ?? "").trim());

  const consentAt = input.consent && input.consentAt ? formatChicago(new Date(input.consentAt)) : "";
  const consentRecord = (input.consentText || "").trim();

  const source = sourceLine(input.sourcePage || "", input.formPage || "");
  const leadSource = leadSourceLabel(input.src || "", input.utmSource || "");
  const campaign = campaignLine(input.utmSource || "", input.utmMedium || "", input.utmCampaign || "");
  const referrer = (input.referrer || "").trim();

  const attachments: LeadEmailAttachment[] = [];
  if (input.houseImage?.bytes.length) {
    attachments.push({
      filename: "street-view.jpg",
      content: input.houseImage.bytes.toString("base64"),
      contentType: input.houseImage.contentType || "image/jpeg",
    });
  }
  input.photos.forEach((photo, index) => {
    const filename = safeFilename(photo.filename, index);
    const content = photo.bytes.toString("base64");
    attachments.push({ filename, content, contentType: photo.contentType });
  });

  const invite = buildCallInvite({
    test,
    name: input.name,
    phone: input.phone,
    email: input.email,
    day: input.preferredCallDay || "",
    time: input.preferredCallTime,
    now,
  });
  if (invite) {
    attachments.push({
      filename: invite.filename,
      content: Buffer.from(invite.content).toString("base64"),
      contentType: invite.contentType,
    });
  }

  const captions = input.photos.map((photo, index) => photoCaption(photo.filename, index, parsed.style));
  const links = input.photos.map((_, index) => input.photoLinks?.[index] ?? "");

  // ---------- plain text ----------
  const text = (() => {
    const lines: string[] = [];
    if (test) lines.push(TEST_LINE, "");
    lines.push(`${kicker.toUpperCase()} · ${when}`, name || "New lead");
    if (callback) lines.push(`Justin will call ${callback.phrase}.`);
    if (input.kind === "update") lines.push(updateSentence(input.newPhotoCount ?? 0));
    lines.push("");
    if (phone) lines.push(`Phone: ${phone}`);
    if (email) lines.push(`Email: ${email}`);
    if (street) lines.push(`Address: ${address}`);
    else if (locality) lines.push(`Town: ${locality}`);
    lines.push("");
    lines.push(parsed.style ? `PHOTOS & DESIGN (style: ${parsed.style})` : "PHOTOS");
    if (parsed.customDesign) lines.push(`Custom design needed: ${parsed.customDesign}`);
    if (input.photos.length) {
      input.photos.forEach((_, index) => {
        lines.push(`- ${captions[index]}${links[index] ? `: ${links[index]}` : ""}`);
      });
      lines.push("(Also attached to this email as files.)");
    } else {
      lines.push("No photos uploaded.");
    }
    lines.push("", "PROJECT DETAILS");
    for (const row of details) lines.push(`${row.label}: ${(row.value ?? "").replace(/\n/g, "; ")}`);
    lines.push("", "CONSENT");
    if (input.consent) {
      lines.push(`Yes${consentAt ? `, ${consentAt}` : ""}`);
      if (consentRecord) lines.push(consentRecord);
    } else {
      lines.push("No text consent. Call or email only.");
    }
    if (street) {
      lines.push("", "THE HOUSE (FOR YOUR VISIT)", address);
      if (streetViewUrl) lines.push(`Street View: ${streetViewUrl}`);
      if (directionsUrl) lines.push(`Directions from your location: ${directionsUrl}`);
      if (mapsUrl) lines.push(`Open in Google Maps: ${mapsUrl}`);
      const about = houseFactRows(input.houseFacts);
      if (about.length) {
        lines.push("About the house:");
        for (const row of about) lines.push(`${row.label}: ${row.value}`);
      }
    }
    lines.push("", "---");
    lines.push(`Source: ${leadSource}`);
    if (source) lines.push(`Page: ${source}`);
    if (referrer) lines.push(`Referrer: ${referrer}`);
    if (campaign) lines.push(`Campaign (UTM): ${campaign}`);
    lines.push(`Internal lead email only — not sent to the homeowner. Lead ${input.id.slice(0, 8)}.`);
    return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
  })();

  // ---------- HTML (plain transactional, so Gmail is less likely to file it under Promotions) ----------
  const phoneHtml = phone
    ? tel
      ? `Phone: <a href="${esc(tel)}">${esc(phone)}</a>`
      : `Phone: ${esc(phone)}`
    : "";
  const emailHtml = email ? `Email: <a href="${esc(`mailto:${email}`)}">${esc(email)}</a>` : "";
  const addressHtml = street || locality
    ? `Address: ${esc(street)}${street && locality ? ", " : ""}${esc(locality)}`
    : "";

  const photoLines = input.photos.length
    ? input.photos
        .map((_, index) => {
          const open = links[index] ? ` — <a href="${esc(links[index])}">open full size</a>` : "";
          return `${esc(captions[index])}${open}`;
        })
        .join("<br />") + "<br />(Also attached to this email as files.)"
    : "No photos uploaded.";

  const detailLines = details
    .map((row) => `${esc(row.label)}: ${escLines(row.value ?? "")}`)
    .join("<br />");

  const consentBlock = input.consent
    ? `<strong>Yes${consentAt ? `, ${esc(consentAt)}` : ""}</strong>${
        consentRecord ? `<br />${escLines(consentRecord)}` : ""
      }`
    : "No text consent. Call or email only.";

  const about = houseFactRows(input.houseFacts);
  const houseBlock = street
    ? `<p style="margin:0 0 16px;">
        <strong>The house (for your visit)</strong><br />
        ${esc(address)}
        ${streetViewUrl ? `<br />Street View: <a href="${esc(streetViewUrl)}">${esc(streetViewUrl)}</a>` : ""}
        ${directionsUrl ? `<br />Directions: <a href="${esc(directionsUrl)}">${esc(directionsUrl)}</a>` : ""}
        ${mapsUrl ? `<br />Google Maps: <a href="${esc(mapsUrl)}">${esc(mapsUrl)}</a>` : ""}
        ${
          about.length
            ? `<br /><br />About the house<br />${about.map((row) => `${esc(row.label)}: ${esc(row.value ?? "")}`).join("<br />")}`
            : ""
        }
        ${input.houseImage?.bytes.length ? "<br />Street view photo attached." : ""}
      </p>`
    : "";

  const footerBits = [
    `Source: ${esc(leadSource)}`,
    source ? `Page: ${esc(source)}` : "",
    referrer ? `Referrer: ${esc(referrer)}` : "",
    campaign ? `Campaign (UTM): ${esc(campaign)}` : "",
    `Internal lead email only — not sent to the homeowner. Lead ${esc(input.id.slice(0, 8))}.`,
  ].filter(Boolean);

  const bodyParts = [
    test ? `<p style="margin:0 0 16px;color:#9f2d2d;"><strong>${esc(TEST_LINE)}</strong></p>` : "",
    `<p style="margin:0 0 16px;">${esc(kicker)} · ${esc(when)}</p>`,
    `<p style="margin:0 0 16px;"><strong>${esc(name || "New lead")}</strong>${phoneHtml ? `<br />${phoneHtml}` : ""}${emailHtml ? `<br />${emailHtml}` : ""}${addressHtml ? `<br />${addressHtml}` : ""}</p>`,
    callback
      ? `<p style="margin:0 0 16px;">Justin will call ${esc(callback.phrase)}.</p>`
      : "",
    input.kind === "update" ? `<p style="margin:0 0 16px;">${esc(updateSentence(input.newPhotoCount ?? 0))}</p>` : "",
    parsed.style
      ? `<p style="margin:0 0 16px;">Style they picked: <strong>${esc(parsed.style)}</strong></p>`
      : "",
    parsed.customDesign
      ? `<p style="margin:0 0 16px;"><strong>Custom design needed.</strong> ${esc(parsed.customDesign.replace(/^CUSTOM DESIGN NEEDED\s*\.\s*/i, ""))}</p>`
      : "",
    `<p style="margin:0 0 16px;"><strong>${parsed.style || captions.some((caption) => caption.startsWith("Design preview")) ? "Photos &amp; design" : "Their photos"}</strong><br />${photoLines}</p>`,
    details.length ? `<p style="margin:0 0 16px;"><strong>Project details</strong><br />${detailLines}</p>` : "",
    `<p style="margin:0 0 16px;"><strong>Consent</strong><br />${consentBlock}</p>`,
    houseBlock,
    `<p style="margin:24px 0 0;padding-top:12px;border-top:1px solid #cccccc;font-size:13px;color:#555555;">${footerBits.join("<br />")}</p>`,
  ].filter(Boolean);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:16px;background:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#111111;">
${bodyParts.join("\n")}
</body>
</html>`;

  return { subject, text, html, attachments };
}

/** Rows for the small "About the house" block. Add property-record rows via house-facts providers. */
export function houseFactRows(facts: HouseFacts | null | undefined): Row[] {
  if (!facts) return [];
  return [
    { label: "Parish", value: facts.parish },
    { label: FLOOD_ZONE_LABEL, value: facts.floodZone },
    ...facts.records.map((row) => ({ label: row.label, value: row.value })),
  ].filter((row) => row.value.trim());
}

function updateSentence(newPhotoCount: number) {
  if (newPhotoCount > 0) {
    return newPhotoCount === 1 ? "Added 1 photo to this quote." : `Added ${newPhotoCount} photos to this quote.`;
  }
  return "Updated details for this quote.";
}

