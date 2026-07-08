import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SessionProvider } from "@/features/session/session-context";

vi.mock("@/lib/ai.functions", () => ({
  recommendActions: vi.fn(async () => ({ text: "1. Alert supervisor\n2. Secure area" })),
}));

import { DecisionSupport } from "@/features/decision/decision-support";

function renderWithSession(ui: React.ReactElement) {
  return render(<SessionProvider>{ui}</SessionProvider>);
}


describe("DecisionSupport", () => {
  it("renders labeled scenario input and disables submit until filled", () => {
    renderWithSession(<DecisionSupport />);
    expect(screen.getByLabelText(/describe the scenario/i)).toBeInTheDocument();
    const submit = screen.getByRole("button", { name: /get recommendation/i });
    expect(submit).toBeDisabled();
  });

  it("shows the AI recommendation after submitting a scenario", async () => {
    renderWithSession(<DecisionSupport />);
    fireEvent.change(screen.getByLabelText(/describe the scenario/i), {
      target: { value: "Power outage in West Stand" },
    });
    fireEvent.click(screen.getByRole("button", { name: /get recommendation/i }));
    await waitFor(() =>
      expect(screen.getByLabelText(/ai recommendation/i)).toHaveTextContent(/alert supervisor/i),
    );
  });
});
