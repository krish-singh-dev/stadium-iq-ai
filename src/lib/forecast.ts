import type { Zone } from "@/types";

/**
 * Simple linear extrapolation of occupancy from a rolling history sample.
 * Returns the projected occupancy `minutesAhead` from now, clamped to [0, capacity].
 */
export function forecastOccupancy(
  history: readonly { t: number; occupancy: number }[],
  capacity: number,
  minutesAhead: number,
): number {
  if (history.length < 2) return history[0]?.occupancy ?? 0;
  const n = history.length;
  const meanT = history.reduce((s, p) => s + p.t, 0) / n;
  const meanY = history.reduce((s, p) => s + p.occupancy, 0) / n;
  let num = 0;
  let den = 0;
  for (const p of history) {
    num += (p.t - meanT) * (p.occupancy - meanY);
    den += (p.t - meanT) ** 2;
  }
  const slope = den === 0 ? 0 : num / den; // people per ms
  const intercept = meanY - slope * meanT;
  const targetT = history[n - 1].t + minutesAhead * 60_000;
  const raw = intercept + slope * targetT;
  return Math.max(0, Math.min(capacity, Math.round(raw)));
}

export interface ZoneForecast {
  readonly zoneId: string;
  readonly projected: number;
  readonly delta: number;
  readonly ratio: number;
}

/** Forecast a set of zones from a shared history keyed by zone id. */
export function forecastZones(
  zones: readonly Zone[],
  histories: Readonly<Record<string, readonly { t: number; occupancy: number }[]>>,
  minutesAhead: number,
): readonly ZoneForecast[] {
  return zones.map((z) => {
    const projected = forecastOccupancy(histories[z.id] ?? [{ t: Date.now(), occupancy: z.occupancy }], z.capacity, minutesAhead);
    return {
      zoneId: z.id,
      projected,
      delta: projected - z.occupancy,
      ratio: z.capacity === 0 ? 0 : projected / z.capacity,
    };
  });
}
