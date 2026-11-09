import type { ReactNode } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ChatWidget } from "@/components/chat-widget";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { brand, hero } from "@/lib/copy";
import { cn } from "cn";

export function SiteShell({
  children,
  sticky = false,
}: {
  children: ReactNode;
  sticky?: boolean;
}) {
  return (
    <>
      <SiteHeader overlay={sticky} />
      <div className={sticky ? "pb-24 md:pb-0" : "pb-16 md:pb-0"}>
        {children}
        <SiteFooter />
      </div>
      {sticky ? (
        <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
          <a
            href={brand.phoneHref}
            aria-label={`Call ${brand.phone}`}
            className={cn(buttonVariants({ variant: "outline" }), "h-12 rounded-full text-base")}
          >
            Call
          </a>
          <Link
            href="/estimate"
            className={cn(buttonVariants({ variant: "default" }), "h-12 rounded-full text-base")}
          >
            {hero.primary}
          </Link>
        </div>
      ) : null}
      <ChatWidget raised={sticky} />
    </>
  );
}
