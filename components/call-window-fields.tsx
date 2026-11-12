"use client";

import { CALL_DAYS, CALL_TIMES, type CallDayId, type CallTimeId } from "@/lib/call-window";
import { cn } from "cn";

type CallWindowFieldsProps = {
  day: string;
  time: string;
  onDay: (value: CallDayId) => void;
  onTime: (value: CallTimeId) => void;
  dayError?: string;
  timeError?: string;
  idPrefix?: string;
};

export function CallWindowFields({
  day,
  time,
  onDay,
  onTime,
  dayError,
  timeError,
  idPrefix = "call",
}: CallWindowFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <p className="sm:col-span-2 text-sm text-muted-foreground">
        Required — pick a day and a time so we can call you.
      </p>
      <fieldset id={`${idPrefix}-day`} className={cn("grid scroll-mt-24 gap-2 rounded-xl outline-none", dayError && "ring-1 ring-destructive p-2")} tabIndex={-1} aria-required="true">
        <legend className="text-sm font-medium">Best day <span className="font-normal text-muted-foreground">(required)</span></legend>
        <div className="grid gap-2">
          {CALL_DAYS.map((item) => {
            const id = `${idPrefix}-day-${item.id}`;
            const on = day === item.id;
            return (
              <label
                key={item.id}
                htmlFor={id}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-xl border px-3 text-sm",
                  on ? "border-primary bg-tint-clay/40" : "border-border bg-card",
                )}
              >
                <input
                  id={id}
                  type="radio"
                  name={`${idPrefix}-day`}
                  value={item.id}
                  checked={on}
                  onChange={() => onDay(item.id)}
                  required
                  className="size-4 accent-[var(--primary)]"
                />
                {item.label}
              </label>
            );
          })}
        </div>
        {dayError ? <p className="text-sm text-destructive" role="alert">{dayError}</p> : null}
      </fieldset>
      <fieldset id={`${idPrefix}-time`} className={cn("grid scroll-mt-24 gap-2 rounded-xl outline-none", timeError && "ring-1 ring-destructive p-2")} tabIndex={-1} aria-required="true">
        <legend className="text-sm font-medium">Best time to call <span className="font-normal text-muted-foreground">(required)</span></legend>
        <div className="grid gap-2">
          {CALL_TIMES.map((item) => {
            const id = `${idPrefix}-time-${item.id}`;
            const on = time === item.id;
            return (
              <label
                key={item.id}
                htmlFor={id}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-xl border px-3 text-sm",
                  on ? "border-primary bg-tint-clay/40" : "border-border bg-card",
                )}
              >
                <input
                  id={id}
                  type="radio"
                  name={`${idPrefix}-time`}
                  value={item.id}
                  checked={on}
                  onChange={() => onTime(item.id)}
                  required
                  className="size-4 accent-[var(--primary)]"
                />
                <span>
                  {item.label}
                  <span className="block text-xs text-muted-foreground">{item.hint}</span>
                </span>
              </label>
            );
          })}
        </div>
        {timeError ? <p className="text-sm text-destructive" role="alert">{timeError}</p> : null}
      </fieldset>
    </div>
  );
}
