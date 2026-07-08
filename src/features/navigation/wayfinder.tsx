import { useMemo, useState } from "react";
import { StadiumMap } from "@/features/stadium/stadium-map";
import { buildRoute } from "@/lib/routing";
import type { Zone } from "@/types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Props {
  zones: readonly Zone[];
}

/** Wayfinding: pick origin + destination, get accessible turn-by-turn steps. */
export function Wayfinder({ zones }: Props) {
  const [fromId, setFromId] = useState(zones[0]?.id ?? "");
  const [toId, setToId] = useState(zones[1]?.id ?? "");
  const [accessible, setAccessible] = useState(false);

  const from = zones.find((z) => z.id === fromId);
  const to = zones.find((z) => z.id === toId);
  const steps = useMemo(
    () => (from && to ? buildRoute(from, to, zones, { accessibleOnly: accessible }) : []),
    [from, to, zones, accessible],
  );

  return (
    <section aria-labelledby="nav-heading" className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="nav-heading" className="text-base font-semibold">
            Smart Navigation
          </h2>
          <p className="text-xs text-muted-foreground">AI-guided wayfinding across the venue</p>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="a11y-route" checked={accessible} onCheckedChange={setAccessible} />
          <Label htmlFor="a11y-route" className="text-sm">
            Accessible route
          </Label>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <StadiumMap zones={zones} highlightId={toId} onSelect={(z) => setToId(z.id)} />
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <label className="text-sm">
              <span className="mb-1 block text-muted-foreground">From</span>
              <select
                value={fromId}
                onChange={(e) => setFromId(e.target.value)}
                className="w-full rounded-md border bg-background px-2 py-2"
              >
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-muted-foreground">To</span>
              <select
                value={toId}
                onChange={(e) => setToId(e.target.value)}
                className="w-full rounded-md border bg-background px-2 py-2"
              >
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                    {z.accessible ? " (accessible)" : ""}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <ol
            className="space-y-2 rounded-lg border bg-background p-3 text-sm"
            aria-label="Turn-by-turn directions"
          >
            {steps.map((s, i) => (
              <li key={`${s.zoneId ?? "step"}-${i}`} className="flex gap-2">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
                >
                  {i + 1}
                </span>
                <span>{s.instruction}</span>
              </li>
            ))}
          </ol>
          <Button
            variant="secondary"
            onClick={() => {
              const tmp = fromId;
              setFromId(toId);
              setToId(tmp);
            }}
          >
            Swap direction
          </Button>
        </div>
      </div>
    </section>
  );
}
