"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GigiAvatar } from "@/components/gigi-avatar";
import { CHAT_ANSWERS, QUICK_PROMPTS, replyTo } from "@/lib/chat";
import { cn } from "cn";

type Turn = { role: "assistant" | "you"; text: string };

export function ChatWidget({ raised = false }: { raised?: boolean }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<Turn[]>([{ role: "assistant", text: CHAT_ANSWERS.disclosure }]);

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

  return (
    <div className={cn("fixed right-4 z-40", raised ? "bottom-24 md:bottom-6" : "bottom-4 md:bottom-6")}>
      {open ? (
        <section
          className="mb-3 flex max-h-[min(32rem,70vh)] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xl"
          aria-label="Gigi, Acadiana Bathrooms' AI assistant"
          data-testid="ai-chat"
        >
          <header className="flex items-start justify-between gap-3 border-b border-border bg-fig px-4 py-3 text-fig-foreground">
            <div className="flex items-start gap-3">
              <GigiAvatar size={48} alt="" className="size-12 shrink-0 border border-white/20" />
              <div>
                <p className="text-base font-semibold leading-5">Gigi</p>
                <p className="mt-1 text-sm leading-5 text-fig-muted">Acadiana Bathrooms&apos; AI assistant</p>
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
                    "rounded-2xl px-3 py-2 text-sm leading-6",
                    turn.role === "assistant" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground",
                  )}
                >
                  {turn.text}
                </p>
              </div>
            ))}
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
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="ml-auto flex items-center gap-2 rounded-full bg-fig px-3 py-2 pr-4 text-sm font-semibold text-fig-foreground shadow-lg max-md:[[data-sticky-cta]_&]:hidden"
        aria-expanded={open}
        aria-label="Chat with Gigi, Acadiana Bathrooms' AI assistant"
        data-testid="gigi-launcher"
      >
        <GigiAvatar size={32} alt="" className="size-8 border border-white/20" />
        Gigi
      </button>
    </div>
  );
}
