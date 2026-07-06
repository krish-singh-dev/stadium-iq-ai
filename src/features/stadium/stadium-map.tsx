import { useMemo } from "react";
import { densityColorClass, densityGlyph, densityLabel, densityLevel } from "@/lib/crowd";
import type { Zone } from "@/types";

interface Props {
  zones: readonly Zone[];
  highlightId?: string;
  onSelect?: (zone: Zone) => void;
}

/** Accessible SVG-based stadium map with density-encoded zone markers. */
export function StadiumMap({ zones, highlightId, onSelect }: Props) {
  const markers = useMemo(
    () =>
      zones.map((z) => ({
        zone: z,
        level: densityLevel(z),
      })),
    [zones],
  );

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="absolute inset-6 rounded-[40%] bg-pitch/25 ring-2 ring-pitch/40">
        <div className="absolute inset-6 rounded-[35%] border-2 border-dashed border-pitch/50" />
        <div className="absolute inset-x-1/3 top-1/2 h-px bg-pitch/60" aria-hidden="true" />
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
    </div>
  );
}
