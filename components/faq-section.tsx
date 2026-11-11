import { JsonLd } from "@/components/json-ld";
import { faqPageJsonLd, type FaqItem } from "@/lib/schema";
import { cn } from "cn";

/**
 * Visible FAQ plus FAQPage JSON-LD. Use this for home, service or town pages.
 * Schema is emitted only when at least one visible question is passed in.
 */
export function FaqSection({
  faqs,
  heading = "Questions",
  id = "questions",
  className,
}: {
  faqs: readonly FaqItem[];
  heading?: string;
  id?: string;
  className?: string;
}) {
  if (!faqs.length) return null;

  return (
    <section id={id} className={cn("rise scroll-mt-28 bg-brass-soft", className)} aria-labelledby={`${id}-heading`}>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <div className="mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
        <h2 id={`${id}-heading`} className="text-4xl md:text-5xl">
          {heading}
        </h2>
        <div className="mt-8 divide-y divide-foreground/15">
          {faqs.map((item) => (
            <details key={item.q} className="group py-1">
              <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-3 text-lg font-medium">
                {item.q}
                <span className="text-2xl leading-none group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="max-w-3xl pb-4 leading-7">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
