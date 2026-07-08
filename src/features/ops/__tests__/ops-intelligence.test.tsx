import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { OpsIntelligence } from "@/features/ops/ops-intelligence";
import { ZONES } from "@/lib/mock-data";
import type { Incident } from "@/types";

const INCIDENTS: Incident[] = [
  {
    id: "i-1",
    zoneId: "sec-north",
    type: "medical",
    severity: "high",
    summary: "Fan needs medical attention",
    reportedAt: 1_700_000_000_000,
    status: "open",
  },
  {
    id: "i-2",
    zoneId: "gate-b",
    type: "security",
    severity: "low",
    summary: "Unattended bag near Gate B",
    reportedAt: 1_700_000_600_000,
    status: "resolved",
  },
];

describe("OpsIntelligence", () => {
  it("renders a searchable, labeled incident query input", () => {
    render(<OpsIntelligence incidents={INCIDENTS} zones={ZONES} />);
    expect(screen.getByLabelText(/ask about incidents/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /operational intelligence/i })).toBeInTheDocument();
  });

  it("filters incidents by a natural-language query", () => {
    render(<OpsIntelligence incidents={INCIDENTS} zones={ZONES} />);
    const input = screen.getByLabelText(/ask about incidents/i);
    fireEvent.change(input, { target: { value: "medical high" } });
    expect(screen.getByText(/Fan needs medical attention/i)).toBeInTheDocument();
    expect(screen.queryByText(/Unattended bag/i)).not.toBeInTheDocument();
  });
});
