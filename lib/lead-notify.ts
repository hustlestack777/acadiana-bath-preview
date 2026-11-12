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
export function isTeamTestLead(phone: string, email: string, name = "") {
  return is555TestPhone(phone) || isTestInboxEmail(email) || isTestName(name);
}

/**
 * Shaun's test switch (11/12/2026): a name that starts with "TEST" in any case
 * ("TEST", "Test Lead", "test-2", "TEST123") marks a test lead. Names like
 * "Testa" or "Tester" are real surnames and do not count.
 * A TEST-name lead alerts Shaun only, never Justin, skips the homeowner
 * confirmation, and is saved with test = true.
 */
export function isTestName(name: string) {
  return /^\s*test(?![a-z])/i.test(name || "");
}

/** Never text a test lead. There is no SMS send today; this is the guard for one. */
export function shouldTextLead(phone: string, email: string, name = "") {
  return !isTeamTestLead(phone, email, name);
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
  /** False for TEST-name leads: no homeowner confirmation email at all. */
  customerConfirmation: boolean;
};

/**
 * Production: To Justin, CC Shaun (and any other non-Justin addresses in the
 * notify list). Test: To Shaun only, never Justin, no CC.
 */
export function leadNotificationRoute(input: {
  phone: string;
  email: string;
  name?: string;
  notifyList?: string[];
  forceTest?: boolean;
}): LeadNotificationRoute {
  const test = Boolean(input.forceTest) || isTeamTestLead(input.phone, input.email, input.name);
  if (test) {
    return { test: true, to: [SHAUN_CC_EMAIL], cc: [], customerConfirmation: !isTestName(input.name ?? "") };
  }
  const extras = (input.notifyList ?? []).filter(
    (address) => address.trim().toLowerCase() !== JUSTIN_LEAD_EMAIL.toLowerCase(),
  );
  return {
    test: false,
    customerConfirmation: true,
    to: [JUSTIN_LEAD_EMAIL],
    cc: uniqueAddresses([SHAUN_CC_EMAIL, ...extras]),
  };
}

export type CustomerConfirmationRoute = {
  replyTo: string;
  bcc?: string[];
};

/**
 * Homeowner confirmation routing. Replies go to Justin's lead inbox.
 * Shaun is BCC'd unless the homeowner address is already Shaun, so we
 * don't To and BCC the same inbox. Test mode does not change this:
 * nothing is sent To Justin, but replyTo may still be his address.
 */
export function customerConfirmationRoute(customerEmail: string): CustomerConfirmationRoute {
  const customer = customerEmail.trim();
  const bcc =
    customer.toLowerCase() === SHAUN_CC_EMAIL.toLowerCase() ? undefined : [SHAUN_CC_EMAIL];
  return { replyTo: JUSTIN_LEAD_EMAIL, bcc };
}
