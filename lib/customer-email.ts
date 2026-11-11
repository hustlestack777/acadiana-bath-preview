import { brand, finishes } from "./copy";
import {
  choiceLabel,
  firstName,
  formatEmailSize,
  formatPhone,
  localityLine,
  projectLabels,
  timingLabel,
} from "./lead-display";
import { withTestSubject } from "./lead-notify";
import { parseFeatures, type LeadEmailAttachment, type LeadEmailPhoto } from "./lead-email";
import { EMAIL, esc, eyebrow, panel, para, pillButton, rowsTable, sectionTitle, shell, testBanner, type Row } from "./email-layout";
import { SITE_URL } from "./site";

/** What the customer told us, shown back to them so they have it saved. */
export type CustomerRecap = {
  /** Big line at the top of the recap, e.g. "8 vinyl windows" plus its ballpark range (see windowRecapHeadline). */
  headline?: string;
  /** One short line under the headline. */
  note?: string;
  rows: Row[];
  /** Style picked on /design. */
  style?: string;
};

export type CustomerConfirmationInput = {
  name: string;
  /** Customer's phone as typed; shown formatted like (337) 555-0142. */
  phone?: string;
  sourcePage: string;
  photos?: LeadEmailPhoto[];
  recap?: CustomerRecap;
  test?: boolean;
};

const DESIGN_FINE_PRINT = "Design preview. Final pricing at your free consult.";

/** Default recap for /estimate and the quick-quote path forms, built from the saved lead. */
export function recapFromLead(input: {
  project: string;
  width: string;
  depth: string;
  height: string;
  measurements: string;
  finish: string;
  features: string;
  budget: string;
  timing: string;
  preferredCallTime: string;
  street: string;
  city: string;
  zip: string;
  photoCount: number;
}): CustomerRecap {
  const parsed = parseFeatures(input.features, true);
  const budget = parseFeatures(input.budget, true);
  const finishId = input.finish.trim();
  const keep = (row: Row) => !/^(path|sms consent)$/i.test(row.label);
  const place = [input.street.trim(), localityLine(input.city, input.zip)].filter(Boolean).join(", ");
  const rows: Row[] = [
    { label: "Project", value: projectLabels(input.project) },
    { label: "Size", value: formatEmailSize(input.width, input.depth, input.height) },
    { label: "Measurements", value: input.measurements.trim() },
    { label: "Finish", value: finishId && finishId !== "unsure" ? choiceLabel(finishId, finishes) : "" },
    ...parsed.rows.filter(keep),
    ...budget.rows.filter((row) => !/skipped/i.test(row.value ?? "")),
    { label: "Timing", value: timingLabel(input.timing) },
    { label: "Best time to call", value: input.preferredCallTime.trim() },
    { label: "Address", value: place },
    { label: "Photos", value: input.photoCount ? `${input.photoCount} sent` : "" },
    ...(parsed.notes.length ? [{ label: "Your notes", value: parsed.notes.join("\n") }] : []),
  ];
  return { rows: rows.filter((row) => (row.value ?? "").trim()) };
}

export function buildCustomerConfirmation(input: CustomerConfirmationInput) {
  const given = firstName(input.name) || "there";
  const isDesign = input.sourcePage === "/design";
  const isWindows = input.sourcePage === "/windows";
  const test = Boolean(input.test);
  const subject = withTestSubject(
    isDesign ? "We got your bathroom design" : isWindows ? "We got your window quote request" : "We got your request",
    test,
  );

  const formatted = input.phone ? formatPhone(input.phone) : "";
  const callAt = formatted.startsWith("(") ? ` at ${formatted}` : "";
  const telAt = formatted.startsWith("(") ? formatted : "";
  const opener = isDesign
    ? "Thanks for sending your photo. Here’s the look you picked, next to your bathroom."
    : isWindows
      ? "Thanks for requesting a window quote. Here’s your ballpark and what you told us, so you have it saved."
      : "Thanks for reaching out about your bathroom. Here’s a recap of what you sent, so you have it saved.";
  const next = `Justin will call you soon${callAt} to talk through it${isWindows ? " and set up a time to measure" : ""}.`;
  const nextText = next;

  const before = isDesign ? input.photos?.[0] : undefined;
  const after = isDesign ? input.photos?.[1] : undefined;
  const attachments: LeadEmailAttachment[] = [];
  if (before?.bytes.length) {
    attachments.push({
      filename: "your-bathroom.jpg",
      content: before.bytes.toString("base64"),
      contentType: before.contentType || "image/jpeg",
      contentId: "design-before",
    });
  }
  if (after?.bytes.length) {
    attachments.push({
      filename: "your-design-preview.jpg",
      content: after.bytes.toString("base64"),
      contentType: after.contentType || "image/jpeg",
      contentId: "design-after",
    });
  }

  const recap = input.recap;
  const style = recap?.style?.trim() || "";
  const recapRows = recap?.rows.filter((row) => (row.htmlValue ?? row.value ?? "").trim()) ?? [];
  const windowsLink = `${SITE_URL}/windows`;

  // ---------- plain text ----------
  const textLines = [
    test ? "TEST — this went to the team test inbox only." : "",
    test ? "" : null,
    `Hi ${given},`,
    "",
    opener,
    "",
  ].filter((line): line is string => line !== null);
  if (isDesign && style) textLines.push(`The look you picked: ${style}`);
  if (isDesign && after) textLines.push("Your bathroom and the design preview are attached.", DESIGN_FINE_PRINT, "");
  if (recap?.headline) textLines.push(recap.headline);
  if (recap?.note) textLines.push(recap.note);
  if (recap?.headline || recap?.note) textLines.push("");
  if (recapRows.length) {
    textLines.push("WHAT YOU SENT US");
    for (const row of recapRows) textLines.push(`${row.label}: ${(row.value ?? "").replace(/\n/g, "; ")}`);
    textLines.push("");
  }
  textLines.push(nextText, "", `Questions before then? Call us at ${brand.phone}.`, "", "Thanks,", "Justin", brand.name, brand.phone);
  if (!isWindows) textLines.push("", `Need windows too? Get a window quote: ${windowsLink}`);
  const text = textLines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";

  // ---------- HTML ----------
  const header = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td class="ab-pad" style="padding:26px 28px 18px;border-bottom:1px solid ${EMAIL.line};">
        <p style="margin:0;font-family:${EMAIL.serif};font-size:21px;line-height:1.25;color:${EMAIL.green};">${esc(brand.name)}</p>
      </td></tr>
    </table>`;

  const image = (cid: string, alt: string, width: number) =>
    `<img src="cid:${cid}" alt="${esc(alt)}" width="${width}" style="display:block;width:100%;max-width:${width}px;height:auto;border:0;border-radius:12px;" />`;
  const caption = (label: string) =>
    `<p style="margin:0 0 6px;font-family:${EMAIL.font};font-size:12px;line-height:1.3;letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:${EMAIL.muted};">${esc(label)}</p>`;

  const designHtml = isDesign
    ? `${style ? para(`The look you picked: <strong>${esc(style)}</strong>`) : ""}
       ${
         before && after
           ? `${caption("Your bathroom")}${image("design-before", "Your bathroom", 504)}
              <div style="height:14px;line-height:14px;font-size:1px;">&nbsp;</div>
              ${image("design-after", "Your design preview", 504)}`
           : after
             ? `${image("design-after", "Your design preview", 504)}`
             : ""
       }
       ${after ? `<p style="margin:8px 0 18px;font-family:${EMAIL.font};font-size:13px;line-height:1.5;color:${EMAIL.faint};">${esc(DESIGN_FINE_PRINT)}</p>` : ""}`
    : "";

  const headlineHtml = recap?.headline
    ? `<p style="margin:10px 0 4px;font-family:${EMAIL.serif};font-size:22px;line-height:1.3;color:${EMAIL.green};">${esc(recap.headline)}</p>
       ${recap.note ? `<p style="margin:0 0 6px;font-family:${EMAIL.font};font-size:14px;line-height:1.5;color:${EMAIL.muted};">${esc(recap.note)}</p>` : ""}`
    : "";
  const recapHtml =
    headlineHtml || recapRows.length
      ? `${sectionTitle(isWindows ? "Your window ballpark" : "What you sent us").replace("margin:26px 0 10px", "margin:6px 0 10px")}
         ${panel(`${headlineHtml}${headlineHtml && recapRows.length ? `<div style="height:6px;line-height:6px;font-size:1px;">&nbsp;</div>` : ""}${rowsTable(recapRows, { labelWidth: 120 })}`, { padding: headlineHtml ? "8px 18px 6px" : "4px 18px" })}`
      : "";

  const body = `${eyebrow(isDesign ? "Your design" : isWindows ? "Window quote request" : "Request received", EMAIL.green)}
    <p style="margin:0 0 14px;font-family:${EMAIL.serif};font-size:26px;line-height:1.2;color:${EMAIL.ink};">Hi ${esc(given)},</p>
    ${para(esc(opener))}
    ${designHtml}
    ${recapHtml}
    ${para(esc(next).replace(esc(telAt), telAt ? `<span style="white-space:nowrap;">${esc(telAt)}</span>` : ""))}
    ${para(`Questions before then? We’re one tap away.`)}
    <p style="margin:6px 0 22px;">${pillButton(brand.phoneHref, `Call ${brand.phone}`)}</p>
    <p style="margin:0 0 2px;font-family:${EMAIL.font};font-size:16px;line-height:1.55;color:${EMAIL.ink};">Thanks,</p>
    <p style="margin:0 0 22px;font-family:${EMAIL.font};font-size:16px;line-height:1.55;color:${EMAIL.ink};">Justin<br /><span style="color:${EMAIL.muted};">${esc(brand.name)}</span><br /><a href="${esc(brand.phoneHref)}" style="color:${EMAIL.green};text-decoration:none;font-weight:600;">${esc(brand.phone)}</a></p>`;

  const footer = [
    isWindows
      ? ""
      : `Need windows too? <a href="${esc(windowsLink)}" style="color:${EMAIL.green};text-decoration:underline;">Get a window quote.</a>`,
    `You’re getting this because you asked ${esc(brand.name)} for a quote. Just reply if you have a question.`,
    `${esc(brand.name)} · Serving Acadiana`,
  ]
    .filter(Boolean)
    .join("<br />");

  const preheader = recap?.headline
    ? `${recap.headline}. Justin will call you soon.`
    : isDesign
      ? "Here’s your design preview. Justin will call you soon."
      : "Here’s a recap of your request. Justin will call you soon.";

  const html = shell({
    title: subject,
    preheader,
    banner: test ? testBanner("TEST — this went to the team test inbox only.") : "",
    header,
    body,
    footer,
  });

  return { subject, text, html, attachments };
}
