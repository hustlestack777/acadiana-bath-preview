import type { ReactNode } from "react";
import { brand } from "@/lib/copy";

const PHONE = "(337) 522-0023";

/** Keep the visible wording, but turn phone, Design My Bathroom, and the quote form into links. */
export function LinkedCopy({ text, className }: { text: string; className?: string }) {
  const nodes: ReactNode[] = [];
  const pattern = /(\(337\) 522-0023|Design My Bathroom|quote form)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    if (token === PHONE) {
      nodes.push(
        <a key={key} className="font-medium underline underline-offset-4" href={brand.phoneHref}>
          {PHONE}
        </a>,
      );
    } else if (token === "Design My Bathroom") {
      nodes.push(
        <a key={key} className="font-medium underline underline-offset-4" href="/design">
          Design My Bathroom
        </a>,
      );
    } else {
      nodes.push(
        <a key={key} className="font-medium underline underline-offset-4" href="/estimate">
          quote form
        </a>,
      );
    }
    key += 1;
    last = match.index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <p className={className}>{nodes}</p>;
}
