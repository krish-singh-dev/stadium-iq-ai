import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TransportPanel } from "@/features/transport/transport-panel";
import { SHUTTLES } from "@/lib/mock-data";

describe("TransportPanel", () => {
  it("renders a labeled section with a heading", () => {
    render(<TransportPanel />);
    expect(screen.getByRole("region", { name: /transportation/i })).toBeInTheDocument();
  });

  it("lists every shuttle line", () => {
    render(<TransportPanel />);
    for (const s of SHUTTLES) {
      expect(screen.getByText(s.line)).toBeInTheDocument();
    }
  });

  it("hides ETA for cancelled shuttles", () => {
    render(<TransportPanel />);
    const cancelled = SHUTTLES.filter((s) => s.status === "cancelled");
    // Number of ETA labels equals non-cancelled shuttle count
    const etas = screen.queryAllByText(/^ETA \d+ min$/);
    expect(etas.length).toBe(SHUTTLES.length - cancelled.length);
  });
});
