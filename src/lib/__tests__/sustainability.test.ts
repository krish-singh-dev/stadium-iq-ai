import { describe, expect, it } from "vitest";
import { totalSustainability, zoneSustainability } from "@/lib/sustainability";
import { ZONES } from "@/lib/mock-data";
import type { Zone } from "@/types";

describe("zoneSustainability", () => {
  it("scales with occupancy", () => {
    const z: Zone = { id: "z", name: "Z", type: "concession", capacity: 100, occupancy: 100, x: 0, y: 0, accessible: true };
    const empty: Zone = { ...z, occupancy: 0 };
    expect(zoneSustainability(z).energyKWh).toBeGreaterThan(0);
    expect(zoneSustainability(empty)).toEqual({ energyKWh: 0, waterLiters: 0, wasteKg: 0, co2Kg: 0 });
  });
  it("restrooms use more water per person", () => {
    const rest: Zone = { id: "r", name: "R", type: "restroom", capacity: 10, occupancy: 10, x: 0, y: 0, accessible: true };
    const seat: Zone = { ...rest, id: "s", type: "seating" };
    expect(zoneSustainability(rest).waterLiters).toBeGreaterThan(zoneSustainability(seat).waterLiters);
  });
});

describe("totalSustainability", () => {
  it("aggregates across zones", () => {
    const t = totalSustainability(ZONES);
    expect(t.energyKWh).toBeGreaterThan(0);
    expect(t.co2Kg).toBeGreaterThan(0);
  });
});
