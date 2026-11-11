import { JsonLd } from "@/components/json-ld";
import { faqPageJsonLd, type FaqItem } from "@/lib/schema";
import { cn } from "cn";

function renderAnswer(item: FaqItem) {
  const link = item.link;
  if (!link) return item.a;
  const at = item.a.indexOf(link.text);
  if (at < 0) return item.a;
  return (
    <>
      {item.a.slice(0, at)}
      <a href={link.href} className="font-medium underline underline-offset-4">
        {link.text}
      </a>
      {item.a.slice(at + link.text.length)}
    </>
  );
}

/**
 * Visible FAQ plus FAQPage JSON-LD. Use this for home, service or town pages.
 * Schema is emitted only when at least one visible question is passed in.
 */
function FaqList({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="mt-8 divide-y divide-foreground/15">
      {items.map((item) => (
        <details key={item.q} className="group py-1">
          <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-3 text-lg font-medium">
            {item.q}
            <span className="text-2xl leading-none group-open:rotate-45" aria-hidden="true">
              +
            </span>
          </summary>
          <p className="max-w-3xl pb-4 leading-7">{renderAnswer(item)}</p>
        </details>
      ))}
    </div>
  );
}

export function FaqSection({
  faqs,
  moreFaqs,
  moreHeading = "More questions",
  heading = "Questions",
  id = "questions",
  className,
  moreHref,
  moreLabel = "See all questions",
}: {
  faqs: readonly FaqItem[];
  moreFaqs?: readonly FaqItem[];
  moreHeading?: string;
  heading?: string;
  id?: string;
  className?: string;
  moreHref?: string;
  moreLabel?: string;
}) {
  if (!faqs.length) return null;
  const schemaItems = moreFaqs?.length ? [...faqs, ...moreFaqs] : [...faqs];

  return (
    <section id={id} className={cn("rise scroll-mt-28 bg-brass-soft", className)} aria-labelledby={`${id}-heading`}>
      <JsonLd data={faqPageJsonLd(schemaItems)} />
      <div className="mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
        <h2 id={`${id}-heading`} className="text-4xl md:text-5xl">
          {heading}
        </h2>
        <FaqList items={faqs} />
        {moreFaqs?.length ? (
          <details className="group mt-10 rounded-[1.4rem] border border-foreground/15 bg-background/40 px-5 py-3">
            <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 text-lg font-medium">
              {moreHeading}
              <span className="text-2xl leading-none group-open:rotate-45" aria-hidden="true">
                +
              </span>
            </summary>
            <FaqList items={moreFaqs} />
          </details>
        ) : null}
        {moreHref ? (
          <p className="mt-8">
            <a href={moreHref} className="font-medium underline underline-offset-4">
              {moreLabel}
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
