import { MaisonLogo } from "@/components/logo";
import { brand, cardClaims, services } from "@/lib/copy";
import { SERVICE_AREA } from "@/lib/coverage";
import { ConsultLink } from "@/components/consult-link";

export function SiteFooter() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 md:grid-cols-3">
        <div>
          <MaisonLogo onDark className="text-secondary-foreground" />
          <p className="mt-4 text-sm leading-6 text-fig-muted">
            Bathroom remodels. {SERVICE_AREA} Call or email to talk about your project.
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
            {cardClaims.consult}
          </p>
          <ConsultLink className="mt-4 inline-block text-sm underline underline-offset-4">
            Free Consult
          </ConsultLink>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brass-soft">Services</p>
          <p className="mt-3 text-sm leading-6">{services.join(" · ")}</p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <a href="/solid-surface" className="underline underline-offset-4">Solid surface</a>
            <a href="/custom-tile" className="underline underline-offset-4">Custom tile</a>
            <a href="/custom-tile#grout" className="underline underline-offset-4">Grout colors</a>
            <a href="/faq" className="underline underline-offset-4">FAQ</a>
            <a href="/serving-lake-charles" className="underline underline-offset-4">Lake Charles</a>
            <a href="/serving-baton-rouge" className="underline underline-offset-4">Baton Rouge</a>
            <a href="/serving-houma" className="underline underline-offset-4">Houma</a>
          </p>
          <p className="mt-4 text-sm leading-6 text-fig-muted">
            {SERVICE_AREA}
          </p>
        </div>
      </div>
      <p className="border-t border-white/15 px-5 py-4 text-center text-xs leading-5 text-fig-muted">
        {brand.name} ·{" "}
        <a href="/privacy" className="underline underline-offset-4">
          Privacy Policy
        </a>
      </p>
    </footer>
  );
}
