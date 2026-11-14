import { MaisonLogo } from "@/components/logo";
import { DesignLink } from "@/components/design-link";
import { brand, cardClaims, heroDesignCta, services } from "@/lib/copy";
import { SERVICE_AREA } from "@/lib/coverage";
import { ConsultLink } from "@/components/consult-link";
import { WindowsQuoteLine } from "@/components/windows-quote-line";
import { townPath, towns } from "@/lib/towns";

export function SiteFooter() {
  return (
    <footer className="bg-secondary pb-36 text-secondary-foreground md:pb-0">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 pe-36 md:grid-cols-3 md:pe-5">
        <div>
          <MaisonLogo onDark className="text-secondary-foreground" />
          <p className="mt-4 text-sm leading-6 text-fig-muted">
            Custom bathroom remodels, from design to the finished bathroom. {SERVICE_AREA} Start with Design My Bathroom or a free quote.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brass-soft">Call or email</p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <ConsultLink className="underline underline-offset-4">{cardClaims.consult}</ConsultLink>
            <DesignLink className="underline underline-offset-4">{heroDesignCta}</DesignLink>
          </p>
          <p className="mt-3">
            <a href={brand.phoneHref} className="text-base font-medium">
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
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brass-soft">Services</p>
          <p className="mt-3 text-sm leading-6">{services.join(" · ")}</p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <a href="/solid-surface" className="underline underline-offset-4">Solid surface</a>
            <a href="/walk-in-shower-lafayette" className="underline underline-offset-4">Walk-in showers</a>
            <a href="/custom-tile" className="underline underline-offset-4">Custom tile</a>
            <a href="/custom-tile#grout" className="underline underline-offset-4">Grout colors</a>
            <a href="/gallery" className="underline underline-offset-4">Gallery</a>
            <a href="/about" className="underline underline-offset-4">About</a>
            <a href="/faq" className="underline underline-offset-4">FAQ</a>
            <a href="/areas" className="underline underline-offset-4">See every town we serve</a>
            {["lafayette", "youngsville", "broussard", "lake-charles", "baton-rouge", "houma"].map((slug) => {
              const town = towns.find((item) => item.slug === slug);
              if (!town) return null;
              return (
                <a key={town.slug} href={townPath(town.slug)} className="underline underline-offset-4">
                  {town.name}
                </a>
              );
            })}
          </p>
          <p className="mt-4 text-sm leading-6 text-fig-muted">
            {SERVICE_AREA}
          </p>
          <WindowsQuoteLine className="mt-4 text-fig-muted" />
        </div>
      </div>
      <div className="border-t border-white/15 px-5 py-4 pe-36 text-center text-fig-muted md:pe-5">
        <p className="text-xs leading-5">
          {brand.name} ·{" "}
          <a href="/about" className="underline underline-offset-4">
            About
          </a>{" "}
          ·{" "}
          <a href="/privacy" className="underline underline-offset-4">
            Privacy Policy
          </a>
        </p>
        <a
          href="https://lagniapperealmlabs.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block max-w-[17rem] text-fig-muted no-underline sm:max-w-none"
        >
          <span className="block text-[11px] leading-4 tracking-wide">Powered by Lagniappe Realm Labs</span>
          <span className="mt-0.5 block text-[10px] leading-4 text-fig-muted/80">
            Custom sites · Marketing · Design · Leads · Automation
          </span>
        </a>
      </div>
    </footer>
  );
}
