import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StadiumMap } from "@/features/stadium/stadium-map";
import { ZONES } from "@/lib/mock-data";
import { densityLevel } from "@/lib/crowd";

describe("StadiumMap", () => {
  it("exposes an image role with a descriptive heatmap summary", () => {
    render(<StadiumMap zones={ZONES} />);
    const img = screen.getByRole("img", { name: /density heatmap of/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAccessibleName(/critical/);
    expect(img).toHaveAccessibleName(/moderate/);
  });

  it("renders a heat overlay layer for every zone with matching density", () => {
    const { container } = render(<StadiumMap zones={ZONES} />);
    for (const z of ZONES) {
      const heat = container.querySelector(`[data-testid="heat-${z.id}"]`);
      expect(heat, `heat overlay missing for ${z.id}`).not.toBeNull();
      expect(heat).toHaveAttribute("data-density", densityLevel(z));
    }
  });

  it("marks each zone with an accessible button label describing density", () => {
    render(<StadiumMap zones={ZONES} />);
    for (const z of ZONES) {
      // Zone names may substring-match (e.g. "Fan Zone" vs "Fan Zone Grill"),
      // so anchor the accessible-name regex to the full ", density " suffix.
      const re = new RegExp(`^${z.name.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}, density `, "i");
      expect(screen.getByRole("button", { name: re })).toBeInTheDocument();
    }
  });
});

