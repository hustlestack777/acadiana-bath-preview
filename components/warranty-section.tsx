import { cn } from "cn";
import {
  warrantyContactAfter,
  warrantyContactBefore,
  warrantyHeading,
  warrantyLinkHref,
  warrantyLinkText,
  warrantyParagraphs,
} from "@/lib/warranty";

export function WarrantyCard({
  className,
  id,
  headingId = "warranty-heading",
}: {
  className?: string;
  id?: string;
  headingId?: string;
}) {
  return (
    <article
      id={id}
      className={cn("rounded-[1.6rem] bg-secondary p-7 text-secondary-foreground md:p-10", className)}
      data-section="warranty"
    >
      <h2 id={headingId} className="font-heading text-3xl leading-tight md:text-4xl">
        {warrantyHeading}
      </h2>
      <div className="mt-6 max-w-3xl space-y-4 leading-7">
        {warrantyParagraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p>
          {warrantyContactBefore}
          <a href={warrantyLinkHref} className="font-medium underline underline-offset-4">
            {warrantyLinkText}
          </a>
          {warrantyContactAfter}
        </p>
      </div>
    </article>
  );
}

export function WarrantySection({
  className,
  id = "warranty",
}: {
  className?: string;
  id?: string;
}) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} className={cn("rise scroll-mt-28", className)} aria-labelledby={headingId}>
      <div className="mx-auto w-full max-w-6xl px-5 py-8 md:py-12">
        <WarrantyCard headingId={headingId} />
      </div>
    </section>
  );
}
