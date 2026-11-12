import { cn } from "cn";

/** Small corner pill for AI / inspiration stills that are not finished jobs. */
export function DesignIdeaTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "design-idea-tag pointer-events-none absolute z-10 rounded-full border border-white/25 bg-[#14261f]/80 px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#f6f1e6] shadow-sm backdrop-blur-[2px]",
        className,
      )}
    >
      Design idea
    </span>
  );
}
