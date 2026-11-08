import Link from "next/link";
import { brand } from "@/lib/copy";
import { ALSO_PLANNED, CORRIDOR } from "@/lib/coverage";

export function SiteFooter() {
  return (
    <footer className="bg-hero text-hero-foreground">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 md:grid-cols-3">
        <div>
          <p className="font-heading text-2xl">{brand.name}</p>
          <p className="mt-3 text-sm leading-6 text-hero-muted">
            Bathroom remodeling with Onyx Collection showers. Product statements on this site come from
            manufacturer materials and are separate from installation.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brass-soft">Contact placeholders</p>
          <p className="mt-3">{brand.phone}</p>
          <p>{brand.email}</p>
          <Link href="/estimate" className="mt-4 inline-block text-sm underline underline-offset-4">
            Request My Project Review
          </Link>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brass-soft">Planned towns</p>
          <p className="mt-3 text-sm leading-6 text-hero-muted">
            {[...CORRIDOR, ...ALSO_PLANNED].join(", ")}. Prairieville and Gonzales are not included. Not an office
            in each town.
          </p>
        </div>
      </div>
      <p className="border-t border-hero-muted/20 px-5 py-4 text-center text-xs text-hero-muted">
        Prototype only. Nothing submitted here is stored. No labor coverage is promised.
      </p>
    </footer>
  );
}
