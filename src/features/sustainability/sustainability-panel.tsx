import { useMemo } from "react";
import { totalSustainability, zoneSustainability } from "@/lib/sustainability";
import type { Zone } from "@/types";

interface Props {
  zones: readonly Zone[];
}

/** Sustainability metrics for the current live occupancy snapshot. */
export function SustainabilityPanel({ zones }: Props) {
  const total = useMemo(() => totalSustainability(zones), [zones]);
  const topEnergy = useMemo(
    () =>
      zones
        .map((z) => ({ zone: z, m: zoneSustainability(z) }))
        .sort((a, b) => b.m.energyKWh - a.m.energyKWh)
        .slice(0, 3),
    [zones],
  );

  const cards = [
    { label: "Energy", value: `${total.energyKWh} kWh` },
    { label: "Water", value: `${total.waterLiters.toLocaleString()} L` },
    { label: "Waste", value: `${total.wasteKg} kg` },
    { label: "CO₂", value: `${total.co2Kg} kg` },
  ];

  return (
    <section
      aria-labelledby="sustain-heading"
      className="rounded-xl border bg-card p-4 shadow-sm"
    >
      <header className="mb-3">
        <h2 id="sustain-heading" className="text-base font-semibold">
          Sustainability Snapshot
        </h2>
        <p className="text-xs text-muted-foreground">Live estimate from current occupancy</p>
      </header>
      <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border bg-background p-3">
            <dt className="text-xs text-muted-foreground">{c.label}</dt>
            <dd className="mt-1 text-lg font-semibold">{c.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4">
        <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
          Top energy draws
        </p>
        <ul role="list" className="text-sm">
          {topEnergy.map(({ zone, m }) => (
            <li key={zone.id} className="flex justify-between py-1">
              <span>{zone.name}</span>
              <span className="font-mono text-xs text-muted-foreground">{m.energyKWh} kWh</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
