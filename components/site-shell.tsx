import type { ReactNode } from "react";
import { ChatWidget } from "@/components/chat-widget";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cn } from "cn";
import { StickyCtaBar } from "@/components/sticky-cta-bar";

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
      <div
        className={cn(
          !bleed && "pt-24",
          sticky && chat && "pb-40 md:pb-24",
          sticky && !chat && "pb-28 md:pb-0",
          !sticky && chat && "pb-24 md:pb-24",
          chat && !bleed && "max-md:[&_main]:pe-32",
        )}
      >
        {children}
        <SiteFooter />
      </div>
      {sticky ? <StickyCtaBar /> : null}
      {chat ? <ChatWidget raised={sticky} /> : null}
    </>
  );
}
