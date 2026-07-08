import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { CrowdDashboard } from "@/features/crowd/crowd-dashboard";
import { DecisionSupport } from "@/features/decision/decision-support";
import { OpsIntelligence } from "@/features/ops/ops-intelligence";
import { ForecastPanel } from "@/features/forecast/forecast-panel";
import { EvacuationPlanner } from "@/features/evacuation/evacuation-planner";
import { SustainabilityPanel } from "@/features/sustainability/sustainability-panel";
import { BroadcastPanel } from "@/features/broadcast/broadcast-panel";
import { useLiveStadium } from "@/features/stadium/use-live-stadium";
import { useSession } from "@/features/session/session-context";


export const Route = createFileRoute("/organizer")({
  head: () => ({
    meta: [
      { title: "Organizer View — StadiumIQ" },
      { name: "description", content: "Crowd management, incident log, and AI decision support for organizers." },
    ],
  }),
  component: OrganizerView,
});

function OrganizerView() {
  const { role, setRole } = useSession();
  const { zones, incidents } = useLiveStadium();
  useEffect(() => {
    if (role !== "organizer") setRole("organizer");
  }, [role, setRole]);

  return (
    <AppShell title="Organizer control center — crowd, forecast, broadcast, and decision support">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <CrowdDashboard zones={zones} />
          <ForecastPanel zones={zones} />
          <SustainabilityPanel zones={zones} />
        </div>
        <div className="space-y-6">
          <DecisionSupport />
          <BroadcastPanel />
          <EvacuationPlanner zones={zones} />
          <OpsIntelligence incidents={incidents} zones={zones} />
        </div>
      </div>
    </AppShell>
  );
}

