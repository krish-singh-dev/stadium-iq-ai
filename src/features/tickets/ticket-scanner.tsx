import { useMemo, useState } from "react";
import { toast } from "sonner";
import { signTicket, verifyTicket } from "@/lib/ticket";
import { sanitizeUserText } from "@/lib/sanitize";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Staff-only ticket scanner (demo checksum, not real crypto). */
export function TicketScanner() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<ReturnType<typeof verifyTicket> | null>(null);

  const demoCode = useMemo(
    () =>
      signTicket({
        match: "USAMEX",
        seat: "N108R12S07",
        expiresAt: Date.now() + 1000 * 60 * 60 * 6,
      }),
    [],
  );

  function scan(raw: string) {
    const clean = sanitizeUserText(raw, 120);
    const r = verifyTicket(clean);
    setResult(r);
    if (r.ok) toast.success(`Admitted · Seat ${r.payload?.seat}`);
    else toast.error(`Rejected · ${r.reason}`);
  }

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
          Simulated QR scanner — paste a ticket code or try the demo one.
        </p>
      </header>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          scan(code);
        }}
        className="space-y-3"
      >
        <div>
          <Label htmlFor="ticket-code">Ticket code</Label>
          <Input
            id="ticket-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="WC26-…"
            autoComplete="off"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" className="min-h-11">
            Verify ticket
          </Button>
          <Button
            type="button"
            variant="outline"
            className="min-h-11"
            onClick={() => {
              setCode(demoCode);
              scan(demoCode);
            }}
          >
            Use demo ticket
          </Button>
        </div>
      </form>
      {result && (
        <div
          role="status"
          aria-live="polite"
          className={`mt-4 rounded-md border p-3 text-sm ${
            result.ok
              ? "border-density-low bg-density-low/20"
              : "border-destructive bg-destructive/10 text-destructive"
          }`}
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
