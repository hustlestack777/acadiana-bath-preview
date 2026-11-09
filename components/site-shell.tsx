import type { ReactNode } from "react";
import Link from "next/link";
import { ChatWidget } from "@/components/chat-widget";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { brand, hero } from "@/lib/copy";
import { cn } from "cn";

export function SiteShell({
  children,
  sticky = false,
  bleed = false,
}: {
  children: ReactNode;
  sticky?: boolean;
  bleed?: boolean;
}) {
  return (
    <>
      <SiteHeader />
      <div className={cn(!bleed && "pt-24", sticky ? "pb-24 md:pb-0" : undefined)}>
        {children}
        <SiteFooter />
      </div>
      {sticky ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
          <div className="grid grid-cols-2 gap-2">
            <a
              href={brand.phoneHref}
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card text-base font-medium"
            >
              {brand.phone}
            </a>
            <Link
              href="/estimate"
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary text-base font-medium text-primary-foreground"
            >
              {hero.primary}
            </Link>
          </div>
        </div>
      ) : null}
      <ChatWidget raised={sticky} />
    </>
  );
}
