import type { Zone } from "@/types";

export interface RouteStep {
  readonly instruction: string;
  readonly zoneId?: string;
}

/** Very small deterministic wayfinder: straight-line hop through 1 intermediary. */
export function buildRoute(
  from: Zone,
  to: Zone,
  all: readonly Zone[],
  opts: { accessibleOnly?: boolean } = {},
): readonly RouteStep[] {
  const candidates = opts.accessibleOnly ? all.filter((z) => z.accessible) : all;
  const mid = nearestBetween(from, to, candidates);
  const steps: RouteStep[] = [
    { instruction: `Start at ${from.name}.`, zoneId: from.id },
  ];
  if (mid && mid.id !== from.id && mid.id !== to.id) {
    steps.push({ instruction: `Head toward ${mid.name} (${bearing(from, mid)}).`, zoneId: mid.id });
  }
  steps.push({ instruction: `Continue ${bearing(mid ?? from, to)} to arrive at ${to.name}.`, zoneId: to.id });
  return steps;
}

function distance(a: Zone, b: Zone): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function nearestBetween(from: Zone, to: Zone, all: readonly Zone[]): Zone | undefined {
  let best: Zone | undefined;
  let bestScore = Infinity;
  for (const z of all) {
    if (z.id === from.id || z.id === to.id) continue;
    const score = distance(from, z) + distance(z, to);
    if (score < bestScore) {
      bestScore = score;
      best = z;
    }
  }
  return best;
}

function bearing(a: Zone, b: Zone): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return "straight ahead";
  const horiz = dx > 0 ? "east" : "west";
  const vert = dy > 0 ? "south" : "north";
  if (Math.abs(dx) < 10) return vert;
  if (Math.abs(dy) < 10) return horiz;
  return `${vert}-${horiz}`;
}
