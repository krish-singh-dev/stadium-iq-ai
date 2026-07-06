import { useEffect, useMemo, useState } from "react";
import { forecastZones } from "@/lib/forecast";
import { densityLevel } from "@/lib/crowd";
import type { Zone } from "@/types";

interface Props {
  zones: readonly Zone[];
}

const HORIZON_MIN = 15;

/** 15-minute crowd forecast for the top-loaded zones. */
export function ForecastPanel({ zones }: Props) {
  // Roll a per-zone history in local state so the linear forecast has samples.
  const [histories, setHistories] = useState<Record<string, { t: number; occupancy: number }[]>>({});

  useEffect(() => {
    const now = Date.now();
    setHistories((prev) => {
      const next: Record<string, { t: number; occupancy: number }[]> = { ...prev };
      for (const z of zones) {
        const h = [...(next[z.id] ?? []), { t: now, occupancy: z.occupancy }];
        next[z.id] = h.slice(-10);
      }
      return next;
    });
  }, [zones]);

  const forecasts = useMemo(
    () => forecastZones(zones, histories, HORIZON_MIN),
    [zones, histories],
  );

  const rows = useMemo(
    () =>
      forecasts
        .map((f) => {
          const zone = zones.find((z) => z.id === f.zoneId)!;
          return { zone, f, level: densityLevel({ capacity: zone.capacity, occupancy: f.projected }) };
        })
        .sort((a, b) => b.f.ratio - a.f.ratio)
        .slice(0, 6),
    [forecasts, zones],
  );

  return (
    <section
      aria-labelledby="forecast-heading"
      className="rounded-xl border bg-card p-4 shadow-sm"
    >
      <header className="mb-3">
        <h2 id="forecast-heading" className="text-base font-semibold">
          Crowd Forecast · next {HORIZON_MIN} min
        </h2>
        <p className="text-xs text-muted-foreground">
          Linear extrapolation from a rolling occupancy sample
        </p>
      </header>
      <ul role="list" className="divide-y text-sm">
        {rows.map(({ zone, f, level }) => (
          <li key={zone.id} className="flex items-center justify-between gap-3 py-2">
            <span className="min-w-0 truncate">{zone.name}</span>
            <span className="flex items-center gap-3">
              <span
                className={`inline-flex h-6 items-center rounded-full px-2 text-xs font-semibold ${
                  level === "critical"
                    ? "bg-destructive text-destructive-foreground"
                    : level === "high"
                      ? "bg-density-high text-white"
                      : level === "moderate"
                        ? "bg-density-moderate"
                        : "bg-density-low"
                }`}
              >
                {level}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {f.projected.toLocaleString()} / {zone.capacity.toLocaleString()}
              </span>
              <span
                className={`w-12 text-right font-mono text-xs ${
                  f.delta > 0 ? "text-destructive" : "text-muted-foreground"
                }`}
              >
                {f.delta >= 0 ? "+" : ""}
                {f.delta}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
