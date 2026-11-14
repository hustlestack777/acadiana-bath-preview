import Link from "next/link";
import { SocialLinks } from "@/components/social-link";
import { BATH_QUOTE_LABEL, BATH_QUOTE_NOTE, PUBLIC_SITE_ORIGIN, WINDOWS_QUOTE_LABEL } from "@/lib/getpros";

/** Two quote doors for the lead-machine host. Windows carries no price. */
export function GetProsHub() {
  return (
    <main id="content" tabIndex={-1} className="mx-auto flex w-full max-w-3xl flex-col justify-center px-5 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">Acadiana Bathrooms and Countertops</p>
      <h1 className="mt-3 font-heading text-[clamp(2.6rem,8vw,4.4rem)] leading-[0.95]">Get a quote</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/design"
          className="flex min-h-36 flex-col justify-center rounded-3xl bg-bronze px-6 py-8 text-bronze-foreground hover:bg-bronze-hover"
        >
          <span className="text-2xl font-semibold">{BATH_QUOTE_LABEL}</span>
          <span className="mt-2 text-sm">{BATH_QUOTE_NOTE}</span>
        </Link>
        <Link
          href="/windows"
          className="flex min-h-36 flex-col justify-center rounded-3xl border border-border bg-card px-6 py-8 text-foreground"
        >
          <span className="text-2xl font-semibold">{WINDOWS_QUOTE_LABEL}</span>
        </Link>
      </div>
      <p className="mt-8 text-sm text-muted-foreground">
        The website is{" "}
        <a href={PUBLIC_SITE_ORIGIN} className="font-semibold underline underline-offset-4">
          abclafayette.com
        </a>
        .
      </p>
      <SocialLinks className="mt-4" itemClassName="border-border text-foreground" />
    </main>
  );
}
