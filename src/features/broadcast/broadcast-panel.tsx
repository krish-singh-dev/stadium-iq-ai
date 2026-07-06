import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { composeBroadcast } from "@/lib/ai.functions";
import { sanitizeUserText } from "@/lib/sanitize";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const AUDIENCES = ["all", "north", "south", "east", "west", "concourse"] as const;
type Audience = (typeof AUDIENCES)[number];

/** AI-drafted multilingual PA broadcast (EN/ES/FR/AR). */
export function BroadcastPanel() {
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<Audience>("all");
  const [output, setOutput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const compose = useServerFn(composeBroadcast);

  async function run() {
    const clean = sanitizeUserText(message, 300);
    if (!clean) return;
    setPending(true);
    setError(null);
    try {
      const res = await compose({ data: { message: clean, audience } });
      setOutput(res.text);
    } catch {
      setError("Broadcast service failed. Please retry.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section
      aria-labelledby="broadcast-heading"
      className="rounded-xl border bg-card p-4 shadow-sm"
    >
      <header className="mb-3">
        <h2 id="broadcast-heading" className="text-base font-semibold">
          Multilingual Broadcast
        </h2>
        <p className="text-xs text-muted-foreground">
          Draft a PA announcement in EN · ES · FR · AR
        </p>
      </header>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void run();
        }}
        className="space-y-3"
      >
        <div>
          <Label htmlFor="broadcast-audience">Audience</Label>
          <select
            id="broadcast-audience"
            value={audience}
            onChange={(e) => setAudience(e.target.value as Audience)}
            className="mt-1 w-full rounded-md border bg-background px-2 py-2 text-sm"
          >
            {AUDIENCES.map((a) => (
              <option key={a} value={a}>
                {a.replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="broadcast-msg">Message intent</Label>
          <Textarea
            id="broadcast-msg"
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 300))}
            maxLength={300}
            rows={3}
            placeholder="e.g. Please clear the concourse near section 108 for medical access."
          />
        </div>
        <Button type="submit" disabled={pending || !message.trim()} className="min-h-11">
          {pending ? "Drafting…" : "Draft broadcast"}
        </Button>
      </form>
      {error && (
        <p role="alert" className="mt-3 rounded-md bg-destructive/10 p-2 text-sm text-destructive">
          {error}
        </p>
      )}
      {output && (
        <pre
          className="mt-4 whitespace-pre-wrap rounded-md border bg-background p-3 text-sm font-sans"
          aria-live="polite"
          aria-label="Broadcast draft"
        >
          {output}
        </pre>
      )}
    </section>
  );
}
