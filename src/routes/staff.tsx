import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { OpsIntelligence } from "@/features/ops/ops-intelligence";
import { DecisionSupport } from "@/features/decision/decision-support";
import { TransportPanel } from "@/features/transport/transport-panel";
import { StadiumMap } from "@/features/stadium/stadium-map";
import { TicketScanner } from "@/features/tickets/ticket-scanner";
import { EvacuationPlanner } from "@/features/evacuation/evacuation-planner";
import { useLiveStadium } from "@/features/stadium/use-live-stadium";
import { useSession } from "@/features/session/session-context";


export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: "Staff View — StadiumIQ" },
      { name: "description", content: "Shift summary, ops intelligence, and real-time actions for venue staff." },
    ],
  }),
  component: StaffView,
});

function StaffView() {
  const { role, setRole } = useSession();
  const { zones, incidents } = useLiveStadium();
  useEffect(() => {
    if (role !== "staff") setRole("staff");
  }, [role, setRole]);

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section aria-labelledby="map-heading" className="rounded-xl border bg-card p-4 shadow-sm">
            <h2 id="map-heading" className="mb-3 text-base font-semibold">
              Venue Overview
            </h2>
            <StadiumMap zones={zones} />
          </section>
          <EvacuationPlanner zones={zones} />
          <OpsIntelligence incidents={incidents} zones={zones} />
        </div>
        <div className="space-y-6">
          <TicketScanner />
          <DecisionSupport />
          <TransportPanel />
        </div>
      </div>
    </AppShell>
  );
}

