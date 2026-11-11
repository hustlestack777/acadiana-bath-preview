import type { ReactNode } from "react";
import Link from "next/link";
import { ChatWidget } from "@/components/chat-widget";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { brand, hero, heroDesignCta } from "@/lib/copy";
import { cn } from "cn";
import { ConsultLink } from "@/components/consult-link";

export function SiteShell({
  children,
  sticky = false,
  bleed = false,
  chat = true,
}: {
  children: ReactNode;
  sticky?: boolean;
  bleed?: boolean;
  chat?: boolean;
}) {
  return (
    <>
      <SiteHeader />
      <div className={cn(!bleed && "pt-24", sticky && chat && "pb-40 md:pb-24", sticky && !chat && "pb-28 md:pb-0", !sticky && chat && "pb-24 md:pb-24")}>
        {children}
        <SiteFooter />
      </div>
      {sticky ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
          <div className="grid grid-cols-2 gap-2">
            <ConsultLink className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-3 text-center text-sm font-semibold text-primary-foreground">
              {hero.primary}
            </ConsultLink>
            <Link
              href="/design"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-3 text-center text-sm font-semibold"
            >
              {heroDesignCta}
            </Link>
          </div>
          <a href={brand.phoneHref} className="mt-1.5 block text-center text-xs font-semibold tracking-wide">
            {brand.phone}
          </a>
        </div>
      ) : null}
      {chat ? <ChatWidget raised={sticky} /> : null}
    </>
  );
}
