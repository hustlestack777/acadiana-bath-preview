"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { rememberFromPage } from "@/components/lead-attribution";

/** Every Free Consult button goes here. On /estimate it scrolls to the form instead of reloading. */
export const CONSULT_HREF = "/estimate#start";
export const OPEN_FORM_EVENT = "ab:open-form";

export function ConsultLink({ onClick, ...props }: Omit<ComponentProps<typeof Link>, "href">) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      href={CONSULT_HREF}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        rememberFromPage(pathname);
        onClick?.(event);
        if (pathname === "/estimate") {
          event.preventDefault();
          if (window.location.hash !== "#start") window.history.replaceState(null, "", CONSULT_HREF);
          window.dispatchEvent(new Event(OPEN_FORM_EVENT));
        }
      }}
    />
  );
}
