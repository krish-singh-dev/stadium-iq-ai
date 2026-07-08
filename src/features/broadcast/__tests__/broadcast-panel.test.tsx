import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

vi.mock("@/lib/ai.functions", () => ({
  composeBroadcast: vi.fn(async () => ({
    text: "EN: Clear the aisle.\nES: Despejen el pasillo.\nFR: Dégagez l'allée.\nAR: أخلوا الممر.",
  })),
}));

import { BroadcastPanel } from "@/features/broadcast/broadcast-panel";

describe("BroadcastPanel", () => {
  it("renders labeled audience select and message textarea", () => {
    render(<BroadcastPanel />);
    expect(screen.getByLabelText(/audience/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message intent/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /draft broadcast/i })).toBeDisabled();
  });

  it("renders a multilingual EN/ES/FR/AR draft on submit", async () => {
    render(<BroadcastPanel />);
    fireEvent.change(screen.getByLabelText(/message intent/i), {
      target: { value: "Please clear the aisle" },
    });
    fireEvent.click(screen.getByRole("button", { name: /draft broadcast/i }));
    await waitFor(() => {
      const draft = screen.getByLabelText(/broadcast draft/i);
      expect(draft).toHaveTextContent(/EN:/);
      expect(draft).toHaveTextContent(/ES:/);
      expect(draft).toHaveTextContent(/FR:/);
      expect(draft).toHaveTextContent(/AR:/);
    });
  });
});
