import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Wayfinder } from "@/features/navigation/wayfinder";
import { ZONES } from "@/lib/mock-data";

describe("Wayfinder", () => {
  it("renders labeled From/To selects and a directions list", () => {
    render(<Wayfinder zones={ZONES} />);
    expect(screen.getByRole("region", { name: /smart navigation/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/from/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/to/i)).toBeInTheDocument();
    expect(screen.getByRole("list", { name: /turn-by-turn directions/i })).toBeInTheDocument();
  });

  it("swaps origin and destination when the Swap button is clicked", () => {
    render(<Wayfinder zones={ZONES} />);
    const from = screen.getByLabelText(/from/i) as HTMLSelectElement;
    const to = screen.getByLabelText(/to/i) as HTMLSelectElement;
    const initialFrom = from.value;
    const initialTo = to.value;
    fireEvent.click(screen.getByRole("button", { name: /swap direction/i }));
    expect(from.value).toBe(initialTo);
    expect(to.value).toBe(initialFrom);
  });

  it("does not render the wheelchair emoji inside <option> labels", () => {
    render(<Wayfinder zones={ZONES} />);
    const options = screen.getAllByRole("option");
    for (const opt of options) {
      expect(opt.textContent ?? "").not.toContain("♿");
    }
  });
});
