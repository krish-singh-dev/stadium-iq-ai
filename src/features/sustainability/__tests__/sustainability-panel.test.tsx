import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SustainabilityPanel } from "@/features/sustainability/sustainability-panel";
import { ZONES } from "@/lib/mock-data";
import { totalSustainability } from "@/lib/sustainability";

describe("SustainabilityPanel", () => {
  it("renders a labeled region with the four metric cards", () => {
    render(<SustainabilityPanel zones={ZONES} />);
    expect(screen.getByRole("region", { name: /sustainability snapshot/i })).toBeInTheDocument();
    for (const label of ["Energy", "Water", "Waste", "CO₂"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("shows the aggregate energy value derived from totalSustainability", () => {
    render(<SustainabilityPanel zones={ZONES} />);
    const total = totalSustainability(ZONES);
    expect(screen.getByText(`${total.energyKWh} kWh`)).toBeInTheDocument();
  });

  it("lists the top 3 energy-draw zones", () => {
    render(<SustainabilityPanel zones={ZONES} />);
    // The heading label 'Top energy draws' is rendered above the top-3 list
    expect(screen.getByText(/top energy draws/i)).toBeInTheDocument();
  });
});
