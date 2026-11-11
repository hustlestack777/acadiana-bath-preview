import { cn } from "cn";

type LogoProps = {
  className?: string;
  compact?: boolean;
  onDark?: boolean;
};

export function MaisonLogo({ className, compact = false, onDark = false }: LogoProps) {
  const src = compact ? "/brand/mark.png" : onDark ? "/brand/logo-on-dark.png" : "/brand/logo.png";
  const width = compact ? 800 : 2316;
  const height = compact ? 879 : 617;

  return (
    <span className={cn("inline-flex min-w-0 items-center", className)}>
      {/* Decorative; the parent link already names the business. */}
      <img
        src={src}
        alt=""
        width={width}
        height={height}
        className={cn("w-auto max-w-[min(100%,18rem)]", compact ? "h-11" : "h-10 sm:h-12")}
      />
    </span>
  );
}
