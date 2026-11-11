import { brand, finishes } from "./copy";
import {
  choiceLabel,
  firstName,
  formatEmailSize,
  localityLine,
  projectLabels,
  timingLabel,
} from "./lead-display";
import { withTestSubject } from "./lead-notify";
import { parseFeatures, type LeadEmailAttachment, type LeadEmailPhoto } from "./lead-email";
import { EMAIL, esc, panel, para, pillButton, rowsTable, sectionTitle, shell, testBanner, type Row } from "./email-layout";
import { callWindowLabel, customerCallbackSubject } from "./call-window";
import { justinVcfAttachment } from "./justin-vcf";

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
  preferredCallDay?: string;
  preferredCallTime?: string;
  now?: Date;
  test?: boolean;
};

const DESIGN_FINE_PRINT = "Design preview. When your consultant measures, you'll get your exact price right then.";

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
  preferredCallDay?: string;
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
    { label: "Call window", value: callWindowLabel(input.preferredCallDay || "", input.preferredCallTime.trim()) || input.preferredCallTime.trim() },
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
  const now = input.now ?? new Date();
  const subject = withTestSubject(
    customerCallbackSubject(input.preferredCallDay || "", input.preferredCallTime || "", now),
    test,
  );

  const windowSubject = customerCallbackSubject(input.preferredCallDay || "", input.preferredCallTime || "", now);
  const dayBit = windowSubject.replace(/^We'll call you /, "").replace(/^Justin will call you /, "");
  const hasWindow = Boolean(input.preferredCallDay && input.preferredCallTime);
  const vcfUrl = "https://abclafayette.com/justin.vcf";

  const thanks = hasWindow
    ? `Thanks for reaching out to Acadiana Bathrooms. We'll call you ${dayBit} to discuss your project. Save Justin's number so you'll know it's him: (337) 522-0023. You can call or text him there anytime.`
    : "Thanks for reaching out to Acadiana Bathrooms. We'll call you to discuss your project. Save Justin's number so you'll know it's him: (337) 522-0023. You can call or text him there anytime.";
  const nextSteps =
    "What happens next: We'll call you to discuss your project and set a time to take measurements. When your consultant measures, they'll go over design options with you, and you'll get your exact price right then.";
  const signoff = "Talk soon,\nAcadiana Bathrooms · abclafayette.com";

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
  attachments.push(justinVcfAttachment());

  const recap = input.recap;
  const style = recap?.style?.trim() || "";
  const recapRows = recap?.rows.filter((row) => (row.htmlValue ?? row.value ?? "").trim()) ?? [];

  // ---------- plain text ----------
  const textLines = [
    test ? "TEST — this went to the team test inbox only." : "",
    test ? "" : null,
    `Hi ${given},`,
    "",
    thanks,
    "",
    `Save Justin's Contact: ${vcfUrl}`,
    "",
    nextSteps,
    "",
    "Talk soon,",
    "Acadiana Bathrooms · abclafayette.com",
  ].filter((line): line is string => line !== null);
  if (isDesign && style) {
    textLines.push("", `The look you picked: ${style}`);
  }
  if (isDesign && after) {
    textLines.push("Your bathroom and the design preview are attached.", DESIGN_FINE_PRINT);
  }
  if (recap?.headline) textLines.push("", recap.headline);
  if (recap?.note) textLines.push(recap.note);
  if (recapRows.length) {
    textLines.push("", "WHAT YOU SENT US");
    for (const row of recapRows) textLines.push(`${row.label}: ${(row.value ?? "").replace(/\n/g, "; ")}`);
  }
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
      ? `${sectionTitle(isWindows ? "Your window ballpark" : "What you sent us").replace("margin:26px 0 10px", "margin:18px 0 10px")}
         ${panel(`${headlineHtml}${headlineHtml && recapRows.length ? `<div style="height:6px;line-height:6px;font-size:1px;">&nbsp;</div>` : ""}${rowsTable(recapRows, { labelWidth: 120 })}`, { padding: headlineHtml ? "8px 18px 6px" : "4px 18px" })}`
      : "";

  const thanksHtml = thanks
    .replace("(337) 522-0023", '<a href="tel:+13375220023" style="color:' + EMAIL.green + ';text-decoration:none;font-weight:700;white-space:nowrap;">(337) 522-0023</a>');

  const body = `<p style="margin:0 0 14px;font-family:${EMAIL.serif};font-size:26px;line-height:1.2;color:${EMAIL.ink};">Hi ${esc(given)},</p>
    ${para(thanksHtml)}
    <p style="margin:6px 0 22px;">${pillButton(vcfUrl, "Save Justin's Contact")}</p>
    ${para(esc(nextSteps))}
    <p style="margin:0 0 22px;font-family:${EMAIL.font};font-size:16px;line-height:1.55;color:${EMAIL.ink};">Talk soon,<br />Acadiana Bathrooms · <a href="https://abclafayette.com" style="color:${EMAIL.green};text-decoration:none;">abclafayette.com</a></p>
    ${designHtml}
    ${recapHtml}`;

  const footer = `You're getting this because you asked ${esc(brand.name)} for a quote. Just reply if you have a question.<br />${esc(brand.name)} · Serving Acadiana`;

  const preheader = hasWindow
    ? windowSubject
    : "We'll call you to discuss your project.";

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
