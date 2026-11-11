import { cn } from "cn";

const HINT = "Save Justin's number so you know it's him when he calls.";
const LABEL = "Save Justin's Contact";

export function SaveJustinContact({
  className,
  buttonClassName,
}: {
  className?: string;
  buttonClassName?: string;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      <p className="text-sm leading-6 text-muted-foreground">{HINT}</p>
      <a
        href="/justin.vcf"
        download="justin-acadiana-bathrooms.vcf"
        className={
          buttonClassName ??
          "inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-6 text-base font-semibold"
        }
      >
        {LABEL}
      </a>
    </div>
  );
}
