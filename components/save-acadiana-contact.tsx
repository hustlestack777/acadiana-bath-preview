import { cn } from "cn";

const HINT = "Save the Acadiana Bathrooms and Countertops number so you know it's us when we call.";
const LABEL = "Save Acadiana Bathrooms and Countertops";

export function SaveAcadianaContact({
  className,
  buttonClassName,
  hideHint = false,
}: {
  className?: string;
  buttonClassName?: string;
  hideHint?: boolean;
}) {
  return (
    <div className={cn("grid gap-2", className)}>
      {hideHint ? null : <p className="text-sm leading-6 text-muted-foreground">{HINT}</p>}
      <a
        href="/contact.vcf"
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
