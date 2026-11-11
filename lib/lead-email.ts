import {
  firstName,
  formatChicago,
  formatEmailSize,
  formatPhone,
  fullAddress,
  homeownerLabel,
  leadNotes,
  leadSubject,
  localityLine,
  paymentLabel,
  phoneTel,
  projectLabels,
  timingLabel,
} from "./lead-display";
import { mapsSearchUrl, openInMapsUrl } from "./street-view";
import { campaignLine, sourceLine } from "./lead-attribution";

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
  preferredCallTime: string;
  photos: LeadEmailPhoto[];
  newPhotoCount?: number;
  houseImage?: { bytes: Buffer; contentType: string } | null;
  consent?: boolean;
  consentAt?: Date | string | null;
  consentText?: string;
  test?: boolean;
  sourcePage?: string;
  formPage?: string;
  referrer?: string;
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

const INK = "#1c241c";
const MUTED = "#55574c";
const CARD = "#fffaf3";
const LINE = "#d8d3c4";
const CLAY = "#103830";
const CREAM = "#f3efe4";
const CANVAS = "#e7e3d6";
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Arial, Helvetica, sans-serif";

function esc(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[character] ?? character;
  });
}

function safeFilename(filename: string, index: number) {
  const cleaned = filename.replace(/[/\\]/g, "").replace(/[^\w.\- ]+/g, "").trim() || "photo.jpg";
  return `${String(index + 1).padStart(2, "0")}-${cleaned}`;
}

function photoCid(index: number) {
  return `photo-${index + 1}`;
}

export function buildLeadEmail(input: LeadEmailContent) {
  const name = input.name.trim();
  const town = input.city.trim();
  const when = formatChicago(input.createdAt);
  const subject = leadSubject(name, town, input.kind);
  const phone = formatPhone(input.phone);
  const tel = phoneTel(input.phone);
  const email = input.email.trim();
  const project = projectLabels(input.project);
  const size = formatEmailSize(input.width, input.depth, input.height);
  const notes = leadNotes(input.measurements, input.features, input.budget);
  const home = homeownerLabel(input.homeowner);
  const payment = paymentLabel(input.payment);
  const timing = timingLabel(input.timing);
  const callTime = input.preferredCallTime.trim();
  const street = input.street.trim();
  const locality = localityLine(town, input.zip);
  const address = fullAddress(street, town, input.zip);
  const mapsUrl = street ? mapsSearchUrl(address) : "";
  const streetViewUrl = street ? openInMapsUrl(address, input.latitude, input.longitude) : "";
  const kicker = input.kind === "update" ? "Consult update" : "New consult";
  const given = firstName(name);
  const test = Boolean(input.test);

  const source = sourceLine(input.sourcePage || "", input.formPage || "");
  const campaign = campaignLine(input.utmSource || "", input.utmMedium || "", input.utmCampaign || "");
  const referrer = (input.referrer || "").trim();
  const rows = [
    source ? ["Source", source] : null,
    referrer ? ["Referrer", referrer] : null,
    campaign ? ["Campaign", campaign] : null,
    home ? ["Home", home] : null,
    timing ? ["Timing", timing] : null,
    payment ? ["Payment", payment] : null,
    callTime ? ["Call time", callTime] : null,
    notes ? ["Notes", notes] : null,
    input.consent
      ? [
          "Consent",
          `Yes${input.consentAt ? `, ${formatChicago(new Date(input.consentAt))}` : ""}${input.consentText ? `\n${input.consentText}` : ""}`,
        ]
      : null,
  ].filter((row): row is [string, string] => Boolean(row));

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
    attachments.push({
      filename,
      content,
      contentType: photo.contentType,
      contentId: photoCid(index),
    });
    attachments.push({
      filename,
      content,
      contentType: photo.contentType,
    });
  });

  const text = textBody({
    kicker,
    test,
    name,
    town,
    when,
    phone,
    email,
    street,
    locality,
    mapsUrl,
    streetViewUrl,
    project,
    size,
    rows,
    photoCount: input.photos.length,
    newPhotoCount: input.newPhotoCount ?? 0,
    kind: input.kind,
    id: input.id,
  });

  const html = htmlBody({
    kicker,
    test,
    name,
    town,
    when,
    phone,
    tel,
    email,
    given,
    street,
    locality,
    mapsUrl,
    streetViewUrl,
    hasHouseImage: Boolean(input.houseImage?.bytes.length),
    project,
    size,
    rows,
    photoCount: input.photos.length,
    newPhotoCount: input.newPhotoCount ?? 0,
    kind: input.kind,
    id: input.id,
  });

  return { subject, text, html, attachments };
}

function textBody(input: {
  kicker: string;
  name: string;
  town: string;
  when: string;
  phone: string;
  email: string;
  test: boolean;
  street: string;
  locality: string;
  mapsUrl: string;
  streetViewUrl: string;
  project: string;
  size: string;
  rows: Array<[string, string]>;
  photoCount: number;
  newPhotoCount: number;
  kind: "new" | "update";
  id: string;
}) {
  const lines = [
    input.test ? "TEST LEAD — sent to Shaun only, not to Justin." : "",
    input.kicker.toUpperCase(),
    input.name,
    [input.town, input.when].filter(Boolean).join(" · "),
    "",
  ];
  if (input.kind === "update") {
    lines.push(updateSentence(input.newPhotoCount), "");
  }
  if (input.phone) lines.push(`Call: ${input.phone}`);
  if (input.email) lines.push(`Email: ${input.email}`);
  if (input.phone || input.email) lines.push("");
  if (input.street) {
    lines.push(input.street);
    if (input.locality) lines.push(input.locality);
    if (input.streetViewUrl) lines.push(`Street View: ${input.streetViewUrl}`);
    if (input.mapsUrl) lines.push(`Open in Google Maps: ${input.mapsUrl}`);
    lines.push("");
  }
  if (input.project) lines.push(input.project);
  if (input.size) lines.push(input.size);
  if (input.project || input.size) lines.push("");
  for (const [label, value] of input.rows) {
    lines.push(`${label}: ${value.replace(/\n/g, " ")}`);
  }
  if (input.rows.length) lines.push("");
  if (input.photoCount) {
    lines.push(
      `Their photos: ${input.photoCount} (shown in this email and attached as files)`,
      "",
    );
  }
  lines.push(
    "Internal lead email only — not sent to the homeowner.",
    `Lead ${input.id.slice(0, 8)}.`,
  );
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

function updateSentence(newPhotoCount: number) {
  if (newPhotoCount > 0) {
    return newPhotoCount === 1 ? "Added 1 photo to this consult." : `Added ${newPhotoCount} photos to this consult.`;
  }
  return "Updated details for this consult.";
}

function htmlBody(input: {
  kicker: string;
  name: string;
  town: string;
  when: string;
  phone: string;
  tel: string;
  email: string;
  test: boolean;
  given: string;
  street: string;
  locality: string;
  mapsUrl: string;
  streetViewUrl: string;
  hasHouseImage: boolean;
  project: string;
  size: string;
  rows: Array<[string, string]>;
  photoCount: number;
  newPhotoCount: number;
  kind: "new" | "update";
  id: string;
}) {
  const subline = [input.town, input.when].filter(Boolean).join(" · ");
  const buttons = buttonRow(input.phone, input.tel, input.email, input.given);
  const address = input.street
    ? `<p style="margin:0 0 4px;font-family:${SANS};font-size:17px;line-height:1.3;color:${INK};"><strong>${esc(input.street)}</strong></p>
       ${input.locality ? `<p style="margin:0 0 8px;font-family:${SANS};font-size:14px;line-height:1.4;color:${MUTED};">${esc(input.locality)}</p>` : ""}
       ${
         input.hasHouseImage
           ? `<p style="margin:10px 0 6px;font-family:${SANS};font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:${MUTED};">Street View</p>
              <img src="cid:house-street-view" alt="Street View of the house" width="520" style="display:block;width:100%;max-width:520px;height:auto;border-radius:16px;border:1px solid ${LINE};margin:0 0 8px;" />`
           : ""
       }
       ${mapLinks(input.streetViewUrl, input.mapsUrl, input.hasHouseImage)}`
    : "";

  const job =
    input.project || input.size
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;background:${CREAM};border-radius:16px;">
          <tr><td style="padding:14px 16px;font-family:${SANS};color:${INK};">
            ${input.project ? `<p style="margin:0 0 4px;font-size:18px;line-height:1.3;font-weight:700;">${esc(input.project)}</p>` : ""}
            ${input.size ? `<p style="margin:0;font-size:15px;line-height:1.4;">${esc(input.size)}</p>` : ""}
          </td></tr>
        </table>`
      : "";

  const meta = input.rows
    .map(
      ([label, value]) => `<tr>
        <td valign="top" width="88" style="padding:0 8px 10px 0;font-family:${SANS};font-size:15px;line-height:1.35;color:${MUTED};font-weight:700;">${esc(label)}</td>
        <td valign="top" style="padding:0 0 10px;font-family:${SANS};font-size:15px;line-height:1.35;color:${INK};">${esc(value).replace(/\n/g, "<br />")}</td>
      </tr>`,
    )
    .join("");

  const update =
    input.kind === "update"
      ? `<p style="margin:0 0 14px;font-family:${SANS};font-size:14px;line-height:1.4;color:${MUTED};">${esc(updateSentence(input.newPhotoCount))}</p>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${esc(input.kicker)}</title></head>
<body style="margin:0;padding:0;background:${CANVAS};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CANVAS};">
    <tr><td align="center" style="padding:16px 12px 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${CARD};border-radius:20px;overflow:hidden;">
        <tr><td style="background:${INK};padding:22px 22px 20px;">
          <p style="margin:0 0 8px;font-family:${SANS};font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#e4d8b4;font-weight:700;">${esc(input.kicker)}</p>
          <h1 style="margin:0 0 6px;font-family:${SERIF};font-size:34px;line-height:1;font-weight:500;color:#f6f1e6;">${esc(input.name)}</h1>
          <p style="margin:0;font-family:${SERIF};font-size:16px;line-height:1.3;color:#e4d8b4;">${esc(subline)}</p>
          ${
            input.phone
              ? `<p style="margin:10px 0 0;font-family:${SANS};font-size:20px;line-height:1.2;font-weight:700;">${
                  input.tel
                    ? `<a href="${esc(input.tel)}" style="color:#f6f1e6;text-decoration:underline;text-underline-offset:3px;">${esc(input.phone)}</a>`
                    : `<span style="color:#f6f1e6;">${esc(input.phone)}</span>`
                }</p>`
              : ""
          }
        </td></tr>
        <tr><td style="padding:22px;">
          ${
            input.test
              ? `<p style="margin:0 0 14px;font-family:${SANS};font-size:13px;line-height:1.4;color:#8c4030;font-weight:700;">TEST LEAD — sent to Shaun only, not to Justin.</p>`
              : ""
          }
          ${update}
          ${buttons}
          ${address}
          ${job}
          ${meta ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px;">${meta}</table>` : ""}
          ${photoBlock(input.photoCount)}
        </td></tr>
        <tr><td style="padding:14px 22px 18px;border-top:1px solid ${LINE};font-family:${SANS};font-size:12px;line-height:1.45;color:${MUTED};">
          Internal lead email only — not sent to the homeowner. Lead ${esc(input.id.slice(0, 8))}.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}


function mapLinks(streetViewUrl: string, mapsUrl: string, hasHouseImage: boolean) {
  if (!streetViewUrl && !mapsUrl) return "";
  const primaryUrl = streetViewUrl || mapsUrl;
  const maps = mapsUrl
    ? `<a href="${esc(mapsUrl)}" style="color:#103830;font-weight:700;text-decoration:underline;text-underline-offset:3px;">Open in Google Maps</a>`
    : "";
  if (hasHouseImage) {
    const street = `<a href="${esc(primaryUrl)}" style="color:#103830;font-weight:700;text-decoration:underline;text-underline-offset:3px;">Open Street View</a>`;
    const items = [street, maps].filter(Boolean).join(" &nbsp;·&nbsp; ");
    return `<p style="margin:0 0 18px;font-family:${SANS};">${items}</p>`;
  }
  const button = `<a href="${esc(primaryUrl)}" style="display:block;background:${CLAY};color:#ffffff;text-decoration:none;border-radius:999px;padding:12px 16px;font-weight:700;font-size:16px;text-align:center;">Open Street View</a>`;
  const under = maps
    ? `<p style="margin:10px 0 18px;font-family:${SANS};font-size:14px;text-align:center;">${maps}</p>`
    : "";
  return `<p style="margin:8px 0 0;font-family:${SANS};">${button}</p>${under}`;
}

function buttonRow(phone: string, tel: string, email: string, given: string) {
  const call = phone && tel
    ? `<a href="${esc(tel)}" style="display:block;background:${CLAY};color:#ffffff;text-decoration:none;border-radius:999px;padding:12px 8px;font-weight:700;font-size:15px;text-align:center;font-family:${SANS};">Call ${esc(phone)}</a>`
    : "";
  const mail = email
    ? `<a href="${esc(`mailto:${email}`)}" style="display:block;background:#ffffff;color:${INK};text-decoration:none;border:1px solid ${LINE};border-radius:999px;padding:12px 8px;font-weight:700;font-size:15px;text-align:center;font-family:${SANS};">Email ${esc(given || "customer")}</a>`
    : "";
  if (!call && !mail) return "";
  if (call && mail) {
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
      <tr>
        <td width="50%" valign="top" style="padding-right:4px;">${call}</td>
        <td width="50%" valign="top" style="padding-left:4px;">${mail}</td>
      </tr>
    </table>`;
  }
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;"><tr><td>${call || mail}</td></tr></table>`;
}

function photoBlock(count: number) {
  if (!count) return "";
  const image = (index: number) =>
    `<img src="cid:${photoCid(index)}" alt="Customer photo ${index + 1}" width="250" style="display:block;width:100%;max-width:250px;height:auto;border-radius:14px;border:0;" />`;
  if (count === 1) {
    return `<h2 style="margin:8px 0 10px;font-family:${SERIF};font-size:22px;line-height:1.1;font-weight:500;color:${INK};">Their photos</h2>
      <img src="cid:${photoCid(0)}" alt="Customer photo 1" width="520" style="display:block;width:100%;max-width:520px;height:auto;border-radius:14px;" />`;
  }
  let rows = "";
  for (let index = 0; index < count; index += 2) {
    const right = index + 1 < count ? image(index + 1) : "";
    rows += `<tr>
      <td width="50%" valign="top" style="padding:0 4px 8px 0;">${image(index)}</td>
      <td width="50%" valign="top" style="padding:0 0 8px 4px;">${right}</td>
    </tr>`;
  }
  return `<h2 style="margin:8px 0 10px;font-family:${SERIF};font-size:22px;line-height:1.1;font-weight:500;color:${INK};">Their photos</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>`;
}
