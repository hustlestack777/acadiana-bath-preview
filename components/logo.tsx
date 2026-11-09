import { cn } from "cn";

export function MaisonLogo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-3", className)}>
      <svg viewBox="0 0 72 72" className="size-11 shrink-0" aria-hidden="true">
        <rect width="72" height="72" rx="8" fill="#F6E4D6" />
        <path d="M12 60V32a24 24 0 0 1 48 0v28" fill="none" stroke="#C46A4A" strokeWidth="12" />
        <path d="M24 60V36a12 12 0 0 1 24 0v24" fill="none" stroke="#8C4030" strokeWidth="7" />
        <path d="M12 40h48M12 50h48M24 28v32M36 20v40M48 28v32" stroke="#F6E4D6" strokeWidth="1.4" />
      </svg>
      <span className="min-w-0">
        <span className="block font-heading text-xl leading-none">Acadiana</span>
        {compact ? null : (
          <span className="mt-1 block text-[10px] font-semibold tracking-[0.16em] uppercase opacity-80">
            Bathrooms & Countertops
          </span>
        )}
      </span>
    </span>
  );
}
