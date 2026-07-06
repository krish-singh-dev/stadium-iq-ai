import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { askAssistant } from "@/lib/ai.functions";
import { sanitizeUserText } from "@/lib/sanitize";
import { detectLanguage, LANGUAGES } from "@/lib/language";
import { useSession } from "@/features/session/session-context";
import type { ChatMessage, Language, Zone } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  zones: readonly Zone[];
}

const MIN_INTERVAL_MS = 1200;

/** Multilingual chat assistant with debounced/rate-limited submission. */
export function AssistantChat({ zones }: Props) {
  const { role, language, setLanguage } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastSent = useRef(0);
  const logRef = useRef<HTMLDivElement>(null);
  const ask = useServerFn(askAssistant);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages]);

  const send = useCallback(async () => {
    const clean = sanitizeUserText(input);
    if (!clean) return;
    const now = Date.now();
    if (now - lastSent.current < MIN_INTERVAL_MS) {
      setError("Please wait a moment before sending another message.");
      return;
    }
    lastSent.current = now;
    setError(null);
    const detected = detectLanguage(clean);
    if (detected !== language) setLanguage(detected);

    const userMsg: ChatMessage = {
      id: `u-${now}`,
      role: "user",
      content: clean,
      createdAt: now,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setPending(true);
    try {
      const context = zones
        .slice(0, 8)
        .map((z) => `${z.name}: ${Math.round((z.occupancy / z.capacity) * 100)}% full`)
        .join("; ");
      const res = await ask({ data: { message: clean, language: detected, role, context } });
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", content: res.text, createdAt: Date.now() },
      ]);
    } catch {
      setError("Assistant call failed. Please try again.");
    } finally {
      setPending(false);
    }
  }, [ask, input, language, role, setLanguage, zones]);

  return (
    <section
      aria-labelledby="assistant-heading"
      className="flex h-full min-h-[28rem] flex-col rounded-xl border bg-card shadow-sm"
    >
      <header className="flex items-center justify-between border-b p-4">
        <div>
          <h2 id="assistant-heading" className="text-base font-semibold">
            Multilingual AI Assistant
          </h2>
          <p className="text-xs text-muted-foreground">
            Generative AI · auto-detects language
          </p>
        </div>
        <label className="text-sm">
          <span className="sr-only">Language</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="rounded-md border bg-background px-2 py-1 text-sm focus-visible:ring-2 focus-visible:ring-ring"
          >
            {Object.entries(LANGUAGES).map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </header>
      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label="Conversation"
        className="flex-1 space-y-3 overflow-y-auto p-4"
      >
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Try: “Where is the nearest accessible restroom?” or “¿Dónde está la Puerta A?”
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className={
                m.role === "user"
                  ? "max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-sm text-primary-foreground"
                  : "max-w-[80%] rounded-2xl rounded-tl-sm bg-secondary px-3 py-2 text-sm text-secondary-foreground"
              }
            >
              {m.content}
            </div>
          </div>
        ))}
        {pending && (
          <p className="text-sm text-muted-foreground" aria-live="polite">
            Assistant is thinking…
          </p>
        )}
      </div>
      {error && (
        <p role="alert" className="border-t border-destructive/30 bg-destructive/10 p-2 text-xs text-destructive">
          {error}
        </p>
      )}
      <form
        className="flex gap-2 border-t p-3"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <label htmlFor="assistant-input" className="sr-only">
          Ask the assistant
        </label>
        <Textarea
          id="assistant-input"
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, 500))}
          maxLength={500}
          rows={2}
          placeholder="Ask the AI assistant…"
          className="min-h-11 flex-1 resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
        />
        <Button type="submit" disabled={pending || !input.trim()} className="min-h-11">
          Send
        </Button>
      </form>
    </section>
  );
}
