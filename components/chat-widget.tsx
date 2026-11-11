"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { DesignLink } from "@/components/design-link";
import { GigiAvatar } from "@/components/gigi-avatar";
import {
  CHAT_ANSWERS,
  GIGI_GREETING_DELAY_MS,
  GIGI_GREETING_LEAD,
  GIGI_HEADER_SUBLINE,
  INTRO_CHIPS,
  greetingForPath,
  respond,
  shouldShowGreeting,
  type GigiChip,
  type GigiSession,
} from "@/lib/chat";
import { cn } from "cn";

type Turn = { role: "assistant" | "you"; text: string };

const GREETING_KEY = "gigi-greeting";
const DESKTOP_MQ = "(min-width: 768px)";

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

function isDesktop() {
  return window.matchMedia(DESKTOP_MQ).matches;
}

function collectHeroCtas(): Element[] {
  const quote = document.querySelector("[data-testid=hero-cta]");
  if (!quote) return [];
  const nodes: Element[] = [];
  const group = quote.parentElement;
  if (group) nodes.push(...Array.from(group.querySelectorAll("a, button")));
  else nodes.push(quote);
  const after = group?.nextElementSibling;
  if (after instanceof Element) {
    if (after.matches('a[href^="tel:"]')) nodes.push(after);
    else {
      const phone = after.querySelector('a[href^="tel:"]');
      if (phone) nodes.push(phone);
    }
  }
  return nodes;
}

function isCtaOrPhone(el: HTMLElement) {
  const href = el.getAttribute("href") || "";
  const text = (el.textContent || "").replace(/\s+/g, " ").trim();
  const testid = el.getAttribute("data-testid") || "";
  if (href.startsWith("tel:")) return true;
  if (testid === "hero-cta" || testid === "design-render" || testid === "design-unlock") return true;
  if (/^get my free quote$/i.test(text) || /^get a free quote$/i.test(text)) return true;
  if (/^design my bathroom$/i.test(text)) return true;
  return false;
}

function collectPageCtas(widgetRoot: Element | null): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>("a, button, label")].filter(
    (el) => !widgetRoot?.contains(el) && isCtaOrPhone(el),
  );
}

function inViewport(el: Element) {
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
}

function rectsOverlap(a: DOMRect, b: DOMRect, pad = 8) {
  return !(a.right < b.left - pad || a.left > b.right + pad || a.bottom < b.top - pad || a.top > b.bottom + pad);
}

function measureStickyOffset(widgetRoot: Element | null) {
  if (isDesktop()) return 0;
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  let offset = 0;
  for (const el of document.querySelectorAll<HTMLElement>("div, nav, aside")) {
    if (widgetRoot?.contains(el) || el === widgetRoot) continue;
    const style = getComputedStyle(el);
    if (style.position !== "fixed" && style.position !== "sticky") continue;
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") continue;
    const rect = el.getBoundingClientRect();
    if (rect.height < 36 || rect.width < vw * 0.45) continue;
    if (rect.top < vh * 0.5) continue;
    if (rect.bottom < vh - 8) continue;
    offset = Math.max(offset, Math.ceil(vh - rect.top));
  }
  return offset ? offset + 8 : 0;
}

function reservedDockRect(bottomOffset: number, withBubble: boolean) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = withBubble ? Math.min(15.5 * 16, vw - 24) : 108;
  const height = withBubble ? 120 : 52;
  const right = 16;
  const bottom = vh - bottomOffset;
  return new DOMRect(vw - right - width, bottom - height, width, height);
}

export function ChatWidget({ raised = false }: { raised?: boolean }) {
  const pathname = usePathname() || "/";
  const allowBubble = shouldShowGreeting(pathname);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [turns, setTurns] = useState<Turn[]>([{ role: "assistant", text: CHAT_ANSWERS.disclosure }]);
  const [session, setSession] = useState<GigiSession>({ phase: "intro" });
  const [chips, setChips] = useState<GigiChip[]>(INTRO_CHIPS);
  const inputRef = useRef<HTMLInputElement>(null);
  const [bubbleLine, setBubbleLine] = useState(GIGI_GREETING_LEAD);
  const [bubbleReady, setBubbleReady] = useState(false);
  const [bubbleHidden, setBubbleHidden] = useState(true);
  const [dockClear, setDockClear] = useState(true);
  const [bottomPx, setBottomPx] = useState<number | null>(null);
  const greetingRef = useRef<GreetingState>({ line: GIGI_GREETING_LEAD, status: "pending" });
  const widgetRef = useRef<HTMLDivElement>(null);
  const bubbleReadyRef = useRef(false);
  const bubbleHiddenRef = useRef(true);
  const openRef = useRef(false);

  useEffect(() => {
    bubbleReadyRef.current = bubbleReady;
    bubbleHiddenRef.current = bubbleHidden;
    openRef.current = open;
  }, [bubbleReady, bubbleHidden, open]);

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
      if (greetingRef.current.status === "hidden") return;
      setBubbleReady(true);
    }, GIGI_GREETING_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [allowBubble, pathname]);

  useLayoutEffect(() => {
    let io: IntersectionObserver | null = null;
    let raf = 0;

    function compute() {
      const root = widgetRef.current;
      if (isDesktop()) {
        setBottomPx(null);
        setDockClear(true);
        return;
      }
      const offset = measureStickyOffset(root) || (raised ? 96 : 16);
      setBottomPx(offset);
      if (openRef.current) {
        setDockClear(true);
        return;
      }
      if (collectHeroCtas().some(inViewport)) {
        setDockClear(false);
        return;
      }
      const wouldShowBubble = allowBubble && !bubbleHiddenRef.current && bubbleReadyRef.current;
      const box = root && root.getBoundingClientRect().height > 0
        ? root.getBoundingClientRect()
        : reservedDockRect(offset, wouldShowBubble);
      const overlap = collectPageCtas(root).some((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return false;
        // Already cleared by raising the dock above a sticky/fixed bottom bar.
        if (offset && r.top >= window.innerHeight - offset) return false;
        return rectsOverlap(box, r);
      });
      setDockClear(!overlap);
    }

    function schedule() {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        compute();
      });
    }

    function watchHero() {
      io?.disconnect();
      io = new IntersectionObserver(() => schedule(), { threshold: 0 });
      for (const el of collectHeroCtas()) io.observe(el);
    }

    watchHero();
    const mo = new MutationObserver(() => {
      watchHero();
      schedule();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-sticky-cta"] });
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const mq = window.matchMedia(DESKTOP_MQ);
    mq.addEventListener("change", schedule);
    compute();
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      io?.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      mq.removeEventListener("change", schedule);
    };
  }, [raised, allowBubble, open, bubbleReady, bubbleHidden]);

  useEffect(() => {
    if (!allowBubble || bubbleHidden || !bubbleReady || !dockClear || open) return;
    if (greetingRef.current.status === "pending") {
      const next = { line: greetingRef.current.line, status: "shown" as const };
      greetingRef.current = next;
      writeGreeting(next);
    }
  }, [allowBubble, bubbleHidden, bubbleReady, dockClear, open]);

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
    const result = respond(trimmed, session);
    setTurns((current) => [
      ...current,
      { role: "you", text: trimmed },
      { role: "assistant", text: result.text },
    ]);
    setSession(result.session);
    setChips(result.chips);
    setDraft("");
  }

  function onChip(chip: GigiChip) {
    if (chip.focusInput) {
      inputRef.current?.focus();
      return;
    }
    if (chip.message) ask(chip.message);
  }

  const showDock = open || dockClear;
  const showBubble = !open && allowBubble && !bubbleHidden && bubbleReady && dockClear;
  const chipClassName = "rounded-full border border-border bg-background px-3 py-1.5 text-left text-xs";
  const placeholder =
    session.phase === "location"
      ? "Town or ZIP"
      : session.phase === "callTime"
        ? "Morning, afternoon, or evening"
        : session.phase === "callDay"
          ? "Weekday, weekend, or any day"
          : "Ask about showers, tile, cost or area";

  return (
    <div
      ref={widgetRef}
      data-gigi-widget=""
      className={cn(
        "fixed right-4 z-40 flex flex-col items-end md:bottom-6",
        bottomPx == null && (raised ? "bottom-24" : "bottom-4"),
        bottomPx != null && "max-md:bottom-[var(--gigi-bottom)]",
      )}
      style={bottomPx != null ? ({ "--gigi-bottom": `${bottomPx}px` } as CSSProperties) : undefined}
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
            {chips.length ? (
              <div className="flex flex-wrap gap-2 pl-9" data-testid="gigi-chips">
                {chips.map((chip) =>
                  chip.href ? (
                    chip.href.startsWith("/design") ? (
                      <DesignLink key={chip.label} look={chip.look} className={chipClassName} onClick={hideBubble}>
                        {chip.label}
                      </DesignLink>
                    ) : (
                      <Link key={chip.label} href={chip.href} className={chipClassName} onClick={hideBubble}>
                        {chip.label}
                      </Link>
                    )
                  ) : (
                    <button key={chip.label} type="button" className={chipClassName} onClick={() => onChip(chip)}>
                      {chip.label}
                    </button>
                  ),
                )}
              </div>
            ) : null}
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
              ref={inputRef}
              value={draft}
              maxLength={240}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={placeholder}
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
          className="mb-2 max-w-[min(15.5rem,calc(100vw-5.5rem))] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-200"
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
      {showDock ? (
        <button
          type="button"
          onClick={() => (open ? setOpen(false) : openChat())}
          className="ml-auto flex items-center gap-2 rounded-full bg-fig px-3 py-2 pr-4 text-sm font-semibold text-fig-foreground shadow-lg"
          aria-expanded={open}
          aria-label="Chat with Gigi"
          data-testid="gigi-launcher"
        >
          <GigiAvatar size={32} alt="" className="size-8 border border-white/20" />
          Gigi
        </button>
      ) : null}
    </div>
  );
}
