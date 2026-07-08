import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CrowdDashboard } from "@/features/crowd/crowd-dashboard";
import { ZONES } from "@/lib/mock-data";
import { densityLabel, summarizeCrowd } from "@/lib/crowd";

describe("CrowdDashboard", () => {
  it("renders a labeled region with the crowd heading", () => {
    render(<CrowdDashboard zones={ZONES} />);
    expect(screen.getByRole("heading", { name: /crowd management/i })).toBeInTheDocument();
  });

  it("shows all four density buckets in the summary chips", () => {
    render(<CrowdDashboard zones={ZONES} />);
    const summary = summarizeCrowd(ZONES);
    for (const level of ["low", "moderate", "high", "critical"] as const) {
      const label = densityLabel(level);
      // The chip renders "<Label> · <count>"
      expect(
        screen.getByText(new RegExp(`${label}\\s*·\\s*${summary[level]}`, "i")),
      ).toBeInTheDocument();
    }
  });
});
