"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className={cn("fixed right-4 z-40", raised ? "bottom-[9rem] md:bottom-6" : "bottom-4 md:bottom-6")}>
      {open ? (
        <section
          className="mb-3 flex max-h-[min(32rem,70vh)] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-xl"
          aria-label="AI assistant"
          data-testid="ai-chat"
        >
          <header className="flex items-start justify-between gap-3 border-b border-border bg-fig px-4 py-3 text-fig-foreground">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em]">AI assistant</p>
              <p className="mt-1 text-sm leading-5 text-fig-muted">Not a person. Not Justin. Not submitted or saved.</p>
            </div>
            <button type="button" className="inline-flex size-10 items-center justify-center rounded-xl" onClick={() => setOpen(false)}>
              <span className="sr-only">Close AI assistant</span>
              <X />
            </button>
          </header>
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {turns.map((turn, index) => (
              <p
                key={`${turn.role}-${index}`}
                className={cn(
                  "rounded-2xl px-3 py-2 text-sm leading-6",
                  turn.role === "assistant" ? "bg-muted text-foreground" : "ml-6 bg-primary text-primary-foreground",
                )}
              >
                {turn.text}
              </p>
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
              Ask the AI assistant
            </label>
            <Input
              id="ai-question"
              value={draft}
              maxLength={240}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask from the published facts"
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
        className="ml-auto flex size-12 items-center justify-center rounded-full bg-fig text-sm font-semibold text-fig-foreground shadow-lg md:h-auto md:w-auto md:gap-2 md:px-4 md:py-3"
        aria-expanded={open}
      >
        <span className="rounded-full bg-fig-foreground px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-fig">
          AI
        </span>
        <span className="sr-only md:not-sr-only">Assistant</span>
      </button>
    </div>
  );
}
