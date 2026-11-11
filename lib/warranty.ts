/** Approved Onyx warranty copy (Shaun, Nov 11, 2026). Use verbatim. */

export const warrantyHeading =
  "The Onyx Collection “Yes, Guaranteed Forever”";

export const warrantyParagraphs = [
  "We install The Onyx Collection shower panels, bases, and accessories. Those Onyx-manufactured products are covered by The Onyx Collection’s own manufacturer guarantee, officially named “Yes, Guaranteed Forever.”",
  "In The Onyx Collection’s words: “If our product ever fails, we will either provide you with a new item or refund the cost.”",
  "This guarantee applies only to Onyx-manufactured products we install. It does not cover tile, grout, caulk, or our installation work.",
  "We stand behind our work, and we will make issues right.",
] as const;

export const warrantyContactBefore =
  "Questions about an Onyx-manufactured product can also go to The Onyx Collection at 1-800-ONYXTOP (1-800-669-9867), or see their guarantee page at ";

export const warrantyLinkText = "onyxcollection.com/guarantee";

export const warrantyLinkHref = "https://onyxcollection.com/guarantee/";

export const warrantyContactAfter = ".";

export const warrantyContactPlain =
  `${warrantyContactBefore}${warrantyLinkText}${warrantyContactAfter}`;

/** Full section as plain text, for schema, llms.txt, and chat. */
export const warrantyPlainText = [warrantyHeading, ...warrantyParagraphs, warrantyContactPlain].join(" ");

export const warrantyStandBehind = warrantyParagraphs[3];
