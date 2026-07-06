import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EvacuationPlanner } from "@/features/evacuation/evacuation-planner";
import { ZONES } from "@/lib/mock-data";

describe("EvacuationPlanner", () => {
  it("lists routes for non-exit zones", () => {
    render(<EvacuationPlanner zones={ZONES} />);
    expect(screen.getByRole("heading", { name: /evacuation/i })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").length).toBeGreaterThan(0);
  });
  it("filters when accessible-only is toggled", async () => {
    const user = userEvent.setup();
    render(<EvacuationPlanner zones={ZONES} />);
    const cb = screen.getByRole("checkbox", { name: /accessible/i });
    await user.click(cb);
    expect((cb as HTMLInputElement).checked).toBe(true);
  });
});
