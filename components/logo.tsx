import { cn } from "cn";

type LogoProps = {
  className?: string;
  compact?: boolean;
  onDark?: boolean;
};

export function MaisonLogo({ className, compact = false, onDark = false }: LogoProps) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2 sm:gap-2.5", className)}>
      {/* Decorative; the parent link already names the business. */}
      <img
        src="/brand/mark.png"
        alt=""
        width={800}
        height={879}
        className={cn("w-auto shrink-0", compact ? "h-9 sm:h-10" : "h-11 sm:h-[3.25rem]")}
      />
      <span className="flex min-w-0 flex-col items-start justify-center leading-none">
        <span
          className={cn(
            "font-heading font-semibold tracking-[0.06em]",
            compact ? "text-[1.45rem] sm:text-[1.65rem]" : "text-[1.7rem] sm:text-[1.95rem]",
            onDark ? "text-[#f6f1e6] [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]" : "text-[#14261f]",
          )}
        >
          ACADIANA
        </span>
        <span
          className={cn(
            "mt-1 font-sans font-semibold",
            compact ? "text-[0.78rem] leading-none sm:text-[0.82rem]" : "text-[0.84rem] leading-none sm:text-[0.92rem]",
            onDark ? "text-[#e4d8b4] [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]" : "text-[#6b5a2a]",
          )}
        >
          Bathrooms & Countertops
        </span>
      </span>
    </span>
  );
}
