import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <SiteShell>
      <main id="content" className="mx-auto w-full max-w-3xl px-5 py-20">
        <h1 className="text-4xl">That page is not on this site.</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The homepage and the project review are the two pages in this prototype.
        </p>
        <Link href="/" className={cn(buttonVariants({ variant: "default" }), "mt-6 h-12 rounded-xl px-5 text-base")}>
          Back to the homepage
        </Link>
      </main>
    </SiteShell>
  );
}
