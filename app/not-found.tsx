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
          That page wandered off. Let&apos;s get you back to something stylish.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/design" className={cn(buttonVariants({ variant: "default" }), "h-12 rounded-xl px-5 text-base")}>
            Design My Bathroom
          </Link>
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "h-12 rounded-xl px-5 text-base")}>
            Back to the homepage
          </Link>
        </div>
      </main>
    </SiteShell>
  );
}
