import type { ReactNode } from "react";
import { ChatWidget } from "@/components/chat-widget";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cn } from "cn";
import { StickyCtaBar } from "@/components/sticky-cta-bar";
import { HashScroll } from "@/components/hash-scroll";

export function SiteShell({
  children,
  sticky = false,
  bleed = false,
  chat = true,
  formPage = false,
}: {
  children: ReactNode;
  sticky?: boolean;
  bleed?: boolean;
  chat?: boolean;
  /** False on form pages: Gigi only shows on wide screens beside the form, so she never covers fields or buttons. */
  formPage?: boolean;
}) {
  return (
    <>
      <HashScroll />
      <SiteHeader />
      <div
        className={cn(
          !bleed && "pt-24",
          sticky && chat && "pb-40 md:pb-24",
          sticky && !chat && "pb-28 md:pb-0",
          !sticky && chat && "pb-24 md:pb-24",
          chat && !formPage && !bleed && "max-md:[--chat-gutter:8rem] max-md:[&_main]:pe-[var(--chat-gutter)]",
        )}
      >
        {children}
        <SiteFooter />
      </div>
      {sticky ? <StickyCtaBar /> : null}
      {chat ? <ChatWidget raised={sticky} formPage={formPage} /> : null}
    </>
  );
}
