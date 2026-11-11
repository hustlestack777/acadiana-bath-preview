"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { designHref, pathHrefForLook, persistStartingLook, type StartingLook } from "@/lib/starting-looks";

type LookLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  look: StartingLook;
  dest?: "path" | "design";
};

/** A look card that stores the pick and carries it to the path page or Design My Bathroom. */
export function LookLink({ look, dest = "path", onClick, ...props }: LookLinkProps) {
  const href = dest === "design" ? designHref(look.id) : pathHrefForLook(look);
  return (
    <Link
      {...props}
      href={href}
      data-look-id={look.id}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        persistStartingLook(look.id);
        onClick?.(event);
      }}
    />
  );
}
