"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConsultLink } from "@/components/consult-link";
import { DesignLink } from "@/components/design-link";
import { GigiAvatar } from "@/components/gigi-avatar";
import {
  CHAT_ANSWERS,
  GIGI_GREETING_DELAY_MS,
  GIGI_GREETING_LEAD,
  GIGI_HEADER_SUBLINE,
  QUICK_PROMPTS,
  greetingForPath,
  replyTo,
  shouldShowGreeting,
} from "@/lib/chat";
import { cn } from "cn";

type Turn = { role: "assistant" | "you"; text: string };

const GREETING_KEY = "gigi-greeting";

type GreetingState = { line: string; status: "pending" | "shown" | "hidden" };

function readGreeting(pathname: string): GreetingState {
  try {
    const raw = sessionStorage.getItem(GREETING_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<GreetingState>;
      if (parsed.status === "hidden" || parsed.status === "shown") {
        return { line: typeof parsed.line === "string" ? parsed.line : GIGI_GREETING_LEAD, status: parsed.status };
      }
    }
  } catch {
    /* private mode or a stale value */
  }
  return { line: greetingForPath(pathname), status: "pending" };
}

function writeGreeting(state: GreetingState) {
  try {
    sessionStorage.setItem(GREETING_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / private mode */
  }
}

export function ChatWidget({ raised = false }: { raised?: boolean }) {
  const pathname = usePathname() || "/";
  const allowBubble = shouldShowGreeting(pathname);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<Turn[]>([{ role: "assistant", text: CHAT_ANSWERS.disclosure }]);
  const [bubbleLine, setBubbleLine] = useState(GIGI_GREETING_LEAD);
  const [bubbleReady, setBubbleReady] = useState(false);
  const [bubbleHidden, setBubbleHidden] = useState(true);
  const greetingRef = useRef<GreetingState>({ line: GIGI_GREETING_LEAD, status: "pending" });

  useEffect(() => {
    if (!allowBubble) {
      setBubbleHidden(true);
      setBubbleReady(false);
      return;
    }
    const saved = readGreeting(pathname);
    greetingRef.current = saved;
    setBubbleLine(saved.line);
    if (saved.status !== "pending") {
      setBubbleHidden(true);
      setBubbleReady(false);
      return;
    }
    setBubbleHidden(false);
    writeGreeting(saved);
    const timer = window.setTimeout(() => {
      if (greetingRef.current.status !== "pending") return;
      const next = { line: greetingRef.current.line, status: "shown" as const };
      greetingRef.current = next;
      writeGreeting(next);
      setBubbleReady(true);
    }, GIGI_GREETING_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [allowBubble, pathname]);

  function hideBubble() {
    const next = { line: greetingRef.current.line, status: "hidden" as const };
    greetingRef.current = next;
    writeGreeting(next);
    setBubbleHidden(true);
    setBubbleReady(false);
  }

  function openChat() {
    hideBubble();
    setOpen(true);
  }

  function ask(message: string) {
    const trimmed = message.trim();
    if (!trimmed) return;
    setTurns((current) => [
      ...current,
      { role: "you", text: trimmed },
      { role: "assistant", text: replyTo(trimmed) },
    ]);
    setDraft("");
  }

  const showBubble = !open && allowBubble && !bubbleHidden && bubbleReady;
  const freshChat = turns.length === 1 && turns[0]?.role === "assistant";

  return (
    <div
      className={cn(
        "fixed right-4 z-40 flex flex-col items-end",
        raised ? "bottom-24 md:bottom-6" : "bottom-4 md:bottom-6",
      )}
    >
      {open ? (
        <section
          className="mb-3 flex max-h-[min(32rem,70vh)] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xl"
          aria-label="Chat with Gigi"
          data-testid="ai-chat"
        >
          <header className="flex items-start justify-between gap-3 border-b border-border bg-fig px-4 py-3 text-fig-foreground">
            <div className="flex items-start gap-3">
              <GigiAvatar size={48} alt="" className="size-12 shrink-0 border border-white/20" />
              <div>
                <p className="text-base font-semibold leading-5">Gigi</p>
                <p className="mt-0.5 text-xs leading-4 text-fig-muted">{GIGI_HEADER_SUBLINE}</p>
              </div>
            </div>
            <button type="button" className="inline-flex size-10 items-center justify-center rounded-xl" onClick={() => setOpen(false)}>
              <span className="sr-only">Close chat with Gigi</span>
              <X />
            </button>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {turns.map((turn, index) => (
              <div
                key={`${turn.role}-${index}`}
                className={cn("flex items-end gap-2", turn.role === "you" ? "justify-end" : "justify-start")}
              >
                {turn.role === "assistant" ? (
                  <GigiAvatar size={28} alt="" className="mb-0.5 size-7 shrink-0" />
                ) : null}
                <p
                  className={cn(
                    "min-w-0 max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6",
                    turn.role === "assistant" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground",
                  )}
                >
                  {turn.text}
                </p>
              </div>
            ))}
            {freshChat ? (
              <div className="flex flex-wrap gap-2 pl-9">
                <button
                  type="button"
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-left text-xs"
                  onClick={() => ask("What's a ballpark price?")}
                >
                  Ballpark price
                </button>
                <DesignLink
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-left text-xs"
                  onClick={hideBubble}
                >
                  Redesign my bathroom
                </DesignLink>
                <ConsultLink
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-left text-xs"
                  onClick={hideBubble}
                >
                  Get a free quote
                </ConsultLink>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.label}
                    type="button"
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-left text-xs"
                    onClick={() => ask(prompt.message)}
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <form
            className="flex gap-2 border-t border-border p-3"
            onSubmit={(event) => {
              event.preventDefault();
              ask(draft);
            }}
          >
            <label className="sr-only" htmlFor="ai-question">
              Ask Gigi
            </label>
            <Input
              id="ai-question"
              value={draft}
              maxLength={240}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask about showers, tile, cost or area"
              className="h-11 text-base md:text-base"
            />
            <Button type="submit" className="h-11 rounded-xl px-3">
              Ask
            </Button>
          </form>
        </section>
      ) : null}
      {showBubble ? (
        <div
          className="mb-2 max-w-[min(15.5rem,calc(100vw-5.5rem))] max-md:[[data-sticky-cta]_&]:hidden motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-200"
          data-testid="gigi-greeting"
        >
          <div className="relative rounded-2xl rounded-br-md border border-border bg-card px-3 py-2 pr-8 text-card-foreground shadow-lg">
            <button type="button" className="block text-left text-xs leading-5 sm:text-sm" onClick={openChat}>
              {bubbleLine}
            </button>
            <button
              type="button"
              className="absolute right-1 top-1 inline-flex size-6 items-center justify-center rounded-full text-muted-foreground"
              onClick={(event) => {
                event.stopPropagation();
                hideBubble();
              }}
            >
              <span className="sr-only">Dismiss greeting</span>
              <X className="size-3.5" />
            </button>
            <span
              aria-hidden="true"
              className="absolute -bottom-1.5 right-6 size-3 rotate-45 border-b border-r border-border bg-card"
            />
          </div>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openChat())}
        className="ml-auto flex items-center gap-2 rounded-full bg-fig px-3 py-2 pr-4 text-sm font-semibold text-fig-foreground shadow-lg max-md:[[data-sticky-cta]_&]:hidden"
        aria-expanded={open}
        aria-label="Chat with Gigi"
        data-testid="gigi-launcher"
      >
        <GigiAvatar size={32} alt="" className="size-8 border border-white/20" />
        Gigi
      </button>
    </div>
  );
}
