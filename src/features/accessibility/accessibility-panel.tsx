import { useState } from "react";
import { toast } from "sonner";
import { sanitizeUserText } from "@/lib/sanitize";
import type { AssistanceRequest, Zone } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Props {
  zones: readonly Zone[];
  onRequest?: (r: AssistanceRequest) => void;
}

const KINDS: readonly AssistanceRequest["kind"][] = [
  "wheelchair",
  "sensory",
  "translation",
  "medical",
  "other",
];

/** Accessibility assistance request form (notifies volunteer staff). */
export function AccessibilityPanel({ zones, onRequest }: Props) {
  const [zoneId, setZoneId] = useState<string>(zones[0]?.id ?? "");
  const [kind, setKind] = useState<AssistanceRequest["kind"]>("wheelchair");
  const [note, setNote] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const clean = sanitizeUserText(note, 300);
    const req: AssistanceRequest = {
      id: `req-${Date.now()}`,
      zoneId,
      kind,
      note: clean,
      createdAt: Date.now(),
      status: "pending",
    };
    onRequest?.(req);
    toast.success("Assistance requested. A volunteer has been notified.");
    setNote("");
  }

  return (
    <section
      aria-labelledby="a11y-heading"
      className="rounded-xl border bg-card p-4 shadow-sm"
    >
      <header className="mb-3">
        <h2 id="a11y-heading" className="text-base font-semibold">
          Accessibility Assistance
        </h2>
        <p className="text-xs text-muted-foreground">
          Wheelchair routes, sensory-friendly zones, and staff support
        </p>
      </header>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="a11y-zone">Your location</Label>
            <select
              id="a11y-zone"
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-2 py-2 text-sm"
            >
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                  {z.accessible ? " ♿" : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="a11y-kind">Type of assistance</Label>
            <select
              id="a11y-kind"
              value={kind}
              onChange={(e) => setKind(e.target.value as AssistanceRequest["kind"])}
              className="mt-1 w-full rounded-md border bg-background px-2 py-2 text-sm"
            >
              {KINDS.map((k) => (
                <option key={k} value={k}>
                  {k.replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <Label htmlFor="a11y-note">Additional details (optional)</Label>
          <Textarea
            id="a11y-note"
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 300))}
            maxLength={300}
            rows={3}
          />
        </div>
        <Button type="submit" className="min-h-11">
          Request assistance
        </Button>
      </form>
    </section>
  );
}
