import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { CrowdDashboard } from "@/features/crowd/crowd-dashboard";
import { DecisionSupport } from "@/features/decision/decision-support";
import { OpsIntelligence } from "@/features/ops/ops-intelligence";
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
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CrowdDashboard zones={zones} />
        </div>
        <div className="space-y-6">
          <DecisionSupport />
          <OpsIntelligence incidents={incidents} zones={zones} />
        </div>
      </div>
    </AppShell>
  );
}
