import { MaisonLogo } from "@/components/logo";
import { brand, cardClaims, services } from "@/lib/copy";
import { ALSO_PLANNED, CORRIDOR } from "@/lib/coverage";
import { ConsultLink } from "@/components/consult-link";

export function SiteFooter() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 md:grid-cols-3">
        <div>
          <MaisonLogo onDark className="text-secondary-foreground" />
          <p className="mt-4 text-sm leading-6 text-fig-muted">
            Bathroom remodels in Lafayette and the planned service area. Call or email to talk about your project.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brass-soft">Visit, call, or email</p>
          <p className="mt-3">
            <a href={brand.phoneHref} className="text-lg font-medium">
              {brand.phone}
            </a>
          </p>
          <p className="mt-1">
            <a href={brand.emailHref} className="underline underline-offset-4">
              {brand.email}
            </a>
          </p>
          <p className="mt-1">
            <a href={brand.websiteHref} className="underline underline-offset-4">
              {brand.website}
            </a>
          </p>
          <p className="mt-3 text-sm">
            {cardClaims.consult}. {cardClaims.lifetime}
          </p>
          <ConsultLink className="mt-4 inline-block text-sm underline underline-offset-4">
            Free Consult
          </ConsultLink>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brass-soft">Services</p>
          <p className="mt-3 text-sm leading-6">{services.join(" · ")}</p>
          <p className="mt-4 text-sm leading-6 text-fig-muted">
            {[...CORRIDOR, ...ALSO_PLANNED].join(", ")}. Prairieville and Gonzales are not included. Not an office in
            each town.
          </p>
        </div>
      </div>
      <p className="border-t border-white/15 px-5 py-4 text-center text-xs leading-5 text-fig-muted">
        {brand.name}. {cardClaims.lifetime}
      </p>
    </footer>
  );
}
