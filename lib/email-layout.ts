/**
 * Shared email shell for every Acadiana Bathrooms email (lead emails to Justin and
 * customer confirmations). Table-based, inline-styled HTML that holds up in Gmail on
 * desktop and phone. Modeled on the Shaun's Firewood nurture email: a 560px centered
 * column, a system font at 16px / 1.55, 14px between paragraphs, hidden preheader
 * text, a pill button, a simple sign-off, and a small gray footer with a top border.
 * Colors are the site's Live Oak palette (app/globals.css :root).
 */

export const EMAIL = {
  canvas: "#f3efe4",
  card: "#ffffff",
  ink: "#1c241c",
  muted: "#55574c",
  faint: "#7a7c70",
  line: "#d8d3c4",
  green: "#103830",
  greenDeep: "#14261f",
  wash: "#f6f3ea",
  sage: "#e8e6d8",
  onGreen: "#f6f1e6",
  onGreenMuted: "#d5e2d8",
  alert: "#9f2d2d",
  alertWash: "#fbecea",
  font: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
} as const;

export function esc(value: string) {
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

/** Escape and keep line breaks. */
export function escLines(value: string) {
  return esc(value).replace(/\n/g, "<br />");
}

const P = `margin:0 0 14px;font-family:${EMAIL.font};font-size:16px;line-height:1.55;color:${EMAIL.ink};`;

export function para(html: string, extra = "") {
  return `<p style="${P}${extra}">${html}</p>`;
}

export function eyebrow(text: string, color: string = EMAIL.muted, extra = "") {
  return `<p style="margin:0 0 8px;font-family:${EMAIL.font};font-size:12px;line-height:1.3;letter-spacing:.12em;text-transform:uppercase;font-weight:700;color:${color};${extra}">${esc(text)}</p>`;
}

export function sectionTitle(text: string) {
  return `<p style="margin:26px 0 10px;font-family:${EMAIL.font};font-size:12px;line-height:1.3;letter-spacing:.12em;text-transform:uppercase;font-weight:700;color:${EMAIL.green};">${esc(text)}</p>`;
}

/** Pill button. `block` makes it full width (best for the main tap target on a phone). */
export function pillButton(
  href: string,
  label: string,
  options: { variant?: "solid" | "outline"; block?: boolean } = {},
) {
  const solid = (options.variant ?? "solid") === "solid";
  const style = [
    `display:${options.block ? "block" : "inline-block"}`,
    `background:${solid ? EMAIL.green : EMAIL.card}`,
    `color:${solid ? "#ffffff" : EMAIL.green}`,
    solid ? `border:1px solid ${EMAIL.green}` : `border:1px solid ${EMAIL.line}`,
    "text-decoration:none",
    "padding:13px 22px",
    "border-radius:999px",
    "font-weight:700",
    "font-size:16px",
    "line-height:1.2",
    "text-align:center",
    `font-family:${EMAIL.font}`,
  ].join(";");
  return `<a href="${esc(href)}" style="${style}">${esc(label)}</a>`;
}

/** Label / value rows. Values are escaped; pass `htmlValue` rows to keep markup. */
export type Row = { label: string; value?: string; htmlValue?: string };

export function rowsTable(rows: Row[], options: { labelWidth?: number } = {}) {
  const visible = rows.filter((row) => (row.htmlValue ?? row.value ?? "").trim());
  if (!visible.length) return "";
  const width = options.labelWidth ?? 132;
  const body = visible
    .map((row, index) => {
      const border = index === visible.length - 1 ? "" : `border-bottom:1px solid ${EMAIL.line};`;
      const value = row.htmlValue ?? escLines(row.value ?? "");
      return `<tr>
        <td valign="top" width="${width}" style="width:${width}px;padding:10px 12px 10px 0;${border}font-family:${EMAIL.font};font-size:14px;line-height:1.45;color:${EMAIL.muted};font-weight:600;">${esc(row.label)}</td>
        <td valign="top" style="padding:10px 0;${border}font-family:${EMAIL.font};font-size:15px;line-height:1.5;color:${EMAIL.ink};">${value}</td>
      </tr>`;
    })
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${body}</table>`;
}

/** Soft panel (recap box). */
export function panel(inner: string, options: { background?: string; border?: string; padding?: string } = {}) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;margin:4px 0 16px;">
    <tr><td style="background:${options.background ?? EMAIL.wash};border:1px solid ${options.border ?? EMAIL.line};border-radius:14px;padding:${options.padding ?? "6px 18px"};">${inner}</td></tr>
  </table>`;
}

export function shell(input: {
  title: string;
  preheader: string;
  /** Optional strip above the card (e.g. the TEST banner). */
  banner?: string;
  header: string;
  body: string;
  footer: string;
}) {
  // The &zwnj;&nbsp; run keeps Gmail from pulling body text into the inbox preview.
  const filler = "&#847;&zwnj;&nbsp;".repeat(40);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light" />
<title>${esc(input.title)}</title>
<style>
  @media only screen and (max-width: 600px) {
    .ab-outer { padding: 0 !important; }
    .ab-card { border-radius: 0 !important; border-left: 0 !important; border-right: 0 !important; }
    .ab-pad { padding-left: 20px !important; padding-right: 20px !important; }
    .ab-stack { display: block !important; width: 100% !important; padding: 0 0 10px 0 !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${EMAIL.canvas};-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;mso-hide:all;font-size:1px;line-height:1px;color:${EMAIL.canvas};">${esc(input.preheader)}${filler}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${EMAIL.canvas};">
    <tr><td align="center" class="ab-outer" style="padding:24px 12px 32px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" class="ab-card" style="width:100%;max-width:560px;background:${EMAIL.card};border:1px solid ${EMAIL.line};border-radius:18px;border-collapse:separate;overflow:hidden;">
        ${input.banner ?? ""}
        <tr><td class="ab-pad" style="padding:0;">${input.header}</td></tr>
        <tr><td class="ab-pad" style="padding:24px 28px 8px;">${input.body}</td></tr>
        <tr><td class="ab-pad" style="padding:0 28px 24px;">
          <p style="margin:0;padding-top:14px;border-top:1px solid ${EMAIL.line};font-family:${EMAIL.font};font-size:12px;line-height:1.6;color:${EMAIL.faint};">${input.footer}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function testBanner(text: string) {
  return `<tr><td style="background:${EMAIL.alertWash};border-bottom:1px solid #efc9c3;padding:10px 28px;font-family:${EMAIL.font};font-size:13px;line-height:1.4;font-weight:700;color:${EMAIL.alert};">${esc(text)}</td></tr>`;
}
