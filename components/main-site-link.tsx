import { PUBLIC_SITE_ORIGIN } from "@/lib/getpros";

/** Shown on every lead-machine page so visitors can reach the real website. */
export function MainSiteLink() {
  return (
    <p className="fixed inset-x-0 top-0 z-50 flex h-10 items-center justify-center bg-foreground px-4 text-center text-sm text-background">
      <a href={PUBLIC_SITE_ORIGIN} className="font-semibold underline underline-offset-4">
        abclafayette.com
      </a>
    </p>
  );
}
