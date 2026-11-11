import Link from "next/link";
import { designCopy } from "@/lib/design-styles";

/** "Design My Bathroom" link for the dark photo heroes. */
export function DesignCta({ testId = "design-cta" }: { testId?: string }) {
  return (
    <Link
      href="/design"
      data-testid={testId}
      className="hero-copy mt-4 inline-flex max-w-xl flex-col rounded-2xl border border-white/60 bg-white/10 px-5 py-3 text-left text-white backdrop-blur-sm hover:bg-white/20"
    >
      <span className="text-base font-semibold">✨ {designCopy.cta}</span>
      <span className="text-sm text-white/85">{designCopy.headline}</span>
    </Link>
  );
}
