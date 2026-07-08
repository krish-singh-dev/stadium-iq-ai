import { useMemo } from "react";
import { densityColorClass, densityGlyph, densityLabel, densityLevel } from "@/lib/crowd";
import type { DensityLevel, Zone } from "@/types";

interface Props {
  zones: readonly Zone[];
  highlightId?: string;
  onSelect?: (zone: Zone) => void;
}

const HEAT_COLOR: Record<DensityLevel, string> = {
  low: "var(--color-density-low)",
  moderate: "var(--color-density-moderate)",
  high: "var(--color-density-high)",
  critical: "var(--color-density-critical)",
};

const HEAT_OPACITY: Record<DensityLevel, number> = {
  low: 0.18,
  moderate: 0.28,
  high: 0.42,
  critical: 0.6,
};

/** Accessible SVG-based stadium map with a 2D density heat overlay + zone markers. */
export function StadiumMap({ zones, highlightId, onSelect }: Props) {
  const markers = useMemo(
    () =>
      zones.map((z) => ({
        zone: z,
        level: densityLevel(z),
      })),
    [zones],
  );

  const summary = useMemo(() => {
    const counts: Record<DensityLevel, number> = { low: 0, moderate: 0, high: 0, critical: 0 };
    for (const { level } of markers) counts[level] += 1;
    return `Density heatmap of ${markers.length} stadium zones: ${counts.critical} critical, ${counts.high} high, ${counts.moderate} moderate, ${counts.low} low.`;
  }, [markers]);

  return (
    <figure
      role="img"
      aria-label={summary}
      className="relative m-0 aspect-[4/3] w-full overflow-hidden rounded-xl border bg-card shadow-sm"
    >
      <div className="absolute inset-6 rounded-[40%] bg-pitch/25 ring-2 ring-pitch/40">
        <div className="absolute inset-6 rounded-[35%] border-2 border-dashed border-pitch/50" />
        <div className="absolute inset-x-1/3 top-1/2 h-px bg-pitch/60" aria-hidden="true" />
      </div>
      {/* 2D density heat overlay — radial gradients per zone, additive blend */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 mix-blend-multiply">
        {markers.map(({ zone, level }) => (
          <span
            key={`heat-${zone.id}`}
            data-testid={`heat-${zone.id}`}
            data-density={level}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              width: "26%",
              height: "34%",
              background: `radial-gradient(closest-side, ${HEAT_COLOR[level]} 0%, transparent 70%)`,
              opacity: HEAT_OPACITY[level],
            }}
          />
        ))}
      </div>
      <ul
        role="list"
        aria-label="Stadium zones"
        className="absolute inset-0"
      >
        {markers.map(({ zone, level }) => (
          <li
            key={zone.id}
            style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            <button
              type="button"
              onClick={() => onSelect?.(zone)}
              aria-label={`${zone.name}, density ${densityLabel(level)}, ${zone.occupancy} of ${zone.capacity}`}
              aria-current={highlightId === zone.id ? "true" : undefined}
              className={`group flex min-h-11 min-w-11 items-center justify-center rounded-full border-2 border-background px-2 py-1 text-xs font-semibold shadow-md outline-none transition focus-visible:ring-2 focus-visible:ring-ring ${densityColorClass(level)} ${highlightId === zone.id ? "ring-2 ring-brand ring-offset-2 ring-offset-background" : ""}`}
            >
              <span aria-hidden="true" className="mr-1">
                {densityGlyph(level)}
              </span>
              <span className="max-w-[6rem] truncate">{zone.name}</span>
            </button>
          </li>
        ))}
      </ul>
      <figcaption className="sr-only">{summary}</figcaption>
    </figure>
  );
}

