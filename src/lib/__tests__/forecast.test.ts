import { describe, expect, it } from "vitest";
import { forecastOccupancy, forecastZones } from "@/lib/forecast";

describe("forecastOccupancy", () => {
  it("returns the sole point for a single sample", () => {
    expect(forecastOccupancy([{ t: 0, occupancy: 42 }], 100, 5)).toBe(42);
  });
  it("extrapolates a rising trend", () => {
    const t0 = 0;
    const hist = [
      { t: t0, occupancy: 10 },
      { t: t0 + 60_000, occupancy: 20 },
      { t: t0 + 120_000, occupancy: 30 },
    ];
    expect(forecastOccupancy(hist, 200, 2)).toBe(50);
  });
  it("clamps to capacity", () => {
    const hist = [
      { t: 0, occupancy: 90 },
      { t: 60_000, occupancy: 95 },
    ];
    expect(forecastOccupancy(hist, 100, 60)).toBe(100);
  });
  it("never goes below zero", () => {
    const hist = [
      { t: 0, occupancy: 20 },
      { t: 60_000, occupancy: 10 },
    ];
    expect(forecastOccupancy(hist, 100, 60)).toBe(0);
  });
});

describe("forecastZones", () => {
  it("returns a forecast per zone", () => {
    const zones = [
      { id: "a", name: "A", type: "gate" as const, capacity: 100, occupancy: 50, x: 0, y: 0, accessible: true },
    ];
    const out = forecastZones(zones, { a: [{ t: 0, occupancy: 40 }, { t: 60_000, occupancy: 50 }] }, 1);
    expect(out).toHaveLength(1);
    expect(out[0].projected).toBe(60);
    expect(out[0].delta).toBe(10);
    expect(out[0].ratio).toBeCloseTo(0.6);
  });
});
