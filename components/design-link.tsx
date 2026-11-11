"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { designHref, findStartingLook, persistStartingLook, readStartingLook } from "@/lib/starting-looks";

type DesignLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  look?: string;
};

function lookFromPage(lookProp?: string) {
  const fromUrl = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("look") || "" : "";
  return findStartingLook(lookProp || fromUrl || readStartingLook())?.id ?? "";
}

/** Design My Bathroom link that keeps a chosen starting look in the URL and in sessionStorage. */
export function DesignLink({ look: lookProp, onClick, ...props }: DesignLinkProps) {
  const router = useRouter();
  const href = designHref(lookProp);

  return (
    <Link
      {...props}
      href={href}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        const lookId = lookFromPage(lookProp);
        if (lookId) persistStartingLook(lookId);
        onClick?.(event);
        const next = designHref(lookId);
        if (next !== href && !event.defaultPrevented) {
          event.preventDefault();
          router.push(next);
        }
      }}
    />
  );
}
