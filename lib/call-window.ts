/** Call-window choices and the .ics slot in America/Chicago. */

export const CHICAGO_TZ = "America/Chicago";

export const CALL_TIMES = [
  { id: "morning", label: "Morning", hour: 9, hint: "9 AM CT" },
  { id: "afternoon", label: "Afternoon", hour: 14, hint: "2 PM CT" },
  { id: "evening", label: "Evening", hour: 18, hint: "6 PM CT" },
] as const;

export const CALL_DAYS = [
  { id: "weekday", label: "Weekday" },
  { id: "weekend", label: "Weekend" },
  { id: "any", label: "Any day" },
] as const;

export type CallTimeId = (typeof CALL_TIMES)[number]["id"];
export type CallDayId = (typeof CALL_DAYS)[number]["id"];

export function isCallTimeId(value: string): value is CallTimeId {
  return CALL_TIMES.some((item) => item.id === value);
}

export function isCallDayId(value: string): value is CallDayId {
  return CALL_DAYS.some((item) => item.id === value);
}

export function callTimeLabel(id: string) {
  const item = CALL_TIMES.find((time) => time.id === id);
  return item ? `${item.label} (${item.hint})` : "";
}

export function callDayLabel(id: string) {
  return CALL_DAYS.find((day) => day.id === id)?.label ?? "";
}

export function callWindowLabel(day: string, time: string) {
  const dayLabel = callDayLabel(day);
  const timeLabel = callTimeLabel(time);
  if (dayLabel && timeLabel) return `${dayLabel} · ${timeLabel}`;
  return dayLabel || timeLabel;
}

type ChicagoParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: number; // 0 = Sunday
};

function chicagoParts(date: Date): ChicagoParts {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: CHICAGO_TZ,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(fmt.formatToParts(date).map((part) => [part.type, part.value]));
  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    weekday: weekdayMap[parts.weekday] ?? 0,
  };
}

/** Instant for a civil clock time in America/Chicago. */
export function chicagoCivilToDate(year: number, month: number, day: number, hour: number, minute = 0): Date {
  let utc = Date.UTC(year, month - 1, day, hour, minute, 0);
  for (let i = 0; i < 3; i += 1) {
    const parts = chicagoParts(new Date(utc));
    const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, 0);
    const wanted = Date.UTC(year, month - 1, day, hour, minute, 0);
    utc += wanted - asUtc;
  }
  return new Date(utc);
}

function addDays(parts: ChicagoParts, days: number): ChicagoParts {
  const noon = chicagoCivilToDate(parts.year, parts.month, parts.day, 12, 0);
  return chicagoParts(new Date(noon.getTime() + days * 24 * 60 * 60 * 1000));
}

function isWeekday(weekday: number) {
  return weekday >= 1 && weekday <= 5;
}

/**
 * Next matching call slot in America/Chicago.
 * Weekday = next weekday (today if the slot is still ahead).
 * Weekend = next Saturday (today if Saturday and the slot is still ahead).
 * Any day = tomorrow.
 */
export function nextCallSlot(day: CallDayId, time: CallTimeId, now = new Date()): Date {
  const slot = CALL_TIMES.find((item) => item.id === time) ?? CALL_TIMES[0];
  const nowParts = chicagoParts(now);

  const slotOn = (parts: ChicagoParts) => chicagoCivilToDate(parts.year, parts.month, parts.day, slot.hour, 0);

  if (day === "any") {
    return slotOn(addDays(nowParts, 1));
  }

  for (let offset = 0; offset <= 16; offset += 1) {
    const candidate = addDays(nowParts, offset);
    const matches = day === "weekend" ? candidate.weekday === 6 : isWeekday(candidate.weekday);
    if (!matches) continue;
    const start = slotOn(candidate);
    if (start.getTime() > now.getTime()) return start;
  }

  return slotOn(addDays(nowParts, 1));
}

function icsStamp(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function icsEscape(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export function buildCallInvite(input: {
  name: string;
  phone?: string;
  email?: string;
  day: string;
  time: string;
  now?: Date;
  test?: boolean;
}): { start: Date; end: Date; filename: string; content: string; contentType: "text/calendar" } | null {
  if (!isCallDayId(input.day) || !isCallTimeId(input.time)) return null;
  const start = nextCallSlot(input.day, input.time, input.now);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const who = input.name.trim() || "new lead";
  const window = callWindowLabel(input.day, input.time);
  const title = input.test ? `TEST – Call ${who} — Acadiana Bathrooms` : `Call ${who} — Acadiana Bathrooms`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Acadiana Bathrooms//Lead Call//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:call-${icsStamp(start)}-${who.replace(/[^A-Za-z0-9]+/g, "").slice(0, 24) || "lead"}@abclafayette.com`,
    `DTSTAMP:${icsStamp(input.now ?? new Date())}`,
    `DTSTART:${icsStamp(start)}`,
    `DTEND:${icsStamp(end)}`,
    `SUMMARY:${icsEscape(title)}`,
    `DESCRIPTION:${icsEscape(
      [
        `Call window they picked: ${window}.`,
        input.phone ? `Phone: ${input.phone}` : "",
        input.email ? `Email: ${input.email}` : "",
        "Justin calls them for a quick chat about what they want.",
      ]
        .filter(Boolean)
        .join("\n"),
    )}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ];
  return {
    start,
    end,
    filename: "justin-callback.ics",
    content: lines.join("\r\n"),
    contentType: "text/calendar",
  };
}
