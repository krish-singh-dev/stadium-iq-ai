import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ForecastPanel } from "@/features/forecast/forecast-panel";
import { ZONES } from "@/lib/mock-data";

describe("ForecastPanel", () => {
  it("renders a labeled region and forecast heading with the horizon", () => {
    render(<ForecastPanel zones={ZONES} />);
    const region = screen.getByRole("region", { name: /crowd forecast/i });
    expect(region).toBeInTheDocument();
    expect(region).toHaveTextContent(/next 15 min/i);
  });

  it("caps the visible forecast list at 6 zones", () => {
    render(<ForecastPanel zones={ZONES} />);
    const items = screen.getAllByRole("listitem");
    expect(items.length).toBeLessThanOrEqual(6);
    expect(items.length).toBeGreaterThan(0);
  });
});
