"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

export function WindowsQuoteLine({ className }: { className?: string }) {
  const pathname = usePathname();
  if (pathname === "/windows") return null;

  return (
    <p className={cn("text-sm leading-6", className)}>
      Need windows too?{" "}
      <Link href="/windows" className="underline underline-offset-4">
        Get a window quote
      </Link>
    </p>
  );
}
