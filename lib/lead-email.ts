import {
  choiceLabel,
  firstName,
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
import { buildCallInvite, callWindowLabel } from "./call-window";
import { finishes } from "./copy";
import { FLOOD_ZONE_LABEL, type HouseFacts } from "./house-facts";
import {
  EMAIL,
  esc,
  escLines,
  eyebrow,
  rowsTable,
  sectionTitle,
  shell,
  testBanner,
  type Row,
} from "./email-layout";

export type LeadEmailPhoto = {
  filename: string;
  contentType: string;
  bytes: Buffer;
};

export type LeadEmailContent = {
  kind: "new" | "update";
  id: string;
  createdAt: Date;
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

function photoCid(index: number) {
  return `photo-${index + 1}`;
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
  const subject = leadSubject(name, town, input.kind);
  const phone = formatPhone(input.phone);
  const tel = phoneTel(input.phone);
  const email = input.email.trim();
  const given = firstName(name);
  const test = Boolean(input.test);
  const street = input.street.trim();
  const locality = localityLine(town, input.zip);
  const address = fullAddress(street, town, input.zip);
  const mapsUrl = street ? mapsSearchUrl(address) : "";
  const streetViewUrl = street ? openInMapsUrl(address, input.latitude, input.longitude) : "";
  const directionsUrl = street ? mapsDirectionsUrl(address) : "";
  const kicker = input.kind === "update" ? "Quote update" : "New quote";
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
      contentId: "house-street-view",
    });
  }
  input.photos.forEach((photo, index) => {
    const filename = safeFilename(photo.filename, index);
    const content = photo.bytes.toString("base64");
    attachments.push({ filename, content, contentType: photo.contentType, contentId: photoCid(index) });
    attachments.push({ filename, content, contentType: photo.contentType });
  });

  const invite = buildCallInvite({
    test,
    name: input.name,
    phone: input.phone,
    email: input.email,
    day: input.preferredCallDay || "",
    time: input.preferredCallTime,
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
    if (input.kind === "update") lines.push(updateSentence(input.newPhotoCount ?? 0));
    lines.push("");
    if (phone) lines.push(`Call now: ${phone}`);
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

  // ---------- HTML ----------
  const contactLines = [
    phone
      ? `<p style="margin:0 0 4px;font-family:${EMAIL.font};font-size:22px;line-height:1.3;font-weight:700;">${
          tel
            ? `<a href="${esc(tel)}" style="color:${EMAIL.onGreen};text-decoration:none;">${esc(phone)}</a>`
            : `<span style="color:${EMAIL.onGreen};">${esc(phone)}</span>`
        }</p>`
      : "",
    email
      ? `<p style="margin:0 0 4px;font-family:${EMAIL.font};font-size:15px;line-height:1.45;"><a href="${esc(`mailto:${email}`)}" style="color:${EMAIL.onGreenMuted};text-decoration:underline;">${esc(email)}</a></p>`
      : "",
    street || locality
      ? `<p style="margin:0;font-family:${EMAIL.font};font-size:15px;line-height:1.45;color:${EMAIL.onGreenMuted};">${esc(street)}${street && locality ? "<br />" : ""}${esc(locality)}</p>`
      : "",
  ].join("");

  const callButton =
    phone && tel
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0 0;">
          <tr>
            <td class="ab-stack" valign="top" style="padding:0 6px 0 0;">${callNow(tel)}</td>
            ${email ? `<td class="ab-stack" valign="top" width="42%" style="padding:0 0 0 6px;">${emailButton(email, given)}</td>` : ""}
          </tr>
        </table>`
      : email
        ? `<div style="margin:18px 0 0;">${emailButton(email, given)}</div>`
        : "";

  const header = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td class="ab-pad" style="background:${EMAIL.green};padding:24px 28px 24px;">
        ${eyebrow(`${kicker} · ${when}`, EMAIL.onGreenMuted)}
        <h1 style="margin:0 0 10px;font-family:${EMAIL.serif};font-size:30px;line-height:1.15;font-weight:500;color:#ffffff;">${esc(name || "New lead")}</h1>
        ${contactLines}
        ${callButton}
      </td></tr>
    </table>`;

  const update =
    input.kind === "update"
      ? `<p style="margin:0 0 6px;font-family:${EMAIL.font};font-size:15px;line-height:1.5;color:${EMAIL.muted};">${esc(updateSentence(input.newPhotoCount ?? 0))}</p>`
      : "";

  const photoTitle = parsed.style || captions.some((caption) => caption.startsWith("Design preview")) ? "Photos & design" : "Their photos";
  const styleLine = parsed.style
    ? `<p style="margin:0 0 12px;font-family:${EMAIL.font};font-size:16px;line-height:1.5;color:${EMAIL.ink};"><span style="color:${EMAIL.muted};">Style they picked:</span> <strong>${esc(parsed.style)}</strong></p>`
    : "";
  const customLine = parsed.customDesign
    ? `<p style="margin:0 0 12px;padding:10px 14px;background:${EMAIL.alertWash};border-radius:10px;font-family:${EMAIL.font};font-size:14px;line-height:1.5;color:${EMAIL.alert};"><strong>Custom design needed.</strong> ${esc(parsed.customDesign.replace(/^CUSTOM DESIGN NEEDED\.\s*/i, ""))}</p>`
    : "";
  const photosHtml = input.photos.length
    ? input.photos
        .map((_, index) => {
          const img = `<img src="cid:${photoCid(index)}" alt="${esc(captions[index])}" width="504" style="display:block;width:100%;max-width:504px;height:auto;border:0;border-radius:12px;" />`;
          const linked = links[index] ? `<a href="${esc(links[index])}" style="text-decoration:none;">${img}</a>` : img;
          const open = links[index]
            ? ` &nbsp;·&nbsp; <a href="${esc(links[index])}" style="color:${EMAIL.green};font-weight:600;text-decoration:underline;">Open full size</a>`
            : "";
          return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px;">
            <tr><td>${linked}</td></tr>
            <tr><td style="padding:6px 2px 0;font-family:${EMAIL.font};font-size:13px;line-height:1.4;color:${EMAIL.muted};"><strong style="color:${EMAIL.ink};">${esc(captions[index])}</strong>${open}</td></tr>
          </table>`;
        })
        .join("")
    : `<p style="margin:0 0 14px;padding:12px 14px;background:${EMAIL.wash};border:1px dashed ${EMAIL.line};border-radius:10px;font-family:${EMAIL.font};font-size:15px;line-height:1.5;color:${EMAIL.muted};">No photos uploaded.</p>`;

  const consentHtml = input.consent
    ? `<p style="margin:0 0 6px;font-family:${EMAIL.font};font-size:15px;line-height:1.5;color:${EMAIL.ink};"><strong>Yes${consentAt ? `, ${esc(consentAt)}` : ""}</strong></p>
       ${consentRecord ? `<p style="margin:0;font-family:${EMAIL.font};font-size:14px;line-height:1.5;color:${EMAIL.muted};">${escLines(consentRecord)}</p>` : ""}`
    : `<p style="margin:0;font-family:${EMAIL.font};font-size:15px;line-height:1.5;color:${EMAIL.muted};">No text consent. Call or email only.</p>`;

  const hasHouseImage = Boolean(input.houseImage?.bytes.length);
  const aboutRows = houseFactRows(input.houseFacts);
  const houseHtml = street
    ? `${sectionTitle("The house (for your visit)")}
       <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;">
         <tr>
           ${
             hasHouseImage
               ? `<td valign="top" width="150" style="width:150px;padding:0 14px 0 0;"><a href="${esc(streetViewUrl || mapsUrl)}" style="text-decoration:none;"><img src="cid:house-street-view" alt="Street View of the house" width="150" style="display:block;width:150px;height:auto;border:1px solid ${EMAIL.line};border-radius:10px;" /></a></td>`
               : ""
           }
           <td valign="top" style="font-family:${EMAIL.font};font-size:14px;line-height:1.55;color:${EMAIL.ink};">
             ${esc(street)}${locality ? `<br />${esc(locality)}` : ""}<br />
             ${streetViewUrl ? `<a href="${esc(streetViewUrl)}" style="color:${EMAIL.green};font-weight:600;text-decoration:underline;">Open Street View</a>` : ""}
             ${directionsUrl ? `<br /><a href="${esc(directionsUrl)}" style="color:${EMAIL.green};font-weight:600;text-decoration:underline;">Get directions</a>` : ""}
             ${mapsUrl ? `<br /><a href="${esc(mapsUrl)}" style="color:${EMAIL.green};font-weight:600;text-decoration:underline;">Open in Google Maps</a>` : ""}
           </td>
         </tr>
       </table>
       ${aboutHouseHtml(aboutRows)}`
    : "";

  const footerBits = [
    `Source: ${esc(leadSource)}`,
    source ? `Page: ${esc(source)}` : "",
    referrer ? `Referrer: ${esc(referrer)}` : "",
    campaign ? `Campaign (UTM): ${esc(campaign)}` : "",
    `Internal lead email only — not sent to the homeowner. Lead ${esc(input.id.slice(0, 8))}.`,
  ].filter(Boolean);

  const body = `${update}
    ${sectionTitle(photoTitle).replace("margin:26px 0 10px", "margin:4px 0 10px")}
    ${styleLine}
    ${customLine}
    ${photosHtml}
    ${details.length ? `${sectionTitle("Project details")}${rowsTable(details)}` : ""}
    ${sectionTitle("Consent")}
    ${consentHtml}
    ${houseHtml || `<div style="height:14px;line-height:14px;font-size:1px;">&nbsp;</div>`}`;

  const preheader = [phone, town, project, input.photos.length ? `${input.photos.length} photo${input.photos.length === 1 ? "" : "s"}` : "no photos"]
    .filter(Boolean)
    .join(" · ");

  const html = shell({
    title: subject,
    preheader,
    banner: test ? testBanner(TEST_LINE) : "",
    header,
    body,
    footer: footerBits.join("<br />"),
  });

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

function aboutHouseHtml(rows: Row[]) {
  if (!rows.length) return "";
  const body = rows
    .map(
      (row) => `<tr>
        <td valign="top" style="padding:3px 10px 3px 0;font-family:${EMAIL.font};font-size:13px;line-height:1.45;color:${EMAIL.muted};">${esc(row.label)}</td>
        <td valign="top" style="padding:3px 0;font-family:${EMAIL.font};font-size:13px;line-height:1.45;color:${EMAIL.ink};font-weight:600;">${esc(row.value ?? "")}</td>
      </tr>`,
    )
    .join("");
  return `<p style="margin:0 0 4px;font-family:${EMAIL.font};font-size:13px;line-height:1.4;font-weight:700;color:${EMAIL.ink};">About the house</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;">${body}</table>`;
}

function callNow(tel: string) {
  return `<a href="${esc(tel)}" style="display:block;background:#ffffff;color:${EMAIL.green};text-decoration:none;padding:14px 18px;border-radius:999px;font-weight:700;font-size:17px;line-height:1.2;text-align:center;font-family:${EMAIL.font};">Call now</a>`;
}

function emailButton(email: string, given: string) {
  return `<a href="${esc(`mailto:${email}`)}" style="display:block;background:transparent;color:#ffffff;border:1px solid ${EMAIL.onGreenMuted};text-decoration:none;padding:13px 18px;border-radius:999px;font-weight:700;font-size:16px;line-height:1.2;text-align:center;font-family:${EMAIL.font};">Email ${esc(given || "them")}</a>`;
}

function updateSentence(newPhotoCount: number) {
  if (newPhotoCount > 0) {
    return newPhotoCount === 1 ? "Added 1 photo to this quote." : `Added ${newPhotoCount} photos to this quote.`;
  }
  return "Updated details for this quote.";
}

