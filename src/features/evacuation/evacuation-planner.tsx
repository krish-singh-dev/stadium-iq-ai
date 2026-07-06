import { useMemo, useState } from "react";
import { planEvacuation } from "@/lib/evacuation";
import type { Zone } from "@/types";
import { Label } from "@/components/ui/label";

interface Props {
  zones: readonly Zone[];
}

/** Emergency evacuation planner — nearest exit per zone with A11y filter. */
export function EvacuationPlanner({ zones }: Props) {
  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const routes = useMemo(() => planEvacuation(zones, { accessibleOnly }), [zones, accessibleOnly]);
  const zoneById = useMemo(() => new Map(zones.map((z) => [z.id, z.name] as const)), [zones]);
  const maxEta = routes.reduce((m, r) => Math.max(m, r.etaSeconds), 0);

  return (
    <section
      aria-labelledby="evac-heading"
      className="rounded-xl border bg-card p-4 shadow-sm"
    >
      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 id="evac-heading" className="text-base font-semibold">
            Emergency Evacuation Planner
          </h2>
          <p className="text-xs text-muted-foreground">
            Nearest safe exit per zone. Longest projected egress:{" "}
            <span className="font-semibold text-foreground">{maxEta}s</span>
          </p>
        </div>
        <Label className="flex cursor-pointer items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={accessibleOnly}
            onChange={(e) => setAccessibleOnly(e.target.checked)}
            className="size-4"
          />
          Accessible exits only
        </Label>
      </header>
      <ul role="list" className="divide-y text-sm">
        {routes.map((r) => (
          <li key={r.fromId} className="flex items-center justify-between py-2">
            <span className="truncate">
              <span className="font-medium">{zoneById.get(r.fromId)}</span>{" "}
              <span aria-hidden="true">→</span>{" "}
              <span className="text-muted-foreground">{zoneById.get(r.exitId)}</span>
            </span>
            <span className="font-mono text-xs text-muted-foreground">{r.etaSeconds}s</span>
          </li>
        ))}
        {routes.length === 0 && (
          <li className="py-3 text-sm text-muted-foreground">No exits available with current filter.</li>
        )}
      </ul>
    </section>
  );
}
