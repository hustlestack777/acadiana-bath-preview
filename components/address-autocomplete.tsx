"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import type { AddressHit } from "@/lib/address-suggest";
import { cn } from "cn";

export type AddressSelection = {
  street: string;
  city: string;
  region: string;
  zip: string;
  lat: number | null;
  lon: number | null;
  label: string;
};

const MIN_CHARS = 3;
const DEBOUNCE_MS = 300;

/** As-you-type house-number picker. Enter selects a suggestion and does not submit the form. */
export function AddressAutocomplete({
  id,
  value,
  onChange,
  onSelect,
  invalid = false,
  describedBy,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (address: AddressSelection) => void;
  invalid?: boolean;
  describedBy?: string;
}) {
  const listId = useId();
  const [suggestions, setSuggestions] = useState<AddressHit[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState("Suggestions appear as you type.");
  const requestId = useRef(0);
  const selectedStreet = useRef("");
  const typed = useRef(false);

  useEffect(() => {
    const query = value.trim();
    // Browser autofill fires a burst of changes without keystrokes; only search while the user is typing.
    if (!typed.current) return;
    if (query && query === selectedStreet.current) return;
    if (query.length < MIN_CHARS) return;
    const seq = ++requestId.current;
    const timer = window.setTimeout(() => {
      void (async () => {
        setStatus("Searching addresses…");
        try {
          const response = await fetch(`/api/address-suggest?q=${encodeURIComponent(query)}`);
          const data = (await response.json().catch(() => null)) as { suggestions?: AddressHit[] } | null;
          if (seq !== requestId.current) return;
          const list = data?.suggestions ?? [];
          setSuggestions(list);
          setActive(0);
          setOpen(list.length > 0);
          setStatus(list.length ? "Select your address from the list." : "No matches yet — keep typing the street and city.");
        } catch {
          if (seq !== requestId.current) return;
          setSuggestions([]);
          setOpen(false);
          setStatus("Address search is unavailable. You can still type the street.");
        }
      })();
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [value]);

  async function selectIndex(index: number) {
    const suggestion = suggestions[index];
    if (!suggestion) return;
    setStatus("Finding that house…");
    try {
      const response = await fetch("/api/address-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(suggestion),
      });
      const data = (await response.json().catch(() => null)) as { address?: AddressSelection } | null;
      const address = data?.address;
      if (!response.ok || !address?.street) {
        if (suggestion.street || suggestion.label) {
          apply({
            street: suggestion.street || suggestion.label,
            city: suggestion.city,
            region: suggestion.region,
            zip: suggestion.zip,
            lat: suggestion.lat,
            lon: suggestion.lon,
            label: suggestion.label,
          });
        } else {
          setStatus("Couldn’t use that one. Try another suggestion.");
        }
        return;
      }
      apply(address);
    } catch {
      setStatus("Couldn’t use that one. Try another suggestion.");
    }
  }

  function apply(address: AddressSelection) {
    const street = address.street || address.label;
    selectedStreet.current = street.trim();
    setOpen(false);
    setSuggestions([]);
    const where = [address.city, address.region, address.zip].filter(Boolean).join(", ");
    setStatus(where ? `Address selected — ${where}` : "Address selected.");
    onSelect({ ...address, street });
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    typed.current = true;
    if (event.key === "ArrowDown" && suggestions.length) {
      event.preventDefault();
      setOpen(true);
      setActive((current) => (current + 1) % suggestions.length);
      return;
    }
    if (event.key === "ArrowUp" && suggestions.length) {
      event.preventDefault();
      setOpen(true);
      setActive((current) => (current - 1 + suggestions.length) % suggestions.length);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      if (suggestions.length) void selectIndex(Math.max(0, Math.min(active, suggestions.length - 1)));
      return;
    }
    if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const activeId = open && suggestions.length ? `${listId}-opt-${active}` : undefined;

  return (
    <div className="relative">
      <input
        id={id}
        name="address-line1"
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={activeId}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        autoComplete="address-line1"
        autoCapitalize="words"
        spellCheck={false}
        value={value}
        placeholder="123 Main St"
        onInput={(event) => {
          if ((event.nativeEvent as InputEvent).inputType?.startsWith("insert")) typed.current = true;
        }}
        onChange={(event) => {
          const next = event.target.value;
          if (next.trim() !== selectedStreet.current) selectedStreet.current = "";
          onChange(next);
          if (next.trim().length < MIN_CHARS) {
            requestId.current += 1;
            setSuggestions([]);
            setOpen(false);
            setStatus("Suggestions appear as you type.");
          }
        }}
        onKeyDown={onKeyDown}
        onFocus={() => {
          if (suggestions.length) setOpen(true);
        }}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 180);
        }}
        className={cn(
          "h-12 w-full rounded-xl border bg-card px-3 text-base outline-none",
          invalid ? "border-destructive" : "border-input",
        )}
      />
      {open && suggestions.length ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-[#d8d3c4] bg-[#fffaf3] p-1 shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              id={`${listId}-opt-${index}`}
              role="option"
              aria-selected={index === active}
              className={cn(
                "cursor-pointer rounded-lg px-3 py-3 text-sm leading-5",
                index === active ? "bg-[#f3efe4]" : "",
              )}
              onMouseDown={(event) => {
                event.preventDefault();
                void selectIndex(index);
              }}
            >
              {suggestion.label}
            </li>
          ))}
        </ul>
      ) : null}
      <p className={cn("text-sm leading-6 text-muted-foreground", status === "Suggestions appear as you type." ? "sr-only" : "mt-1")} role="status">
        {status}
      </p>
    </div>
  );
}
