import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { recommendActions } from "@/lib/ai.functions";
import { sanitizeUserText } from "@/lib/sanitize";
import { useSession } from "@/features/session/session-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const PRESETS = [
  "Sudden thunderstorm approaching in 15 minutes.",
  "Gate 3 turnstile malfunction with growing queue.",
  "Medical incident in South Stand row 42.",
];

/** AI recommendation engine for real-time decision support. */
export function DecisionSupport() {
  const { role } = useSession();
  const [scenario, setScenario] = useState("");
  const [output, setOutput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recommend = useServerFn(recommendActions);

  async function run(text: string) {
    const clean = sanitizeUserText(text, 400);
    if (!clean) return;
    setPending(true);
    setError(null);
    try {
      const res = await recommend({ data: { scenario: clean, role } });
      setOutput(res.text);
    } catch {
      setError("Recommendation service failed. Please retry.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section
      aria-labelledby="decision-heading"
      className="rounded-xl border bg-card p-4 shadow-sm"
    >
      <header className="mb-3">
        <h2 id="decision-heading" className="text-base font-semibold">
          Real-Time Decision Support
        </h2>
        <p className="text-xs text-muted-foreground">
          AI-generated action checklist for stadium incidents
        </p>
      </header>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void run(scenario);
        }}
        className="space-y-3"
      >
        <div>
          <Label htmlFor="scenario">Describe the scenario</Label>
          <Textarea
            id="scenario"
            value={scenario}
            onChange={(e) => setScenario(e.target.value.slice(0, 400))}
            maxLength={400}
            rows={3}
            placeholder="e.g. Power outage in the West Stand concourse"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setScenario(p);
                void run(p);
              }}
              className="min-h-11 rounded-full border px-3 py-1 text-xs hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              {p}
            </button>
          ))}
        </div>
        <Button type="submit" disabled={pending || !scenario.trim()} className="min-h-11">
          {pending ? "Generating…" : "Get recommendation"}
        </Button>
      </form>
      {error && (
        <p role="alert" className="mt-3 rounded-md bg-destructive/10 p-2 text-sm text-destructive">
          {error}
        </p>
      )}
      {output && (
        <div
          className="mt-4 rounded-md border bg-background p-3 text-sm"
          aria-live="polite"
          aria-label="AI recommendation"
        >
          <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
            AI recommendation
          </p>
          <pre className="whitespace-pre-wrap font-sans">{output}</pre>
        </div>
      )}
    </section>
  );
}
