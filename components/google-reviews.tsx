import { GOOGLE_REVIEWS, GOOGLE_REVIEWS_READ_URL, GOOGLE_WRITE_REVIEW_URL } from "@/lib/site";

function Star() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 text-brass" fill="currentColor">
      <path d="M10 1.6 12.3 7l5.7.5-4.3 3.7 1.3 5.5L10 13.8 4.9 16.7 6.2 11.2 1.9 7.5 7.7 7 10 1.6z" />
    </svg>
  );
}

/** Verified Google summary only. No review quotes, names, or extra counts. */
export function GoogleReviews() {
  const count: number = GOOGLE_REVIEWS.count;
  const countLabel = count === 1 ? "review" : "reviews";
  return (
    <section id="google-reviews" aria-labelledby="google-reviews-heading" className="bg-band" data-testid="google-reviews">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-4 px-5 py-8">
        <div className="min-w-0">
          <h2 id="google-reviews-heading" className="accent-rule text-xs font-semibold uppercase tracking-[0.22em] text-brass">
            Google reviews
          </h2>
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-base leading-6">
            <span className="inline-flex gap-0.5" aria-hidden="true">
              {Array.from({ length: GOOGLE_REVIEWS.rating }, (_, index) => (
                <Star key={index} />
              ))}
            </span>
            <span>{GOOGLE_REVIEWS.rating}-star rating on Google</span>
            <span>
              {count} {countLabel}
            </span>
          </p>
        </div>
        <div className="flex max-w-full flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <a
            href={GOOGLE_REVIEWS_READ_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium underline underline-offset-4"
            data-testid="google-reviews-read"
          >
            Read our reviews on Google
          </a>
          <a
            href={GOOGLE_WRITE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-full bg-bronze px-5 text-sm font-medium text-bronze-foreground hover:bg-bronze-hover"
            data-testid="google-reviews-write"
          >
            Leave us a review
          </a>
        </div>
      </div>
    </section>
  );
}
