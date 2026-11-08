import type { ReactNode } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ChatWidget } from "@/components/chat-widget";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { hero } from "@/lib/copy";
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
      <SiteHeader />
      <div className={sticky ? "pb-24 md:pb-0" : "pb-16 md:pb-0"}>
        {children}
        <SiteFooter />
      </div>
      {sticky ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card p-3 md:hidden">
          <Link
            href="/estimate"
            className={cn(buttonVariants({ variant: "default" }), "h-12 w-full rounded-xl text-base")}
          >
            {hero.primary}
          </Link>
        </div>
      ) : null}
      <ChatWidget raised={sticky} />
    </>
  );
}
