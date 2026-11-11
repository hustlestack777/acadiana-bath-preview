import { brand } from "./copy";
import { firstName, formatPhone } from "./lead-display";
import { withTestSubject } from "./lead-notify";
import type { LeadEmailAttachment, LeadEmailPhoto } from "./lead-email";

const INK = "#1c1014";
const MUTED = "#6d5a54";
const CARD = "#fffdf9";
const LINE = "#e8ddd4";
const CANVAS = "#e7ddd3";
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

export type CustomerConfirmationInput = {
  name: string;
  /** Customer's phone as typed; shown formatted like (337) 555-0142. */
  phone?: string;
  sourcePage: string;
  photos?: LeadEmailPhoto[];
  test?: boolean;
};

export function buildCustomerConfirmation(input: CustomerConfirmationInput) {
  const given = firstName(input.name) || "there";
  const isDesign = input.sourcePage === "/design";
  const isWindows = input.sourcePage === "/windows";
  const subject = withTestSubject(
    isDesign ? "We got your bathroom design" : "We got your request",
    Boolean(input.test),
  );

  const callAt = input.phone && formatPhone(input.phone).startsWith("(") ? ` at ${formatPhone(input.phone)}` : "";
  const opener = isDesign
    ? `Thanks for sending your photo. Here's the look you picked, next to your bathroom. Justin will call you soon${callAt} to talk through it.`
    : isWindows
      ? `Thanks for requesting a window quote. Justin will call you soon${callAt} to talk through it.`
      : `Thanks for reaching out. Justin will call you soon${callAt} to talk through your project.`;

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

  const text = [
    `Hi ${given},`,
    "",
    opener,
    "",
    brand.name,
    brand.phone,
    "",
  ].join("\n");

  const photosHtml =
    before && after
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0 8px;">
          <tr>
            <td width="50%" valign="top" style="padding:0 4px 8px 0;">
              <p style="margin:0 0 6px;font-family:${SANS};font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:${MUTED};">Your bathroom</p>
              <img src="cid:design-before" alt="Your bathroom" width="250" style="display:block;width:100%;max-width:250px;height:auto;border-radius:14px;" />
            </td>
            <td width="50%" valign="top" style="padding:0 0 8px 4px;">
              <p style="margin:0 0 6px;font-family:${SANS};font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:${MUTED};">Design preview</p>
              <img src="cid:design-after" alt="Your design preview" width="250" style="display:block;width:100%;max-width:250px;height:auto;border-radius:14px;" />
            </td>
          </tr>
        </table>`
      : after
        ? `<p style="margin:18px 0 6px;font-family:${SANS};font-size:11px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:${MUTED};">Design preview</p>
           <img src="cid:design-after" alt="Your design preview" width="520" style="display:block;width:100%;max-width:520px;height:auto;border-radius:14px;margin:0 0 8px;" />`
        : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${CANVAS};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CANVAS};">
    <tr><td align="center" style="padding:16px 12px 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${CARD};border-radius:20px;overflow:hidden;">
        <tr><td style="padding:28px 22px 8px;">
          <p style="margin:0 0 16px;font-family:${SERIF};font-size:28px;line-height:1.15;font-weight:500;color:${INK};">Hi ${esc(given)},</p>
          <p style="margin:0;font-family:${SANS};font-size:17px;line-height:1.5;color:${INK};">${esc(opener)}</p>
          ${photosHtml}
        </td></tr>
        <tr><td style="padding:18px 22px 26px;">
          <p style="margin:0 0 4px;font-family:${SANS};font-size:16px;line-height:1.4;font-weight:700;color:${INK};">${esc(brand.name)}</p>
          <p style="margin:0;font-family:${SANS};font-size:16px;line-height:1.4;">
            <a href="${esc(brand.phoneHref)}" style="color:${INK};text-decoration:none;font-weight:700;">${esc(brand.phone)}</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, text, html, attachments };
}
