import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { issueDemoTicket, verifyTicketFn } from "@/lib/ticket.functions";
import { sanitizeUserText } from "@/lib/sanitize";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Result = Awaited<ReturnType<typeof verifyTicketFn>>;

/** Staff-only ticket scanner. Verification runs server-side (HMAC-SHA256). */
export function TicketScanner() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [demoCode, setDemoCode] = useState<string>("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    issueDemoTicket({ data: { match: "USAMEX", seat: "N108R12S07" } })
      .then((r) => {
        if (!cancelled) setDemoCode(r.code);
      })
      .catch(() => {
        /* demo optional */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const scan = useCallback(async (raw: string) => {
    const clean = sanitizeUserText(raw, 200);
    if (!clean) {
      toast.error("Enter a ticket code");
      return;
    }
    setPending(true);
    try {
      const r = await verifyTicketFn({ data: { code: clean } });
      setResult(r);
      if (r.ok) toast.success(`Admitted · Seat ${r.payload?.seat}`);
      else toast.error(`Rejected · ${r.reason}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setPending(false);
    }
  }, []);

  const useDemo = useCallback(() => {
    if (!demoCode) return;
    setCode(demoCode);
    void scan(demoCode);
  }, [demoCode, scan]);

  const statusClass = useMemo(() => {
    if (!result) return "";
    return result.ok
      ? "border-density-low bg-density-low/20"
      : "border-destructive bg-destructive/10 text-destructive";
  }, [result]);

  return (
    <section
      aria-labelledby="ticket-heading"
      className="rounded-xl border bg-card p-4 shadow-sm"
    >
      <header className="mb-3">
        <h2 id="ticket-heading" className="text-base font-semibold">
          Ticket Verification
        </h2>
        <p className="text-xs text-muted-foreground">
          Paste a ticket code or try the demo one. Verification runs on the server.
        </p>
      </header>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void scan(code);
        }}
        className="space-y-3"
      >
        <div>
          <Label htmlFor="ticket-code">Ticket code</Label>
          <Input
            id="ticket-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="WC26.…"
            autoComplete="off"
            inputMode="text"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" className="min-h-11" disabled={pending}>
            {pending ? "Verifying…" : "Verify ticket"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            onClick={useDemo}
            disabled={pending || !demoCode}
          >
            Use demo ticket
          </Button>
        </div>
      </form>
      {result && (
        <div
          role="status"
          aria-live="polite"
          className={`mt-4 rounded-md border p-3 text-sm ${statusClass}`}
        >
          {result.ok ? (
            <>
              <p className="font-semibold">Admitted</p>
              <p>
                Match {result.payload?.match} · Seat {result.payload?.seat}
              </p>
            </>
          ) : (
            <p className="font-semibold">Rejected — {result.reason}</p>
          )}
        </div>
      )}
    </section>
  );
}
