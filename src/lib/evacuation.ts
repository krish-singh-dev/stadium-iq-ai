import type { Zone } from "@/types";

export interface EvacuationRoute {
  readonly fromId: string;
  readonly exitId: string;
  readonly distance: number;
  readonly etaSeconds: number;
}

/** Euclidean distance between two zones on the % grid. */
export function zoneDistance(a: Pick<Zone, "x" | "y">, b: Pick<Zone, "x" | "y">): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * For each non-exit zone compute the nearest exit/gate (optionally accessible-only).
 * ETA assumes ~1.2 m/s walking, mapping 1% grid ~= 1.5m.
 */
export function planEvacuation(
  zones: readonly Zone[],
  options: { accessibleOnly?: boolean } = {},
): readonly EvacuationRoute[] {
  const exits = zones.filter(
    (z) => (z.type === "exit" || z.type === "gate") && (!options.accessibleOnly || z.accessible),
  );
  if (exits.length === 0) return [];
  const routes: EvacuationRoute[] = [];
  for (const z of zones) {
    if (z.type === "exit" || z.type === "gate") continue;
    let best = exits[0];
    let bestDist = zoneDistance(z, best);
    for (let i = 1; i < exits.length; i++) {
      const d = zoneDistance(z, exits[i]);
      if (d < bestDist) {
        bestDist = d;
        best = exits[i];
      }
    }
    const meters = bestDist * 1.5;
    routes.push({
      fromId: z.id,
      exitId: best.id,
      distance: Math.round(bestDist * 10) / 10,
      etaSeconds: Math.round(meters / 1.2),
    });
  }
  return routes;
}
