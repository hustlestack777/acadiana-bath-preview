import assert from "node:assert/strict";
import { test } from "node:test";
import { buildCustomerConfirmation } from "./customer-email";
import {
  JUSTIN_LEAD_EMAIL,
  SHAUN_CC_EMAIL,
  is555TestPhone,
  isTeamTestLead,
  isTestInboxEmail,
  leadNotificationRoute,
  shouldTextLead,
  withTestSubject,
} from "./lead-notify";

const notifyList = [
  JUSTIN_LEAD_EMAIL,
  SHAUN_CC_EMAIL,
  "shaun@lagniapperealmlabs.com",
];

test("555 exchange numbers and Grok Bot inboxes are team test leads", () => {
  assert.equal(is555TestPhone("337-555-0142"), true);
  assert.equal(is555TestPhone("(337) 555-0001"), true);
  assert.equal(is555TestPhone("+1 337 555 9999"), true);
  assert.equal(is555TestPhone("337-522-0023"), false);
  assert.equal(is555TestPhone("555-1212"), false);

  assert.equal(isTestInboxEmail("shaun-sqmdjh@mail.grokbot.com"), true);
  assert.equal(isTestInboxEmail("qa@grokbot.com"), true);
  assert.equal(isTestInboxEmail("someone@sub.mail.grokbot.com"), true);
  assert.equal(isTestInboxEmail("jane@gmail.com"), false);

  assert.equal(isTeamTestLead("337-555-0142", "jane@gmail.com"), true);
  assert.equal(isTeamTestLead("337-522-0023", "qa@mail.grokbot.com"), true);
  assert.equal(isTeamTestLead("337-522-0023", "jane@gmail.com"), false);
  assert.equal(shouldTextLead("337-555-0142", "jane@gmail.com"), false);
  assert.equal(shouldTextLead("337-522-0023", "jane@gmail.com"), true);
});

test("real leads go To Justin and CC Shaun; test leads go to Shaun only", () => {
  const real = leadNotificationRoute({
    phone: "337-522-0023",
    email: "jane@gmail.com",
    notifyList,
  });
  assert.equal(real.test, false);
  assert.deepEqual(real.to, [JUSTIN_LEAD_EMAIL]);
  assert.deepEqual(real.cc, [SHAUN_CC_EMAIL, "shaun@lagniapperealmlabs.com"]);

  const byPhone = leadNotificationRoute({
    phone: "337-555-0100",
    email: "jane@gmail.com",
    notifyList,
  });
  assert.equal(byPhone.test, true);
  assert.deepEqual(byPhone.to, [SHAUN_CC_EMAIL]);
  assert.deepEqual(byPhone.cc, []);
  assert.equal(byPhone.to.includes(JUSTIN_LEAD_EMAIL), false);

  const byEmail = leadNotificationRoute({
    phone: "337-405-9945",
    email: "shaun-sqmdjh@mail.grokbot.com",
    notifyList,
  });
  assert.equal(byEmail.test, true);
  assert.deepEqual(byEmail.to, [SHAUN_CC_EMAIL]);
  assert.deepEqual(byEmail.cc, []);
});

test("test subjects get a single [TEST] prefix", () => {
  assert.equal(withTestSubject("New consult · Ada · Lafayette", true), "TEST – New consult · Ada · Lafayette");
  assert.equal(withTestSubject("TEST – New consult · Ada · Lafayette", true), "TEST – New consult · Ada · Lafayette");
  assert.equal(withTestSubject("[TEST v2] New consult · Ada · Lafayette", true), "TEST – New consult · Ada · Lafayette");
  assert.equal(withTestSubject("New consult · Ada · Lafayette", false), "New consult · Ada · Lafayette");
});

test("the customer confirmation is short, signed, and has no banned claims", () => {
  const now = new Date("2026-11-11T13:00:00Z"); // 7 AM CT Wednesday
  const email = buildCustomerConfirmation({
    name: "Adam Bomb",
    sourcePage: "/estimate",
    preferredCallDay: "weekday",
    preferredCallTime: "morning",
    now,
    test: true,
  });
  assert.equal(email.subject, "TEST – Justin will call you Wednesday, Nov 11 between 9 AM and 10 AM CT");
  assert.match(email.text, /Hi Adam,/);
  assert.match(email.text, /Thanks for reaching out to Acadiana Bathrooms\./);
  assert.match(email.text, /Justin, the owner, will call you Wednesday, Nov 11 between 9 AM and 10 AM CT to discuss your project\./);
  assert.match(email.text, /Save his number so you'll know it's him: \(337\) 522-0023\./);
  assert.match(email.text, /You can call or text him there anytime\./);
  assert.match(email.text, /Save Justin's Contact: https:\/\/abclafayette\.com\/justin\.vcf/);
  assert.match(email.text, /What happens next: Justin calls to discuss your project\. Then he sets a time to take measurements, walk you through materials and design options, and give you your exact price at that visit\./);
  assert.match(email.text, /Talk soon,\nAcadiana Bathrooms · abclafayette\.com/);
  assert.match(email.html, /Save Justin(?:&#39;|')s Contact/);
  assert.match(email.html, /href="https:\/\/abclafayette\.com\/justin\.vcf"/);
  assert.match(email.html, /tel:\+13375220023/);
  assert.equal(email.attachments.some((item) => item.filename === "justin-acadiana-bathrooms.vcf" && item.contentType === "text/vcard"), true);
  const blob = `${email.subject}\n${email.text}\n${email.html}`.toLowerCase();
  for (const banned of ["deposit", "licensed", "insured", "onyx", "pella", "within 24", "tomorrow", "same day"]) {
    assert.equal(blob.includes(banned), false, banned);
  }

  const design = buildCustomerConfirmation({
    name: "Nasty Nick",
    sourcePage: "/design",
    preferredCallDay: "weekday",
    preferredCallTime: "afternoon",
    now,
    test: true,
    photos: [
      { filename: "before.jpg", contentType: "image/jpeg", bytes: Buffer.from("aaaa") },
      { filename: "after.jpg", contentType: "image/jpeg", bytes: Buffer.from("bbbb") },
    ],
  });
  assert.equal(design.subject, "TEST – Justin will call you Wednesday, Nov 11 between 2 PM and 3 PM CT");
  assert.match(design.html, /cid:design-before/);
  assert.match(design.html, /cid:design-after/);
  assert.match(design.html, /Your bathroom/);
  assert.match(design.html, /Design preview/);
  assert.equal(design.attachments.length, 3);
  assert.equal(design.attachments[2]?.filename, "justin-acadiana-bathrooms.vcf");
});

