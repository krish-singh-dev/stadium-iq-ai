import type { DensityLevel, Zone } from "@/types";

/** Compute density level from occupancy ratio. Pure and testable. */
export function densityLevel(zone: Pick<Zone, "capacity" | "occupancy">): DensityLevel {
  if (zone.capacity <= 0) return "low";
  const ratio = zone.occupancy / zone.capacity;
  if (ratio >= 0.9) return "critical";
  if (ratio >= 0.75) return "high";
  if (ratio >= 0.5) return "moderate";
  return "low";
}

export function densityLabel(level: DensityLevel): string {
  switch (level) {
    case "critical":
      return "Critical";
    case "high":
      return "High";
    case "moderate":
      return "Moderate";
    case "low":
      return "Low";
  }
}

/** Tailwind-safe token classes for density (design-system driven). */
export function densityColorClass(level: DensityLevel): string {
  switch (level) {
    case "critical":
      return "bg-density-critical text-white";
    case "high":
      return "bg-density-high text-white";
    case "moderate":
      return "bg-density-moderate text-foreground";
    case "low":
      return "bg-density-low text-foreground";
  }
}

/** Icon glyph so status is not communicated by color alone (a11y). */
export function densityGlyph(level: DensityLevel): string {
  switch (level) {
    case "critical":
      return "!!";
    case "high":
      return "!";
    case "moderate":
      return "~";
    case "low":
      return "·";
  }
}

export function summarizeCrowd(zones: readonly Zone[]): {
  critical: number;
  high: number;
  moderate: number;
  low: number;
} {
  const acc = { critical: 0, high: 0, moderate: 0, low: 0 };
  for (const z of zones) acc[densityLevel(z)] += 1;
  return acc;
}
