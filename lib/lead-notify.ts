/** Justin's real lead inbox. Production lead emails go To this address. */
export const JUSTIN_LEAD_EMAIL = "acadianabathandcounter@gmail.com";

/** Shaun is always CC'd on real leads, and receives Justin's copy on test leads. */
export const SHAUN_CC_EMAIL = "shaun.brasher@gmail.com";

function phoneDigits(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
}


const TEST_INBOX_DOMAINS = ["mail.grokbot.com", "grokbot.com"];

export function emailDomain(email: string) {
  const at = email.trim().toLowerCase().lastIndexOf("@");
  return at >= 0 ? email.trim().toLowerCase().slice(at + 1) : "";
}

/** True when the phone uses the 555 exchange, e.g. 337-555-0142. */
export function is555TestPhone(phone: string) {
  const digits = phoneDigits(phone);
  return digits.length === 10 && digits.slice(3, 6) === "555";
}

/** True when the address is on a Grok Bot / agent inbox domain. */
export function isTestInboxEmail(email: string) {
  const domain = emailDomain(email);
  if (!domain) return false;
  return TEST_INBOX_DOMAINS.some((allowed) => domain === allowed || domain.endsWith(`.${allowed}`));
}

/**
 * Team test mode. A lead is a test when the phone uses a 555 exchange
 * (for example 337-555-xxxx) or the email is at a Grok Bot inbox domain
 * (mail.grokbot.com or grokbot.com).
 */
export function isTeamTestLead(phone: string, email: string) {
  return is555TestPhone(phone) || isTestInboxEmail(email);
}

/** Never text a test lead. There is no SMS send today; this is the guard for one. */
export function shouldTextLead(phone: string, email: string) {
  return !isTeamTestLead(phone, email);
}

export const TEST_SUBJECT_PREFIX = "TEST – ";

export function withTestSubject(subject: string, test: boolean) {
  const trimmed = subject.trim();
  if (!test) return trimmed;
  const without = trimmed.replace(/^\s*(?:\[TEST[^\]]*\]|TEST)\s*[–-]?\s*/i, "");
  return `${TEST_SUBJECT_PREFIX}${without}`;
}

function uniqueAddresses(addresses: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const address of addresses) {
    const trimmed = address.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(trimmed);
  }
  return result;
}

export type LeadNotificationRoute = {
  test: boolean;
  to: string[];
  cc: string[];
};

/**
 * Production: To Justin, CC Shaun (and any other non-Justin addresses in the
 * notify list). Test: To Shaun only, never Justin, no CC.
 */
export function leadNotificationRoute(input: {
  phone: string;
  email: string;
  notifyList?: string[];
  forceTest?: boolean;
}): LeadNotificationRoute {
  const test = Boolean(input.forceTest) || isTeamTestLead(input.phone, input.email);
  if (test) {
    return { test: true, to: [SHAUN_CC_EMAIL], cc: [] };
  }
  const extras = (input.notifyList ?? []).filter(
    (address) => address.trim().toLowerCase() !== JUSTIN_LEAD_EMAIL.toLowerCase(),
  );
  return {
    test: false,
    to: [JUSTIN_LEAD_EMAIL],
    cc: uniqueAddresses([SHAUN_CC_EMAIL, ...extras]),
  };
}
