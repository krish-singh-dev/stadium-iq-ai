import type { Zone } from "@/types";

/** Very rough per-zone sustainability model for the demo dashboard. */
export interface SustainabilityMetrics {
  readonly energyKWh: number;
  readonly waterLiters: number;
  readonly wasteKg: number;
  readonly co2Kg: number;
}

const ENERGY_PER_PERSON: Record<Zone["type"], number> = {
  gate: 0.05,
  seating: 0.15,
  concession: 0.4,
  restroom: 0.08,
  exit: 0.02,
  medical: 0.35,
  fanzone: 0.25,
};

export function zoneSustainability(zone: Zone): SustainabilityMetrics {
  const energy = zone.occupancy * ENERGY_PER_PERSON[zone.type];
  const water = zone.type === "restroom" ? zone.occupancy * 4 : zone.occupancy * 0.2;
  const waste = zone.type === "concession" ? zone.occupancy * 0.12 : zone.occupancy * 0.02;
  return {
    energyKWh: Math.round(energy * 10) / 10,
    waterLiters: Math.round(water),
    wasteKg: Math.round(waste * 10) / 10,
    co2Kg: Math.round(energy * 0.4 * 10) / 10,
  };
}

export function totalSustainability(zones: readonly Zone[]): SustainabilityMetrics {
  return zones
    .map(zoneSustainability)
    .reduce<SustainabilityMetrics>(
      (acc, m) => ({
        energyKWh: Math.round((acc.energyKWh + m.energyKWh) * 10) / 10,
        waterLiters: acc.waterLiters + m.waterLiters,
        wasteKg: Math.round((acc.wasteKg + m.wasteKg) * 10) / 10,
        co2Kg: Math.round((acc.co2Kg + m.co2Kg) * 10) / 10,
      }),
      { energyKWh: 0, waterLiters: 0, wasteKg: 0, co2Kg: 0 },
    );
}
