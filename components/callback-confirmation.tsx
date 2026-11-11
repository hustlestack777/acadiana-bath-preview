import { SaveJustinContact } from "@/components/save-justin-contact";
import { callbackThanksText } from "@/lib/call-window";
import { type ReactNode } from "react";
import { cn } from "cn";

const PHONE = "(337) 522-0023";
const TEL = "tel:+13375220023";

export function CallbackConfirmation({
  name,
  day,
  time,
  as: Heading = "h1",
  headingId,
  className,
  headingClassName,
  buttonClassName,
  children,
}: {
  name: string;
  day: string;
  time: string;
  as?: "h1" | "h2" | "h3";
  headingId?: string;
  className?: string;
  headingClassName?: string;
  buttonClassName?: string;
  children?: ReactNode;
}) {
  const parts = callbackThanksText(name, day, time);
  const [before, after] = parts.body.split(PHONE);
  return (
    <div className={cn("grid gap-4", className)}>
      <Heading
        id={headingId}
        tabIndex={-1}
        data-step-heading
        className={headingClassName ?? "font-heading text-[clamp(2rem,6vw,3.2rem)] leading-[1.02] outline-none"}
      >
        {parts.heading}
      </Heading>
      <p className="text-lg leading-8">
        {before}
        <a href={TEL} className="whitespace-nowrap font-semibold underline underline-offset-4">
          {PHONE}
        </a>
        {after}
      </p>
      <SaveJustinContact hideHint buttonClassName={buttonClassName} />
      <p className="text-base leading-7 text-muted-foreground">{parts.after}</p>
      {children}
    </div>
  );
}
